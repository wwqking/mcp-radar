// 候选发现 —— 自动找「用户在搜、但库里没有」的 MCP server，过门槛后产出待审种子。
//
// 为什么需要：官方 registry 收不到主流 server（curated.ts 开头已说明），而白名单是手工维护的，
// 跟不上。实测 chrome-devtools-mcp（★47.6k、12,160/mo）就这么漏了几个月。每天重跑采集
// 解决不了——瓶颈是采集**源**不是频率。这个模块补的就是「源」。
//
// ⚠️ 三道门槛的由来（2026-07-26 实测，别删）：
//   ① 相关性：GitHub 搜索按 star 排序取第一个，误命中率 32%。`chatgpt`/`azure`/`langchain`
//      三个词全部命中 LibreChat(★41k)——星越高越容易错配。所以必须验仓库名与词对得上。
//   ② 是不是 server：搜 mcp 会捞到大量 awesome-list / 客户端 / 教程 / SDK。
//   ③ npm 归属：27 个同名包里 17 个指向别人的重实现（npm `fastmcp` 是 punkpeye 的 TS 版，
//      不是 PrefectHQ 的 Python 版）。填错 → TrustScore 用别人的下载数算。
// 三道机器门槛过完仍需人工看一眼，所以这个模块只产出**待审清单**，由 CI 开 PR，不自动合并。

import { cachedGetJson } from "./cached-fetch";
import { CURATED_SEEDS } from "./curated";
import { DISCOVERED_SEEDS } from "./discovered";

const GH = "https://api.github.com";

/** 机器发现的门槛比手工挑的更严：手工挑过的东西人已经看过，机器没有。 */
const MIN_STARS = Number(process.env.MCP_DISCOVER_MIN_STARS ?? 50);
/** 半年没动的不要——采进来也是 dying/dead，白占位。 */
const MAX_IDLE_DAYS = Number(process.env.MCP_DISCOVER_MAX_IDLE_DAYS ?? 180);

export interface Candidate {
  /** owner/repo */
  repo: string;
  name: string;
  description: string;
  stars: number;
  archived: boolean;
  pushedAt: string;
  idleDays: number;
  npmPackage: string | null;
  /** 来源：github = 趋势发现，keyword = 关键词研究待办清单 */
  source: "github" | "keyword";
  /** keyword 来源时带上搜索量，供 PR 里排序 */
  volume?: number;
}

export interface Rejection {
  repo: string;
  reason: string;
}

function ghHeaders(): Record<string, string> {
  const token = process.env.GITHUB_TOKEN;
  const h: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "mcp-radar-discover",
  };
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

interface SearchItem {
  full_name: string;
  name: string;
  description: string | null;
  stargazers_count: number;
  archived: boolean;
  pushed_at: string;
  fork: boolean;
}

function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function idleDays(pushedAt: string): number {
  return Math.max(0, Math.round((Date.now() - new Date(pushedAt).getTime()) / 86400000));
}

// ---------- 门槛 ② 是不是一个 MCP server ----------

/** 明确不是 server 的东西：清单站 / 客户端 / 教程 / 框架脚手架。 */
const NOT_A_SERVER = [
  /\bawesome\b/, /\bcourse\b/, /\btutorial\b/, /\bexamples?\b/, /\bdemo\b/,
  /\bboilerplate\b/, /\btemplate\b/, /\bstarter\b/, /\bcookbook\b/,
  /\bspec(ification)?\b/, /\bdocs?\b/, /\bhandbook\b/, /\bworkshop\b/,
  /\bguide\b/, /\bbest[- ]practices\b/, /\bcheat ?sheet\b/, /\bfor[- ]beginners\b/,
  /\bclient\b/, /\bproxy\b/, /\bgateway\b/, /\binspector\b/, /\bregistry\b/,
  /\bcollection\b/, /\bdirectory\b/, /\bskills?\b/,
  // 「帮你跑/建 server 的东西」不是 server 本身。这类每周都会冒出来，
  // 不在机器这层挡掉就得人工重复筛（首跑漏进来的：fastmcp 框架、mcphub、mcp-router、mcpvault）
  /\bframework\b/, /\brouter\b/, /\bhub\b/, /\bvault\b/, /\bmanager\b/,
  /\blauncher\b/, /\binstaller\b/, /\bbundler?\b/, /\bwrapper\b/, /\baggregator\b/,
  /\bbuild(ing|er)?\s+(your\s+own\s+)?mcp\b/, /\bfor\s+building\b/,
];

