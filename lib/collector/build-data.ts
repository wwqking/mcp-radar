// 采集编排 —— 本项目内的「引擎」：registry 拿候选 → GitHub/npm 富化 → 算 TrustScore + 分类
// → 输出 MCPServer[]（与前端类型对齐）。构建期跑一次，结果内置进 SSG。
//
// 只在 Node 服务端运行（用了 fs 缓存 + 环境变量），不进浏览器 bundle。

import type { MCPServer, HealthSignals, Lifecycle } from "../types";
import { fetchRegistryCandidates, parseGithubRepo, type RegistryCandidate } from "./registry";
import { fetchGithubHealth, fetchReadmeFacts } from "./github";
import { fetchNpmAdoption } from "./npm";
import {
  computeBreakdown,
  computeTrustScore,
  computeLifecycle,
  computeVerdict,
  issueResponseRate,
} from "./score";
import { classifyTaxonomy } from "./classify";
import { deriveClientCompat } from "./client-compat";
import { readVerifications, applyVerifications } from "./install-verification";
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
import { writeTaxonomyAudit } from "./taxonomy-report";
import { classifyServerTaxonomy } from "../taxonomy";

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
function emptySignals(
  cand: RegistryCandidate,
  auditable: boolean,
  inOfficialRegistry: boolean,
): HealthSignals {
  return {
    lastCommitDaysAgo: null,
    commits90d: null,
    issueResponseDays: null,
    issueResponseRatePct: null,
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
    inOfficialRegistry,
    officialRegistryVerifiedAt: inOfficialRegistry ? todayIso() : null,
    hasRunnableEntry: cand.hasPackage || cand.remoteEndpoints.length > 0,
    repoAuditable: auditable,
    dataUpdatedAt: todayIso(),
  };
}

