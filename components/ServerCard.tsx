import Link from "next/link";
import type { MCPServer } from "@/lib/types";
import { formatNumber } from "@/lib/constants";
import TrustScore from "./TrustScore";
import LifecycleBadge from "./LifecycleBadge";
import Sparkline from "./Sparkline";
import type { Locale } from "@/lib/i18n/locales";
import { localizedHref } from "@/lib/i18n/href";
import { TAXONOMY_TOPICS, taxonomyForServer, topicName } from "@/lib/taxonomy";

interface Props {
  server: MCPServer;
  locale: Locale;
  showTrend?: boolean;
  evidence?: string; // 雷达页的可解释依据
  rank?: number; // 榜单页排名
  showRemoteEvidence?: boolean;
}

/** 榜单/雷达/搜索结果统一卡片 */
export default function ServerCard({ server, locale, showTrend = false, evidence, rank, showRemoteEvidence = false }: Props) {
  const s = server.signals;
  const taxonomy = taxonomyForServer(server);
  const topics = TAXONOMY_TOPICS.filter((topic) => taxonomy.topics.includes(topic.slug)).slice(0, 2);
  const updated =
    s.lastCommitDaysAgo === null
      ? null
      : s.lastCommitDaysAgo === 0
        ? locale === "en" ? "updated today" : "今天更新"
        : locale === "en" ? `updated ${s.lastCommitDaysAgo}d ago` : `${s.lastCommitDaysAgo} 天前更新`;
  const remoteTransports = Array.from(new Set((server.remoteEndpoints ?? []).map((endpoint) => endpoint.type)));
  const remoteHosts = Array.from(new Set((server.remoteEndpoints ?? []).map((endpoint) => {
    try { return new URL(endpoint.url).host; } catch { return endpoint.url; }
  })));
  return (
    <Link
      href={localizedHref(locale, `/server/${server.slug}`)}
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

      {topics.length > 0 && (
        <div className="flex flex-wrap gap-1.5" aria-label={locale === "zh" ? "主题" : "Topics"}>
          {topics.map((topic) => (
            <span
              key={topic.slug}
              className="rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
            >
              {topicName(topic, locale)}
            </span>
          ))}
        </div>
      )}

      {showRemoteEvidence && server.remoteEndpoints?.length ? (
        <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-xs text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-400">
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            <span><strong className="text-neutral-800 dark:text-neutral-200">{locale === "zh" ? "传输" : "Transport"}:</strong> {remoteTransports.join(" + ")}</span>
            <span><strong className="text-neutral-800 dark:text-neutral-200">{locale === "zh" ? "认证" : "Auth"}:</strong> {server.readmeFacts?.needsApiKey ? (locale === "zh" ? "README 提及密钥" : "key indicated") : (locale === "zh" ? "未核实" : "not verified")}</span>
            <span><strong className="text-neutral-800 dark:text-neutral-200">{locale === "zh" ? "来源" : "Source"}:</strong> {s.inOfficialRegistry ? (locale === "zh" ? "官方 registry" : "official registry") : (locale === "zh" ? "社区元数据" : "community metadata")}</span>
          </div>
          <p className="mt-1 truncate" title={remoteHosts.join(", ")}>{remoteHosts.join(", ")} · {locale === "zh" ? "声明于" : "declared, checked"} {s.dataUpdatedAt}</p>
          <p className="mt-1 text-neutral-400">{locale === "zh" ? "端点声明不等于握手或安全验证。" : "Endpoint declaration is not a handshake or security verification."}</p>
        </div>
      ) : null}

      <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500 dark:text-neutral-400">
          <LifecycleBadge status={server.lifecycle} locale={locale} size="sm" />
          {s.stars > 0 && <span title="GitHub stars">⭐ {formatNumber(s.stars)}</span>}
          {updated && <span>{updated}</span>}
        </div>
        {showTrend && server.starsTrend.length > 1 && (
          <Sparkline data={server.starsTrend} width={80} height={24} />
        )}
      </div>
    </Link>
  );
}
