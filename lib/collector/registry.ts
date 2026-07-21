// 官方 MCP registry 客户端 —— "钥匙源"：拿 server 清单、repo url、包名、官方 status。
// 健康数据（stars/活跃度/下载）在下游 GitHub/npm 富化，registry 本身不给。
//
// 真实 API 结构（已验证 GET /v0/servers）：
//   { servers: [{ server: { name, description, title, repository?, packages?, remotes? }, _meta: {...} }],
//     metadata: { nextCursor?, count } }

import { cachedGetJson } from "./cached-fetch";

const REGISTRY_BASE = "https://registry.modelcontextprotocol.io";

export interface RegistryServer {
  name: string;
  title?: string;
  description?: string;
  version?: string;
  repository?: { url: string; source?: string };
  packages?: Array<{ registryType?: string; registry_name?: string; identifier?: string; name?: string; version?: string }>;
  remotes?: Array<{ type: string; url: string }>;
}

interface RegistryMeta {
  "io.modelcontextprotocol.registry/official"?: {
    status?: string;
    publishedAt?: string;
    updatedAt?: string;
    isLatest?: boolean;
  };
}

interface RegistryItem {
  server: RegistryServer;
  _meta?: RegistryMeta;
}

interface RegistryPage {
  servers: RegistryItem[];
  metadata?: { nextCursor?: string; count?: number };
}

/** registry 富化后的一条候选（钥匙 + 官方元信息） */
export interface RegistryCandidate {
  name: string;
  title: string;
  description: string;
  repoUrl: string | null;
  /** 首个 npm 包名（用于 npm 富化） */
  npmPackage: string | null;
  /** 纯 remotes 型（无仓库/无包）→ 无法审计 */
  remoteOnly: boolean;
  status: string;
  publishedAt: string | null;
  updatedAt: string | null;
}

function pickNpmPackage(s: RegistryServer): string | null {
  const pkgs = s.packages ?? [];
  const npm = pkgs.find(
    (p) => (p.registryType ?? p.registry_name)?.toLowerCase() === "npm",
  );
  if (!npm) return null;
  return npm.identifier ?? npm.name ?? null;
}

function toCandidate(item: RegistryItem): RegistryCandidate {
  const s = item.server;
  const official = item._meta?.["io.modelcontextprotocol.registry/official"];
  const repoUrl = s.repository?.url ?? null;
  const npmPackage = pickNpmPackage(s);
  const hasPackage = (s.packages?.length ?? 0) > 0;
  return {
    name: s.name,
    title: s.title || s.name,
    description: s.description ?? "",
    repoUrl,
    npmPackage,
    remoteOnly: !repoUrl && !hasPackage,
    status: official?.status ?? "unknown",
    publishedAt: official?.publishedAt ?? null,
    updatedAt: official?.updatedAt ?? null,
  };
}

/**
 * 拉 registry server 清单。
 * @param limit 最多返回多少条候选（"先采少量" → 传小值，控制下游 GitHub 调用量）
 * @param onlyWithRepo 是否只保留有 GitHub 仓库的（健康数据是独家卖点，无 repo 的先跳过）
 */
export async function fetchRegistryCandidates(opts: {
  limit: number;
  onlyWithRepo?: boolean;
}): Promise<RegistryCandidate[]> {
  const { limit, onlyWithRepo = true } = opts;
  const out: RegistryCandidate[] = [];
  const seen = new Set<string>();
  let cursor: string | undefined;
  let pages = 0;
  const MAX_PAGES = 40; // 安全上限，防止游标异常时死循环

  while (out.length < limit && pages < MAX_PAGES) {
    pages++;
    const url = new URL("/v0/servers", REGISTRY_BASE);
    url.searchParams.set("limit", "100");
    if (cursor) url.searchParams.set("cursor", cursor);

    const res = await cachedGetJson<RegistryPage>(url.toString());
    if (!res.ok || !res.data) break;

    for (const item of res.data.servers) {
      const cand = toCandidate(item);
      // 去重：registry 每个版本一条，只留最新遇到的第一条（isLatest 优先靠排序，这里按 name 去重）
      if (seen.has(cand.name)) continue;
      if (onlyWithRepo && !cand.repoUrl) continue;
      seen.add(cand.name);
      out.push(cand);
      if (out.length >= limit) break;
    }

    cursor = res.data.metadata?.nextCursor;
    if (!cursor) break;
  }

  return out;
}

/** 从 GitHub repo url 解析 owner/repo */
export function parseGithubRepo(url: string | null): { owner: string; repo: string } | null {
  if (!url) return null;
  const m = url.match(/github\.com[/:]([^/]+)\/([^/#?]+?)(?:\.git)?(?:[/#?].*)?$/i);
  if (!m) return null;
  return { owner: m[1], repo: m[2] };
}
