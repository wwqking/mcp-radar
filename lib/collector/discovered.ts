// 自动发现的 server 种子 —— 由 `npm run discover` 生成，经人工审 PR 后合并。
//
// ⚠️ 这个文件由 discover 追加维护；旧种子不会被下一期候选覆盖。
// 手工挑的 server 请加到 curated.ts —— 两份分开是刻意的：
//   - curated.ts  手工维护，采集时**无条件保留**（优质保底）
//   - discovered.ts 机器发现，采集时仍要过 passesQualityGate（机器没人看过，不给豁免）
// 分开还有一个作用：自动开的 PR 永远只碰这个文件，改坏了也污染不到手工白名单。
//
// 上次生成：2026-07-26

import type { CuratedSeed } from "./curated";

export const DISCOVERED_SEEDS: CuratedSeed[] = [
  { name: "mcp-solver", repoUrl: "https://github.com/szeider/mcp-solver", npmPackage: null }, // ★176 · 1600/mo 有人搜
  { name: "codebase-memory-mcp", repoUrl: "https://github.com/DeusData/codebase-memory-mcp", npmPackage: "codebase-memory-mcp" }, // ★35349 · GitHub 趋势
  { name: "DesktopCommanderMCP", repoUrl: "https://github.com/wonderwhy-er/DesktopCommanderMCP", npmPackage: null }, // ★8843 · GitHub 趋势
  { name: "git-mcp", repoUrl: "https://github.com/idosal/git-mcp", npmPackage: null }, // ★8285 · GitHub 趋势
  { name: "firecrawl-mcp-server", repoUrl: "https://github.com/firecrawl/firecrawl-mcp-server", npmPackage: null }, // ★7043 · GitHub 趋势
  { name: "mobile-mcp", repoUrl: "https://github.com/mobile-next/mobile-mcp", npmPackage: null }, // ★5636 · GitHub 趋势
  { name: "mcp-obsidian", repoUrl: "https://github.com/MarkusPfundstein/mcp-obsidian", npmPackage: null }, // ★4135 · GitHub 趋势
  { name: "excel-mcp-server", repoUrl: "https://github.com/haris-musa/excel-mcp-server", npmPackage: null }, // ★4058 · GitHub 趋势
  { name: "ros-mcp-server", repoUrl: "https://github.com/robotmcp/ros-mcp-server", npmPackage: null }, // ★1360 · GitHub 趋势
  { name: "mysql_mcp_server", repoUrl: "https://github.com/designcomputer/mysql_mcp_server", npmPackage: null }, // ★1342 · GitHub 趋势
  { name: "telegram-mcp", repoUrl: "https://github.com/chigwell/telegram-mcp", npmPackage: null }, // ★1332 · GitHub 趋势
  { name: "wenyan-mcp", repoUrl: "https://github.com/caol64/wenyan-mcp", npmPackage: null }, // ★1281 · GitHub 趋势
  { name: "matlab-mcp-server", repoUrl: "https://github.com/matlab/matlab-mcp-server", npmPackage: null }, // ★1255 · GitHub 趋势
  { name: "cocos-mcp-server", repoUrl: "https://github.com/DaxianLee/cocos-mcp-server", npmPackage: null }, // ★1252 · GitHub 趋势
  { name: "mcp-cli", repoUrl: "https://github.com/philschmid/mcp-cli", npmPackage: null }, // ★1235 · GitHub 趋势
  { name: "jupyter-mcp-server", repoUrl: "https://github.com/datalayer/jupyter-mcp-server", npmPackage: null }, // ★1227 · GitHub 趋势
  { name: "MCPJungle", repoUrl: "https://github.com/mcpjungle/MCPJungle", npmPackage: null }, // ★1173 · GitHub 趋势
  { name: "12306-mcp", repoUrl: "https://github.com/Joooook/12306-mcp", npmPackage: null }, // ★1118 · GitHub 趋势
  { name: "cve-mcp-server", repoUrl: "https://github.com/mukul975/cve-mcp-server", npmPackage: null }, // ★1095 · GitHub 趋势
  { name: "yargi-mcp", repoUrl: "https://github.com/saidsurucu/yargi-mcp", npmPackage: null }, // ★1080 · GitHub 趋势
  { name: "google-meta-ads-ga4-mcp", repoUrl: "https://github.com/irinabuht12-oss/google-meta-ads-ga4-mcp", npmPackage: null }, // ★1043 · GitHub 趋势
  { name: "mcp-server", repoUrl: "https://github.com/PortSwigger/mcp-server", npmPackage: null }, // ★1012 · GitHub 趋势
  { name: "powerbi-modeling-mcp", repoUrl: "https://github.com/microsoft/powerbi-modeling-mcp", npmPackage: "@microsoft/powerbi-modeling-mcp" }, // ★997 · GitHub 趋势
  { name: "mcp-scanner", repoUrl: "https://github.com/cisco-ai-defense/mcp-scanner", npmPackage: null }, // ★990 · GitHub 趋势
  { name: "code-index-mcp", repoUrl: "https://github.com/johnhuang316/code-index-mcp", npmPackage: null }, // ★986 · GitHub 趋势
];
