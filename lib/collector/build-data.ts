// 采集编排 —— 本项目内的「引擎」：registry 拿候选 → GitHub/npm 富化 → 算 TrustScore + 分类
// → 输出 MCPServer[]（与前端类型对齐）。构建期跑一次，结果内置进 SSG。
//
// 只在 Node 服务端运行（用了 fs 缓存 + 环境变量），不进浏览器 bundle。

import type { MCPServer, HealthSignals, Lifecycle } from "../types";
import { fetchRegistryCandidates, parseGithubRepo, type RegistryCandidate } from "./registry";
import { fetchGithubHealth, fetchReadmeFacts } from "./github";
import { fetchNpmAdoption } from "./npm";
import { computeBreakdown, computeTrustScore, computeLifecycle, computeVerdict } from "./score";
import { classify } from "./classify";
import { CURATED_SEEDS } from "./curated";
import { DISCOVERED_SEEDS } from "./discovered";
import {
  readAllSnapshots,
  readPreviousSnapshot,
  writeSnapshot,
  toWeeklyDelta,
  daysBetweenDates,
  type SnapshotMetric,
} from "./snapshots";
import { writeDataset, readDataset } from "./dataset";
import {
  advanceCatalogState,
  readCatalogState,
  writeCatalogState,
  type CatalogSource,
} from "./catalog-state";

const REGISTRY_URL = "https://registry.modelcontextprotocol.io";

/** 每天最多做多少个 GitHub/npm 深度富化。Registry 元数据始终完整遍历，不再受此窗口限制。 */
const DEFAULT_ENRICH_LIMIT = Number(process.env.MCP_COLLECT_LIMIT ?? 800);
/** 每天给“从未入库”的 Registry 项目预留多少个富化名额，避免旧项目占满预算导致总数不增长。 */
const DEFAULT_NEW_SERVER_LIMIT = Number(process.env.MCP_NEW_SERVER_LIMIT ?? 250);
/** 连续多少次完整 Registry 扫描没看到，才真正从公开数据集移除。 */
const MISSING_GRACE_RUNS = Number(process.env.MCP_MISSING_GRACE_RUNS ?? 3);

/** registry 补量项的质量门槛：白名单无条件保留（在下方单独处理），
 *  registry 长尾要么有 star（社区认可），要么可运行（有包/仓库可审计），否则丢弃避免扫进垃圾。
 *  这样「去掉硬上限、采多少保留多少」不会变成「把一堆 0 星死项也收进来」。 */
function passesQualityGate(s: MCPServer): boolean {
  if (s.signals.stars > 0) return true;
  if (s.signals.hasRunnableEntry && s.lifecycle !== "unverifiable") return true;
  return false;
}

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
  let readmeFacts: import("../types").ReadmeFacts | undefined;
  if (gh) {
    const [health, readme] = await Promise.all([
      fetchGithubHealth(gh.owner, gh.repo),
      fetchReadmeFacts(gh.owner, gh.repo),
    ]);
    readmeFacts = readme ?? undefined;
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
          // 结构化 key，供多语言运行时渲染（见 lib/i18n/verdict.ts）
          deathReasonKey: lifecycle === "dead" ? ("archived" as const) : ("stale" as const),
          deathReasonDays: lifecycle === "dying" ? signals.lastCommitDaysAgo : null,
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
    verdictKey: lifecycle,
    verdictDays: lifecycle === "dying" ? signals.lastCommitDaysAgo : null,
    addedAt: cand.publishedAt ? cand.publishedAt.slice(0, 10) : todayIso(),
    ...deathInfo,
    starsTrend: [], // 趋势需历史快照，先空（sparkline 会显示「无数据」）
    downloadsTrend: [],
    ...(readmeFacts ? { readmeFacts } : {}),
    ...(cand.remoteEndpoints.length ? { remoteEndpoints: cand.remoteEndpoints } : {}),
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
    // 白名单是「本地装包跑」的开源 server；托管端点由 registry 侧提供，这里恒空。
    remoteEndpoints: [],
    status: "active",
    publishedAt: null,
    updatedAt: null,
  };
}

interface SourcedCandidate {
  candidate: RegistryCandidate;
  source: CatalogSource;
}

