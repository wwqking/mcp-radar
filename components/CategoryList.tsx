"use client";

import { useEffect, useId, useMemo, useState } from "react";
import type { MCPServer } from "@/lib/types";
import ServerCard from "./ServerCard";
import type { Locale } from "@/lib/i18n/locales";
import { taxonomyForServer } from "@/lib/taxonomy";

type Sort = "score" | "updated" | "stars";
type Filter = "all" | "active";
const PAGE_SIZE = 48;

interface FilterLabels {
  all: string;
  activeOnly: string;
  sortBy: string;
  sortScore: string;
  sortStars: string;
  sortUpdated: string;
  emptyList: string;
  topicFilter?: string;
  allTopics?: string;
  taxonomyNote?: string;
  showing?: string;
  loadMore?: string;
}

export interface TopicFilterOption {
  slug: string;
  label: string;
  count: number;
}

interface Props {
  servers: MCPServer[];
  locale: Locale;
  labels: FilterLabels;
  anchor: string; // 已在服务端拼好的“本类共 N 个…”整句
  topicOptions?: TopicFilterOption[];
}

/** 分类页：lifecycle 筛选 + 排序 */
export default function CategoryList({ servers, locale, labels, anchor, topicOptions = [] }: Props) {
  const [sort, setSort] = useState<Sort>("score");
  const [filter, setFilter] = useState<Filter>("all");
  const [topic, setTopic] = useState("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const topicSelectId = useId();

  useEffect(() => {
    const initial = new URLSearchParams(window.location.search).get("topic");
    if (initial && topicOptions.some((option) => option.slug === initial)) setTopic(initial);
  }, [topicOptions]);

  const changeTopic = (nextTopic: string) => {
    setTopic(nextTopic);
    const url = new URL(window.location.href);
    if (nextTopic === "all") url.searchParams.delete("topic");
    else url.searchParams.set("topic", nextTopic);
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
  };

  const list = useMemo(() => {
    let l = filter === "active" ? servers.filter((s) => s.lifecycle === "active") : [...servers];
    if (topic !== "all") {
      l = l.filter((server) => taxonomyForServer(server).topics.includes(topic));
    }
    l.sort((a, b) => {
      const rank = (s: MCPServer) => (s.lifecycle === "dead" || s.lifecycle === "unverifiable" ? 1 : 0);
      if (rank(a) !== rank(b)) return rank(a) - rank(b);
      if (sort === "score") return b.trustScore - a.trustScore;
      if (sort === "stars") return b.signals.stars - a.signals.stars;
      return (a.signals.lastCommitDaysAgo ?? 9999) - (b.signals.lastCommitDaysAgo ?? 9999);
    });
    return l;
  }, [servers, sort, filter, topic]);
  const visibleList = list.slice(0, visibleCount);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [sort, filter, topic]);

  return (
    <div>
      {/* 独家数据锚 */}
      <p className="mb-5 rounded-lg border border-brand-200 bg-brand-50 px-4 py-2.5 text-sm text-brand-900 dark:border-brand-900 dark:bg-brand-950/50 dark:text-brand-100">
        {anchor}
      </p>

      {/* 子筛选 */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <div className="flex rounded-lg border border-neutral-200 p-0.5 dark:border-neutral-700">
          {(
            [
              ["all", labels.all],
              ["active", labels.activeOnly],
            ] as [Filter, string][]
          ).map(([v, label]) => (
            <button
              key={v}
              onClick={() => setFilter(v)}
              className={`min-h-11 rounded-md px-3 py-2 text-sm ${
                filter === v
                  ? "bg-brand-600 text-white"
                  : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {topicOptions.length > 0 && (
          <div className="flex min-h-11 items-center gap-2">
            <label htmlFor={topicSelectId} className="text-sm text-neutral-500 dark:text-neutral-400">
              {labels.topicFilter ?? (locale === "zh" ? "主题：" : "Topic:")}
            </label>
            <select
              id={topicSelectId}
              value={topic}
              onChange={(event) => changeTopic(event.target.value)}
              className="min-h-11 rounded-lg border border-neutral-200 bg-white px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:ring-brand-900"
            >
              <option value="all">{labels.allTopics ?? (locale === "zh" ? "全部主题" : "All topics")}</option>
              {topicOptions.map((option) => (
                <option key={option.slug} value={option.slug}>
                  {option.label} · {option.count}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400">
          {labels.sortBy}
          {(
            [
              ["score", labels.sortScore],
              ["stars", labels.sortStars],
              ["updated", labels.sortUpdated],
            ] as [Sort, string][]
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
      </div>

      {topicOptions.length > 0 && labels.taxonomyNote && (
        <p className="-mt-2 mb-5 text-xs text-neutral-500 dark:text-neutral-400">
          {labels.taxonomyNote}
        </p>
      )}

      <p className="mb-4 text-sm text-neutral-500 dark:text-neutral-400" aria-live="polite">
        {(labels.showing ?? (locale === "zh" ? "显示 {shown}/{total} 个" : "Showing {shown} of {total}"))
          .replace("{shown}", String(visibleList.length))
          .replace("{total}", String(list.length))}
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {visibleList.map((s) => (
          <ServerCard key={s.slug} server={s} locale={locale} />
        ))}
      </div>

      {visibleCount < list.length && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
            className="min-h-11 rounded-lg border border-neutral-300 px-5 py-2 text-sm font-medium text-neutral-700 hover:border-brand-400 hover:text-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-300 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-brand-700 dark:hover:text-brand-300"
          >
            {labels.loadMore ?? (locale === "zh" ? "加载更多" : "Load more")}
          </button>
        </div>
      )}

      {list.length === 0 && (
        <p className="py-12 text-center text-sm text-neutral-400">{labels.emptyList}</p>
      )}
    </div>
  );
}
