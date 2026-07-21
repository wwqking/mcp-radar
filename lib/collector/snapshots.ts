// 历史快照 —— 趋势/diff 的数据基础。
//
// 每次 live 采集写一份 data/snapshots/YYYY-MM-DD.json（slug → stars/downloads）。
// 与 .cache（gitignored 的 API 缓存）不同：快照要提交进 git，跨构建/跨 CI 持久，
// 这样才能算「这周涨了多少 stars」、画近 N 期趋势 sparkline。
//
// 只在构建期（Node 服务端）运行。

import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const SNAP_DIR = join(process.cwd(), "data", "snapshots");

/** 单个 server 在某一天的可量化指标 */
export interface SnapshotMetric {
  stars: number;
  downloads: number | null;
}

export interface Snapshot {
  date: string; // YYYY-MM-DD
  servers: Record<string, SnapshotMetric>; // slug → metric
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/** 列出所有快照日期（升序） */
async function listSnapshotDates(): Promise<string[]> {
  try {
    const files = await readdir(SNAP_DIR);
    return files
      .filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f))
      .map((f) => f.replace(/\.json$/, ""))
      .sort();
  } catch {
    return [];
  }
}

async function readSnapshot(date: string): Promise<Snapshot | null> {
  try {
    const raw = await readFile(join(SNAP_DIR, `${date}.json`), "utf8");
    return JSON.parse(raw) as Snapshot;
  } catch {
    return null;
  }
}

/** 读全部历史快照（升序），供趋势 sparkline 构造 */
export async function readAllSnapshots(): Promise<Snapshot[]> {
  const dates = await listSnapshotDates();
  const out: Snapshot[] = [];
  for (const d of dates) {
    const s = await readSnapshot(d);
    if (s) out.push(s);
  }
  return out;
}

/**
 * 取「上一份」快照：日期严格早于今天的最近一份。
 * 用于算周增量（今天 vs 最近一次旧记录）。
 */
export async function readPreviousSnapshot(): Promise<Snapshot | null> {
  const dates = await listSnapshotDates();
  const prev = dates.filter((d) => d < today()).pop();
  return prev ? readSnapshot(prev) : null;
}

/** 写入今天的快照（覆盖当天已有的）。 */
export async function writeSnapshot(servers: Record<string, SnapshotMetric>): Promise<void> {
  const snap: Snapshot = { date: today(), servers };
  try {
    await mkdir(SNAP_DIR, { recursive: true });
    await writeFile(join(SNAP_DIR, `${snap.date}.json`), JSON.stringify(snap, null, 0), "utf8");
  } catch (err) {
    console.warn(`[collector] 快照写入失败：${String(err)}`);
  }
}

/**
 * 按天数把「两次快照的增量」折算成周增量。
 * @param current 当前值
 * @param previous 上次值
 * @param daysApart 两次快照相隔天数
 */
export function toWeeklyDelta(current: number, previous: number, daysApart: number): number {
  if (daysApart <= 0) return 0;
  const perDay = (current - previous) / daysApart;
  return Math.round(perDay * 7);
}

/** 两个 YYYY-MM-DD 相隔天数 */
export function daysBetweenDates(a: string, b: string): number {
  return Math.round(Math.abs(new Date(a).getTime() - new Date(b).getTime()) / 86400000);
}
