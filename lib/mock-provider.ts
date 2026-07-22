// Mock 数据源 —— 实现 MCPDataProvider 契约。
// 数据基于真实知名 MCP server 的公开信息（2025-2026 年量级），用于演示 / 引擎接好前的回落。
// 引擎 mcp_directory API 上线后，把 NEXT_PUBLIC_DATA_SOURCE 切到 "api" 即可弃用本文件。

import type { MCPServer, RadarEntry } from "./types";
import type {
  MCPDataProvider,
  SiteStats,
  LeaderboardOptions,
  RadarBuckets,
} from "./provider";
import { CATEGORIES, formatNumber, formatDate } from "./constants";

// ---------- 工具函数（生成趋势数组） ----------
function trend(base: number, growth: number, noise = 0.15): number[] {
  const arr: number[] = [];
  let v = base;
  for (let i = 0; i < 12; i++) {
    v = v * (1 + growth) * (1 + (Math.sin(i * 2.7) * noise) / 2);
    arr.push(Math.round(v));
  }
  return arr;
}

function isoDaysAgo(days: number): string {
  const d = new Date("2026-07-21T09:00:00+08:00");
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

// ---------- Server 数据 ----------

const servers: MCPServer[] = [
  // ===== 数据库类 =====
  {
    slug: "postgres-mcp",
    name: "@modelcontextprotocol/server-postgres",
    tagline: "PostgreSQL 官方参考实现，只读查询 + schema 探查",
    description: "官方维护的 PostgreSQL MCP server，提供只读 SQL 查询和数据库 schema 检查能力，适合让 AI 安全地分析你的数据库结构。",
    categories: ["database"],
    lifecycle: "active",
    trustScore: 88,
    breakdown: { maintenance: 90, adoption: 85, usability: 92, health: 84, community: 80 },
    signals: {
      lastCommitDaysAgo: 3, commits90d: 87, issueResponseDays: 2, archived: false,
      stars: 7400, starsWeeklyDelta: 62, npmWeeklyDownloads: 41200, releaseFrequencyPerMonth: 2.1,
      openIssues: 34, openPRs: 12, license: "MIT", contributors: 58, forks: 620,
      inOfficialRegistry: true, hasRunnableEntry: true, dataUpdatedAt: isoDaysAgo(0),
    },
    repoUrl: "https://github.com/modelcontextprotocol/servers",
    npmPackage: "@modelcontextprotocol/server-postgres",
    registryUrl: "https://registry.modelcontextprotocol.io",
    verdict: "✅ 官方维护，活跃迭代，生产可用",
    addedAt: "2025-03-12",
    starsTrend: trend(5200, 0.028),
    downloadsTrend: trend(26000, 0.035),
  },
  {
    slug: "sqlite-mcp",
    name: "mcp-server-sqlite-npx",
    tagline: "零配置 SQLite 查询，npx 直接跑",
    description: "社区实现的 SQLite MCP server，支持读写查询与表结构管理，无需安装，npx 一键启动，适合本地数据分析场景。",
    categories: ["database"],
    lifecycle: "dying",
    trustScore: 54,
    breakdown: { maintenance: 28, adoption: 62, usability: 70, health: 55, community: 48 },
    signals: {
      lastCommitDaysAgo: 214, commits90d: 0, issueResponseDays: null, archived: false,
      stars: 890, starsWeeklyDelta: 3, npmWeeklyDownloads: 5400, releaseFrequencyPerMonth: 0,
      openIssues: 21, openPRs: 8, license: "MIT", contributors: 6, forks: 74,
      inOfficialRegistry: true, hasRunnableEntry: true, dataUpdatedAt: isoDaysAgo(0),
    },
    repoUrl: "https://github.com/example/sqlite-mcp",
    npmPackage: "mcp-server-sqlite-npx",
    registryUrl: "https://registry.modelcontextprotocol.io",
    verdict: "⚠️ 已 214 天未更新，issue 无人响应，谨慎用于生产",
    addedAt: "2025-04-02",
    deadAt: isoDaysAgo(34),
    deathReason: "最近提交 214 天前，近 90 天 0 提交，issue 无响应",
    starsTrend: trend(860, 0.002),
    downloadsTrend: trend(5800, -0.004),
  },
  {
    slug: "redis-mcp",
    name: "@redis/mcp-redis",
    tagline: "Redis 官方出品，键值读写 + 数据结构操作",
    description: "Redis 官方维护的 MCP server，支持字符串、哈希、列表、集合等数据结构的自然语言操作。",
    categories: ["database", "cloud"],
    lifecycle: "active",
    trustScore: 82,
    breakdown: { maintenance: 84, adoption: 74, usability: 90, health: 82, community: 70 },
    signals: {
      lastCommitDaysAgo: 6, commits90d: 45, issueResponseDays: 3, archived: false,
      stars: 2100, starsWeeklyDelta: 41, npmWeeklyDownloads: 12800, releaseFrequencyPerMonth: 1.5,
      openIssues: 11, openPRs: 4, license: "MIT", contributors: 19, forks: 140,
      inOfficialRegistry: true, hasRunnableEntry: true, dataUpdatedAt: isoDaysAgo(0),
    },
    repoUrl: "https://github.com/redis/mcp-redis",
    npmPackage: "@redis/mcp-redis",
    registryUrl: "https://registry.modelcontextprotocol.io",
    verdict: "✅ 官方维护，更新稳定",
    addedAt: "2025-05-18",
    starsTrend: trend(1400, 0.035),
    downloadsTrend: trend(8200, 0.04),
  },
  {
    slug: "mysql-mcp",
    name: "mysql-mcp-server",
    tagline: "MySQL / MariaDB 连接，带查询审计",
    description: "社区 MySQL MCP server，支持连接池、只读模式和查询审计日志。",
    categories: ["database"],
    lifecycle: "active",
    trustScore: 71,
    breakdown: { maintenance: 76, adoption: 66, usability: 74, health: 68, community: 62 },
    signals: {
      lastCommitDaysAgo: 12, commits90d: 31, issueResponseDays: 5, archived: false,
      stars: 1300, starsWeeklyDelta: 18, npmWeeklyDownloads: 8900, releaseFrequencyPerMonth: 1.2,
      openIssues: 9, openPRs: 3, license: "Apache-2.0", contributors: 14, forks: 96,
      inOfficialRegistry: true, hasRunnableEntry: true, dataUpdatedAt: isoDaysAgo(0),
    },
    repoUrl: "https://github.com/example/mysql-mcp",
    npmPackage: "mysql-mcp-server",
    registryUrl: "https://registry.modelcontextprotocol.io",
    verdict: "✅ 维护正常，社区规模中等",
    addedAt: "2025-06-08",
    starsTrend: trend(980, 0.022),
    downloadsTrend: trend(6400, 0.025),
  },
  {
    slug: "mongodb-mcp",
    name: "mongodb-mcp-server",
    tagline: "MongoDB 集合查询与聚合管道",
    description: "MongoDB 社区 MCP server，支持文档查询、聚合管道执行和集合管理。",
    categories: ["database"],
    lifecycle: "active",
    trustScore: 76,
    breakdown: { maintenance: 80, adoption: 78, usability: 76, health: 72, community: 66 },
    signals: {
      lastCommitDaysAgo: 8, commits90d: 38, issueResponseDays: 4, archived: false,
      stars: 2600, starsWeeklyDelta: 35, npmWeeklyDownloads: 15400, releaseFrequencyPerMonth: 1.8,
      openIssues: 17, openPRs: 6, license: "Apache-2.0", contributors: 23, forks: 210,
      inOfficialRegistry: true, hasRunnableEntry: true, dataUpdatedAt: isoDaysAgo(0),
    },
    repoUrl: "https://github.com/example/mongodb-mcp",
    npmPackage: "mongodb-mcp-server",
    registryUrl: "https://registry.modelcontextprotocol.io",
    verdict: "✅ 维护活跃，采用度高",
    addedAt: "2025-04-25",
    starsTrend: trend(1700, 0.03),
    downloadsTrend: trend(10200, 0.033),
  },
  {
    slug: "supabase-mcp",
    name: "@supabase/mcp-server-supabase",
    tagline: "Supabase 官方：项目管理 + SQL + 迁移",
    description: "Supabase 官方 MCP server，支持项目列表、SQL 执行、数据库迁移和 Edge Function 管理。",
    categories: ["database", "cloud"],
    lifecycle: "active",
    trustScore: 86,
    breakdown: { maintenance: 88, adoption: 84, usability: 90, health: 82, community: 78 },
    signals: {
      lastCommitDaysAgo: 2, commits90d: 96, issueResponseDays: 1, archived: false,
      stars: 4900, starsWeeklyDelta: 95, npmWeeklyDownloads: 28900, releaseFrequencyPerMonth: 3.2,
      openIssues: 28, openPRs: 9, license: "MIT", contributors: 41, forks: 320,
      inOfficialRegistry: true, hasRunnableEntry: true, dataUpdatedAt: isoDaysAgo(0),
    },
    repoUrl: "https://github.com/supabase-community/supabase-mcp",
    npmPackage: "@supabase/mcp-server-supabase",
    registryUrl: "https://registry.modelcontextprotocol.io",
    verdict: "✅ 官方高频迭代，强烈推荐",
    addedAt: "2025-03-30",
    starsTrend: trend(2600, 0.05),
    downloadsTrend: trend(14800, 0.055),
  },

  // ===== 浏览器/网页类 =====
  {
    slug: "playwright-mcp",
    name: "@playwright/mcp",
    tagline: "微软官方 Playwright 浏览器自动化",
    description: "Microsoft 官方 Playwright MCP server，用结构化快照驱动浏览器：导航、点击、填表、截图，无需视觉模型。",
    categories: ["browser", "dev"],
    lifecycle: "active",
    trustScore: 93,
    breakdown: { maintenance: 95, adoption: 92, usability: 94, health: 90, community: 88 },
    signals: {
      lastCommitDaysAgo: 1, commits90d: 210, issueResponseDays: 1, archived: false,
      stars: 18500, starsWeeklyDelta: 340, npmWeeklyDownloads: 96400, releaseFrequencyPerMonth: 4.5,
      openIssues: 62, openPRs: 18, license: "Apache-2.0", contributors: 87, forks: 1400,
      inOfficialRegistry: true, hasRunnableEntry: true, dataUpdatedAt: isoDaysAgo(0),
    },
    repoUrl: "https://github.com/microsoft/playwright-mcp",
    npmPackage: "@playwright/mcp",
    registryUrl: "https://registry.modelcontextprotocol.io",
    verdict: "✅ 微软官方重投入，浏览器自动化首选",
    addedAt: "2025-03-15",
    starsTrend: trend(8400, 0.065),
    downloadsTrend: trend(42000, 0.07),
  },
  {
    slug: "puppeteer-mcp",
    name: "@modelcontextprotocol/server-puppeteer",
    tagline: "官方参考实现 Puppeteer 版",
    description: "官方维护的 Puppeteer MCP server，提供浏览器导航、截图、JS 执行能力。",
    categories: ["browser"],
    lifecycle: "active",
    trustScore: 84,
    breakdown: { maintenance: 82, adoption: 86, usability: 88, health: 82, community: 80 },
    signals: {
      lastCommitDaysAgo: 5, commits90d: 74, issueResponseDays: 2, archived: false,
      stars: 9200, starsWeeklyDelta: 78, npmWeeklyDownloads: 58700, releaseFrequencyPerMonth: 2.4,
      openIssues: 41, openPRs: 14, license: "MIT", contributors: 64, forks: 780,
      inOfficialRegistry: true, hasRunnableEntry: true, dataUpdatedAt: isoDaysAgo(0),
    },
    repoUrl: "https://github.com/modelcontextprotocol/servers",
    npmPackage: "@modelcontextprotocol/server-puppeteer",
    registryUrl: "https://registry.modelcontextprotocol.io",
    verdict: "✅ 官方维护，稳定可靠",
    addedAt: "2025-03-12",
    starsTrend: trend(6800, 0.025),
    downloadsTrend: trend(44000, 0.028),
  },
  {
    slug: "fetch-mcp",
    name: "@modelcontextprotocol/server-fetch",
    tagline: "官方网页抓取：HTML 转 Markdown",
    description: "官方 Fetch MCP server，抓取网页并转为 Markdown，支持自定义 UA、代理和内容截取。",
    categories: ["browser", "search"],
    lifecycle: "active",
    trustScore: 85,
    breakdown: { maintenance: 84, adoption: 88, usability: 86, health: 84, community: 78 },
    signals: {
      lastCommitDaysAgo: 4, commits90d: 68, issueResponseDays: 2, archived: false,
      stars: 11800, starsWeeklyDelta: 105, npmWeeklyDownloads: 88200, releaseFrequencyPerMonth: 2.2,
      openIssues: 38, openPRs: 11, license: "MIT", contributors: 72, forks: 940,
      inOfficialRegistry: true, hasRunnableEntry: true, dataUpdatedAt: isoDaysAgo(0),
    },
    repoUrl: "https://github.com/modelcontextprotocol/servers",
    npmPackage: "@modelcontextprotocol/server-fetch",
    registryUrl: "https://registry.modelcontextprotocol.io",
    verdict: "✅ 官方维护，抓取场景装机量最大",
    addedAt: "2025-03-12",
    starsTrend: trend(8600, 0.026),
    downloadsTrend: trend(64000, 0.03),
  },
  {
    slug: "firecrawl-mcp",
    name: "firecrawl-mcp-server",
    tagline: "Firecrawl 托管抓取：整站爬取 + 结构化提取",
    description: "Firecrawl 官方 MCP server，支持整站爬取、结构化数据提取和深度搜索，托管 API 需 key。",
    categories: ["browser", "search"],
    lifecycle: "active",
    trustScore: 79,
    breakdown: { maintenance: 82, adoption: 80, usability: 72, health: 78, community: 74 },
    signals: {
      lastCommitDaysAgo: 7, commits90d: 52, issueResponseDays: 3, archived: false,
      stars: 4600, starsWeeklyDelta: 88, npmWeeklyDownloads: 21600, releaseFrequencyPerMonth: 2.8,
      openIssues: 24, openPRs: 7, license: "MIT", contributors: 31, forks: 380,
      inOfficialRegistry: true, hasRunnableEntry: true, dataUpdatedAt: isoDaysAgo(0),
    },
    repoUrl: "https://github.com/mendableai/firecrawl-mcp-server",
    npmPackage: "firecrawl-mcp-server",
    registryUrl: "https://registry.modelcontextprotocol.io",
    verdict: "✅ 商业公司官方维护，功能强但依赖托管服务",
    addedAt: "2025-04-10",
    starsTrend: trend(2600, 0.045),
    downloadsTrend: trend(12400, 0.048),
  },

  // ===== 文件/文档类 =====
  {
    slug: "filesystem-mcp",
    name: "@modelcontextprotocol/server-filesystem",
    tagline: "官方文件系统读写：白名单目录控制",
    description: "官方 Filesystem MCP server，读写指定目录下的文件，支持目录白名单、文件搜索、元信息查询。",
    categories: ["files"],
    lifecycle: "active",
    trustScore: 87,
    breakdown: { maintenance: 86, adoption: 90, usability: 90, health: 84, community: 82 },
    signals: {
      lastCommitDaysAgo: 3, commits90d: 92, issueResponseDays: 2, archived: false,
      stars: 13600, starsWeeklyDelta: 96, npmWeeklyDownloads: 124000, releaseFrequencyPerMonth: 2.6,
      openIssues: 45, openPRs: 15, license: "MIT", contributors: 78, forks: 1150,
      inOfficialRegistry: true, hasRunnableEntry: true, dataUpdatedAt: isoDaysAgo(0),
    },
    repoUrl: "https://github.com/modelcontextprotocol/servers",
    npmPackage: "@modelcontextprotocol/server-filesystem",
    registryUrl: "https://registry.modelcontextprotocol.io",
    verdict: "✅ 官方维护，几乎是所有客户端的默认装机项",
    addedAt: "2025-03-12",
    starsTrend: trend(10200, 0.024),
    downloadsTrend: trend(94000, 0.026),
  },
  {
    slug: "pdf-mcp",
    name: "pdf-reader-mcp",
    tagline: "PDF 解析：文本提取 + 表格识别",
    description: "社区 PDF MCP server，提取 PDF 文本、表格和元数据，支持加密文档。",
    categories: ["files"],
    lifecycle: "dying",
    trustScore: 47,
    breakdown: { maintenance: 22, adoption: 58, usability: 62, health: 44, community: 40 },
    signals: {
      lastCommitDaysAgo: 263, commits90d: 0, issueResponseDays: null, archived: false,
      stars: 640, starsWeeklyDelta: 2, npmWeeklyDownloads: 3100, releaseFrequencyPerMonth: 0,
      openIssues: 18, openPRs: 5, license: "MIT", contributors: 4, forks: 52,
      inOfficialRegistry: true, hasRunnableEntry: true, dataUpdatedAt: isoDaysAgo(0),
    },
    repoUrl: "https://github.com/example/pdf-mcp",
    npmPackage: "pdf-reader-mcp",
    registryUrl: "https://registry.modelcontextprotocol.io",
    verdict: "⚠️ 已 263 天未更新，表格识别有已知 bug 未修",
    addedAt: "2025-05-02",
    deadAt: isoDaysAgo(61),
    deathReason: "最近提交 263 天前，18 个 open issue 无响应",
    starsTrend: trend(620, 0.001),
    downloadsTrend: trend(3400, -0.008),
  },

  // ===== 搜索/知识类 =====
  {
    slug: "brave-search-mcp",
    name: "@brave/brave-search-mcp-server",
    tagline: "Brave 官方搜索 API",
    description: "Brave 官方 Search MCP server，网页搜索 + 本地商户搜索，免费额度每月 2000 次。",
    categories: ["search"],
    lifecycle: "active",
    trustScore: 81,
    breakdown: { maintenance: 80, adoption: 82, usability: 84, health: 80, community: 72 },
    signals: {
      lastCommitDaysAgo: 9, commits90d: 41, issueResponseDays: 4, archived: false,
      stars: 3400, starsWeeklyDelta: 29, npmWeeklyDownloads: 24700, releaseFrequencyPerMonth: 1.6,
      openIssues: 15, openPRs: 5, license: "MIT", contributors: 22, forks: 260,
      inOfficialRegistry: true, hasRunnableEntry: true, dataUpdatedAt: isoDaysAgo(0),
    },
    repoUrl: "https://github.com/brave/brave-search-mcp-server",
    npmPackage: "@brave/brave-search-mcp-server",
    registryUrl: "https://registry.modelcontextprotocol.io",
    verdict: "✅ 官方维护，免费额度友好",
    addedAt: "2025-04-18",
    starsTrend: trend(2400, 0.028),
    downloadsTrend: trend(18200, 0.03),
  },
  {
    slug: "exa-mcp",
    name: "exa-mcp-server",
    tagline: "Exa AI 语义搜索：为 LLM 优化的检索",
    description: "Exa 官方 MCP server，AI 原生语义搜索，支持相似链接推荐和内容抓取。",
    categories: ["search", "ai"],
    lifecycle: "active",
    trustScore: 83,
    breakdown: { maintenance: 85, adoption: 82, usability: 86, health: 80, community: 76 },
    signals: {
      lastCommitDaysAgo: 5, commits90d: 58, issueResponseDays: 2, archived: false,
      stars: 3900, starsWeeklyDelta: 54, npmWeeklyDownloads: 26800, releaseFrequencyPerMonth: 2.4,
      openIssues: 12, openPRs: 6, license: "MIT", contributors: 18, forks: 290,
      inOfficialRegistry: true, hasRunnableEntry: true, dataUpdatedAt: isoDaysAgo(0),
    },
    repoUrl: "https://github.com/exa-labs/exa-mcp-server",
    npmPackage: "exa-mcp-server",
    registryUrl: "https://registry.modelcontextprotocol.io",
    verdict: "✅ 官方高频更新，AI 搜索场景体验好",
    addedAt: "2025-03-28",
    starsTrend: trend(2200, 0.042),
    downloadsTrend: trend(15600, 0.045),
  },
  {
    slug: "tavily-mcp",
    name: "tavily-mcp",
    tagline: "Tavily 搜索 + 内容提取",
    description: "Tavily 官方 MCP server，为 AI agent 设计的实时网页搜索与内容提取 API。",
    categories: ["search"],
    lifecycle: "active",
    trustScore: 78,
    breakdown: { maintenance: 80, adoption: 78, usability: 80, health: 76, community: 70 },
    signals: {
      lastCommitDaysAgo: 11, commits90d: 36, issueResponseDays: 4, archived: false,
      stars: 2800, starsWeeklyDelta: 31, npmWeeklyDownloads: 19400, releaseFrequencyPerMonth: 1.9,
      openIssues: 14, openPRs: 4, license: "MIT", contributors: 16, forks: 220,
      inOfficialRegistry: true, hasRunnableEntry: true, dataUpdatedAt: isoDaysAgo(0),
    },
    repoUrl: "https://github.com/tavily-ai/tavily-mcp",
    npmPackage: "tavily-mcp",
    registryUrl: "https://registry.modelcontextprotocol.io",
    verdict: "✅ 官方维护，agent 场景口碑好",
    addedAt: "2025-04-22",
    starsTrend: trend(1900, 0.033),
    downloadsTrend: trend(14200, 0.036),
  },

  // ===== 开发/代码类 =====
  {
    slug: "github-mcp",
    name: "@github/github-mcp-server",
    tagline: "GitHub 官方：仓库、Issue、PR、Actions 全覆盖",
    description: "GitHub 官方 MCP server（Go 实现），覆盖仓库管理、Issue、PR、Actions、安全告警等完整 API。",
    categories: ["dev"],
    lifecycle: "active",
    trustScore: 94,
    breakdown: { maintenance: 96, adoption: 94, usability: 95, health: 92, community: 90 },
    signals: {
      lastCommitDaysAgo: 1, commits90d: 280, issueResponseDays: 1, archived: false,
      stars: 21200, starsWeeklyDelta: 385, npmWeeklyDownloads: null, releaseFrequencyPerMonth: 5.2,
      openIssues: 84, openPRs: 22, license: "MIT", contributors: 96, forks: 2100,
      inOfficialRegistry: true, hasRunnableEntry: true, dataUpdatedAt: isoDaysAgo(0),
    },
    repoUrl: "https://github.com/github/github-mcp-server",
    npmPackage: null,
    registryUrl: "https://registry.modelcontextprotocol.io",
    verdict: "✅ GitHub 官方重投入，研发场景事实标准",
    addedAt: "2025-03-14",
    starsTrend: trend(10800, 0.058),
    downloadsTrend: trend(0, 0),
  },
  {
    slug: "gitlab-mcp",
    name: "@modelcontextprotocol/server-gitlab",
    tagline: "GitLab 项目与 MR 管理",
    description: "官方 GitLab MCP server，支持项目、Issue、MR、管道的查询与操作。",
    categories: ["dev"],
    lifecycle: "active",
    trustScore: 80,
    breakdown: { maintenance: 78, adoption: 80, usability: 86, health: 80, community: 74 },
    signals: {
      lastCommitDaysAgo: 6, commits90d: 55, issueResponseDays: 3, archived: false,
      stars: 5200, starsWeeklyDelta: 44, npmWeeklyDownloads: 31200, releaseFrequencyPerMonth: 2.0,
      openIssues: 26, openPRs: 9, license: "MIT", contributors: 43, forks: 460,
      inOfficialRegistry: true, hasRunnableEntry: true, dataUpdatedAt: isoDaysAgo(0),
    },
    repoUrl: "https://github.com/modelcontextprotocol/servers",
    npmPackage: "@modelcontextprotocol/server-gitlab",
    registryUrl: "https://registry.modelcontextprotocol.io",
    verdict: "✅ 官方维护，GitLab 用户直接装",
    addedAt: "2025-03-12",
    starsTrend: trend(3900, 0.024),
    downloadsTrend: trend(24000, 0.026),
  },
  {
    slug: "sentry-mcp",
    name: "@sentry/mcp-server",
    tagline: "Sentry 官方：错误追踪与性能分析",
    description: "Sentry 官方 MCP server，查询错误事件、分析堆栈、检索性能追踪数据。",
    categories: ["dev", "cloud"],
    lifecycle: "active",
    trustScore: 77,
    breakdown: { maintenance: 79, adoption: 72, usability: 82, health: 76, community: 70 },
    signals: {
      lastCommitDaysAgo: 8, commits90d: 43, issueResponseDays: 3, archived: false,
      stars: 1900, starsWeeklyDelta: 26, npmWeeklyDownloads: 9800, releaseFrequencyPerMonth: 2.2,
      openIssues: 11, openPRs: 4, license: "MIT", contributors: 15, forks: 130,
      inOfficialRegistry: true, hasRunnableEntry: true, dataUpdatedAt: isoDaysAgo(0),
    },
    repoUrl: "https://github.com/getsentry/sentry-mcp",
    npmPackage: "@sentry/mcp-server",
    registryUrl: "https://registry.modelcontextprotocol.io",
    verdict: "✅ 官方维护，Sentry 用户值得装",
    addedAt: "2025-05-06",
    starsTrend: trend(1100, 0.036),
    downloadsTrend: trend(6400, 0.038),
  },
  {
    slug: "docker-mcp",
    name: "docker-mcp-toolkit",
    tagline: "容器管理：镜像、容器、卷一把梭",
    description: "社区 Docker MCP server，管理容器生命周期、查看日志、执行命令。",
    categories: ["dev", "cloud"],
    lifecycle: "dead",
    trustScore: 31,
    breakdown: { maintenance: 8, adoption: 44, usability: 48, health: 22, community: 30 },
    signals: {
      lastCommitDaysAgo: 342, commits90d: 0, issueResponseDays: null, archived: true,
      stars: 2100, starsWeeklyDelta: 1, npmWeeklyDownloads: 890, releaseFrequencyPerMonth: 0,
      openIssues: 47, openPRs: 13, license: "MIT", contributors: 9, forks: 180,
      inOfficialRegistry: true, hasRunnableEntry: false, dataUpdatedAt: isoDaysAgo(0),
    },
    repoUrl: "https://github.com/example/docker-mcp",
    npmPackage: "docker-mcp-toolkit",
    registryUrl: "https://registry.modelcontextprotocol.io",
    verdict: "⛔ 仓库已 archive，作者宣布弃坑，别装",
    addedAt: "2025-04-05",
    deadAt: isoDaysAgo(96),
    deathReason: "仓库 archived，作者 README 声明停止维护",
    starsTrend: trend(2060, 0.000),
    downloadsTrend: trend(1400, -0.02),
  },

  // ===== 通讯/协作类 =====
  {
    slug: "slack-mcp",
    name: "@modelcontextprotocol/server-slack",
    tagline: "官方 Slack：频道读写、消息搜索",
    description: "官方 Slack MCP server，发送消息、读取频道历史、搜索消息、管理反应。",
    categories: ["comms"],
    lifecycle: "active",
    trustScore: 79,
    breakdown: { maintenance: 78, adoption: 82, usability: 82, health: 78, community: 72 },
    signals: {
      lastCommitDaysAgo: 7, commits90d: 47, issueResponseDays: 3, archived: false,
      stars: 6100, starsWeeklyDelta: 52, npmWeeklyDownloads: 34800, releaseFrequencyPerMonth: 1.8,
      openIssues: 29, openPRs: 10, license: "MIT", contributors: 38, forks: 520,
      inOfficialRegistry: true, hasRunnableEntry: true, dataUpdatedAt: isoDaysAgo(0),
    },
    repoUrl: "https://github.com/modelcontextprotocol/servers",
    npmPackage: "@modelcontextprotocol/server-slack",
    registryUrl: "https://registry.modelcontextprotocol.io",
    verdict: "✅ 官方维护，团队协作场景主力",
    addedAt: "2025-03-12",
    starsTrend: trend(4600, 0.026),
    downloadsTrend: trend(26600, 0.028),
  },
  {
    slug: "google-calendar-mcp",
    name: "google-calendar-mcp",
    tagline: "Google 日历读写与日程管理",
    description: "社区 Google Calendar MCP server，查询日程、创建事件、管理提醒，OAuth 认证。",
    categories: ["comms", "cloud"],
    lifecycle: "active",
    trustScore: 68,
    breakdown: { maintenance: 72, adoption: 64, usability: 70, health: 66, community: 60 },
    signals: {
      lastCommitDaysAgo: 15, commits90d: 24, issueResponseDays: 6, archived: false,
      stars: 1100, starsWeeklyDelta: 14, npmWeeklyDownloads: 7200, releaseFrequencyPerMonth: 1.1,
      openIssues: 13, openPRs: 4, license: "MIT", contributors: 11, forks: 98,
      inOfficialRegistry: true, hasRunnableEntry: true, dataUpdatedAt: isoDaysAgo(0),
    },
    repoUrl: "https://github.com/example/gcal-mcp",
    npmPackage: "google-calendar-mcp",
    registryUrl: "https://registry.modelcontextprotocol.io",
    verdict: "✅ 维护正常，个人项目节奏",
    addedAt: "2025-06-12",
    starsTrend: trend(820, 0.022),
    downloadsTrend: trend(5600, 0.024),
  },

  // ===== 云/DevOps 类 =====
  {
    slug: "kubernetes-mcp",
    name: "mcp-server-kubernetes",
    tagline: "K8s 集群操作：Pod、部署、日志",
    description: "社区 Kubernetes MCP server，查询和操作 Pod、Deployment、Service，读取容器日志。",
    categories: ["cloud", "dev"],
    lifecycle: "active",
    trustScore: 74,
    breakdown: { maintenance: 76, adoption: 72, usability: 76, health: 72, community: 68 },
    signals: {
      lastCommitDaysAgo: 10, commits90d: 34, issueResponseDays: 5, archived: false,
      stars: 2400, starsWeeklyDelta: 28, npmWeeklyDownloads: 8600, releaseFrequencyPerMonth: 1.4,
      openIssues: 16, openPRs: 5, license: "Apache-2.0", contributors: 21, forks: 190,
      inOfficialRegistry: true, hasRunnableEntry: true, dataUpdatedAt: isoDaysAgo(0),
    },
    repoUrl: "https://github.com/example/k8s-mcp",
    npmPackage: "mcp-server-kubernetes",
    registryUrl: "https://registry.modelcontextprotocol.io",
    verdict: "✅ 维护活跃，运维场景实用",
    addedAt: "2025-05-20",
    starsTrend: trend(1700, 0.03),
    downloadsTrend: trend(6600, 0.032),
  },
  {
    slug: "aws-mcp",
    name: "aws-mcp-server",
    tagline: "AWS 资源查询：EC2、S3、Lambda",
    description: "社区 AWS MCP server，查询 EC2 实例、S3 存储桶、Lambda 函数等核心资源状态。",
    categories: ["cloud"],
    lifecycle: "dying",
    trustScore: 43,
    breakdown: { maintenance: 18, adoption: 56, usability: 58, health: 40, community: 42 },
    signals: {
      lastCommitDaysAgo: 198, commits90d: 0, issueResponseDays: null, archived: false,
      stars: 1500, starsWeeklyDelta: 4, npmWeeklyDownloads: 2600, releaseFrequencyPerMonth: 0,
      openIssues: 25, openPRs: 7, license: "Apache-2.0", contributors: 8, forks: 130,
      inOfficialRegistry: true, hasRunnableEntry: true, dataUpdatedAt: isoDaysAgo(0),
    },
    repoUrl: "https://github.com/example/aws-mcp",
    npmPackage: "aws-mcp-server",
    registryUrl: "https://registry.modelcontextprotocol.io",
    verdict: "⚠️ 已 198 天未更新，建议改用 AWS 官方新出的 server",
    addedAt: "2025-04-15",
    deadAt: isoDaysAgo(48),
    deathReason: "最近提交 198 天前，近 90 天 0 提交",
    starsTrend: trend(1440, 0.002),
    downloadsTrend: trend(3000, -0.012),
  },

  // ===== AI/模型类 =====
  {
    slug: "openai-mcp",
    name: "openai-mcp-server",
    tagline: "OpenAI API 封装：GPT、DALL·E、Whisper",
    description: "社区 OpenAI MCP server，统一调用 GPT 系列、图像生成和语音转写 API。",
    categories: ["ai"],
    lifecycle: "dead",
    trustScore: 35,
    breakdown: { maintenance: 10, adoption: 52, usability: 50, health: 28, community: 34 },
    signals: {
      lastCommitDaysAgo: 289, commits90d: 0, issueResponseDays: null, archived: true,
      stars: 1800, starsWeeklyDelta: 2, npmWeeklyDownloads: 1200, releaseFrequencyPerMonth: 0,
      openIssues: 33, openPRs: 9, license: "MIT", contributors: 7, forks: 150,
      inOfficialRegistry: true, hasRunnableEntry: false, dataUpdatedAt: isoDaysAgo(0),
    },
    repoUrl: "https://github.com/example/openai-mcp",
    npmPackage: "openai-mcp-server",
    registryUrl: "https://registry.modelcontextprotocol.io",
    verdict: "⛔ 仓库已 archive，API 版本过旧会报错，别装",
    addedAt: "2025-03-25",
    deadAt: isoDaysAgo(120),
    deathReason: "仓库 archived，仍调用已下线的 v1/completions 端点",
    starsTrend: trend(1760, 0.000),
    downloadsTrend: trend(1800, -0.018),
  },
  {
    slug: "qdrant-mcp",
    name: "mcp-server-qdrant",
    tagline: "Qdrant 官方向量检索：RAG 记忆层",
    description: "Qdrant 官方 MCP server，向量存储与语义检索，常用作 AI agent 的长期记忆层。",
    categories: ["ai", "database"],
    lifecycle: "active",
    trustScore: 80,
    breakdown: { maintenance: 82, adoption: 76, usability: 84, health: 80, community: 74 },
    signals: {
      lastCommitDaysAgo: 6, commits90d: 44, issueResponseDays: 3, archived: false,
      stars: 2700, starsWeeklyDelta: 33, npmWeeklyDownloads: 11200, releaseFrequencyPerMonth: 2.0,
      openIssues: 13, openPRs: 5, license: "Apache-2.0", contributors: 19, forks: 210,
      inOfficialRegistry: true, hasRunnableEntry: true, dataUpdatedAt: isoDaysAgo(0),
    },
    repoUrl: "https://github.com/qdrant/mcp-server-qdrant",
    npmPackage: "mcp-server-qdrant",
    registryUrl: "https://registry.modelcontextprotocol.io",
    verdict: "✅ 官方维护，RAG 场景推荐",
    addedAt: "2025-04-08",
    starsTrend: trend(1800, 0.034),
    downloadsTrend: trend(8200, 0.036),
  },

  // ===== 支付/商业类 =====
  {
    slug: "stripe-mcp",
    name: "@stripe/agent-toolkit",
    tagline: "Stripe 官方：支付、订阅、发票",
    description: "Stripe 官方 Agent Toolkit MCP server，查询支付、管理订阅、创建发票和退款。",
    categories: ["commerce"],
    lifecycle: "active",
    trustScore: 85,
    breakdown: { maintenance: 86, adoption: 82, usability: 88, health: 84, community: 78 },
    signals: {
      lastCommitDaysAgo: 4, commits90d: 63, issueResponseDays: 2, archived: false,
      stars: 4300, starsWeeklyDelta: 58, npmWeeklyDownloads: 18900, releaseFrequencyPerMonth: 2.8,
      openIssues: 18, openPRs: 7, license: "MIT", contributors: 26, forks: 310,
      inOfficialRegistry: true, hasRunnableEntry: true, dataUpdatedAt: isoDaysAgo(0),
    },
    repoUrl: "https://github.com/stripe/agent-toolkit",
    npmPackage: "@stripe/agent-toolkit",
    registryUrl: "https://registry.modelcontextprotocol.io",
    verdict: "✅ Stripe 官方维护，商业场景首选",
    addedAt: "2025-04-01",
    starsTrend: trend(2400, 0.044),
    downloadsTrend: trend(11000, 0.047),
  },
  {
    slug: "shopify-mcp",
    name: "shopify-mcp-server",
    tagline: "Shopify 店铺数据：订单、商品、库存",
    description: "社区 Shopify MCP server，查询订单、管理商品、同步库存，需店铺 API key。",
    categories: ["commerce"],
    lifecycle: "unverifiable",
    trustScore: 52,
    breakdown: { maintenance: 0, adoption: 58, usability: 64, health: 50, community: 0 },
    signals: {
      lastCommitDaysAgo: null, commits90d: null, issueResponseDays: null, archived: false,
      stars: 0, starsWeeklyDelta: 0, npmWeeklyDownloads: null, releaseFrequencyPerMonth: null,
      openIssues: null, openPRs: null, license: null, contributors: null, forks: null,
      inOfficialRegistry: true, hasRunnableEntry: false, dataUpdatedAt: isoDaysAgo(0),
    },
    repoUrl: null,
    npmPackage: null,
    registryUrl: "https://registry.modelcontextprotocol.io",
    verdict: "⚪ 纯远程服务、无开源仓库，无法审计其安全性，谨慎授权店铺权限",
    addedAt: "2025-06-28",
    starsTrend: [],
    downloadsTrend: [],
  },

  // ===== 本周新增（雷达页用）=====
  {
    slug: "linear-mcp",
    name: "@linear/mcp-server",
    tagline: "Linear 官方：Issue 与项目管理",
    description: "Linear 官方 MCP server，查询和创建 Issue、管理项目周期和团队工作流。",
    categories: ["dev", "comms"],
    lifecycle: "active",
    trustScore: 75,
    breakdown: { maintenance: 78, adoption: 70, usability: 80, health: 74, community: 66 },
    signals: {
      lastCommitDaysAgo: 3, commits90d: 28, issueResponseDays: 2, archived: false,
      stars: 980, starsWeeklyDelta: 120, npmWeeklyDownloads: 4600, releaseFrequencyPerMonth: 2.4,
      openIssues: 6, openPRs: 3, license: "MIT", contributors: 9, forks: 62,
      inOfficialRegistry: true, hasRunnableEntry: true, dataUpdatedAt: isoDaysAgo(0),
    },
    repoUrl: "https://github.com/linear/mcp-server",
    npmPackage: "@linear/mcp-server",
    registryUrl: "https://registry.modelcontextprotocol.io",
    verdict: "✅ 官方新出，增长迅猛",
    addedAt: isoDaysAgo(6),
    starsTrend: trend(180, 0.16),
    downloadsTrend: trend(900, 0.15),
  },
  {
    slug: "notion-mcp",
    name: "@notionhq/notion-mcp-server",
    tagline: "Notion 官方：页面、数据库、块操作",
    description: "Notion 官方 MCP server，读写页面、查询数据库、管理块内容。",
    categories: ["files", "comms", "search"],
    lifecycle: "active",
    trustScore: 83,
    breakdown: { maintenance: 84, adoption: 84, usability: 86, health: 80, community: 76 },
    signals: {
      lastCommitDaysAgo: 2, commits90d: 71, issueResponseDays: 2, archived: false,
      stars: 5600, starsWeeklyDelta: 185, npmWeeklyDownloads: 33400, releaseFrequencyPerMonth: 3.4,
      openIssues: 22, openPRs: 8, license: "MIT", contributors: 28, forks: 420,
      inOfficialRegistry: true, hasRunnableEntry: true, dataUpdatedAt: isoDaysAgo(0),
    },
    repoUrl: "https://github.com/makenotion/notion-mcp-server",
    npmPackage: "@notionhq/notion-mcp-server",
    registryUrl: "https://registry.modelcontextprotocol.io",
    verdict: "✅ 官方重投入，Notion 用户必装",
    addedAt: isoDaysAgo(11),
    starsTrend: trend(2400, 0.072),
    downloadsTrend: trend(16800, 0.065),
  },
  {
    slug: "figma-mcp",
    name: "figma-developer-mcp",
    tagline: "Figma 设计稿转代码上下文",
    description: "社区 Figma MCP server，读取设计稿结构、样式和组件信息，为 AI 编码提供设计上下文。",
    categories: ["dev", "misc"],
    lifecycle: "active",
    trustScore: 81,
    breakdown: { maintenance: 84, adoption: 86, usability: 78, health: 78, community: 72 },
    signals: {
      lastCommitDaysAgo: 4, commits90d: 66, issueResponseDays: 2, archived: false,
      stars: 9800, starsWeeklyDelta: 260, npmWeeklyDownloads: 42100, releaseFrequencyPerMonth: 3.0,
      openIssues: 31, openPRs: 12, license: "MIT", contributors: 35, forks: 780,
      inOfficialRegistry: true, hasRunnableEntry: true, dataUpdatedAt: isoDaysAgo(0),
    },
    repoUrl: "https://github.com/example/figma-mcp",
    npmPackage: "figma-developer-mcp",
    registryUrl: "https://registry.modelcontextprotocol.io",
    verdict: "✅ 设计转代码场景最火的社区实现",
    addedAt: "2025-03-20",
    starsTrend: trend(4600, 0.062),
    downloadsTrend: trend(22000, 0.058),
  },
  {
    slug: "memory-mcp",
    name: "@modelcontextprotocol/server-memory",
    tagline: "官方知识图谱记忆：跨会话持久化",
    description: "官方 Memory MCP server，基于知识图谱的实体关系记忆，让 AI 跨会话记住信息。",
    categories: ["ai", "misc"],
    lifecycle: "active",
    trustScore: 82,
    breakdown: { maintenance: 80, adoption: 86, usability: 84, health: 80, community: 76 },
    signals: {
      lastCommitDaysAgo: 5, commits90d: 51, issueResponseDays: 3, archived: false,
      stars: 10500, starsWeeklyDelta: 92, npmWeeklyDownloads: 76800, releaseFrequencyPerMonth: 2.0,
      openIssues: 36, openPRs: 13, license: "MIT", contributors: 54, forks: 890,
      inOfficialRegistry: true, hasRunnableEntry: true, dataUpdatedAt: isoDaysAgo(0),
    },
    repoUrl: "https://github.com/modelcontextprotocol/servers",
    npmPackage: "@modelcontextprotocol/server-memory",
    registryUrl: "https://registry.modelcontextprotocol.io",
    verdict: "✅ 官方维护，agent 记忆场景装机量大",
    addedAt: "2025-03-12",
    starsTrend: trend(8200, 0.022),
    downloadsTrend: trend(62000, 0.024),
  },
];

// 补齐派生字段：repoAuditable 由「是否有开源仓库」推导，避免逐条手写。
for (const s of servers) {
  if (s.signals.repoAuditable === undefined) {
    (s.signals as { repoAuditable: boolean }).repoAuditable = s.repoUrl !== null;
  }
}

// ---------- 纯函数查询逻辑（不依赖 Promise，供 provider 方法包装） ----------

function graveyardSync(): MCPServer[] {
  return servers
    .filter((s) => s.lifecycle === "dead" || s.lifecycle === "dying")
    .sort((a, b) => (a.deadAt ?? "").localeCompare(b.deadAt ?? "") * -1);
}

function radarSync(): RadarBuckets {
  const byStarsDelta = [...servers]
    .filter((s) => s.lifecycle === "active")
    .sort((a, b) => b.signals.starsWeeklyDelta - a.signals.starsWeeklyDelta)
    .slice(0, 5);
  const trending: RadarEntry[] = byStarsDelta.map((s) => ({
    server: s,
    kind: "trending" as const,
    evidence: `+${s.signals.starsWeeklyDelta} ⭐ / 周${s.signals.npmWeeklyDownloads ? `，周下载 ${formatNumber(s.signals.npmWeeklyDownloads)}` : ""}`,
    evidenceKey: "trendingDelta" as const,
    evidenceVars: {
      starsDelta: s.signals.starsWeeklyDelta,
      stars: s.signals.stars,
      downloads: s.signals.npmWeeklyDownloads,
    },
  }));

  const added: RadarEntry[] = servers
    .filter((s) => new Date(s.addedAt) >= new Date(isoDaysAgo(14)))
    .map((s) => ({
      server: s,
      kind: "new" as const,
      evidence: `${formatDate(s.addedAt)} 首次收录，已获 ${formatNumber(s.signals.stars)} ⭐`,
      evidenceKey: "new" as const,
      evidenceVars: { addedAt: s.addedAt, stars: s.signals.stars },
    }));

  const dead: RadarEntry[] = graveyardSync()
    .slice(0, 4)
    .map((s) => ({
      server: s,
      kind: "dead" as const,
      evidence: s.deathReason ?? "健康度持续恶化",
      evidenceKey: "dead" as const,
    }));

  return { trending, added, dead };
}

// ---------- Provider 实现 ----------

export const mockProvider: MCPDataProvider = {
  async getCategories() {
    return CATEGORIES;
  },
  async getCategoryBySlug(slug) {
    return CATEGORIES.find((c) => c.slug === slug);
  },
  async getAllServers() {
    return servers;
  },
  async getServerBySlug(slug) {
    return servers.find((s) => s.slug === slug);
  },
  async getServersByCategory(catSlug) {
    return servers.filter((s) => s.categories.includes(catSlug));
  },
  async getTopServers(n = 8) {
    return [...servers]
      .filter((s) => s.lifecycle !== "dead")
      .sort((a, b) => b.trustScore - a.trustScore)
      .slice(0, n);
  },
  async getSimilarServers(server, n = 4) {
    return servers
      .filter((s) => s.slug !== server.slug && s.categories.some((c) => server.categories.includes(c)))
      .sort((a, b) => b.trustScore - a.trustScore)
      .slice(0, n);
  },
  async getLeaderboard(options?: LeaderboardOptions) {
    let list = [...servers];
    if (options?.category) list = list.filter((s) => s.categories.includes(options.category!));
    if (options?.lifecycle) list = list.filter((s) => s.lifecycle === options.lifecycle);
    if (options?.minScore) list = list.filter((s) => s.trustScore >= options.minScore!);
    return list.sort((a, b) => b.trustScore - a.trustScore);
  },
  async getGraveyard() {
    return graveyardSync();
  },
  async getRadarEntries() {
    return radarSync();
  },
  async getSiteStats(): Promise<SiteStats> {
    return { total: 1247, active: 812, dying: 168, dead: 137, unverifiable: 130 };
  },
  async getLastUpdated() {
    return isoDaysAgo(0);
  },
};

// 格式化工具与 CATEGORIES 现由 constants.ts 提供；这里透传导出，保持既有 import 兼容。
export { CATEGORIES, formatNumber, formatDate };
