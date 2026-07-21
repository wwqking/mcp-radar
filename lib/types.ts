// MCP Radar 数据类型定义
// 后续接 word-filter 引擎 mcp_directory 赛道 API 时，保持这些类型不变，只换数据来源。

export type Lifecycle = "active" | "dying" | "dead" | "unverifiable";

export interface Category {
  slug: string;
  name: string;
  /** 一句人话解释这类干嘛（SEO + 可读性） */
  tagline: string;
  description: string;
  icon: string; // emoji
}

/** Trust Score 五维分解（主文档 §2） */
export interface ScoreBreakdown {
  maintenance: number; // 维护活跃度 30%
  adoption: number; // 采用度 25%
  usability: number; // 可用性 20%
  health: number; // 健康度 15%
  community: number; // 社区信号 10%
}

export interface HealthSignals {
  lastCommitDaysAgo: number | null; // 最近提交距今（天）
  commits90d: number | null; // 90 天提交数
  issueResponseDays: number | null; // issue 中位响应（天），null = 无响应
  archived: boolean;
  stars: number;
  starsWeeklyDelta: number; // 周环比增量
  npmWeeklyDownloads: number | null; // null = 非 npm 分发
  releaseFrequencyPerMonth: number | null;
  openIssues: number | null;
  openPRs: number | null;
  license: string | null;
  contributors: number | null;
  forks: number | null;
  inOfficialRegistry: boolean;
  hasRunnableEntry: boolean; // 能否解析可运行入口
  /** 是否有开源仓库可审计（纯 remotes 型为 false → unverifiable）。
   *  mock 数据未显式给时由 repoUrl 推导（见 mock-provider 归一化）。 */
  repoAuditable?: boolean;
  dataUpdatedAt: string; // ISO 日期
}

export interface MCPServer {
  /** URL slug，如 "github-mcp" */
  slug: string;
  /** registry 全名，如 "@modelcontextprotocol/server-github" */
  name: string;
  tagline: string;
  description: string;
  categories: string[]; // Category.slug 数组（可多分类）
  lifecycle: Lifecycle;
  trustScore: number; // 0-100
  breakdown: ScoreBreakdown;
  signals: HealthSignals;
  repoUrl: string | null;
  npmPackage: string | null;
  registryUrl: string;
  /** 一句策展判断，如 "✅ 活跃维护，适合生产" */
  verdict: string;
  /** 首次收录日期 ISO */
  addedAt: string;
  /** 死亡判定日期（仅 dead/dying） */
  deadAt?: string;
  /** 死亡原因说明（仅 dead/dying） */
  deathReason?: string;
  /** 近 90 天 stars 趋势（sparkline 用，12 个点） */
  starsTrend: number[];
  /** 近 90 天下载趋势 */
  downloadsTrend: number[];
}

/** 雷达页周报的单个变化条目 */
export interface RadarEntry {
  server: MCPServer;
  kind: "trending" | "new" | "dead";
  /** 可解释依据，如 "+340 ⭐ / 周"、"最近提交 213 天前，issue 无响应" */
  evidence: string;
}
