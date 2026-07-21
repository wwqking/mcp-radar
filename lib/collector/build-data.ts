// 采集编排 —— 本项目内的「引擎」：registry 拿候选 → GitHub/npm 富化 → 算 TrustScore + 分类
// → 输出 MCPServer[]（与前端类型对齐）。构建期跑一次，结果内置进 SSG。
//
// 只在 Node 服务端运行（用了 fs 缓存 + 环境变量），不进浏览器 bundle。

import type { MCPServer, HealthSignals, Lifecycle } from "../types";
import { fetchRegistryCandidates, parseGithubRepo, type RegistryCandidate } from "./registry";
import { fetchGithubHealth } from "./github";
import { fetchNpmAdoption } from "./npm";
import { computeBreakdown, computeTrustScore, computeLifecycle, computeVerdict } from "./score";
import { classify } from "./classify";
import { CURATED_SEEDS } from "./curated";
import {
  readAllSnapshots,
  readPreviousSnapshot,
  writeSnapshot,
  toWeeklyDelta,
  daysBetweenDates,
  type SnapshotMetric,
} from "./snapshots";

const REGISTRY_URL = "https://registry.modelcontextprotocol.io";

/** "先采少量"：默认只采 40 个（控制 GitHub 调用量，未认证也不炸）。可用 env 调。 */
const DEFAULT_LIMIT = Number(process.env.MCP_COLLECT_LIMIT ?? 40);

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/^@/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

/** 无 GitHub 数据时的兜底 signals（纯 remotes / repo 拿不到） */
function emptySignals(cand: RegistryCandidate, auditable: boolean): HealthSignals {
  return {
    lastCommitDaysAgo: null,
    commits90d: null,
    issueResponseDays: null,
    archived: false,
    stars: 0,
    starsWeeklyDelta: 0,
    npmWeeklyDownloads: null,
    releaseFrequencyPerMonth: null,
    openIssues: null,
    openPRs: null,
    license: null,
    contributors: null,
    forks: null,
    inOfficialRegistry: true,
    hasRunnableEntry: !!cand.npmPackage || cand.remoteOnly,
    repoAuditable: auditable,
    dataUpdatedAt: todayIso(),
  };
}

async function enrichOne(cand: RegistryCandidate): Promise<MCPServer> {
  const gh = parseGithubRepo(cand.repoUrl);
  const auditable = !!gh;

  let signals: HealthSignals;
  let ghDescription: string | null = null;
  if (gh) {
    const health = await fetchGithubHealth(gh.owner, gh.repo);
    const npm = cand.npmPackage ? await fetchNpmAdoption(cand.npmPackage) : null;
    if (health) {
      ghDescription = health.description;
      signals = {
        lastCommitDaysAgo: health.lastCommitDaysAgo,
        commits90d: health.commits90d,
        issueResponseDays: health.issueResponseDays,
        archived: health.archived,
        stars: health.stars,
        starsWeeklyDelta: 0, // 需两次快照做 diff，先 0（雷达 diff 是后续 cron 的事）
        npmWeeklyDownloads: npm?.weeklyDownloads ?? null,
        releaseFrequencyPerMonth: npm?.releaseFrequencyPerMonth ?? null,
        openIssues: health.openIssues,
        openPRs: null, // GitHub open_issues_count 已含 PR，单独 PR 数需额外请求，暂 null
        license: health.license,
        contributors: health.contributors,
        forks: health.forks,
        inOfficialRegistry: true,
        hasRunnableEntry: !!cand.npmPackage || auditable,
        repoAuditable: true,
        dataUpdatedAt: todayIso(),
      };
    } else {
      // repo 拿不到（限流/私有/404）→ 当作无法富化
      signals = emptySignals(cand, false);
    }
  } else {
    // 纯 remotes 型
    signals = emptySignals(cand, false);
  }

  const breakdown = computeBreakdown(signals);
  const trustScore = computeTrustScore(breakdown);
  const lifecycle: Lifecycle = computeLifecycle(signals);
  const verdict = computeVerdict(lifecycle, signals);
  // 描述兜底：registry 给的优先，否则用 GitHub repo description
  const description = cand.description || ghDescription || "";
  const categories = classify(cand.name, description);

  const deathInfo =
    lifecycle === "dead" || lifecycle === "dying"
      ? {
          deadAt: todayIso(),
          deathReason:
            lifecycle === "dead"
              ? "仓库 archived，作者停止维护"
              : `最近提交 ${signals.lastCommitDaysAgo ?? "?"} 天前，issue 响应弱，无新 release`,
        }
      : {};

  return {
    slug: slugify(cand.name),
    name: cand.name,
    tagline: (cand.title !== cand.name ? cand.title : description).slice(0, 80) || cand.name,
    description,
    categories,
    lifecycle,
    trustScore,
    breakdown,
    signals,
    repoUrl: cand.repoUrl,
    npmPackage: cand.npmPackage,
    registryUrl: REGISTRY_URL,
    verdict,
    addedAt: cand.publishedAt ? cand.publishedAt.slice(0, 10) : todayIso(),
    ...deathInfo,
    starsTrend: [], // 趋势需历史快照，先空（sparkline 会显示「无数据」）
    downloadsTrend: [],
  };
}

