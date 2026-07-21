// 数据源契约（Data Provider Contract）
//
// 前端只依赖这个接口，不关心数据从哪来。
// - 默认实现：mock-provider.ts（写死的演示数据）
// - 未来实现：api-provider.ts（fetch word-filter 引擎 mcp_directory 赛道 API）
//
// 切换由 lib/data.ts 按环境变量 NEXT_PUBLIC_DATA_SOURCE 决定，页面组件零改动。

import type { Category, MCPServer, RadarEntry, Lifecycle } from "./types";

/** 全站统计数字（首页数字带、墓地页统计等） */
export interface SiteStats {
  total: number;
  active: number;
  dying: number;
  dead: number;
  unverifiable: number;
}

/** 榜单筛选参数 */
export interface LeaderboardOptions {
  category?: string;
  lifecycle?: Lifecycle;
  minScore?: number;
}

/** 雷达页三个分区 */
export interface RadarBuckets {
  trending: RadarEntry[];
  added: RadarEntry[];
  dead: RadarEntry[];
}

/**
 * 数据源契约。任何数据来源（mock / 引擎 API）都实现这套方法。
 *
 * 说明：全部返回 Promise —— 即使 mock 是同步的也包一层 Promise，
 * 这样 api-provider 走真实网络时接口签名不用变，页面里统一 await。
 */
export interface MCPDataProvider {
  // ---- 分类 ----
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;

  // ---- server ----
  getAllServers(): Promise<MCPServer[]>;
  getServerBySlug(slug: string): Promise<MCPServer | undefined>;
  getServersByCategory(catSlug: string): Promise<MCPServer[]>;
  getTopServers(n?: number): Promise<MCPServer[]>;
  getSimilarServers(server: MCPServer, n?: number): Promise<MCPServer[]>;

  // ---- 榜单 / 墓地 / 雷达 ----
  getLeaderboard(options?: LeaderboardOptions): Promise<MCPServer[]>;
  getGraveyard(): Promise<MCPServer[]>;
  getRadarEntries(): Promise<RadarBuckets>;

  // ---- 统计 ----
  getSiteStats(): Promise<SiteStats>;

  /** 数据最后更新时间（ISO 日期），用于页脚/来源标注 */
  getLastUpdated(): Promise<string>;
}
