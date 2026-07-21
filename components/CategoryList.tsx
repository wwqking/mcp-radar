"use client";

import { useMemo, useState } from "react";
import type { MCPServer } from "@/lib/types";
import ServerCard from "./ServerCard";

type Sort = "score" | "updated" | "stars";
type Filter = "all" | "active";

interface Props {
  servers: MCPServer[];
}

/** 分类页：lifecycle 筛选 + 排序 */
export default function CategoryList({ servers }: Props) {
  const [sort, setSort] = useState<Sort>("score");
  const [filter, setFilter] = useState<Filter>("all");

  const list = useMemo(() => {
    let l = filter === "active" ? servers.filter((s) => s.lifecycle === "active") : [...servers];
    // 弃坑/无法审计的沉底（已折叠到底部的语义）
    l.sort((a, b) => {
      const rank = (s: MCPServer) => (s.lifecycle === "dead" || s.lifecycle === "unverifiable" ? 1 : 0);
      if (rank(a) !== rank(b)) return rank(a) - rank(b);
      if (sort === "score") return b.trustScore - a.trustScore;
      if (sort === "stars") return b.signals.stars - a.signals.stars;
      return (a.signals.lastCommitDaysAgo ?? 9999) - (b.signals.lastCommitDaysAgo ?? 9999);
    });
    return l;
  }, [servers, sort, filter]);

  const staleCount = servers.filter((s) => s.lifecycle === "dying" || s.lifecycle === "dead").length;

  return (
    <div>
      {/* 独家数据锚 */}
      <p className="mb-5 rounded-lg border border-brand-200 bg-brand-50 px-4 py-2.5 text-sm text-brand-900 dark:border-brand-900 dark:bg-brand-950/50 dark:text-brand-100">
        本类共 {servers.length} 个 server
        {staleCount > 0 && (
          <>
            ，其中 <strong>{staleCount}</strong> 个已半年无更新或弃坑（已折叠到底部）
          </>
        )}
        。
      </p>

      {/* 子筛选 */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <div className="flex rounded-lg border border-neutral-200 p-0.5 dark:border-neutral-700">
          {(
            [
              ["all", "全部"],
              ["active", "只看活跃"],
            ] as [Filter, string][]
          ).map(([v, label]) => (
            <button
              key={v}
              onClick={() => setFilter(v)}
              className={`rounded-md px-3 py-1 text-sm ${
                filter === v
                  ? "bg-brand-600 text-white"
                  : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400">
          排序：
          {(
            [
              ["score", "TrustScore"],
              ["stars", "Stars"],
              ["updated", "最近更新"],
            ] as [Sort, string][]
          ).map(([v, label]) => (
            <button
              key={v}
              onClick={() => setSort(v)}
              className={`rounded-md px-2 py-1 ${
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

      <div className="grid gap-4 sm:grid-cols-2">
        {list.map((s) => (
          <ServerCard key={s.slug} server={s} />
        ))}
      </div>

      {list.length === 0 && (
        <p className="py-12 text-center text-sm text-neutral-400">该筛选条件下暂无 server。</p>
      )}
    </div>
  );
}