/** 白名单种子 → RegistryCandidate（复用同一条富化管线） */
function seedToCandidate(seed: (typeof CURATED_SEEDS)[number]): RegistryCandidate {
  return {
    name: seed.name,
    title: seed.name,
    description: "",
    repoUrl: seed.repoUrl,
    npmPackage: seed.npmPackage,
    remoteOnly: false,
    status: "active",
    publishedAt: null,
    updatedAt: null,
  };
}

/**
 * 采集全流程：白名单直采 + registry 补量 → 富化 → 按 stars 排序 → 取 top limit。
 *
 * 策略（见 curated.ts）：知名 server 多不在官方 registry，靠白名单保底优质数据；
 * registry 负责铺长尾。合并后按真实 stars 降序，避免字母序采到一堆冷门项。
 */
export async function collectServers(limit = DEFAULT_LIMIT): Promise<MCPServer[]> {
  // registry 多拉一些作为补量池（白名单之外的候选）
  const registryPool = Math.max(limit * 2, 60);
  const registryCands = await fetchRegistryCandidates({ limit: registryPool, onlyWithRepo: true });

  // 合并候选：白名单在前（优先富化），registry 补量在后；按 name 去重
  const merged: RegistryCandidate[] = [...CURATED_SEEDS.map(seedToCandidate)];
  const names = new Set(merged.map((c) => c.name));
  for (const c of registryCands) {
    if (!names.has(c.name)) {
      names.add(c.name);
      merged.push(c);
    }
  }

  // 并发富化（限流保护：token 下 5000/h 充足，5 路并发够快又不炸）
  const CONCURRENCY = 5;
  const enriched: MCPServer[] = [];
  for (let i = 0; i < merged.length; i += CONCURRENCY) {
    const batch = merged.slice(i, i + CONCURRENCY);
    const results = await Promise.all(
      batch.map(async (cand) => {
        try {
          return await enrichOne(cand);
        } catch (err) {
          console.warn(`[collector] 富化失败，跳过 ${cand.name}: ${String(err)}`);
          return null;
        }
      }),
    );
    for (const r of results) if (r) enriched.push(r);
  }

  // 去重 slug
  const seenSlug = new Set<string>();
  const deduped = enriched.filter((s) =>
    seenSlug.has(s.slug) ? false : (seenSlug.add(s.slug), true),
  );

  // 按 stars 降序，取 top limit（白名单高星项自然排到前面）
  deduped.sort((a, b) => b.signals.stars - a.signals.stars);
  const top = deduped.slice(0, limit);

  // 趋势/diff：用历史快照算周增量 + 构造 sparkline，然后写入今天的快照
  await applyTrends(top);

  return top;
}

/**
 * 用历史快照给每个 server 填充 starsWeeklyDelta + starsTrend/downloadsTrend，
 * 最后写入今天的快照供下次 diff。
 * 首次运行（无历史）：delta=0、趋势只有今天一个点（sparkline 显示「无数据」，符合预期）。
 */
async function applyTrends(servers: MCPServer[]): Promise<void> {
  const [history, previous] = await Promise.all([readAllSnapshots(), readPreviousSnapshot()]);
  const todayStr = todayIso();

  for (const s of servers) {
    // ---- 周增量：今天 vs 最近一份旧快照 ----
    if (previous && previous.servers[s.slug]) {
      const prevStars = previous.servers[s.slug].stars;
      const days = Math.max(1, daysBetweenDates(todayStr, previous.date));
      s.signals.starsWeeklyDelta = toWeeklyDelta(s.signals.stars, prevStars, days);
    } else {
      s.signals.starsWeeklyDelta = 0; // 无历史，保持 0
    }

    // ---- sparkline：历史各期 stars/downloads + 今天，最多保留最近 12 期 ----
    const starsPoints: number[] = [];
    const dlPoints: number[] = [];
    for (const snap of history) {
      const m = snap.servers[s.slug];
      if (m) {
        starsPoints.push(m.stars);
        if (m.downloads !== null && m.downloads !== undefined) dlPoints.push(m.downloads);
      }
    }
    // 今天的值（history 不含今天，除非当天已写过——writeSnapshot 会覆盖，这里先补）
    starsPoints.push(s.signals.stars);
    if (s.signals.npmWeeklyDownloads !== null) dlPoints.push(s.signals.npmWeeklyDownloads);

    s.starsTrend = starsPoints.slice(-12);
    s.downloadsTrend = dlPoints.slice(-12);
  }

  // 写今天的快照（下次采集的 diff 基准）
  const snapshot: Record<string, SnapshotMetric> = {};
  for (const s of servers) {
    snapshot[s.slug] = { stars: s.signals.stars, downloads: s.signals.npmWeeklyDownloads };
  }
  await writeSnapshot(snapshot);
}
