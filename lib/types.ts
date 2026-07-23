// MCP Radar 数据类型定义
// 后续接 word-filter 引擎 mcp_directory 赛道 API 时，保持这些类型不变，只换数据来源。

export type Lifecycle = "active" | "dying" | "dead" | "unverifiable";

/** verdict 运行时取词的 key（对应 lifecycle 的四种判断句）。 */
export type VerdictKey = "active" | "dying" | "dead" | "unverifiable";
/** 死因运行时取词的 key。 */
export type DeathReasonKey = "archived" | "stale";

export interface Category {
  slug: string;
  name: string;
  /** 一句人话解释这类干嘛（SEO + 可读性） */
  tagline: string;
  description: string;
  icon: string; // emoji
  /** 英文文案（i18n）。缺省时回退中文。 */
  name_en?: string;
  tagline_en?: string;
  description_en?: string;
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
  /** 一句策展判断（旧字段，i18n 兜底用）。新数据优先用 verdictKey 运行时按 locale 渲染。 */
  verdict: string;
  /** 结构化判断 key，供多语言运行时取词（active/dying/dead/unverifiable）。 */
  verdictKey?: VerdictKey;
  /** dying 判断句需要的天数变量。 */
  verdictDays?: number | null;
  /** 首次收录日期 ISO */
  addedAt: string;
  /** 死亡判定日期（仅 dead/dying） */
  deadAt?: string;
  /** 死亡原因说明（旧字段，i18n 兜底用）。新数据优先用 deathReasonKey。 */
  deathReason?: string;
  /** 结构化死因 key（archived/stale）。 */
  deathReasonKey?: DeathReasonKey;
  /** stale 死因句需要的天数变量。 */
  deathReasonDays?: number | null;
  /** 近 90 天 stars 趋势（sparkline 用，12 个点） */
  starsTrend: number[];
  /** 近 90 天下载趋势 */
  downloadsTrend: number[];
  /** 从 README 规则提取的结构化事实（采集期填充；无 repo/README 时缺省）。 */
  readmeFacts?: ReadmeFacts;
}

/** 从 README 规则提取的结构化事实（非 AI，正则/标题匹配）。
 *  只保留规则可靠的三项；工具列表提取噪音大，交白名单人工精写。 */
export interface ReadmeFacts {
  /** 是否需要 API key / token 才能用（搜到相关关键词即 true）。 */
  needsApiKey: boolean;
  /** 运行时依赖（node / python / docker，能识别到的）。 */
  runtimes: string[];
  /** 典型配置 JSON 片段（含 mcpServers 的代码块，原样保留，供"怎么接"展示）。 */
  configSnippet: string | null;
}

/** 雷达 evidence 的结构化 key，供多语言运行时渲染。 */
export type EvidenceKey = "trendingDelta" | "trendingStars" | "new" | "dead";

/** 雷达页周报的单个变化条目 */
export interface RadarEntry {
  server: MCPServer;
  kind: "trending" | "new" | "dead";
  /** 可解释依据（旧字段，i18n 兜底用）。新数据优先用 evidenceKey 运行时按 locale 渲染。 */
  evidence: string;
  /** 结构化依据 key。 */
  evidenceKey?: EvidenceKey;
  /** evidence 句需要的数值/字符串变量（stars 增量、下载量、收录日期等）。 */
  evidenceVars?: {
    starsDelta?: number;
    stars?: number;
    downloads?: number | null;
    addedAt?: string;
  };
}
