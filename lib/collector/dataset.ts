// 完整数据集读写 —— 采集产出的全量 server 数据（含 TrustScore/分类/信号/趋势）落盘。
//
// 目的：让 Vercel build 直接读这份 JSON（瞬时），不必在 build 里重新拓 registry+GitHub+npm。
// 采集在 CI（GitHub Actions）跑一次 → 写 data/servers.json 提交进 git → build 只读文件。
//
// 与 snapshots（只存 stars/downloads 时间序列）不同，这里存完整 MCPServer[]。

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { MCPServer } from "../types";

const DATA_DIR = join(process.cwd(), "data");
const DATASET_PATH = join(DATA_DIR, "servers.json");

export interface Dataset {
  /** 采集时间 ISO 日期 */
  collectedAt: string;
  servers: MCPServer[];
}

/** 写全量数据集（采集后调用）。 */
export async function writeDataset(servers: MCPServer[]): Promise<void> {
  const data: Dataset = {
    collectedAt: new Date().toISOString().slice(0, 10),
    servers,
  };
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(DATASET_PATH, JSON.stringify(data), "utf8");
}

/** 读全量数据集（build 时调用）。文件不存在返回 null（回退实时采集）。 */
export async function readDataset(): Promise<Dataset | null> {
  try {
    const raw = await readFile(DATASET_PATH, "utf8");
    return JSON.parse(raw) as Dataset;
  } catch {
    return null;
  }
}