async function enrichOne(
  cand: RegistryCandidate,
  inOfficialRegistry: boolean,
  allowReadmeFacts: boolean,
): Promise<MCPServer> {
  const gh = parseGithubRepo(cand.repoUrl);
  const auditable = !!gh;

  let signals: HealthSignals;
  let ghDescription: string | null = null;
  let readmeFacts: import("../types").ReadmeFacts | undefined;
  if (gh) {
    const [health, readme] = await Promise.all([
      fetchGithubHealth(gh.owner, gh.repo),
      allowReadmeFacts ? fetchReadmeFacts(gh.owner, gh.repo) : Promise.resolve(null),
    ]);
    readmeFacts = readme ?? undefined;
    const npm = cand.npmPackage ? await fetchNpmAdoption(cand.npmPackage) : null;
    if (health) {
      ghDescription = health.description;
      signals = {
        lastCommitDaysAgo: health.lastCommitDaysAgo,
        commits90d: health.commits90d,
        issueResponseDays: null,
        issueResponseRatePct: health.issueResponseRatePct,
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
        inOfficialRegistry,
        officialRegistryVerifiedAt: inOfficialRegistry ? todayIso() : null,
        hasRunnableEntry: cand.hasPackage || cand.remoteEndpoints.length > 0,
        repoAuditable: true,
        dataUpdatedAt: todayIso(),
      };
    } else {
      // repo 拿不到（限流/私有/404）→ 当作无法富化
      signals = emptySignals(cand, false, inOfficialRegistry);
    }
  } else {
    // 纯 remotes 型
    signals = emptySignals(cand, false, inOfficialRegistry);
  }

  const breakdown = computeBreakdown(signals);
  const trustScore = computeTrustScore(breakdown);
  const lifecycle: Lifecycle = computeLifecycle(signals);
  const verdict = computeVerdict(lifecycle, signals);
  // 描述兜底：registry 给的优先，否则用 GitHub repo description
  const description = cand.description || ghDescription || "";
  const taxonomy = classifyTaxonomy(cand.name, description, cand.title);

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
    categories: taxonomy.categories,
    primaryCategory: taxonomy.primaryCategory,
    topics: taxonomy.topics,
    categoryConfidence: taxonomy.categoryConfidence,
    needsCategoryReview: taxonomy.needsCategoryReview,
    lifecycle,
    trustScore,
    breakdown,
    signals,
    repoUrl: cand.repoUrl,
    npmPackage: cand.npmPackage,
    hasPublishedPackage: cand.hasPackage,
    packages: cand.packages,
    clientCompat: deriveClientCompat(cand.packages, cand.remoteEndpoints),
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
    hasPackage: !!seed.npmPackage,
    // 白名单只手工维护了包名，没有版本和 transport。npm 包不声明 transport 时
    // 按 MCP 默认形态当 stdio 处理（这也是 npx 能直接起的前提）；版本留 null，
    // 安装命令就不带 @version —— 宁可给不带版本的真命令，也不编一个版本号。
    packages: seed.npmPackage
      ? [{ registryType: "npm", identifier: seed.npmPackage, version: null, transport: "stdio" }]
      : [],
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
  inOfficialRegistry: boolean;
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
/** 两条候选是不是同一个仓库。任一边没有 repoUrl 就判否——
 *  「不知道」不能当成「是」，这正是同名不同人被误合并的入口。 */
function sameRepo(a: RegistryCandidate, b: RegistryCandidate): boolean {
  const norm = (u: string | null) =>
    u?.toLowerCase().replace(/^https?:\/\//, "").replace(/\.git$/, "").replace(/\/+$/, "") ?? null;
  const x = norm(a.repoUrl);
  const y = norm(b.repoUrl);
  return x !== null && x === y;
}

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
    hasPackage: primary.hasPackage || secondary.hasPackage,
    // 种子只手工记了包名（常常是 null），registry 才有 registryType/version/transport，
    // 所以要把 registry 的安装证据补进来。
    //
    // ⚠️ 但只在两边确实是同一个仓库时补。同名不同人的情况是真实存在的：
    // 种子里的 jupyter-mcp-server 是 datalayer/（★1227），registry 里叫这个名字的
    // 是 ChengJiale150/ —— 两个不同的项目。无条件合并会把别人的包挂到这个 server 上，
    // 页面上就会出现一条装了也跑不起来的安装命令。仓库对不上时宁可没有兼容性数据。
    packages: primary.packages.length
      ? primary.packages
      : sameRepo(primary, secondary) ? secondary.packages : [],
    remoteOnly: !repoUrl && !(primary.hasPackage || secondary.hasPackage),
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
      if (source === "registry") existing.inOfficialRegistry = true;
      return;
    }
    byName.set(candidate.name, {
      candidate,
      source,
      inOfficialRegistry: source === "registry",
    });
  };

  for (const seed of CURATED_SEEDS) add(seedToCandidate(seed), "curated");
  for (const seed of DISCOVERED_SEEDS) add(seedToCandidate(seed), "discovered");
  for (const candidate of registryCandidates) add(candidate, "registry");

  // URL 最终按 slug 唯一。极少数不同名字会 slug 碰撞，保留高优先级来源先出现的那条。
  const bySlug = new Map<string, SourcedCandidate>();
  const out: SourcedCandidate[] = [];
  let slugCollisions = 0;
  for (const item of Array.from(byName.values())) {
    const slug = slugify(item.candidate.name);
    const kept = bySlug.get(slug);
    if (kept) {
      slugCollisions++;
      // 碰撞的两条是同一个东西的不同写法（`MCPJungle` vs
      // `io.github.mcpjungle/MCPJungle`）。名字保留高优先级来源的，但要把落败那条
      // 的元数据并进来，否则 registry 的 packages/remotes 会随它一起被丢掉。
      kept.candidate = supplementCandidate(kept.candidate, item.candidate);
      if (item.source === "registry") kept.inOfficialRegistry = true;
      continue;
    }
    bySlug.set(slug, item);
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
function refreshMetadata(
  previous: MCPServer,
  cand: RegistryCandidate,
  inOfficialRegistry: boolean,
): MCPServer {
  const description = cand.description || previous.description;
  const tagline =
    cand.title && cand.title !== cand.name
      ? cand.title.slice(0, 80)
      : previous.tagline || description.slice(0, 80) || cand.name;
  const endpoints = cand.remoteEndpoints.length
    ? cand.remoteEndpoints
    : previous.remoteEndpoints;
  const taxonomy = classifyServerTaxonomy({
    ...previous,
    name: cand.name,
    description,
    tagline,
  });
  const next: MCPServer = {
    ...previous,
    name: cand.name,
    tagline,
    description,
    categories: taxonomy.categories,
    primaryCategory: taxonomy.primaryCategory,
    topics: taxonomy.topics,
    categoryConfidence: taxonomy.categoryConfidence,
    needsCategoryReview: taxonomy.needsCategoryReview,
    repoUrl: cand.repoUrl ?? previous.repoUrl,
    npmPackage: cand.npmPackage ?? previous.npmPackage,
    hasPublishedPackage: cand.hasPackage,
    packages: cand.packages,
    clientCompat: deriveClientCompat(cand.packages, cand.remoteEndpoints),
    registryUrl: REGISTRY_URL,
    signals: {
      ...previous.signals,
      inOfficialRegistry,
      officialRegistryVerifiedAt: inOfficialRegistry ? todayIso() : null,
      hasRunnableEntry: cand.hasPackage || cand.remoteEndpoints.length > 0,
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
  const repoCounts = new Map<string, number>();
  for (const item of catalog) {
    const repo = item.candidate.repoUrl?.toLowerCase();
    if (repo) repoCounts.set(repo, (repoCounts.get(repo) ?? 0) + 1);
  }
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
      finalBySlug.set(
        previous.slug,
        refreshMetadata(previous, current.candidate, current.inOfficialRegistry),
      );
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
          const repoKey = cand.repoUrl?.toLowerCase();
          const enriched = await enrichOne(
            cand,
            item.inOfficialRegistry,
            !repoKey || repoCounts.get(repoKey) === 1,
          );
          const auditable = enriched.signals.repoAuditable !== false;
          const passes = item.source === "curated" || passesQualityGate(enriched);
          if (!auditable || !passes) {
            if (previous) {
              retainedOnFailure++;
              return refreshMetadata(previous, cand, item.inOfficialRegistry);
            }
            qualityRejected++;
            return null;
          }
          return preserveStableDates(enriched, previous);
        } catch (err) {
          if (previous) {
            retainedOnFailure++;
            console.warn(`[collector] 富化失败，保留旧数据 ${cand.name}: ${String(err)}`);
            return refreshMetadata(previous, cand, item.inOfficialRegistry);
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

  // 沙箱验证结果由独立的 verify-install workflow 产出，这里只消费：
  // 把实测过的 server 的 clientCompat.basis 升级成 verified，并挂上工具列表。
  // 两边解耦——验证跑挂了不影响每日采集。
  const verifications = readVerifications();
  const final = applyVerifications(
    Array.from(finalBySlug.values()),
    verifications,
  ).sort((a, b) => b.signals.stars - a.signals.stars);
  if (verifications.size) {
    const applied = final.filter((s) => s.installVerified).length;
    console.log(`[collector] 沙箱验证结果 ${verifications.size} 条，已标记 verified ${applied} 个`);
  }
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

  // 落盘全量数据集：供 Cloudflare build 直接读取，不必在 build 里重新采集
  await writeDataset(final);
  const taxonomyAudit = await writeTaxonomyAudit(final);
  console.log(
    `[taxonomy] 待复核 ${taxonomyAudit.summary.needsReview}/${taxonomyAudit.total} ` +
      `(${taxonomyAudit.summary.needsReviewRatePct}%)；` +
      `${taxonomyAudit.alerts.length ? taxonomyAudit.alerts.join("；") : "分类分布正常"}`,
  );
  await writeCatalogState(catalogTransition.state);

  return final;
}

/**
 * 供数据层（live-provider）用：优先读采集好的数据集（瞬时），读不到才现场采集。
 *
 * 正常流程：CI 每天 `npm run collect` → 写 data/servers.json 提交 → Cloudflare build 读它。
 * 兜底：本地首次跑、或数据集缺失时，退回实时采集（慢但能出数据）。
 */
export async function loadServers(): Promise<MCPServer[]> {
  const ds = await readDataset();
  if (ds && ds.servers.length > 0) return normalizePublishedServers(ds.servers);
  console.warn("[collector] 未找到 data/servers.json，退回实时采集（build 会较慢）");
  return collectServers();
}

/**
 * 旧数据集曾把“仓库可审计”误当作“可运行”，并把所有来源都标成官方 Registry。
 * 在下一次完整采集前按可证明事实保守纠偏，避免错误结论继续上线。
 */
export function normalizePublishedServers(servers: MCPServer[]): MCPServer[] {
  const repoCounts = new Map<string, number>();
  for (const server of servers) {
    const repo = server.repoUrl?.toLowerCase();
    if (repo) repoCounts.set(repo, (repoCounts.get(repo) ?? 0) + 1);
  }

  return servers.map((server) => {
    const registryVerified = Boolean(server.signals.officialRegistryVerifiedAt);
    const responseRate = issueResponseRate(server.signals);
    const signals: HealthSignals = {
      ...server.signals,
      issueResponseDays: null,
      issueResponseRatePct: responseRate,
      inOfficialRegistry: registryVerified,
      hasRunnableEntry:
        Boolean(server.hasPublishedPackage) ||
        Boolean(server.npmPackage) ||
        Boolean(server.remoteEndpoints?.length),
    };
    const breakdown = computeBreakdown(signals);
    const lifecycle = computeLifecycle(signals);
    const repo = server.repoUrl?.toLowerCase();
    const readmeFacts =
      repo && repoCounts.get(repo)! > 1 ? undefined : server.readmeFacts;
    const taxonomy = classifyServerTaxonomy(server);

    return {
      ...server,
      categories: taxonomy.categories,
      primaryCategory: taxonomy.primaryCategory,
      topics: taxonomy.topics,
      categoryConfidence: taxonomy.categoryConfidence,
      needsCategoryReview: taxonomy.needsCategoryReview,
      signals,
      breakdown,
      trustScore: computeTrustScore(breakdown),
      lifecycle,
      verdict: computeVerdict(lifecycle, signals),
      verdictKey: lifecycle,
      verdictDays: lifecycle === "dying" ? signals.lastCommitDaysAgo : null,
      ...(readmeFacts ? { readmeFacts } : { readmeFacts: undefined }),
    };
  });
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
