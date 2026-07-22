import type { Metadata } from "next";
import Link from "next/link";
import { getGraveyard, getSiteStats, formatNumber } from "@/lib/data";
import LifecycleBadge from "@/components/LifecycleBadge";
import SubscribeInline from "@/components/SubscribeInline";
import type { Locale } from "@/lib/i18n/locales";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizedHref } from "@/lib/i18n/href";
import { deathReasonText } from "@/lib/i18n/verdict";

export function generateMetadata({ params }: { params: { locale: Locale } }): Metadata {
  const d = getDictionary(params.locale).graveyard;
  return {
    title: d.metaTitle,
    description: d.metaDesc,
    alternates: { canonical: `/${params.locale}/graveyard` },
  };
}

export default async function GraveyardPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const d = getDictionary(locale).graveyard;
  const [dead, stats] = await Promise.all([getGraveyard(), getSiteStats()]);

  return (
    <div className="container-site py-10 sm:py-14">
      <header className="mb-8 max-w-3xl">
        <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-3xl">
          {d.h1}
        </h1>
        <p className="mt-3 text-neutral-600 dark:text-neutral-400">
          {d.subA} <strong className="text-red-600 dark:text-red-400">{stats.dead + stats.dying}</strong> {d.subB}
        </p>
      </header>

      <div className="space-y-3">
        {dead.map((s) => (
          <Link
            key={s.slug}
            href={localizedHref(locale, `/server/${s.slug}`)}
            className="card group flex flex-col gap-3 p-5 sm:flex-row sm:items-center"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-lg dark:bg-neutral-800">
              🪦
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="mono text-sm font-semibold text-neutral-700 group-hover:text-brand-700 dark:text-neutral-200 dark:group-hover:text-brand-300">
                  {s.name}
                </span>
                <LifecycleBadge status={s.lifecycle} locale={locale} size="sm" />
                {s.signals.stars > 0 && (
                  <span className="text-xs text-neutral-400">{d.hadStars.replace("{n}", formatNumber(s.signals.stars))}</span>
                )}
              </div>
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                {d.deathReason}{deathReasonText(s, locale)}
              </p>
            </div>
            {s.deadAt && (
              <div className="shrink-0 text-right text-xs text-neutral-400">
                <p>{d.deadAt}</p>
                <p className="font-mono">{s.deadAt}</p>
              </div>
            )}
          </Link>
        ))}
      </div>

      {/* 申诉入口 */}
      <div className="mt-10 rounded-xl border border-neutral-200 p-5 text-sm text-neutral-600 dark:border-neutral-700 dark:text-neutral-400">
        <p>
          {d.appeal}{" "}
          <Link href={localizedHref(locale, "/about")} className="link-accent font-medium">{d.appealLink}</Link>
        </p>
      </div>

      <div className="mt-10">
        <SubscribeInline locale={locale} />
      </div>
    </div>
  );
}
