import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getGuideSlugs, getGuideBySlug, freeSectionCount } from "@/lib/guides";
import Paywall from "@/components/Paywall";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { SITE_NAME, absoluteUrl } from "@/lib/site";
import type { Locale } from "@/lib/i18n/locales";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizedHref } from "@/lib/i18n/href";

interface Props {
  params: { slug: string; locale: Locale };
}

export function generateStaticParams() {
  return getGuideSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const g = getGuideBySlug(params.slug, params.locale);
  if (!g) return {};
  const url = `/${params.locale}/guides/${g.slug}`;
  return {
    title: g.title,
    description: g.excerpt,
    alternates: { canonical: url },
    openGraph: { title: g.title, description: g.excerpt, url, type: "article" },
    twitter: { card: "summary_large_image", title: g.title, description: g.excerpt },
  };
}

export default function GuideArticlePage({ params }: Props) {
  const { locale } = params;
  const d = getDictionary(locale).guides;
  const g = getGuideBySlug(params.slug, locale);
  if (!g) notFound();

  const freeCount = freeSectionCount(g);
  const visibleSections = g.sections.slice(0, freeCount);
  const locked = g.tier === "member" && freeCount < g.sections.length;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: g.title,
    description: g.excerpt,
    datePublished: g.publishedAt,
    url: absoluteUrl(`/${locale}/guides/${g.slug}`),
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: { "@type": "Organization", name: SITE_NAME },
    isAccessibleForFree: g.tier === "free",
  };
  const crumb = breadcrumbSchema([
    { name: d.h1, path: `/${locale}/guides` },
    { name: g.title, path: `/${locale}/guides/${g.slug}` },
  ]);

  return (
    <div className="container-site max-w-3xl py-10 sm:py-14">
      <JsonLd data={[articleSchema, crumb]} />
      <nav className="mb-4 text-sm text-neutral-400">
        <Link href={localizedHref(locale, "/guides")} className="hover:text-brand-600">{d.h1}</Link>
        <span className="mx-2">/</span>
        <span className="text-neutral-600 dark:text-neutral-300">{g.title}</span>
      </nav>

      <header className="mb-8">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{g.icon}</span>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
              g.tier === "member"
                ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
            }`}
          >
            {g.tier === "member" ? d.tierMember : d.tierFree}
          </span>
        </div>
        <h1 className="mt-3 text-2xl font-extrabold leading-snug tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-3xl">
          {g.title}
        </h1>
        <p className="mt-2 text-sm text-neutral-400">
          {g.publishedAt} · {d.readingTime.replace("{n}", String(g.readingMinutes))}
        </p>
      </header>

      {!g.translated && (
        <div className="mb-8 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-200">
          {d.notTranslated}
        </div>
      )}

      {/* 目录 */}
      <div className="card mb-8 p-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">{d.toc}</p>
        <ol className="space-y-1 text-sm">
          {g.sections.map((s, i) => (
            <li key={s.heading} className="flex items-center gap-2">
              <span className="text-neutral-300 dark:text-neutral-600">{i + 1}.</span>
              <span className={i < freeCount ? "text-neutral-600 dark:text-neutral-300" : "text-neutral-400 dark:text-neutral-500"}>
                {s.heading}
                {i >= freeCount && <span className="ml-1.5 text-xs">🔒</span>}
              </span>
            </li>
          ))}
        </ol>
      </div>

      {/* 正文（免费部分） */}
      <article className="space-y-8">
        {visibleSections.map((s) => (
          <section key={s.heading}>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">{s.heading}</h2>
            <div className="mt-3 space-y-3">
              {s.body.map((p, i) => (
                <p key={i} className="leading-7 text-neutral-600 dark:text-neutral-400">
                  {p}
                </p>
              ))}
            </div>
          </section>
        ))}
      </article>

      {locked && <Paywall title={g.title} locale={locale} />}

      <div className="mt-12 border-t border-neutral-200 pt-6 text-sm text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
        <Link href={localizedHref(locale, "/guides")} className="link-accent">{d.backToList}</Link>
      </div>
    </div>
  );
}