/**
 * 看起来确实是个 MCP server。
 *
 * ⚠️ 关键一条：**仓库名本身**要带 mcp，光看 description 远远不够。
 * 2026-07-26 首跑实测：搜 `mcp server in:name,description` 会把任何「描述里顺带提一句
 * 支持 MCP」的东西捞进来——private-gpt(★57k)、activepieces、webiny-js(CMS)、jscpd(查重工具)、
 * prest(Postgres REST)、claude-code-ultimate-guide(教程) 全部混进了首批 25 个候选。
 * 它们都不是 server，只是提到了 server。加上"名字得带 mcp"这一条后噪音基本清干净。
 *
 * 代价是会漏掉名字不带 mcp 的真 server（如 oraios/serena）——这是刻意的取舍：
 * 机器发现宁可保守，漏掉的走 curated.ts 手工加。误收的代价（空壳页拖累整站）远大于漏收。
 */
export function looksLikeServer(item: { name: string; description: string | null }): string | null {
  const name = item.name.toLowerCase();
  const hay = `${name} ${item.description ?? ""}`.toLowerCase();

  if (!/mcp/.test(name)) return "仓库名不带 mcp（多半只是描述里顺带提到）";
  for (const re of NOT_A_SERVER) {
    if (re.test(hay)) return `像是 ${re.source.replace(/\\b/g, "").replace(/\\/g, "")} 而不是 server`;
  }
  const isServer = /\bservers?\b/.test(hay) || /\btools?\b/.test(hay) || /\bconnector\b/.test(hay);
  if (!isServer) return "没有 server/tool 语义";
  return null;
}

// ---------- 门槛 ① 相关性（仅关键词来源需要）----------

/**
 * 关键词来源要验「这个仓库真的是这个工具的 server」。
 * 判据：仓库全名（去非字母数字）里出现关键词的主 token。
 * 实测这一道砍掉 32% 的误命中——没有它，LibreChat 会同时冒充 chatgpt/azure/langchain。
 */
export function repoMatchesKeyword(keyword: string, repoFullName: string): boolean {
  const head = keyword.split(/\s+/)[0] ?? "";
  const key = normalize(head);
  if (key.length < 3) return false;
  return normalize(repoFullName).includes(key);
}

// ---------- 门槛 ③ npm 包归属 ----------

interface NpmDoc {
  repository?: { url?: string } | string;
}

/**
 * 只有 npm 元数据的 repository 指回同一个仓库，才认这个包。
 * 否则返回 null —— 采集器会退回纯 GitHub 信号打分，比填错包安全得多。
 */
