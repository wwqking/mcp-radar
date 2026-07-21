// 构建期带磁盘缓存的 fetch。
// 目的：GitHub API 限流（未认证 60/h，token 5000/h），健康数据一天变不了几次，
// 缓存到 .cache/ 让重复构建/调试不再重复打 API。
//
// 只在构建期（Node 服务端）用，不进浏览器 bundle。

import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const CACHE_DIR = join(process.cwd(), ".cache", "collector");

/** 缓存有效期（毫秒）：默认 12 小时，构建间复用 */
const TTL_MS = Number(process.env.MCP_CACHE_TTL_MS ?? 12 * 60 * 60 * 1000);

interface CacheEntry<T> {
  fetchedAt: number;
  status: number;
  data: T | null;
}

function keyFor(url: string): string {
  return createHash("sha1").update(url).digest("hex").slice(0, 16);
}

async function readCache<T>(url: string): Promise<CacheEntry<T> | null> {
  try {
    const raw = await readFile(join(CACHE_DIR, `${keyFor(url)}.json`), "utf8");
    const entry = JSON.parse(raw) as CacheEntry<T>;
    if (Date.now() - entry.fetchedAt > TTL_MS) return null;
    return entry;
  } catch {
    return null;
  }
}

async function writeCache<T>(url: string, entry: CacheEntry<T>): Promise<void> {
  try {
    await mkdir(CACHE_DIR, { recursive: true });
    await writeFile(join(CACHE_DIR, `${keyFor(url)}.json`), JSON.stringify(entry), "utf8");
  } catch {
    // 缓存写失败不影响主流程
  }
}

export interface FetchResult<T> {
  ok: boolean;
  status: number;
  data: T | null;
}

/**
 * 带缓存 + 重试的 JSON GET。
 * - 命中缓存直接返回
 * - 404/410 也缓存（避免反复打死链）
 * - 限流（403/429）不缓存，抛出让上层决定降级
 */
export async function cachedGetJson<T>(
  url: string,
  headers: Record<string, string> = {},
): Promise<FetchResult<T>> {
  const cached = await readCache<T>(url);
  if (cached) return { ok: cached.status >= 200 && cached.status < 300, status: cached.status, data: cached.data };

  let lastErr: unknown = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(url, { headers: { Accept: "application/json", ...headers } });
      if (res.status === 403 || res.status === 429) {
        // 限流：不缓存，短暂等待后重试一次
        lastErr = new Error(`rate limited: ${res.status}`);
        await new Promise((r) => setTimeout(r, 1500));
        continue;
      }
      const data = res.ok ? ((await res.json()) as T) : null;
      const entry: CacheEntry<T> = { fetchedAt: Date.now(), status: res.status, data };
      // 成功 或 明确的 not-found 才缓存
      if (res.ok || res.status === 404 || res.status === 410) await writeCache(url, entry);
      return { ok: res.ok, status: res.status, data };
    } catch (err) {
      lastErr = err;
      await new Promise((r) => setTimeout(r, 800));
    }
  }
  console.warn(`[collector] fetch 失败，降级为空：${url} (${String(lastErr)})`);
  return { ok: false, status: 0, data: null };
}
