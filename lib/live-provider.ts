// 实时数据源 —— 用本项目内的采集器（lib/collector）在构建期拉真实数据，
// 派生出分类/榜单/墓地/雷达/统计等全部视图。实现 MCPDataProvider 契约。
//
// 启用：NEXT_PUBLIC_DATA_SOURCE=live
// 数据量由 MCP_COLLECT_LIMIT 控制（默认 40，"先采少量"）。
// 只在服务端（SSG 构建期 / ISR）运行。

import type { Category, MCPServer, RadarEntry } from "./types";
import type {
  MCPDataProvider,
  SiteStats,
  LeaderboardOptions,
  RadarBuckets,
} from "./provider";
import { CATEGORIES, formatNumber } from "./mock-provider";
import { collectServers } from "./collector/build-data";

// 构建进程内只采一次，全部页面共享（否则每个页面每个查询都重新采集）
let _cache: Promise<MCPServer[]> | null = null;
function servers(): Promise<MCPServer[]> {
  if (!_cache) _cache = collectServers();
  return _cache;
}

function graveyardOf(list: MCPServer[]): MCPServer[] {
  return list
    .filter((s) => s.lifecycle === "dead" || s.lifecycle === "dying")
    .sort((a, b) => (a.deadAt ?? "").localeCompare(b.deadAt ?? "") * -1);
}

export const liveProvider: MCPDataProvider = {
  async getCategories(): Promise<Category[]> {
    return CATEGORIES;
  },
  async getCategoryBySlug(slug) {
    return CATEGORIES.find((c) => c.slug === slug);
  },
  async getAllServers() {
    return servers();
  },
  async getServerBySlug(slug) {
    return (await servers()).find((s) => s.slug === slug);
  },
  async getServersByCategory(catSlug) {
    return (await servers()).filter((s) => s.categories.includes(catSlug));
  },
  async getTopServers(n = 8) {
    return [...(await servers())]
      .filter((s) => s.lifecycle !== "dead")
      .sort((a, b) => b.trustScore - a.trustScore)
      .slice(0, n);
  },
  async getSimilarServers(server, n = 4) {
    return (await servers())
      .filter((s) => s.slug !== server.slug && s.categories.some((c) => server.categories.includes(c)))
      .sort((a, b) => b.trustScore - a.trustScore)
      .slice(0, n);
  },
  async getLeaderboard(options?: LeaderboardOptions) {
    let list = [...(await servers())];
    if (options?.category) list = list.filter((s) => s.categories.includes(options.category!));
    if (options?.lifecycle) list = list.filter((s) => s.lifecycle === options.lifecycle);
    if (options?.minScore) list = list.filter((s) => s.trustScore >= options.minScore!);
    return list.sort((a, b) => b.trustScore - a.trustScore);
  },
  async getGraveyard() {
    return graveyardOf(await servers());
  },
  async getRadarEntries(): Promise<RadarBuckets> {
    const list = await servers();

    // 爆火：有历史快照时按周 stars 增量排；无历史（delta 全 0）退化为按 stars 排
    const hasDelta = list.some((s) => s.signals.starsWeeklyDelta > 0);
    const trending: RadarEntry[] = [...list]
      .filter((s) => s.lifecycle === "active")
      .sort((a, b) =>
        hasDelta
          ? b.signals.starsWeeklyDelta - a.signals.starsWeeklyDelta
          : b.signals.stars - a.signals.stars,
      )
      .slice(0, 5)
      .map((s) => ({
        server: s,
        kind: "trending" as const,
        evidence: hasDelta
          ? `+${formatNumber(s.signals.starsWeeklyDelta)} ⭐ / 周${s.signals.npmWeeklyDownloads ? `，周下载 ${formatNumber(s.signals.npmWeeklyDownloads)}` : ""}`
          : `${formatNumber(s.signals.stars)} ⭐${s.signals.npmWeeklyDownloads ? `，周下载 ${formatNumber(s.signals.npmWeeklyDownloads)}` : ""}`,
      }));

    // 新增：按 addedAt 最近的
    const added: RadarEntry[] = [...list]
      .sort((a, b) => (b.addedAt ?? "").localeCompare(a.addedAt ?? ""))
      .slice(0, 5)
      .map((s) => ({
        server: s,
        kind: "new" as const,
        evidence: `${s.addedAt} 首次收录，${formatNumber(s.signals.stars)} ⭐`,
      }));

    const dead: RadarEntry[] = graveyardOf(list)
      .slice(0, 4)
      .map((s) => ({
        server: s,
        kind: "dead" as const,
        evidence: s.deathReason ?? "健康度持续恶化",
      }));

    return { trending, added, dead };
  },
  async getSiteStats(): Promise<SiteStats> {
    const list = await servers();
    return {
      total: list.length,
      active: list.filter((s) => s.lifecycle === "active").length,
      dying: list.filter((s) => s.lifecycle === "dying").length,
      dead: list.filter((s) => s.lifecycle === "dead").length,
      unverifiable: list.filter((s) => s.lifecycle === "unverifiable").length,
    };
  },
  async getLastUpdated() {
    return new Date().toISOString().slice(0, 10);
  },
};
