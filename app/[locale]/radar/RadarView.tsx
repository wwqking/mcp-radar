"use client";

import { useState } from "react";
import type { RadarBuckets } from "@/lib/provider";
import ServerCard from "@/components/ServerCard";
import SubscribeInline from "@/components/SubscribeInline";
import SourceMethodNote from "@/components/SourceMethodNote";
import type { Locale } from "@/lib/i18n/locales";
import { evidenceText } from "@/lib/i18n/verdict";

interface RadarLabels {
  h1: string;
  sub: string;
  sourceLabel: string;
  periodThisWeek: string;
  periodLastWeek: string;
  periodHistory: string;
  placeholderNote: string;
  trendingTitle: string;
  trendingDesc: string;
  newTitle: string;
  newDesc: string;
  deadTitle: string;
  deadDesc: string;
  emptyPrefix: string;
  emptySuffix: string;
  shareTitle: string;
}

interface Props {
  entries: RadarBuckets;
  lastUpdated: string;
  locale: Locale;
  labels: RadarLabels;
}

/** 雷达页交互层：时间切换 + 分享按钮。数据由服务端父组件 fetch 后传入。 */
export default function RadarView({ entries, lastUpdated, locale, labels: L }: Props) {
  const periods = [L.periodThisWeek, L.periodLastWeek, L.periodHistory] as const;
  const [period, setPeriod] = useState<string>(L.periodThisWeek);
  const { trending, added, dead } = entries;

  const sections = [
    { key: "trending", title: L.trendingTitle, desc: L.trendingDesc, entries: trending },
    { key: "new", title: L.newTitle, desc: L.newDesc, entries: added },
    { key: "dead", title: L.deadTitle, desc: L.deadDesc, entries: dead },
  ];

  return (
    <div className="container-site py-10 sm:py-14">
      <header className="mb-8">
        <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-3xl">
          {L.h1}
        </h1>
        <p className="mt-2 max-w-2xl text-neutral-600 dark:text-neutral-400">{L.sub}</p>
        <SourceMethodNote locale={locale} className="mt-3" sources={[L.sourceLabel]} updatedAt={lastUpdated} />
      </header>

      {/* 时间切换 */}
      <div className="mb-8 flex rounded-lg border border-neutral-200 p-0.5 dark:border-neutral-700 w-fit">
        {periods.map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`rounded-md px-4 py-1.5 text-sm ${
              period === p
                ? "bg-brand-600 text-white"
                : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {period !== L.periodThisWeek && (
        <p className="mb-8 rounded-lg bg-neutral-100 px-4 py-2.5 text-sm text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
          {L.placeholderNote.replace("{period}", period)}
        </p>
      )}

      <div className="space-y-12">
        {sections.map((sec, idx) => (
          <section key={sec.key}>
            <div className="mb-4">
              <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">{sec.title}</h2>
              <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">{sec.desc}</p>
            </div>
            {sec.entries.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {sec.entries.map((e) => {
                  const ev = evidenceText(e, locale);
                  return (
                  <div key={e.server.slug} className="relative">
                    <ServerCard server={e.server} locale={locale} evidence={ev} />
                    <button
                      title={L.shareTitle}
                      onClick={() => {
                        const text = `${e.server.name} — ${ev} | MCP Radar`;
                        navigator.clipboard?.writeText(text).catch(() => {});
                      }}
                      className="absolute right-3 top-3 rounded-md bg-white/80 p-1.5 text-neutral-400 opacity-0 shadow-sm transition-opacity hover:text-brand-600 [div:hover>&]:opacity-100 dark:bg-neutral-900/80"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                    </button>
                  </div>
                  );
                })}
              </div>
            ) : (
              <p className="rounded-lg border border-dashed border-neutral-200 py-8 text-center text-sm text-neutral-400 dark:border-neutral-700">
                {L.emptyPrefix}{sec.title.slice(2)}{L.emptySuffix}
              </p>
            )}

            {idx === 0 && (
              <div className="mt-8">
                <SubscribeInline locale={locale} variant="compact" />
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
