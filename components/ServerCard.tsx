import Link from "next/link";
import type { MCPServer } from "@/lib/types";
import { formatNumber } from "@/lib/constants";
import TrustScore from "./TrustScore";
import LifecycleBadge from "./LifecycleBadge";
import Sparkline from "./Sparkline";

interface Props {
  server: MCPServer;
  showTrend?: boolean;
  evidence?: string; // 雷达页的可解释依据
  rank?: number; // 榜单页排名
}

/** 榜单/雷达/搜索结果统一卡片 */
export default function ServerCard({ server, showTrend = false, evidence, rank }: Props) {
  const s = server.signals;
  return (
    <Link
      href={`/server/${server.slug}`}
      className="card group flex flex-col gap-3 p-4 sm:p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {rank !== undefined && (
              <span className="w-7 shrink-0 text-center font-mono text-sm font-bold text-neutral-400">
                {rank}
              </span>
            )}
            <h3 className="mono truncate text-sm font-semibold text-brand-700 group-hover:underline dark:text-brand-300">
              {server.name}
            </h3>
          </div>
          <p className="mt-1 line-clamp-2 text-sm text-neutral-600 dark:text-neutral-400">
            {server.tagline}
          </p>
        </div>
        <TrustScore value={server.trustScore} size="md" />
      </div>

      {evidence && (
        <p className="rounded-md bg-brand-50 px-2.5 py-1.5 text-xs text-brand-800 dark:bg-brand-950 dark:text-brand-200">
          {evidence}
        </p>
      )}

      <div className="mt-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
          <LifecycleBadge status={server.lifecycle} size="sm" />
          {s.stars > 0 && <span title="GitHub stars">⭐ {formatNumber(s.stars)}</span>}
          {s.lastCommitDaysAgo !== null && (
            <span title="最近提交">
              {s.lastCommitDaysAgo === 0 ? "今天更新" : `${s.lastCommitDaysAgo} 天前更新`}
            </span>
          )}
        </div>
        {showTrend && server.starsTrend.length > 1 && (
          <Sparkline data={server.starsTrend} width={80} height={24} />
        )}
      </div>
    </Link>
  );
}
