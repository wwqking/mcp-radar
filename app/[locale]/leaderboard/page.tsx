import type { Metadata } from "next";
import Link from "next/link";
import { CATEGORIES, getAllServers, getLastUpdated } from "@/lib/data";
import LeaderboardTable from "@/components/LeaderboardTable";
import SubscribeInline from "@/components/SubscribeInline";
import type { Locale } from "@/lib/i18n/locales";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizedHref } from "@/lib/i18n/href";

export function generateMetadata({ params }: { params: { locale: Locale } }): Metadata {
  const d = getDictionary(params.locale).leaderboard;
  return {
    title: d.metaTitle,
    description: d.metaDesc,
    alternates: { canonical: `/${params.locale}/leaderboard` },
  };
}

export default async function LeaderboardPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const dict = getDictionary(locale);
  const d = dict.leaderboard;
  const [servers, lastUpdated] = await Promise.all([getAllServers(), getLastUpdated()]);

  return (
    <div className="container-site py-10 sm:py-14">
      <header className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-3xl">
          {d.h1}
        </h1>
        <p className="mt-2 max-w-2xl text-neutral-600 dark:text-neutral-400">{d.sub}</p>
      </header>

      {/* 方法论条（不能省：榜单可信度的锚） */}
      <div className="mb-8 flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg border border-brand-200 bg-brand-50 px-4 py-2.5 text-sm text-brand-900 dark:border-brand-900 dark:bg-brand-950/50 dark:text-brand-100">
        <span>{d.methodBar.replace("{date}", lastUpdated)}</span>
        <Link href={localizedHref(locale, "/about")} className="font-medium underline underline-offset-4">
          {d.methodLink}
        </Link>
      </div>

      <div className="mb-8">
        <SubscribeInline locale={locale} variant="compact" />
      </div>

      <LeaderboardTable
        servers={servers}
        categories={CATEGORIES}
        locale={locale}
        labels={{
          allCategories: dict.filters.allCategories,
          allStatus: dict.filters.allStatus,
          lcActive: dict.lifecycle.active,
          lcDying: dict.lifecycle.dying,
          lcDead: dict.lifecycle.dead,
          lcUnverifiable: dict.lifecycle.unverifiable,
          anyScore: dict.filters.anyScore,
          score80: dict.filters.score80,
          score60: dict.filters.score60,
          score40: dict.filters.score40,
          sortBy: dict.filters.sortBy,
          sortScore: dict.filters.sortScore,
          sortStars: dict.filters.sortStars,
          sortDownloads: dict.filters.sortDownloads,
          sortUpdated: dict.filters.sortUpdated,
          viewTable: dict.filters.viewTable,
          viewCard: dict.filters.viewCard,
          countN: dict.filters.countN,
          thStatus: d.thStatus,
          thDownloads: d.thDownloads,
          thLastCommit: d.thLastCommit,
          thVerdict: d.thVerdict,
          today: d.today,
          dimMaintenance: d.dimMaintenance,
          dimAdoption: d.dimAdoption,
          dimUsability: d.dimUsability,
          dimHealth: d.dimHealth,
          dimCommunity: d.dimCommunity,
        }}
      />
    </div>
  );
}
