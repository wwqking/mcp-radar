import Link from "next/link";
import type { Metadata } from "next";
import { getServerBySlug } from "@/lib/data";
import ServerCard from "@/components/ServerCard";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, faqSchema, ORGANIZATION_ID } from "@/lib/schema";
import { SITE_NAME, absoluteUrl } from "@/lib/site";
import type { Locale } from "@/lib/i18n/locales";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizedHref, hreflangAlternates } from "@/lib/i18n/href";
import { getPillarContent, PILLAR_RELATED_SERVERS } from "@/lib/pillar-what-is-mcp";
import { SEO_LANDINGS, seoLandingText } from "@/lib/seo-landing";

interface Props {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const c = getPillarContent(locale);
  return {
    title: c.title,
    description: c.excerpt,
    alternates: hreflangAlternates(locale, "/what-is-mcp-server"),
    openGraph: { title: c.title, description: c.excerpt, url: `/${locale}/what-is-mcp-server`, type: "article" },
    twitter: { card: "summary_large_image", title: c.title, description: c.excerpt },
  };
}

export default async function PillarPage({ params }: Props) {
  const { locale } = await params;
  const c = getPillarContent(locale);
  const d = getDictionary(locale).guides; // 复用 guides 词典的通用串（目录/返回等）

  // 内链的高信任 server（数据缺失的优雅跳过）
  const related = (
    await Promise.all(
      PILLAR_RELATED_SERVERS.map(async (r) => {
        const s = await getServerBySlug(r.slug);
        return s ? { server: s } : null;
      }),
    )
  ).filter((x): x is { server: NonNullable<Awaited<ReturnType<typeof getServerBySlug>>> } => x !== null);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: c.title,
    description: c.excerpt,
    datePublished: "2026-07-01",
    dateModified: c.lastVerified ?? "2026-07-28",
    url: absoluteUrl(`/${locale}/what-is-mcp-server`),
    image: absoluteUrl(`/${locale}/opengraph-image`),
    author: { "@id": ORGANIZATION_ID },
    publisher: { "@id": ORGANIZATION_ID },
    isAccessibleForFree: true,
  };
  const crumb = breadcrumbSchema([
    { name: SITE_NAME, path: `/${locale}` },
    { name: c.title, path: `/${locale}/what-is-mcp-server` },
  ]);
  const faq = faqSchema(c.faq.map((f) => ({ q: f.q, a: f.a })));

  const faqLabel = locale === "zh" ? "常见问题" : "Frequently Asked Questions";
  const relatedLabel = locale === "zh" ? "精选 MCP Server" : "Featured MCP Servers";
  const tocLabel = locale === "zh" ? "目录" : "On this page";

  return (
    <div className="container-site max-w-4xl py-10 sm:py-14">
      <JsonLd data={[articleSchema, crumb, faq]} />

      <nav className="mb-4 text-sm text-neutral-400">
        <Link href={localizedHref(locale, "/")} className="hover:text-brand-600">
          {SITE_NAME}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-neutral-600 dark:text-neutral-300">{c.title}</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-3xl">
          {c.title}
        </h1>
        <div className="mt-4 space-y-3">
          {c.intro.map((p, i) => (
            <p key={i} className="leading-7 text-neutral-600 dark:text-neutral-400">
              {p}
            </p>
          ))}
        </div>
        {c.lastVerified && (
          <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400">
            MCP Radar Editorial · {locale === "zh" ? "事实核验" : "Facts verified"}: {c.lastVerified}
            {c.refreshDue ? ` · ${locale === "zh" ? "下次复核" : "Refresh due"}: ${c.refreshDue}` : ""}
          </p>
        )}
      </header>

      {c.directAnswer && (
        <section className="mb-8 rounded-2xl border border-brand-200 bg-brand-50/70 p-5 dark:border-brand-900 dark:bg-brand-950/30 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-300">
            {locale === "zh" ? "直接答案" : "Direct answer"}
          </p>
          <p className="mt-2 text-base font-medium leading-7 text-neutral-800 dark:text-neutral-200">{c.directAnswer}</p>
        </section>
      )}

      {c.visual && (
        <figure className="mb-8 rounded-2xl border border-neutral-200 bg-neutral-50 p-5 dark:border-neutral-800 dark:bg-neutral-900/60 sm:p-6">
          <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">{c.visual.title}</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-4">
            {c.visual.items.map((item, index) => (
              <div key={item.label} className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-950">
                <span className="text-xs font-semibold text-brand-600 dark:text-brand-400">{index + 1}</span>
                <p className="mt-1 font-semibold text-neutral-900 dark:text-neutral-100">{item.label}</p>
                <p className="mt-1 text-xs leading-5 text-neutral-500 dark:text-neutral-400">{item.description}</p>
              </div>
            ))}
          </div>
          <figcaption className="mt-3 text-xs text-neutral-500 dark:text-neutral-400">{c.visual.caption}</figcaption>
        </figure>
      )}

      {c.comparison && (
        <figure className="mb-8">
          <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-neutral-50 text-xs uppercase tracking-wider text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400">
                <tr>{c.comparison.headers.map((header) => <th key={header} className="px-4 py-3 font-semibold">{header}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {c.comparison.rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>{row.map((cell, cellIndex) => (
                    <td key={cellIndex} className={`px-4 py-3 align-top leading-6 text-neutral-600 dark:text-neutral-300 ${cellIndex === 0 ? "font-semibold text-neutral-900 dark:text-neutral-100" : ""}`}>{cell}</td>
                  ))}</tr>
                ))}
              </tbody>
            </table>
          </div>
          <figcaption className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">{c.comparison.caption}</figcaption>
        </figure>
      )}

      {/* 目录 */}
      <div className="card mb-8 p-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">{tocLabel}</p>
        <ol className="space-y-1 text-sm">
          {c.sections.map((s, i) => (
            <li key={s.heading} className="flex items-center gap-2">
              <span className="text-neutral-300 dark:text-neutral-600">{i + 1}.</span>
              <a href={`#s-${i}`} className="text-neutral-600 hover:text-brand-600 dark:text-neutral-300">
                {s.heading}
              </a>
            </li>
          ))}
        </ol>
      </div>

      {/* 正文 */}
      <article className="space-y-8">
        {c.sections.map((s, i) => (
          <section key={s.heading} id={`s-${i}`} className="scroll-mt-20">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">{s.heading}</h2>
            <div className="mt-3 space-y-3">
              {s.body.map((p, j) => (
                <p key={j} className="leading-7 text-neutral-600 dark:text-neutral-400">
                  {p}
                </p>
              ))}
            </div>
          </section>
        ))}
      </article>

      {/* 精选 server（内链回详情页，建立主题权威） */}
      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-lg font-bold text-neutral-900 dark:text-neutral-100">{relatedLabel}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {related.map(({ server }) => (
              <ServerCard key={server.slug} server={server} locale={locale} />
            ))}
          </div>
        </section>
      )}

      {/* MCP Server 接入指南目录：直接链接合并后的详情页，避免经过重定向。 */}
      <section className="mt-12">
        <h2 className="mb-2 text-lg font-bold text-neutral-900 dark:text-neutral-100">
          {locale === "zh" ? "热门 MCP Server 接入指南" : "Popular MCP Server Setup Guides"}
        </h2>
        <p className="mb-4 text-sm text-neutral-500 dark:text-neutral-400">
          {locale === "zh"
            ? "按工具查看接入方式、能力与证据；实际可用性仍需在你的客户端和账号中验证。"
            : "Browse setup, capabilities, and evidence by tool; verify actual usability in your client and account."}
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {SEO_LANDINGS.map((l) => {
            const t = seoLandingText(l, locale);
            return (
              <Link
                key={l.toolSlug}
                href={localizedHref(locale, `/server/${l.serverSlug}`)}
                className="card px-3 py-2.5 text-sm font-medium text-neutral-700 hover:border-brand-400 hover:text-brand-700 dark:text-neutral-300 dark:hover:text-brand-300"
              >
                {t.toolName} MCP Server →
              </Link>
            );
          })}
        </div>
      </section>

      {c.sources && c.sources.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-3 text-lg font-bold text-neutral-900 dark:text-neutral-100">
            {locale === "zh" ? "来源" : "Sources"}
          </h2>
          <ol className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
            {c.sources.map((source) => (
              <li key={source.url}>
                <a href={source.url} target="_blank" rel="noreferrer" className="link-accent">{source.label}</a>
                <span className="text-neutral-400"> · {locale === "zh" ? "访问" : "retrieved"} {source.retrievedAt}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* 本地装 vs 远程连 —— 支柱页是全站权重最高的内链源，remote 落地页要从这里拿一条 */}
      <section className="mt-12">
        <h2 className="mb-2 text-lg font-bold text-neutral-900 dark:text-neutral-100">
          {locale === "zh" ? "不想在本机装？用远程的" : "Don't want to install anything? Use a remote one"}
        </h2>
        <p className="mb-4 text-sm text-neutral-500 dark:text-neutral-400">
          {locale === "zh"
            ? "远程 server 通过 URL 连接，不用在本机安装包；连接前仍需核验运营方、认证方式与数据边界。"
            : "Remote servers connect by URL without a local package; verify the operator, authentication, and data boundary first."}
        </p>
        <Link href={localizedHref(locale, "/remote-mcp-servers")} className="link-accent">
          {locale === "zh" ? "查看所有 Remote MCP Servers" : "Browse all remote MCP servers"} →
        </Link>
      </section>

      {/* FAQ（配 FAQPage schema） */}
      <section className="mt-12">
        <h2 className="mb-4 text-lg font-bold text-neutral-900 dark:text-neutral-100">{faqLabel}</h2>
        <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
          {c.faq.map((f) => (
            <div key={f.q} className="py-4">
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{f.q}</h3>
              <p className="mt-2 leading-7 text-neutral-600 dark:text-neutral-400">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-12 border-t border-neutral-200 pt-6 text-sm text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
        <Link href={localizedHref(locale, "/guides")} className="link-accent">
          {d.h1} →
        </Link>
      </div>
    </div>
  );
}
