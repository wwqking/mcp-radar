// 目录持久状态 —— 记录每个 server 最近一次在来源中出现的时间。
//
// Registry 是外部预览服务，分页/数据可能短暂抖动。不能因为某天抓取没看到一条，
// 就立刻把已经上线的详情页删掉；连续缺失若干次后再移除，避免 URL 和总数来回跳。

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

export type CatalogSource = "curated" | "discovered" | "registry";

export interface CatalogStateEntry {
  source: CatalogSource;
  lastSeenAt: string;
  missingRuns: number;
  /** 新候选最近一次进入深度富化队列的日期；失败项据此排到未尝试项之后。 */
  lastEnrichmentAttemptAt?: string;
  enrichmentAttempts?: number;
}

export interface CatalogState {
  updatedAt: string;
  entries: Record<string, CatalogStateEntry>;
}

const DATA_DIR = join(process.cwd(), "data");
const STATE_PATH = join(DATA_DIR, "catalog-state.json");

export async function readCatalogState(): Promise<CatalogState> {
  try {
    return JSON.parse(await readFile(STATE_PATH, "utf8")) as CatalogState;
  } catch {
    return { updatedAt: "", entries: {} };
  }
}

export async function writeCatalogState(state: CatalogState): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(STATE_PATH, JSON.stringify(state, null, 2), "utf8");
}

/**
 * 推进一次来源状态。
 *
 * - 当前完整来源中能看到：missingRuns 清零。
 * - 旧数据里有、当前来源里没有：missingRuns +1。
 * - 达到 graceRuns 前继续保留；达到后才允许从公开数据集移除。
 */
export function advanceCatalogState(
  previous: CatalogState,
  currentSources: Map<string, CatalogSource>,
  previousSlugs: string[],
  today: string,
  graceRuns: number,
): {
  state: CatalogState;
  retainMissingSlugs: Set<string>;
  removeMissingSlugs: Set<string>;
} {
  const entries: Record<string, CatalogStateEntry> = { ...previous.entries };
  const retainMissingSlugs = new Set<string>();
  const removeMissingSlugs = new Set<string>();

  for (const [slug, source] of Array.from(currentSources.entries())) {
    const old = entries[slug];
    // 稳定存在的 1.5 万条不要每天全量改日期，否则 catalog-state 会制造巨型 git diff。
    // 只在首次出现、来源变化或从缺失恢复时写新日期。
    if (old && old.source === source && old.missingRuns === 0) continue;
    entries[slug] = { source, lastSeenAt: today, missingRuns: 0 };
  }

  for (const slug of previousSlugs) {
    if (currentSources.has(slug)) continue;
    const old = entries[slug];
    const missingRuns = (old?.missingRuns ?? 0) + 1;
    entries[slug] = {
      source: old?.source ?? "registry",
      lastSeenAt: old?.lastSeenAt ?? today,
      missingRuns,
    };
    if (missingRuns < graceRuns) retainMissingSlugs.add(slug);
    else removeMissingSlugs.add(slug);
  }

  return {
    state: { updatedAt: today, entries },
    retainMissingSlugs,
    removeMissingSlugs,
  };
}
