// npm 富化 —— 周下载量 + 版本发布频率。无 key，公开 API。
// 端点：GET api.npmjs.org/downloads/point/last-week/{pkg}
//       GET registry.npmjs.org/{pkg} → time（版本时间线）

import { cachedGetJson } from "./cached-fetch";

export interface NpmAdoption {
  weeklyDownloads: number | null;
  releaseFrequencyPerMonth: number | null;
}

interface DownloadsResponse {
  downloads: number;
}

interface PackumentResponse {
  time?: Record<string, string>; // { "1.0.0": iso, "created": iso, "modified": iso }
}

/** 估算最近 6 个月的月均发版次数 */
function releaseFreq(time: Record<string, string> | undefined): number | null {
  if (!time) return null;
  const cutoff = Date.now() - 180 * 86400000;
  const versions = Object.entries(time).filter(([k]) => k !== "created" && k !== "modified");
  const recent = versions.filter(([, iso]) => new Date(iso).getTime() >= cutoff);
  if (versions.length === 0) return null;
  return Math.round((recent.length / 6) * 10) / 10; // 保留 1 位小数
}

export async function fetchNpmAdoption(pkg: string): Promise<NpmAdoption> {
  const dl = await cachedGetJson<DownloadsResponse>(
    `https://api.npmjs.org/downloads/point/last-week/${encodeURIComponent(pkg)}`,
  );
  const pack = await cachedGetJson<PackumentResponse>(
    `https://registry.npmjs.org/${encodeURIComponent(pkg)}`,
  );
  return {
    weeklyDownloads: dl.ok && dl.data ? dl.data.downloads : null,
    releaseFrequencyPerMonth: pack.ok ? releaseFreq(pack.data?.time) : null,
  };
}
