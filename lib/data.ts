// 数据入口（服务端专用）—— 按环境变量选择数据源，页面从这里 import 查询函数。
//
// ⚠️ 本文件透传 provider（含服务端采集器，用到 node:fs 等），只能被服务端组件 import。
//    客户端组件（"use client"）请从 lib/constants.ts 取 CATEGORIES / LIFECYCLE_META / formatNumber。
//
// 切换数据源：NEXT_PUBLIC_DATA_SOURCE=live 用本项目采集器拉真实数据（默认 mock）。
// 所有查询函数返回 Promise，页面/组件用 await 调用。

import type { Category, MCPServer } from "./types";
import type { SiteStats, LeaderboardOptions, RadarBuckets, MCPDataProvider } from "./provider";
import { mockProvider } from "./mock-provider";
import { liveProvider } from "./live-provider";

// ---------- 选择数据源 ----------
// mock：写死演示数据（默认）
// live：本项目采集器构建期拉真实数据（registry + GitHub + npm）
const SOURCE = process.env.NEXT_PUBLIC_DATA_SOURCE ?? "mock";
const provider: MCPDataProvider = SOURCE === "live" ? liveProvider : mockProvider;

// ---------- 查询函数（薄转发，保持页面调用点稳定） ----------

export function getAllServers(): Promise<MCPServer[]> {
  return provider.getAllServers();
}
export function getServerBySlug(slug: string): Promise<MCPServer | undefined> {
  return provider.getServerBySlug(slug);
}
export function getServersByCategory(catSlug: string): Promise<MCPServer[]> {
  return provider.getServersByCategory(catSlug);
}
export function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  return provider.getCategoryBySlug(slug);
}
export function getCategories(): Promise<Category[]> {
  return provider.getCategories();
}
export function getTopServers(n = 8): Promise<MCPServer[]> {
  return provider.getTopServers(n);
}
export function getLeaderboard(options?: LeaderboardOptions): Promise<MCPServer[]> {
  return provider.getLeaderboard(options);
}
export function getGraveyard(): Promise<MCPServer[]> {
  return provider.getGraveyard();
}
export function getSimilarServers(server: MCPServer, n = 4): Promise<MCPServer[]> {
  return provider.getSimilarServers(server, n);
}
export function getRadarEntries(): Promise<RadarBuckets> {
  return provider.getRadarEntries();
}
export function getSiteStats(): Promise<SiteStats> {
  return provider.getSiteStats();
}
export function getLastUpdated(): Promise<string> {
  return provider.getLastUpdated();
}

// ---------- 透传客户端安全常量（服务端组件可继续从 data.ts 取，省得改 import） ----------
export { CATEGORIES, formatNumber, formatDate, LIFECYCLE_META } from "./constants";

export type { SiteStats, LeaderboardOptions, RadarBuckets } from "./provider";
