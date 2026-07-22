import type { Metadata } from "next";
import { getRadarEntries, getLastUpdated } from "@/lib/data";
import RadarView from "./RadarView";
import type { Locale } from "@/lib/i18n/locales";
import { getDictionary } from "@/lib/i18n/dictionaries";

export function generateMetadata({ params }: { params: { locale: Locale } }): Metadata {
  const d = getDictionary(params.locale).radar;
  return {
    title: d.metaTitle,
    description: d.metaDesc,
    alternates: { canonical: `/${params.locale}/radar` },
  };
}

export default async function RadarPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const d = getDictionary(locale).radar;
  const [entries, lastUpdated] = await Promise.all([getRadarEntries(), getLastUpdated()]);
  return (
    <RadarView
      entries={entries}
      lastUpdated={lastUpdated}
      locale={locale}
      labels={{
        h1: d.h1,
        sub: d.sub,
        sourceLabel: d.sourceLabel,
        periodThisWeek: d.periodThisWeek,
        periodLastWeek: d.periodLastWeek,
        periodHistory: d.periodHistory,
        placeholderNote: d.placeholderNote,
        trendingTitle: d.trendingTitle,
        trendingDesc: d.trendingDesc,
        newTitle: d.newTitle,
        newDesc: d.newDesc,
        deadTitle: d.deadTitle,
        deadDesc: d.deadDesc,
        emptyPrefix: d.emptyPrefix,
        emptySuffix: d.emptySuffix,
        shareTitle: d.shareTitle,
      }}
    />
  );
}