function mergeRemoteEndpoints(
  a: RegistryCandidate["remoteEndpoints"],
  b: RegistryCandidate["remoteEndpoints"],
): RegistryCandidate["remoteEndpoints"] {
  const seen = new Set<string>();
  return [...a, ...b].filter((endpoint) => {
    const key = `${endpoint.type}:${endpoint.url}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/** 高优先级种子保留 repo/package，同时用 Registry 补齐描述、发布日期和 remote endpoint。 */
function supplementCandidate(
  primary: RegistryCandidate,
  secondary: RegistryCandidate,
): RegistryCandidate {
  const repoUrl = primary.repoUrl ?? secondary.repoUrl;
  const npmPackage = primary.npmPackage ?? secondary.npmPackage;
  return {
    ...primary,
    title: primary.title !== primary.name ? primary.title : secondary.title || primary.title,
    description: primary.description || secondary.description,
    repoUrl,
    npmPackage,
    remoteOnly: !repoUrl && !npmPackage,
    remoteEndpoints: mergeRemoteEndpoints(primary.remoteEndpoints, secondary.remoteEndpoints),
    status: secondary.status || primary.status,
    publishedAt: primary.publishedAt ?? secondary.publishedAt,
    updatedAt: secondary.updatedAt ?? primary.updatedAt,
  };
}

/** 三个来源合成稳定目录：curated > discovered > registry；同名时补元数据，不重复计数。 */
function buildCandidateCatalog(registryCandidates: RegistryCandidate[]): SourcedCandidate[] {
  const byName = new Map<string, SourcedCandidate>();
  const add = (candidate: RegistryCandidate, source: CatalogSource) => {
    const existing = byName.get(candidate.name);
    if (existing) {
      existing.candidate = supplementCandidate(existing.candidate, candidate);
      return;
    }
    byName.set(candidate.name, { candidate, source });
  };

  for (const seed of CURATED_SEEDS) add(seedToCandidate(seed), "curated");
  for (const seed of DISCOVERED_SEEDS) add(seedToCandidate(seed), "discovered");
  for (const candidate of registryCandidates) add(candidate, "registry");

  // URL 最终按 slug 唯一。极少数不同名字会 slug 碰撞，保留高优先级来源先出现的那条。
  const seenSlugs = new Set<string>();
  const out: SourcedCandidate[] = [];
  let slugCollisions = 0;
  for (const item of Array.from(byName.values())) {
    const slug = slugify(item.candidate.name);
    if (seenSlugs.has(slug)) {
      slugCollisions++;
      continue;
    }
    seenSlugs.add(slug);
    out.push(item);
  }
  if (slugCollisions > 0) {
    console.warn(`[collector] ${slugCollisions} 个候选发生 slug 碰撞，已按来源优先级去重`);
  }
  return out;
}

function candidateRecency(c: RegistryCandidate): number {
  return new Date(c.updatedAt ?? c.publishedAt ?? 0).getTime() || 0;
}

function dataAge(s: MCPServer | undefined): number {
  if (!s) return 0;
  return new Date(s.signals.dataUpdatedAt || 0).getTime() || 0;
}

/**
 * 用最新 Registry 元数据刷新旧条目，但不需要为此调用 GitHub。
 * 健康信号留到轮转富化时更新。
 */
function refreshMetadata(previous: MCPServer, cand: RegistryCandidate): MCPServer {
  const description = cand.description || previous.description;
  const tagline =
    cand.title && cand.title !== cand.name
      ? cand.title.slice(0, 80)
      : previous.tagline || description.slice(0, 80) || cand.name;
  const endpoints = cand.remoteEndpoints.length
    ? cand.remoteEndpoints
    : previous.remoteEndpoints;
  const next: MCPServer = {
    ...previous,
    name: cand.name,
    tagline,
    description,
    categories: classify(cand.name, description),
    repoUrl: cand.repoUrl ?? previous.repoUrl,
    npmPackage: cand.npmPackage ?? previous.npmPackage,
    registryUrl: REGISTRY_URL,
    signals: {
      ...previous.signals,
      inOfficialRegistry: true,
    },
  };
  if (endpoints?.length) next.remoteEndpoints = endpoints;
  else delete next.remoteEndpoints;
  return next;
}

/** 首次收录/首次判定日期属于目录历史，日常重新富化不能每天重置。 */
function preserveStableDates(next: MCPServer, previous: MCPServer | undefined): MCPServer {
  if (!previous) return next;
  const stable = { ...next, addedAt: previous.addedAt || next.addedAt };
  if (
    (next.lifecycle === "dead" || next.lifecycle === "dying") &&
    previous.deadAt
  ) {
    stable.deadAt = previous.deadAt;
  }
  return stable;
}

function formatNames(list: MCPServer[]): string {
  return list.slice(0, 12).map((s) => s.name).join(", ");
}

/**
 * 采集全流程：
 * 1. 完整遍历 Registry latest 元数据；
 * 2. 与白名单、自动发现种子和昨日数据做持久合并；
 * 3. 在每日 API 预算内优先富化新项目，再轮转刷新旧项目；
 * 4. 来源连续缺失多次后才移除，避免字母序窗口和临时故障造成数量抖动。
 *
 * MCP_COLLECT_LIMIT 现在是“每日深度富化预算”，不是 Registry 来源数量上限。
 */
export async function collectServers(
  enrichLimit = DEFAULT_ENRICH_LIMIT,
): Promise<MCPServer[]> {
  const today = todayIso();
  const previousDataset = await readDataset();
  const previousServers = previousDataset?.servers ?? [];
  const previousBySlug = new Map(previousServers.map((s) => [s.slug, s]));
  const previousSlugs = new Set(previousBySlug.keys());
  const oldCatalogState = await readCatalogState();

  // Registry 元数据请求便宜且无需 token：完整拉取，彻底消除“字母序前 800 条”的来源盲区。
  const registryCandidates = await fetchRegistryCandidates({ onlyWithRepo: true });
  const catalog = buildCandidateCatalog(registryCandidates);
  const catalogBySlug = new Map(catalog.map((item) => [slugify(item.candidate.name), item]));
  const currentSources = new Map(
    catalog.map((item) => [slugify(item.candidate.name), item.source]),
  );

  const seeds = catalog.filter((item) => item.source !== "registry");
  const registryNew = catalog
    .filter(
      (item) =>
        item.source === "registry" &&
        !previousSlugs.has(slugify(item.candidate.name)),
    )
    .sort((a, b) => {
      const aAttempt =
        oldCatalogState.entries[slugify(a.candidate.name)]?.lastEnrichmentAttemptAt;
      const bAttempt =
        oldCatalogState.entries[slugify(b.candidate.name)]?.lastEnrichmentAttemptAt;
      // 从未尝试的优先；失败过的按最早尝试时间轮转回来，不能永久占住前 250 个名额。
      if (!aAttempt && bAttempt) return -1;
      if (aAttempt && !bAttempt) return 1;
      if (aAttempt && bAttempt && aAttempt !== bAttempt) {
        return aAttempt.localeCompare(bAttempt);
      }
      return candidateRecency(b.candidate) - candidateRecency(a.candidate);
    });
  const registryExisting = catalog
    .filter(
      (item) =>
        item.source === "registry" &&
        previousSlugs.has(slugify(item.candidate.name)),
    )
    .sort((a, b) => {
      const aSlug = slugify(a.candidate.name);
      const bSlug = slugify(b.candidate.name);
      return (
        dataAge(previousBySlug.get(aSlug)) - dataAge(previousBySlug.get(bSlug)) ||
        a.candidate.name.localeCompare(b.candidate.name)
      );
    });

  // 种子每天都刷新；剩余预算先保证一批新项目能入库，再轮转旧项目。
  const budget = Math.max(seeds.length, enrichLimit);
  const remainingBudget = Math.max(0, budget - seeds.length);
  const newQuota = Math.min(
    registryNew.length,
    DEFAULT_NEW_SERVER_LIMIT,
    remainingBudget,
  );
  const selected: SourcedCandidate[] = [
    ...seeds,
    ...registryNew.slice(0, newQuota),
  ];
  let slots = budget - selected.length;
  const existingTake = Math.min(slots, registryExisting.length);
  selected.push(...registryExisting.slice(0, existingTake));
  slots -= existingTake;
  if (slots > 0) {
    selected.push(...registryNew.slice(newQuota, newQuota + slots));
  }

  const selectedSlugs = new Set(selected.map((item) => slugify(item.candidate.name)));
  console.log(
    `[collector] 来源目录 ${catalog.length}（curated ${CURATED_SEEDS.length} + ` +
      `discovered ${DISCOVERED_SEEDS.length} + registry ${registryCandidates.length}，已去重）；` +
      `待入库 ${registryNew.length}，本次深度富化 ${selected.length}/${budget}`,
  );

  const catalogTransition = advanceCatalogState(
    oldCatalogState,
    currentSources,
    Array.from(previousSlugs),
    today,
    MISSING_GRACE_RUNS,
  );
  for (const item of selected) {
    const slug = slugify(item.candidate.name);
    if (item.source !== "registry" || previousSlugs.has(slug)) continue;
    const entry = catalogTransition.state.entries[slug];
    if (!entry) continue;
    entry.lastEnrichmentAttemptAt = today;
    entry.enrichmentAttempts = (entry.enrichmentAttempts ?? 0) + 1;
  }

  const finalBySlug = new Map<string, MCPServer>();

  // 未轮到深度富化的已收录项目保留健康信号，但同步最新 Registry 元数据。
  for (const previous of previousServers) {
    const current = catalogBySlug.get(previous.slug);
    if (current && !selectedSlugs.has(previous.slug)) {
      finalBySlug.set(previous.slug, refreshMetadata(previous, current.candidate));
    } else if (!current && catalogTransition.retainMissingSlugs.has(previous.slug)) {
      finalBySlug.set(previous.slug, previous);
    }
  }

  // 深度富化（限流保护：token 下 5000/h；5 路并发）。
  const CONCURRENCY = 5;
  let qualityRejected = 0;
  let retainedOnFailure = 0;
  for (let i = 0; i < selected.length; i += CONCURRENCY) {
    const batch = selected.slice(i, i + CONCURRENCY);
    const results = await Promise.all(
      batch.map(async (item) => {
        const cand = item.candidate;
        const slug = slugify(cand.name);
        const previous = previousBySlug.get(slug);
        try {
          const enriched = await enrichOne(cand);
          const auditable = enriched.signals.repoAuditable !== false;
          const passes = item.source === "curated" || passesQualityGate(enriched);
          if (!auditable || !passes) {
            if (previous) {
              retainedOnFailure++;
              return refreshMetadata(previous, cand);
            }
            qualityRejected++;
            return null;
          }
          return preserveStableDates(enriched, previous);
        } catch (err) {
          if (previous) {
            retainedOnFailure++;
            console.warn(`[collector] 富化失败，保留旧数据 ${cand.name}: ${String(err)}`);
            return refreshMetadata(previous, cand);
          }
          console.warn(`[collector] 富化失败，暂不入库 ${cand.name}: ${String(err)}`);
          return null;
        }
      }),
    );
    for (const server of results) {
      if (server) finalBySlug.set(server.slug, server);
    }
  }

  const final = Array.from(finalBySlug.values()).sort(
    (a, b) => b.signals.stars - a.signals.stars,
  );
  const finalSlugs = new Set(final.map((s) => s.slug));
  const added = final.filter((s) => !previousSlugs.has(s.slug));
  const removed = previousServers.filter((s) => !finalSlugs.has(s.slug));
  const sourceCounts = final.reduce<Record<CatalogSource, number>>(
    (acc, server) => {
      const source =
        currentSources.get(server.slug) ??
        catalogTransition.state.entries[server.slug]?.source ??
        "registry";
      acc[source]++;
      return acc;
    },
    { curated: 0, discovered: 0, registry: 0 },
  );

  console.log(
    `[collector] 目录结果 ${final.length}：+${added.length} -${removed.length} ` +
      `= 净增 ${added.length - removed.length}；来源 curated ${sourceCounts.curated} / ` +
      `discovered ${sourceCounts.discovered} / registry ${sourceCounts.registry}`,
  );
  if (added.length) console.log(`[collector] 新增：${formatNames(added)}`);
  if (removed.length) console.log(`[collector] 移除：${formatNames(removed)}`);
  if (catalogTransition.retainMissingSlugs.size) {
    console.log(
      `[collector] 来源暂缺但处于 ${MISSING_GRACE_RUNS} 次宽限期：` +
        `${catalogTransition.retainMissingSlugs.size} 个`,
    );
  }
  if (qualityRejected || retainedOnFailure) {
    console.log(
      `[collector] 本轮质量门槛拒绝新项 ${qualityRejected}；富化异常保留旧数据 ${retainedOnFailure}`,
    );
  }

  // 趋势/diff：用历史快照算周增量 + 构造 sparkline，然后写入今天的快照
  await applyTrends(final);

  // 落盘全量数据集：供 Vercel build 直接读取，不必在 build 里重新采集
  await writeDataset(final);
  await writeCatalogState(catalogTransition.state);

  return final;
}

/**
 * 供数据层（live-provider）用：优先读采集好的数据集（瞬时），读不到才现场采集。
 *
 * 正常流程：CI 每天 `npm run collect` → 写 data/servers.json 提交 → Vercel build 读它。
 * 兜底：本地首次跑、或数据集缺失时，退回实时采集（慢但能出数据）。
 */
export async function loadServers(): Promise<MCPServer[]> {
  const ds = await readDataset();
  if (ds && ds.servers.length > 0) return ds.servers;
  console.warn("[collector] 未找到 data/servers.json，退回实时采集（build 会较慢）");
  return collectServers();
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
