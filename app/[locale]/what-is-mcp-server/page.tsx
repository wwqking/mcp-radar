import Link from "next/link";
import type { Metadata } from "next";
import { getServerBySlug } from "@/lib/data";
import ServerCard from "@/components/ServerCard";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import { SITE_NAME, absoluteUrl } from "@/lib/site";
import type { Locale } from "@/lib/i18n/locales";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizedHref, hreflangAlternates } from "@/lib/i18n/href";
import { getPillarContent, PILLAR_RELATED_SERVERS } from "@/lib/pillar-what-is-mcp";
import { SEO_LANDINGS, seoLandingText } from "@/lib/seo-landing";

interface Props {
  params: { locale: Locale };
}

export function generateMetadata({ params }: Props): Metadata {
  const c = getPillarContent(params.locale);
  return {
    title: c.title,
    description: c.excerpt,
    alternates: hreflangAlternates(params.locale, "/what-is-mcp-server"),
    openGraph: { title: c.title, description: c.excerpt, url: `/${params.locale}/what-is-mcp-server`, type: "article" },
    twitter: { card: "summary_large_image", title: c.title, description: c.excerpt },
  };
}

export default async function PillarPage({ params }: Props) {
  const { locale } = params;
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
    url: absoluteUrl(`/${locale}/what-is-mcp-server`),
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: { "@type": "Organization", name: SITE_NAME },
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
    <div className="container-site max-w-3xl py-10 sm:py-14">
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
      </header>

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

      {/* MCP Server 接入指南目录：列出所有 SEO 落地页，给它们传站内内链权重 + 方便浏览 */}
      <section className="mt-12">
        <h2 className="mb-2 text-lg font-bold text-neutral-900 dark:text-neutral-100">
          {locale === "zh" ? "热门 MCP Server 接入指南" : "Popular MCP Server Setup Guides"}
        </h2>
        <p className="mb-4 text-sm text-neutral-500 dark:text-neutral-400">
          {locale === "zh"
            ? "按工具查看接入方式、可用能力和配置——每个都是能用的真实 server。"
            : "Browse setup, capabilities, and config by tool — each is a real, usable server."}
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {SEO_LANDINGS.map((l) => {
            const t = seoLandingText(l, locale);
            return (
              <Link
                key={l.toolSlug}
                href={localizedHref(locale, `/servers/${l.toolSlug}-mcp-server`)}
                className="card px-3 py-2.5 text-sm font-medium text-neutral-700 hover:border-brand-400 hover:text-brand-700 dark:text-neutral-300 dark:hover:text-brand-300"
              >
                {t.toolName} MCP Server →
              </Link>
            );
          })}
        </div>
      </section>

      {/* 本地装 vs 远程连 —— 支柱页是全站权重最高的内链源，remote 落地页要从这里拿一条 */}
      <section className="mt-12">
        <h2 className="mb-2 text-lg font-bold text-neutral-900 dark:text-neutral-100">
          {locale === "zh" ? "不想在本机装？用远程的" : "Don't want to install anything? Use a remote one"}
        </h2>
        <p className="mb-4 text-sm text-neutral-500 dark:text-neutral-400">
          {locale === "zh"
            ? "有些 server 作者已经跑在自己服务器上，给一个 URL 就能连，不用 npx / pip 装任何东西。"
            : "Some servers are already hosted by their authors — you paste a URL instead of installing anything with npx or pip."}
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
