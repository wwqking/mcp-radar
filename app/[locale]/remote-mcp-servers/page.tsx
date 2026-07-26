// /remote-mcp-servers —— 「托管端点」切面页。
//
// 为什么是独立路由而不是 /category/remote：主词就是 `remote mcp servers`（480/mo, KD 24），
// 而实测这个词的 Google 首页 #1 就是竞品 mcpservers.org 的同名分类页——URL 里带上词本身
// 比塞进通用 /category/{slug} 更贴合。数据来自 registry 的 remotes 字段（见 collector/registry.ts）。

import Link from "next/link";
import type { Metadata } from "next";
import { CATEGORIES, getAllServers, getLastUpdated, categoryName } from "@/lib/data";
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
  params: { locale: Locale };
}

/** 带托管端点的 server —— 有 remoteEndpoints 就算，按健康分降序。 */
async function getRemoteServers(): Promise<MCPServer[]> {
  const all = await getAllServers();
  return all
    .filter((s) => (s.remoteEndpoints?.length ?? 0) > 0)
    .sort((a, b) => b.trustScore - a.trustScore);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const d = getDictionary(params.locale).remote;
  const servers = await getRemoteServers();
  const title = d.title;
  const description = d.desc.replace("{count}", String(servers.length));
  return {
    title,
    description,
    alternates: hreflangAlternates(params.locale, "/remote-mcp-servers"),
    openGraph: { title, description, url: `/${params.locale}/remote-mcp-servers`, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function RemoteServersPage({ params }: Props) {
  const { locale } = params;
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
        <p className="mt-3 max-w-2xl text-neutral-600 dark:text-neutral-400">{d.lead}</p>
        <SourceMethodNote
          locale={locale}
          className="mt-3"
          sources={[d.srcRegistry, "GitHub API", "npm"]}
          updatedAt={lastUpdated}
        />
      </header>

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
        <p className="text-sm text-neutral-700 dark:text-neutral-300">{d.caution}</p>
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
        </section>
      )}

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
          {CATEGORIES.slice(0, 5).map((c) => (
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
