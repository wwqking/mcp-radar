// 「best-of」榜单的数据层 —— 榜单由 data/servers.json 生成，不是手写排名。
//
// 为什么不手写：手写榜单会过期，而且没法回答「凭什么是这个顺序」。
// 用公开公式排序、把口径写在页面上，才是技能里说的「独家计算」——
// 也是这类页面唯一排得动的做法（竞品的 best-of 全是手写的，抄不走公式）。
//
// ⚠️ 排序不能只用 TrustScore。实测：marketing 类按 trust 直排，
// 前几名是 2 star 的新仓库（trust 73），而 meta-ads-mcp（1115★）排到第 11。
// 原因是 TrustScore 里维护活跃度占 30%，小而新的仓库天然拿满，
// 但「best MCP servers for X」这种查询，用户要的是**真有人在用**的。
// 所以先过采用度门槛，再按 trust 排——门槛负责可信度，trust 负责排序。

import type { MCPServer } from "./types";

export interface BestOfEntry {
  server: MCPServer;
  rank: number;
}

export interface BestOfList {
  entries: BestOfEntry[];
  /** 参与评选的池子大小（过门槛前），写在页面上说明取样范围。 */
  poolSize: number;
  /** 采用度门槛，写在页面上 */
  starsFloor: number;
}

interface BestOfOptions {
  starsFloor?: number;
  limit?: number;
  exclude?: string[];
  requireOfficialRegistry?: boolean;
  client?: string;
}

/** 同一个仓库可能在 registry 里有多条（不同发布者/命名空间）。
 *  榜单上出现两行同一个东西会直接毁掉可信度，所以按 repo 去重，保留 trust 高的那条。 */
function dedupeByRepo(servers: MCPServer[]): MCPServer[] {
  const byRepo = new Map<string, MCPServer>();
  const noRepo: MCPServer[] = [];
  for (const s of servers) {
    const key = s.repoUrl?.toLowerCase().replace(/\/+$/, "");
    if (!key) { noRepo.push(s); continue; }
    const kept = byRepo.get(key);
    if (!kept || (s.trustScore ?? 0) > (kept.trustScore ?? 0)) byRepo.set(key, s);
  }
  return [...Array.from(byRepo.values()), ...noRepo];
}

/**
 * 按分类挑「best」。
 *
 * @param categories 命中任一分类即入池
 * @param starsFloor 采用度门槛。低于这个数的不进榜——「best」榜上放
 *                   0 star 的项目，读者第一眼就知道这榜是凑的。
 *                   实测 50 太低：marketing 类会让 69★ 的新仓库压过
 *                   Stripe 和 Google Analytics，可信度直接崩。200 才像样。
 * @param exclude    slug 排除名单。分类器是按描述文本做关键词匹配的
 *                   （见 collector/classify.ts），必然有误判，而误判在
 *                   best-of 榜上格外刺眼。这里只做人工兜底，不改分类器——
 *                   改分类器影响全站分类，为一个榜单动它不划算。
 */
export function bestOf(
  servers: MCPServer[],
  categories: string[],
  {
    starsFloor = 50,
    limit = 12,
    exclude = [] as string[],
    requireOfficialRegistry = false,
    client,
  }: BestOfOptions = {},
): BestOfList {
  const cats = new Set(categories);
  const skip = new Set(exclude);
  const pool = servers.filter(
    (s) =>
      s.lifecycle === "active" &&
      (s.categories ?? []).some((c) => cats.has(c)) &&
      (!client || s.clientCompat?.some((compat) => compat.client === client)) &&
      // 跨品类的宽榜（"awesome mcp servers" 这类）必须要求 registry 验证过。
      // 否则会捞到 star 数挂错的条目：实测有一条 registry 记录把 repoUrl
      // 指向了 ChatGPTNextWeb/NextChat（88k★，跟它毫无关系），
      // 靠 star 排序时直接冲到榜首。窄品类榜池子小、人眼能扫完，不强制。
      (!requireOfficialRegistry || Boolean(s.signals?.inOfficialRegistry)),
  );
  const eligible = dedupeByRepo(pool)
    .filter((s) => !skip.has(s.slug))
    .filter((s) => (s.signals?.stars ?? 0) >= starsFloor)
    .sort((a, b) =>
      (b.trustScore ?? 0) - (a.trustScore ?? 0) ||
      (b.signals?.stars ?? 0) - (a.signals?.stars ?? 0),
    )
    .slice(0, limit);

  return {
    entries: eligible.map((server, i) => ({ server, rank: i + 1 })),
    poolSize: pool.length,
    starsFloor,
  };
}
