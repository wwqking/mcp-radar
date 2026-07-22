import type { Metadata } from "next";
import Link from "next/link";
import { getAllGuides } from "@/lib/guides";
import type { Locale } from "@/lib/i18n/locales";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizedHref } from "@/lib/i18n/href";

export function generateMetadata({ params }: { params: { locale: Locale } }): Metadata {
  const d = getDictionary(params.locale).guides;
  return {
    title: d.metaTitle,
    description: d.metaDesc,
    alternates: { canonical: `/${params.locale}/guides` },
  };
}

export default function GuidesPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const d = getDictionary(locale).guides;
  const guides = getAllGuides(locale);

  return (
    <div className="container-site max-w-4xl py-10 sm:py-14">
      <header className="mb-8">
        <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-3xl">
          {d.h1}
        </h1>
        <p className="mt-2 max-w-2xl text-neutral-600 dark:text-neutral-400">{d.sub}</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {guides.map((g) => (
          <Link key={g.slug} href={localizedHref(locale, `/guides/${g.slug}`)} className="card group flex flex-col gap-3 p-5 sm:p-6">
            <div className="flex items-center justify-between">
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
            <h2 className="text-base font-bold leading-snug text-neutral-900 group-hover:text-brand-700 dark:text-neutral-100 dark:group-hover:text-brand-300">
              {g.title}
            </h2>
            <p className="flex-1 text-sm leading-6 text-neutral-500 dark:text-neutral-400">{g.excerpt}</p>
            <p className="text-xs text-neutral-400">
              {g.publishedAt} · {d.readingTime.replace("{n}", String(g.readingMinutes))}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