export async function resolveNpmPackage(repo: string, candidates: string[]): Promise<string | null> {
  for (const pkg of candidates) {
    const res = await cachedGetJson<NpmDoc>(`https://registry.npmjs.org/${encodeURIComponent(pkg).replace(/%40/g, "@").replace(/%2F/g, "/")}`);
    if (!res.ok || !res.data) continue;
    const r = res.data.repository;
    const url = typeof r === "string" ? r : r?.url;
    if (!url) continue;
    const m = url.match(/github\.com[/:]([^/]+)\/([^/#?.]+)/i);
    if (m && `${m[1]}/${m[2]}`.toLowerCase() === repo.toLowerCase()) return pkg;
  }
  return null;
}

function npmGuesses(repo: string): string[] {
  const [owner, name] = repo.split("/");
  return Array.from(
    new Set([name, name.toLowerCase(), name.replace(/_/g, "-"), `@${owner.toLowerCase()}/${name.toLowerCase()}`]),
  );
}

/** GitHub search API 限流是 30 次/分钟（认证后），比普通 REST 严得多——必须节流。
 *  首跑没节流，60 个关键词里有 12 个直接吃 403 掉了。 */
const SEARCH_DELAY_MS = Number(process.env.MCP_DISCOVER_SEARCH_DELAY_MS ?? 2200);
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ---------- 已有清单 ----------

/** 库里已有的 + 两份种子文件里已有的 repo（小写 owner/repo）。 */
export function knownRepos(existingRepoUrls: Array<string | null>): Set<string> {
  const set = new Set<string>();
  const add = (url: string | null | undefined) => {
    if (!url) return;
    const m = url.match(/github\.com[/:]([^/]+)\/([^/#?.]+)/i);
    if (m) set.add(`${m[1]}/${m[2]}`.toLowerCase());
  };
  for (const u of existingRepoUrls) add(u);
  for (const s of CURATED_SEEDS) add(s.repoUrl);
  for (const s of DISCOVERED_SEEDS) add(s.repoUrl);
  return set;
}

// ---------- 发现：GitHub 趋势 ----------

/** 搜 GitHub 上高星、活跃、看起来是 MCP server 的仓库。 */
export async function discoverFromGithub(
  known: Set<string>,
  opts: { pages?: number } = {},
): Promise<{ found: Candidate[]; rejected: Rejection[] }> {
  const pages = opts.pages ?? 3;
  const found: Candidate[] = [];
  const rejected: Rejection[] = [];
  const seen = new Set<string>();

  for (let page = 1; page <= pages; page++) {
    const q = encodeURIComponent(`mcp server in:name,description stars:>=${MIN_STARS}`);
    const url = `${GH}/search/repositories?q=${q}&sort=stars&order=desc&per_page=100&page=${page}`;
    const res = await cachedGetJson<{ items: SearchItem[] }>(url, ghHeaders());
    await sleep(SEARCH_DELAY_MS);
    if (!res.ok || !res.data?.items?.length) break;

    for (const item of res.data.items) {
      const repo = item.full_name.toLowerCase();
      if (seen.has(repo)) continue;
      seen.add(repo);
      if (known.has(repo)) continue; // 已在库里/清单里，不重复提
      if (item.fork) { rejected.push({ repo: item.full_name, reason: "是 fork" }); continue; }
      if (item.archived) { rejected.push({ repo: item.full_name, reason: "已归档" }); continue; }

      const notServer = looksLikeServer(item);
      if (notServer) { rejected.push({ repo: item.full_name, reason: notServer }); continue; }

      const idle = idleDays(item.pushed_at);
      if (idle > MAX_IDLE_DAYS) {
        rejected.push({ repo: item.full_name, reason: `${idle} 天没提交（阈值 ${MAX_IDLE_DAYS}）` });
        continue;
      }

      found.push({
        repo: item.full_name,
        name: item.name,
        description: item.description ?? "",
        stars: item.stargazers_count,
        archived: item.archived,
        pushedAt: item.pushed_at,
        idleDays: idle,
        npmPackage: null, // 稍后统一解析
        source: "github",
      });
    }
  }
  return { found, rejected };
}

// ---------- 发现：关键词待办清单 ----------

export interface KeywordTarget {
  keyword: string;
  volume: number;
}

/**
 * 拿关键词研究产出的待采集清单，逐个 GitHub 搜索 + 相关性验证。
 * 这是「用户在搜但我们没有」的直接证据，比趋势发现更贴需求。
 */
export async function discoverFromKeywords(
  targets: KeywordTarget[],
  known: Set<string>,
): Promise<{ found: Candidate[]; rejected: Rejection[] }> {
  const found: Candidate[] = [];
  const rejected: Rejection[] = [];

  for (const t of targets) {
    const q = encodeURIComponent(`${t.keyword} mcp in:name,description`);
    const url = `${GH}/search/repositories?q=${q}&sort=stars&order=desc&per_page=3`;
    const res = await cachedGetJson<{ items: SearchItem[] }>(url, ghHeaders());
    await sleep(SEARCH_DELAY_MS);
    if (!res.ok || !res.data?.items?.length) {
      rejected.push({ repo: t.keyword, reason: "GitHub 上搜不到仓库" });
      continue;
    }

    // 门槛 ①：在前 3 个结果里找仓库名与关键词对得上的，而不是无脑取第一个
    const match = res.data.items.find((i) => repoMatchesKeyword(t.keyword, i.full_name));
    if (!match) {
      rejected.push({
        repo: t.keyword,
        reason: `搜索误命中（首位是 ${res.data.items[0].full_name}，与词无关）`,
      });
      continue;
    }
    const repo = match.full_name.toLowerCase();
    if (known.has(repo)) continue;
    if (match.archived) { rejected.push({ repo: match.full_name, reason: "已归档" }); continue; }
    if (match.stargazers_count < MIN_STARS) {
      rejected.push({ repo: match.full_name, reason: `★${match.stargazers_count} < ${MIN_STARS}` });
      continue;
    }
    const notServer = looksLikeServer(match);
    if (notServer) { rejected.push({ repo: match.full_name, reason: notServer }); continue; }
    const idle = idleDays(match.pushed_at);
    if (idle > MAX_IDLE_DAYS) {
      rejected.push({ repo: match.full_name, reason: `${idle} 天没提交` });
      continue;
    }

    found.push({
      repo: match.full_name,
      name: match.name,
      description: match.description ?? "",
      stars: match.stargazers_count,
      archived: match.archived,
      pushedAt: match.pushed_at,
      idleDays: idle,
      npmPackage: null,
      source: "keyword",
      volume: t.volume,
    });
    known.add(repo); // 同一批里多个词命中同一个 repo 只提一次
  }
  return { found, rejected };
}

/** 给候选补 npm 包名（过门槛 ③ 才填）。 */
export async function attachNpmPackages(cands: Candidate[]): Promise<void> {
  for (const c of cands) {
    c.npmPackage = await resolveNpmPackage(c.repo, npmGuesses(c.repo));
  }
}
