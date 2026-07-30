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
  packages?: Array<{
    registryType?: string;
    registry_name?: string;
    identifier?: string;
    name?: string;
    version?: string;
    /** stdio / streamable-http / sse。决定这个包能接哪些客户端。 */
    transport?: { type?: string };
  }>;
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

/** 托管端点（registry `remotes` 条目）：type 如 streamable-http / sse。 */
export interface RemoteEndpoint {
  type: string;
  url: string;
}

/** 可安装包 —— 客户端兼容性判定的原始证据。
 *
 *  为什么要保留而不是压成 hasPackage 布尔：判断「这个 server 能不能接
 *  Claude Desktop」需要知道 registryType（npm/pypi/oci 决定用 npx/uvx/docker）
 *  和 transport（stdio 才能本地起进程，streamable-http 走远程）。
 *  压成布尔之后这些全丢了，只能靠猜——而猜出来的兼容性声明正是不能上页的东西。 */
export interface InstallablePackage {
  /** npm / pypi / oci / nuget … */
  registryType: string;
  /** 包名，如 `@modelcontextprotocol/server-filesystem` */
  identifier: string;
  version: string | null;
  /** stdio / streamable-http / sse；registry 未声明时为 null（不猜） */
  transport: string | null;
}

/** registry 富化后的一条候选（钥匙 + 官方元信息） */
export interface RegistryCandidate {
  name: string;
  title: string;
  description: string;
  repoUrl: string | null;
  /** 首个 npm 包名（用于 npm 富化） */
  npmPackage: string | null;
  /** Registry manifest 是否提供任一可安装 package（不限于 npm）。 */
  hasPackage: boolean;
  /** 全部可安装包（含 registryType / transport），客户端兼容性判定的证据源。 */
  packages: InstallablePackage[];
  /** 纯 remotes 型（无仓库/无包）→ 无法审计 */
  remoteOnly: boolean;
  /** 托管端点：有这个就能不装包直接连（remote MCP server）。
   *  registry 里 82% 的条目带 remotes，其中过半同时有 repo——这批既能审计健康数据、
   *  又能远程直连，是 /remote-mcp-servers 页的主体。 */
  remoteEndpoints: RemoteEndpoint[];
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

/** 保留 registry 声明的安装包原样，缺字段留 null——不猜、不填默认值。
 *  identifier 缺失的条目直接丢：没有包名就装不了，留着只会污染兼容性判定。 */
function toInstallablePackages(s: RegistryServer): InstallablePackage[] {
  return (s.packages ?? []).flatMap((p) => {
    const identifier = p.identifier ?? p.name;
    const registryType = p.registryType ?? p.registry_name;
    if (!identifier || !registryType) return [];
    return [{
      registryType: registryType.toLowerCase(),
      identifier,
      version: p.version ?? null,
      transport: p.transport?.type?.toLowerCase() ?? null,
    }];
  });
}

function toCandidate(item: RegistryItem): RegistryCandidate {
  const s = item.server;
  const official = item._meta?.["io.modelcontextprotocol.registry/official"];
  const repoUrl = s.repository?.url ?? null;
  const npmPackage = pickNpmPackage(s);
  const packages = toInstallablePackages(s);
  const hasPackage = (s.packages?.length ?? 0) > 0;
  const remoteEndpoints = (s.remotes ?? [])
    .filter((r) => r.type && r.url)
    .map((r) => ({ type: r.type, url: r.url }));
  return {
    name: s.name,
    title: s.title || s.name,
    description: s.description ?? "",
    repoUrl,
    npmPackage,
    hasPackage,
    packages,
    remoteOnly: !repoUrl && !hasPackage,
    remoteEndpoints,
    status: official?.status ?? "unknown",
    publishedAt: official?.publishedAt ?? null,
    updatedAt: official?.updatedAt ?? null,
  };
}

/**
 * 拉 registry 的 latest server 清单。
 *
 * 不传 limit = 遍历完整游标分页。采集器会把 GitHub 富化预算单独控制，
 * 因此这里不能再把「每天愿意富化多少条」误当成「只看字母序前多少条」。
 *
 * @param limit 可选，仅用于本地 smoke test；生产采集不传，读取全量。
 * @param onlyWithRepo 是否只保留有仓库的（健康数据是独家卖点，无 repo 的先跳过）
 */
export async function fetchRegistryCandidates(opts: {
  limit?: number;
  onlyWithRepo?: boolean;
}): Promise<RegistryCandidate[]> {
  const { limit, onlyWithRepo = true } = opts;
  const maxCandidates = limit && limit > 0 ? limit : Number.POSITIVE_INFINITY;
  const out: RegistryCandidate[] = [];
  const seen = new Set<string>();
  const seenCursors = new Set<string>();
  let cursor: string | undefined;
  let pages = 0;
  // Registry 已超过 100 页；默认给足 50,000 个原始条目的空间，同时用 cursor 去重防死循环。
  const maxPages = Number(process.env.MCP_REGISTRY_MAX_PAGES ?? 500);

  while (out.length < maxCandidates && pages < maxPages) {
    pages++;
    const url = new URL("/v0.1/servers", REGISTRY_BASE);
    url.searchParams.set("limit", "100");
    url.searchParams.set("version", "latest");
    if (cursor) {
      if (seenCursors.has(cursor)) {
        console.warn(`[registry] 检测到重复 cursor，已在第 ${pages} 页停止，避免死循环`);
        break;
      }
      seenCursors.add(cursor);
      url.searchParams.set("cursor", cursor);
    }

    const res = await cachedGetJson<RegistryPage>(url.toString());
    if (!res.ok || !res.data) break;

    for (const item of res.data.servers) {
      const cand = toCandidate(item);
      // version=latest 理论上每个 name 只有一条；仍按 name 去重，防御预览 API 的异常重复。
      if (seen.has(cand.name)) continue;
      if (cand.status === "deleted") continue;
      if (onlyWithRepo && !cand.repoUrl) continue;
      seen.add(cand.name);
      out.push(cand);
      if (out.length >= maxCandidates) break;
    }

    cursor = res.data.metadata?.nextCursor;
    if (!cursor) break;
  }

  if (cursor && pages >= maxPages) {
    console.warn(
      `[registry] 达到分页安全上限 ${maxPages}，清单可能不完整；` +
        `可提高 MCP_REGISTRY_MAX_PAGES`,
    );
  }

  console.log(`[registry] latest 全量扫描 ${pages} 页 → ${out.length} 个带仓库候选`);
  return out;
}

/** 从 GitHub repo url 解析 owner/repo */
export function parseGithubRepo(url: string | null): { owner: string; repo: string } | null {
  if (!url) return null;
  const m = url.match(/github\.com[/:]([^/]+)\/([^/#?]+?)(?:\.git)?(?:[/#?].*)?$/i);
  if (!m) return null;
  return { owner: m[1], repo: m[2] };
}
