"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Lifecycle, MCPServer, Category, TaxonomyTopic } from "@/lib/types";
import { formatNumber, categoryName } from "@/lib/constants";
import TrustScore from "./TrustScore";
import LifecycleBadge from "./LifecycleBadge";
import ServerCard from "./ServerCard";
import type { Locale } from "@/lib/i18n/locales";
import { localizedHref } from "@/lib/i18n/href";
import { verdictText } from "@/lib/i18n/verdict";
import { taxonomyForServer, topicName } from "@/lib/taxonomy";

type SortKey = "score" | "stars" | "downloads" | "updated";
type View = "table" | "card";
const PAGE_SIZE = 100;

interface Labels {
  allCategories: string;
  allStatus: string;
  lcActive: string;
  lcDying: string;
  lcDead: string;
  lcUnverifiable: string;
  anyScore: string;
  score80: string;
  score60: string;
  score40: string;
  sortBy: string;
  sortScore: string;
  sortStars: string;
  sortDownloads: string;
  sortUpdated: string;
  viewTable: string;
  viewCard: string;
  countN: string;
  thStatus: string;
  thDownloads: string;
  thLastCommit: string;
  thVerdict: string;
  today: string;
  dimMaintenance: string;
  dimAdoption: string;
  dimUsability: string;
  dimHealth: string;
  dimCommunity: string;
  allTopics: string;
  topicFilter: string;
  showing: string;
  loadMore: string;
}

interface Props {
  servers: MCPServer[];
  categories: Category[];
  topics: TaxonomyTopic[];
  locale: Locale;
  labels: Labels;
}

