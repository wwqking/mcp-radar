import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getGuideSlugs, getGuideBySlug } from "@/lib/guides";
import { getAllServers } from "@/lib/data";
import { bestOf } from "@/lib/best-of";
import RankingTable from "@/components/RankingTable";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, ORGANIZATION_ID } from "@/lib/schema";
import { SITE_NAME, absoluteUrl } from "@/lib/site";
import type { Locale } from "@/lib/i18n/locales";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizedHref, hreflangAlternates } from "@/lib/i18n/href";

interface Props {
  params: Promise<{ slug: string; locale: Locale }>;
}

export function generateStaticParams() {
  return getGuideSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const g = getGuideBySlug(slug, locale);
  if (!g) return {};
  const url = `/${locale}/guides/${g.slug}`;
  return {
    title: g.title,
    description: g.excerpt,
    alternates: hreflangAlternates(locale, `/guides/${g.slug}`),
    openGraph: { title: g.title, description: g.excerpt, url, type: "article" },
    twitter: { card: "summary_large_image", title: g.title, description: g.excerpt },
  };
}

export default async function GuideArticlePage({ params }: Props) {
  const { locale, slug } = await params;
  const d = getDictionary(locale).guides;
  const ds = getDictionary(locale).server;
  const g = getGuideBySlug(slug, locale);
  if (!g) notFound();

  const ranking = g.ranking
    ? bestOf(await getAllServers(), g.ranking.categories, {
        starsFloor: g.ranking.starsFloor,
        exclude: g.ranking.exclude,
        requireOfficialRegistry: g.ranking.requireOfficialRegistry,
        client: g.ranking.client,
        limit: g.ranking.limit,
      })
    : null;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: g.title,
    description: g.excerpt,
    datePublished: g.publishedAt,
    dateModified: g.modifiedAt,
    url: absoluteUrl(`/${locale}/guides/${g.slug}`),
    image: absoluteUrl(`/${locale}/opengraph-image`),
    author: { "@id": ORGANIZATION_ID },
    publisher: { "@id": ORGANIZATION_ID },
    isAccessibleForFree: true,
    ...(g.sources?.length ? { citation: g.sources.map((source) => source.url) } : {}),
  };
  const crumb = breadcrumbSchema([
    { name: d.h1, path: `/${locale}/guides` },
    { name: g.title, path: `/${locale}/guides/${g.slug}` },
  ]);

  return (
    <div className="container-site max-w-4xl py-10 sm:py-14">
      <JsonLd data={[articleSchema, crumb]} />
      <nav className="mb-4 text-sm text-neutral-400">
        <Link href={localizedHref(locale, "/guides")} className="hover:text-brand-600">{d.h1}</Link>
        <span className="mx-2">/</span>
        <span className="text-neutral-600 dark:text-neutral-300">{g.title}</span>
      </nav>

      <header className="mb-8">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{g.icon}</span>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
            g.tier === "member"
              ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
              : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
          }`}>
            {g.tier === "member" ? d.tierMember : d.tierFree}
          </span>
        </div>
        <h1 className="mt-3 text-2xl font-extrabold leading-snug tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-3xl">
          {g.title}
        </h1>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-neutral-400">
          <span>{locale === "zh" ? "发布" : "Published"}: {g.publishedAt}</span>
          <span>{locale === "zh" ? "更新" : "Updated"}: {g.modifiedAt}</span>
          <span>{d.readingTime.replace("{n}", String(g.readingMinutes))}</span>
        </div>
        {(g.lastVerified || g.editorialOwner) && (
          <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
            {g.editorialOwner ?? SITE_NAME}
            {g.lastVerified ? ` · ${locale === "zh" ? "事实核验" : "Facts verified"}: ${g.lastVerified}` : ""}
            {g.refreshDue ? ` · ${locale === "zh" ? "下次复核" : "Refresh due"}: ${g.refreshDue}` : ""}
          </p>
        )}
      </header>

      {!g.translated && (
        <div className="mb-8 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-200">
          {locale === "zh" ? "本指南目前仅提供英文版。" : d.notTranslated}
        </div>
      )}

      {g.directAnswer && (
        <section className="mb-8 rounded-2xl border border-brand-200 bg-brand-50/70 p-5 dark:border-brand-900 dark:bg-brand-950/30 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-300">
            {locale === "zh" ? "直接答案" : "Direct answer"}
          </p>
          <p className="mt-2 text-base font-medium leading-7 text-neutral-800 dark:text-neutral-200">{g.directAnswer}</p>
        </section>
      )}

      {g.keyFacts && g.keyFacts.length > 0 && (
        <section className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label={locale === "zh" ? "关键事实" : "Key facts"}>
          {g.keyFacts.map((fact) => (
            <div key={fact.label} className="card p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">{fact.label}</p>
              <p className="mt-1 font-bold text-neutral-900 dark:text-neutral-100">{fact.value}</p>
              {fact.note && <p className="mt-1 text-xs leading-5 text-neutral-500 dark:text-neutral-400">{fact.note}</p>}
            </div>
          ))}
        </section>
      )}

      {g.visual && (
        <figure className="mb-8 rounded-2xl border border-neutral-200 bg-neutral-50 p-5 dark:border-neutral-800 dark:bg-neutral-900/60 sm:p-6">
          <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">{g.visual.title}</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-4">
            {g.visual.items.map((item, index) => (
              <div key={item.label} className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-950">
                <span className="text-xs font-semibold text-brand-600 dark:text-brand-400">{index + 1}</span>
                <p className="mt-1 font-semibold text-neutral-900 dark:text-neutral-100">{item.label}</p>
                <p className="mt-1 text-xs leading-5 text-neutral-500 dark:text-neutral-400">{item.description}</p>
              </div>
            ))}
          </div>
          <figcaption className="mt-3 text-xs text-neutral-500 dark:text-neutral-400">{g.visual.caption}</figcaption>
        </figure>
      )}

      {g.comparison && (
        <figure className="mb-8">
          <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-neutral-50 text-xs uppercase tracking-wider text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400">
                <tr>{g.comparison.headers.map((header) => <th key={header} className="px-4 py-3 font-semibold">{header}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {g.comparison.rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className={`px-4 py-3 align-top leading-6 text-neutral-600 dark:text-neutral-300 ${cellIndex === 0 ? "font-semibold text-neutral-900 dark:text-neutral-100" : ""}`}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <figcaption className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">{g.comparison.caption}</figcaption>
        </figure>
      )}

      <div className="card mb-8 p-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">{d.toc}</p>
        <ol className="space-y-1 text-sm">
          {g.sections.map((section, index) => (
            <li key={section.heading} className="flex items-center gap-2">
              <span className="text-neutral-300 dark:text-neutral-600">{index + 1}.</span>
              <a href={`#section-${index}`} className="text-neutral-600 hover:text-brand-600 dark:text-neutral-300">{section.heading}</a>
            </li>
          ))}
        </ol>
      </div>

      <article className="space-y-10">
        {g.sections.map((section, sectionIndex) => (
          <section key={section.heading} id={`section-${sectionIndex}`} className="scroll-mt-20">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">{section.heading}</h2>
            <div className="mt-3 space-y-3">
              {section.body.map((paragraph, index) => (
                <p key={index} className="leading-7 text-neutral-600 dark:text-neutral-400">{paragraph}</p>
              ))}
              {section.bullets && section.bullets.length > 0 && (
                <ul className="space-y-2 pl-5 text-neutral-600 dark:text-neutral-400">
                  {section.bullets.map((item) => <li key={item} className="list-disc leading-7">{item}</li>)}
                </ul>
              )}
              {section.codeBlocks?.map((block) => (
                <div key={block.label} className="overflow-hidden rounded-xl border border-neutral-200 bg-neutral-950 dark:border-neutral-800">
                  <p className="border-b border-neutral-800 px-4 py-2 text-xs font-medium text-neutral-400">{block.label}</p>
                  <pre className="overflow-x-auto p-4 text-sm leading-6 text-neutral-100"><code>{block.code}</code></pre>
                </div>
              ))}
            </div>
            {ranking && g.ranking?.afterSection === sectionIndex && (
              <RankingTable
                list={ranking}
                locale={locale}
                client={g.ranking.client}
                strings={{
                  rank: ds.rankingRank,
                  server: ds.rankingServer,
                  trustScore: ds.rankingTrust,
                  stars: ds.rankingStars,
                  clients: ds.rankingClients,
                  methodNote: ds.rankingMethod,
                }}
              />
            )}
          </section>
        ))}
      </article>

      {g.methodology && g.methodology.length > 0 && (
        <section className="mt-12 rounded-xl border border-neutral-200 p-5 dark:border-neutral-800">
          <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">{locale === "zh" ? "方法与限制" : "Methodology and limitations"}</h2>
          <ul className="mt-3 space-y-2 pl-5 text-sm text-neutral-600 dark:text-neutral-400">
            {g.methodology.map((item) => <li key={item} className="list-disc leading-6">{item}</li>)}
          </ul>
        </section>
      )}

      {g.faq && g.faq.length > 0 && (
        <section className="mt-12">
          <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">{locale === "zh" ? "常见问题" : "Frequently asked questions"}</h2>
          <div className="mt-3 divide-y divide-neutral-100 dark:divide-neutral-800">
            {g.faq.map((item) => (
              <div key={item.question} className="py-4">
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{item.question}</h3>
                <p className="mt-2 leading-7 text-neutral-600 dark:text-neutral-400">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {g.sources && g.sources.length > 0 && (
        <section className="mt-12">
          <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">{locale === "zh" ? "来源" : "Sources"}</h2>
          <ol className="mt-3 space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
            {g.sources.map((source) => (
              <li key={source.url}>
                <a href={source.url} target="_blank" rel="noreferrer" className="link-accent">{source.label}</a>
                <span className="text-neutral-400"> · {locale === "zh" ? "访问" : "retrieved"} {source.retrievedAt}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {g.relatedLinks && g.relatedLinks.length > 0 && (
        <section className="mt-12">
          <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">{locale === "zh" ? "继续阅读" : "Continue reading"}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {g.relatedLinks.map((item) => (
              <Link key={item.href} href={localizedHref(locale, item.href)} className="card p-4 hover:border-brand-400 dark:hover:border-brand-700">
                <span className="font-semibold text-brand-700 dark:text-brand-300">{item.label} →</span>
                <span className="mt-1 block text-xs leading-5 text-neutral-500 dark:text-neutral-400">{item.note}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="mt-12 border-t border-neutral-200 pt-6 text-sm text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
        <Link href={localizedHref(locale, "/guides")} className="link-accent">{d.backToList}</Link>
      </div>
    </div>
  );
}
