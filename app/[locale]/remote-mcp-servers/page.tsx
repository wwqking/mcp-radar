// /remote-mcp-servers —— 「托管端点」切面页。
//
// 为什么是独立路由而不是 /category/remote：主词就是 `remote mcp servers`（480/mo, KD 24），
// 而实测这个词的 Google 首页 #1 就是竞品 mcpservers.org 的同名分类页——URL 里带上词本身
// 比塞进通用 /category/{slug} 更贴合。数据来自 registry 的 remotes 字段（见 collector/registry.ts）。

import Link from "next/link";
import type { Metadata } from "next";
import { PUBLIC_CATEGORIES, getAllServers, getLastUpdated, categoryName } from "@/lib/data";
import CategoryList from "@/components/CategoryList";
import SourceMethodNote from "@/components/SourceMethodNote";
import SubscribeInline from "@/components/SubscribeInline";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { absoluteUrl } from "@/lib/site";
import type { Locale } from "@/lib/i18n/locales";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizedHref, hreflangAlternates } from "@/lib/i18n/href";
import type { MCPServer } from "@/lib/types";

interface Props {
  params: Promise<{ locale: Locale }>;
}

/** 带托管端点的 server —— 有 remoteEndpoints 就算，按健康分降序。 */
async function getRemoteServers(): Promise<MCPServer[]> {
  const all = await getAllServers();
  return all
    .filter((s) => (s.remoteEndpoints?.length ?? 0) > 0)
    .sort((a, b) => b.trustScore - a.trustScore);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const d = getDictionary(locale).remote;
  const servers = await getRemoteServers();
  const title = d.title;
  const description = d.desc.replace("{count}", String(servers.length));
  return {
    title,
    description,
    alternates: hreflangAlternates(locale, "/remote-mcp-servers"),
    openGraph: { title, description, url: `/${locale}/remote-mcp-servers`, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function RemoteServersPage({ params }: Props) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const d = dict.remote;

  const servers = await getRemoteServers();
  const lastUpdated = await getLastUpdated();

  // 传输方式分布 —— streamable-http / sse 各多少，给读者一个「主流是什么」的判断
  const transports = new Map<string, number>();
  for (const s of servers) {
    for (const e of s.remoteEndpoints ?? []) {
      transports.set(e.type, (transports.get(e.type) ?? 0) + 1);
    }
  }
  const transportRows = Array.from(transports).sort((a, b) => b[1] - a[1]);
  const endpointCount = transportRows.reduce((sum, [, count]) => sum + count, 0);
  const activeCount = servers.filter((server) => server.lifecycle === "active").length;
  const officialCount = servers.filter((server) => server.signals.inOfficialRegistry).length;
  const authIndicatedCount = servers.filter((server) => server.readmeFacts?.needsApiKey === true).length;

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: d.h1,
    description: d.desc.replace("{count}", String(servers.length)),
    url: absoluteUrl(`/${locale}/remote-mcp-servers`),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: servers.length,
      itemListElement: servers.slice(0, 20).map((s, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: absoluteUrl(`/${locale}/server/${s.slug}`),
        name: s.name,
      })),
    },
  };
  const crumb = breadcrumbSchema([
    { name: d.home, path: `/${locale}` },
    { name: d.h1, path: `/${locale}/remote-mcp-servers` },
  ]);

  return (
    <div className="container-site py-10 sm:py-14">
      <JsonLd data={[collectionSchema, crumb]} />

      <nav className="mb-4 text-sm text-neutral-400">
        <Link href={localizedHref(locale, "/")} className="hover:text-brand-600">
          {d.home}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-neutral-600 dark:text-neutral-300">{d.h1}</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-3xl">
          {d.h1}
        </h1>
        {/* 直接回答段：自足的一句话定义，供 AI 引擎摘引 */}
        <p className="mt-3 max-w-3xl text-neutral-600 dark:text-neutral-400">
          {locale === "zh"
            ? "Remote MCP server 是通过 URL 连接的托管端点，不需要在本机启动对应 server 包。下面的端点来自 registry 声明；声明、维护信号和 TrustScore 都不等于握手成功或安全认证。"
            : "A remote MCP server is a hosted endpoint reached by URL, so the client does not launch that server package locally. The endpoints below are registry declarations; a declaration, maintenance signal, or TrustScore is not a successful handshake or a security certification."}
        </p>
        <SourceMethodNote
          locale={locale}
          className="mt-3"
          sources={[`${d.srcRegistry} remotes`, "GitHub API", "npm"]}
          updatedAt={lastUpdated}
        />
      </header>

      <section className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5" aria-label={locale === "zh" ? "远程目录事实" : "Remote directory facts"}>
        {[
          [locale === "zh" ? "远程 server" : "Remote servers", servers.length, locale === "zh" ? "至少声明 1 个端点" : "at least one declared endpoint"],
          [locale === "zh" ? "端点" : "Endpoints", endpointCount, locale === "zh" ? "一个 server 可有多个端点" : "a server can declare more than one"],
          [locale === "zh" ? "活跃" : "Active", activeCount, locale === "zh" ? "按维护生命周期" : "maintenance lifecycle"],
          [locale === "zh" ? "官方 registry" : "Official registry", officialCount, locale === "zh" ? "来源信号，不是安全认证" : "provenance, not certification"],
          [locale === "zh" ? "提及密钥" : "Key indicated", authIndicatedCount, locale === "zh" ? "README 规则证据" : "README rule evidence"],
        ].map(([label, value, note]) => (
          <div key={String(label)} className="card p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">{label}</p>
            <p className="mt-1 text-2xl font-extrabold text-neutral-900 dark:text-neutral-100">{value}</p>
            <p className="mt-1 text-xs leading-5 text-neutral-500 dark:text-neutral-400">{note}</p>
          </div>
        ))}
      </section>

      {/* 选型判断：remote vs 本地 —— SERP 上竞品普遍只给清单不给判断依据 */}
      <section className="mb-8 rounded-xl border border-neutral-200 p-5 dark:border-neutral-800">
        <h2 className="mb-3 text-lg font-bold text-neutral-900 dark:text-neutral-100">{d.whyTitle}</h2>
        <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
          <li>{d.whyRemote}</li>
          <li>{d.whyLocal}</li>
        </ul>
      </section>

      <section className="mb-8 rounded-xl border border-amber-300/60 bg-amber-50/50 p-5 dark:border-amber-800/50 dark:bg-amber-950/20">
        <h2 className="mb-2 text-lg font-bold text-neutral-900 dark:text-neutral-100">{d.cautionTitle}</h2>
        <p className="text-sm text-neutral-700 dark:text-neutral-300">
          {locale === "zh"
            ? "远程端点会把请求与可能的凭据带到另一个运营方边界。先核验身份、认证、scope、数据保留与子处理方；TrustScore 只汇总公开维护和采用信号，不评估传输内容或服务端安全。"
            : "A remote endpoint moves requests and potentially credentials into another operator's boundary. Verify identity, auth, scopes, retention, and subprocessors first; TrustScore summarizes public maintenance and adoption signals, not transport content or server-side security."}
        </p>
      </section>

      {transportRows.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-bold text-neutral-900 dark:text-neutral-100">{d.transportTitle}</h2>
          <div className="flex flex-wrap gap-2">
            {transportRows.map(([type, n]) => (
              <span
                key={type}
                className="rounded-full border border-neutral-200 px-3 py-1 text-sm text-neutral-600 dark:border-neutral-700 dark:text-neutral-400"
              >
                <code>{type}</code> · {n}
              </span>
            ))}
          </div>
          <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
            {locale === "zh"
              ? `${servers.length} 个 server 共声明 ${endpointCount} 个端点，因此端点数可以高于 server 数。SSE 作为兼容性声明保留；新实现应核对当前 MCP transport 指南。`
              : `${servers.length} servers declare ${endpointCount} endpoints, so endpoint totals can exceed server totals. SSE is retained as a compatibility declaration; new implementations should check the current MCP transport guidance.`}
          </p>
        </section>
      )}

      <section className="mb-8 rounded-xl border border-neutral-200 p-5 dark:border-neutral-800">
        <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
          {locale === "zh" ? "如何连接并验证 URL" : "How to connect and verify a URL"}
        </h2>
        <ol className="mt-3 space-y-2 pl-5 text-sm text-neutral-600 dark:text-neutral-400">
          <li className="list-decimal leading-6">{locale === "zh" ? "先核对运营方、端点来源、HTTPS、认证方式和所需权限。" : "Resolve the operator, endpoint source, HTTPS, authentication method, and requested permissions."}</li>
          <li className="list-decimal leading-6">{locale === "zh" ? "在客户端的个人/本地 scope 添加 URL，不要先共享给团队。" : "Add the URL at a private/local client scope before sharing it with a team."}</li>
          <li className="list-decimal leading-6">{locale === "zh" ? "确认 discovery 与能力清单，再运行一个无破坏性的最小调用。" : "Confirm discovery and the capability list, then run one minimal non-destructive call."}</li>
          <li className="list-decimal leading-6">{locale === "zh" ? "记录客户端、端点、认证范围、结果和测试日期；不要记录 token。" : "Record the client, endpoint, auth scope, result, and test date—never the token."}</li>
        </ol>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <Link href={localizedHref(locale, "/guides/claude-code-mcp-config")} className="link-accent">Claude Code →</Link>
          <Link href={localizedHref(locale, "/guides/cursor-mcp-spawn-npx-enoent")} className="link-accent">Cursor MCP →</Link>
          <Link href={localizedHref(locale, "/guides/mcp-remote")} className="link-accent">{locale === "zh" ? "远程连接指南" : "Remote connection guide"} →</Link>
        </div>
      </section>

      {servers.length === 0 ? (
        <p className="text-neutral-500 dark:text-neutral-400">{d.empty}</p>
      ) : (
        <CategoryList
          servers={servers}
          locale={locale}
          anchor={d.listAnchor.replace("{n}", String(servers.length))}
          labels={{
            all: dict.filters.all,
            activeOnly: dict.filters.activeOnly,
            sortBy: dict.filters.sortBy,
            sortScore: dict.filters.sortScore,
            sortStars: dict.filters.sortStars,
            sortUpdated: dict.filters.sortUpdated,
            emptyList: dict.filters.emptyList,
          }}
          remoteMode
        />
      )}

      <section className="mt-12">
        <h2 className="mb-4 text-lg font-bold text-neutral-900 dark:text-neutral-100">{d.relatedTitle}</h2>
        <div className="flex flex-wrap gap-2">
          <Link
            href={localizedHref(locale, "/what-is-mcp-server")}
            className="rounded-full border border-neutral-200 px-4 py-1.5 text-sm text-neutral-600 hover:border-brand-400 hover:text-brand-700 dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-brand-700 dark:hover:text-brand-300"
          >
            {d.pillarLink}
          </Link>
          {[
            ["/leaderboard", locale === "zh" ? "排行榜" : "Leaderboard"],
            ["/mcp-server-health-report", locale === "zh" ? "生态健康报告" : "Ecosystem health report"],
            ["/about", locale === "zh" ? "评分方法" : "Scoring methodology"],
            ["/guides/mcp-security-red-lines", locale === "zh" ? "安全最佳实践" : "Security best practices"],
          ].map(([href, label]) => (
            <Link key={href} href={localizedHref(locale, href)} className="rounded-full border border-neutral-200 px-4 py-1.5 text-sm text-neutral-600 hover:border-brand-400 hover:text-brand-700 dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-brand-700 dark:hover:text-brand-300">
              {label}
            </Link>
          ))}
          {PUBLIC_CATEGORIES.slice(0, 5).map((c) => (
            <Link
              key={c.slug}
              href={localizedHref(locale, `/category/${c.slug}`)}
              className="rounded-full border border-neutral-200 px-4 py-1.5 text-sm text-neutral-600 hover:border-brand-400 hover:text-brand-700 dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-brand-700 dark:hover:text-brand-300"
            >
              {c.icon} {categoryName(c, locale)}
            </Link>
          ))}
        </div>
      </section>

      <div className="mt-12">
        <SubscribeInline locale={locale} />
      </div>
    </div>
  );
}