/** 榜单：筛选栏 + 表格/卡片视图切换 + 五维展开 */
export default function LeaderboardTable({ servers, categories, topics, locale, labels: L }: Props) {
  const [cat, setCat] = useState<string>("all");
  const [topic, setTopic] = useState<string>("all");
  const [lc, setLc] = useState<"all" | Lifecycle>("all");
  const [minScore, setMinScore] = useState(0);
  const [sort, setSort] = useState<SortKey>("score");
  const [view, setView] = useState<View>("table");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    if (window.matchMedia("(max-width: 639px)").matches) {
      setView("card");
    }
    const initialTopic = new URLSearchParams(window.location.search).get("topic");
    if (initialTopic && topics.some((candidate) => candidate.slug === initialTopic)) {
      setTopic(initialTopic);
    }
  }, []);

  const changeTopic = (nextTopic: string) => {
    setTopic(nextTopic);
    const url = new URL(window.location.href);
    if (nextTopic === "all") url.searchParams.delete("topic");
    else url.searchParams.set("topic", nextTopic);
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
  };

  const list = useMemo(() => {
    let l = [...servers];
    if (cat !== "all") l = l.filter((s) => s.categories.includes(cat));
    if (topic !== "all") l = l.filter((s) => taxonomyForServer(s).topics.includes(topic));
    if (lc !== "all") l = l.filter((s) => s.lifecycle === lc);
    if (minScore > 0) l = l.filter((s) => s.trustScore >= minScore);
    l.sort((a, b) => {
      if (sort === "score") return b.trustScore - a.trustScore;
      if (sort === "stars") return b.signals.stars - a.signals.stars;
      if (sort === "downloads") return (b.signals.npmWeeklyDownloads ?? 0) - (a.signals.npmWeeklyDownloads ?? 0);
      return (a.signals.lastCommitDaysAgo ?? 9999) - (b.signals.lastCommitDaysAgo ?? 9999);
    });
    return l;
  }, [servers, cat, topic, lc, minScore, sort]);
  const visibleList = list.slice(0, visibleCount);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
    setExpanded(null);
  }, [cat, topic, lc, minScore, sort, view]);

  return (
    <div>
      {/* 筛选栏 */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <select
          value={cat}
          onChange={(e) => setCat(e.target.value)}
          aria-label={L.allCategories}
          className="min-h-11 rounded-lg border border-neutral-200 bg-white px-3 text-sm dark:border-neutral-700 dark:bg-neutral-900"
        >
          <option value="all">{L.allCategories}</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>{c.icon} {categoryName(c, locale)}</option>
          ))}
        </select>

        <select
          value={topic}
          onChange={(event) => changeTopic(event.target.value)}
          aria-label={L.topicFilter}
          className="min-h-11 rounded-lg border border-neutral-200 bg-white px-3 text-sm dark:border-neutral-700 dark:bg-neutral-900"
        >
          <option value="all">{L.allTopics}</option>
          {topics.map((candidate) => (
            <option key={candidate.slug} value={candidate.slug}>{topicName(candidate, locale)}</option>
          ))}
        </select>

        <select
          value={lc}
          onChange={(e) => setLc(e.target.value as "all" | Lifecycle)}
          aria-label={L.allStatus}
          className="min-h-11 rounded-lg border border-neutral-200 bg-white px-3 text-sm dark:border-neutral-700 dark:bg-neutral-900"
        >
          <option value="all">{L.allStatus}</option>
          <option value="active">{L.lcActive}</option>
          <option value="dying">{L.lcDying}</option>
          <option value="dead">{L.lcDead}</option>
          <option value="unverifiable">{L.lcUnverifiable}</option>
        </select>

        <select
          value={minScore}
          onChange={(e) => setMinScore(Number(e.target.value))}
          aria-label={L.anyScore}
          className="min-h-11 rounded-lg border border-neutral-200 bg-white px-3 text-sm dark:border-neutral-700 dark:bg-neutral-900"
        >
          <option value={0}>{L.anyScore}</option>
          <option value={80}>{L.score80}</option>
          <option value={60}>{L.score60}</option>
          <option value={40}>{L.score40}</option>
        </select>

        <div className="flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400">
          {L.sortBy}
          {(
            [
              ["score", L.sortScore],
              ["stars", L.sortStars],
              ["downloads", L.sortDownloads],
              ["updated", L.sortUpdated],
            ] as [SortKey, string][]
          ).map(([v, label]) => (
            <button
              key={v}
              onClick={() => setSort(v)}
              className={`min-h-11 rounded-md px-3 py-2 ${
                sort === v
                  ? "bg-neutral-200 font-medium text-neutral-900 dark:bg-neutral-700 dark:text-neutral-100"
                  : "hover:text-neutral-900 dark:hover:text-neutral-100"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="ml-auto flex rounded-lg border border-neutral-200 p-0.5 dark:border-neutral-700">
          {(
            [
              ["table", L.viewTable],
              ["card", L.viewCard],
            ] as [View, string][]
          ).map(([v, label]) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`min-h-11 rounded-md px-3 py-2 text-sm ${
                view === v
                  ? "bg-brand-600 text-white"
                  : "text-neutral-600 dark:text-neutral-400"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <p className="mb-4 text-sm text-neutral-400" aria-live="polite">
        {L.countN.replace("{n}", String(list.length))}
        <span className="mx-1.5" aria-hidden="true">·</span>
        {L.showing.replace("{shown}", String(visibleList.length)).replace("{total}", String(list.length))}
      </p>

      {view === "card" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleList.map((s, i) => (
            <ServerCard key={s.slug} server={s} locale={locale} rank={i + 1} />
          ))}
        </div>
      ) : (
        <div className="card overflow-x-auto p-0">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-left text-xs text-neutral-400 dark:border-neutral-800">
                <th className="px-4 py-3 font-medium">#</th>
                <th className="px-4 py-3 font-medium">Server</th>
                <th className="px-4 py-3 font-medium">TrustScore</th>
                <th className="px-4 py-3 font-medium">{L.thStatus}</th>
                <th className="px-4 py-3 font-medium text-right">Stars</th>
                <th className="px-4 py-3 font-medium text-right">{L.thDownloads}</th>
                <th className="px-4 py-3 font-medium text-right">{L.thLastCommit}</th>
                <th className="px-4 py-3 font-medium">{L.thVerdict}</th>
              </tr>
            </thead>
            <tbody>
              {visibleList.map((s, i) => (
                <Fragment key={s.slug}>
                  <tr
                    onClick={() => setExpanded(expanded === s.slug ? null : s.slug)}
                    className="cursor-pointer border-b border-neutral-100 transition-colors hover:bg-neutral-50 dark:border-neutral-800/60 dark:hover:bg-neutral-800/40"
                  >
                    <td className="px-4 py-3 font-mono text-neutral-400">{i + 1}</td>
                    <td className="px-4 py-3">
                      <Link
                        href={localizedHref(locale, `/server/${s.slug}`)}
                        onClick={(e) => e.stopPropagation()}
                        className="mono font-medium text-brand-700 hover:underline dark:text-brand-300"
                      >
                        {s.name}
                      </Link>
                      <p className="mt-0.5 max-w-[260px] truncate text-xs text-neutral-400">{s.tagline}</p>
                    </td>
                    <td className="px-4 py-3">
                      <TrustScore value={s.trustScore} size="sm" />
                    </td>
                    <td className="px-4 py-3">
                      <LifecycleBadge status={s.lifecycle} locale={locale} size="sm" />
                    </td>
                    <td className="px-4 py-3 text-right font-mono">{formatNumber(s.signals.stars)}</td>
                    <td className="px-4 py-3 text-right font-mono">
                      {s.signals.npmWeeklyDownloads !== null ? formatNumber(s.signals.npmWeeklyDownloads) : "—"}
                    </td>
                    <td className="px-4 py-3 text-right text-neutral-500 dark:text-neutral-400">
                      {s.signals.lastCommitDaysAgo === null ? "—" : s.signals.lastCommitDaysAgo === 0 ? L.today : `${s.signals.lastCommitDaysAgo}d`}
                    </td>
                    <td className="max-w-[180px] truncate px-4 py-3 text-xs text-neutral-500 dark:text-neutral-400">
                      {verdictText(s, locale)}
                    </td>
                  </tr>
                  {expanded === s.slug && (
                    <tr className="border-b border-neutral-100 bg-neutral-50/60 dark:border-neutral-800/60 dark:bg-neutral-800/30">
                      <td colSpan={8} className="px-4 py-4">
                        <div className="grid gap-3 sm:grid-cols-5">
                          {(
                            [
                              [L.dimMaintenance, s.breakdown.maintenance, "30%"],
                              [L.dimAdoption, s.breakdown.adoption, "25%"],
                              [L.dimUsability, s.breakdown.usability, "20%"],
                              [L.dimHealth, s.breakdown.health, "15%"],
                              [L.dimCommunity, s.breakdown.community, "10%"],
                            ] as [string, number, string][]
                          ).map(([label, v, w]) => (
                            <div key={label} className="rounded-lg bg-white p-3 dark:bg-neutral-900">
                              <p className="text-xs text-neutral-400">{label} · {w}</p>
                              <p className={`mt-1 text-lg font-bold ${v >= 80 ? "text-emerald-600" : v >= 60 ? "text-lime-600" : v >= 40 ? "text-amber-600" : "text-red-600"}`}>
                                {v}
                              </p>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {visibleCount < list.length && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
            className="min-h-11 rounded-lg border border-neutral-300 px-5 py-2 text-sm font-medium text-neutral-700 hover:border-brand-400 hover:text-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-300 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-brand-700 dark:hover:text-brand-300"
          >
            {L.loadMore}
          </button>
        </div>
      )}
    </div>
  );
}
