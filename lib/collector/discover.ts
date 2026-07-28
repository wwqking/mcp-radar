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
  /** keyword 来源时带上是哪份清单（人工缺口 / 竞品采词），审 PR 时判断可信度 */
  backlog?: string;
  /** 是 GitHub 搜不到、靠 registry 兜底解析出来的。这类跳过了「仓库名必须带 mcp」，审 PR 时多看一眼 */
  viaRegistry?: boolean;
  /** registry 条目自报的 npm 包名。只当**候选**用，仍要过门槛 ③ 反查 repository */
  npmHint?: string | null;
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
export function looksLikeServer(
  item: { name: string; description: string | null },
  opts: { trusted?: boolean } = {},
): string | null {
  const name = item.name.toLowerCase();
  const hay = `${name} ${item.description ?? ""}`.toLowerCase();

  // 黑名单任何来源都要过 —— registry 里同样有人把清单站/客户端/网关当 server 发布。
  for (const re of NOT_A_SERVER) {
    if (re.test(hay)) return `像是 ${re.source.replace(/\\b/g, "").replace(/\\/g, "")} 而不是 server`;
  }
  // 下面两条是「从名字和描述**猜**是不是 server」，只对 GitHub 搜索这种没人背书的来源用。
  // registry 条目是发布者主动提交的官方声明，再猜一遍只会误杀厂商 monorepo
  // （stripe/agent-toolkit 名字既不带 mcp、描述也没有 server 字样，但它确实是官方 server）。
  if (opts.trusted) return null;
  if (!/mcp/.test(name)) return "仓库名不带 mcp（多半只是描述里顺带提到）";
  const isServer = /\bservers?\b/.test(hay) || /\btools?\b/.test(hay) || /\bconnector\b/.test(hay);
  if (!isServer) return "没有 server/tool 语义";
  return null;
}

// ---------- 门槛 ① 相关性（仅关键词来源需要）----------

/** 词干容错的下限。往下调会退化成 chat / lang 这种通用词根——
 *  那正是 gate ① 当初要挡的 LibreChat 型误命中（`chatgpt` 砍到 `chat` 就会命中 LibreChat）。 */
const MIN_STEM = 6;

/**
 * 关键词来源要验「这个仓库真的是这个工具的 server」。
 * 判据：仓库全名（去非字母数字）里出现关键词的主 token，或它的词干。
 * 实测这一道砍掉 32% 的误命中——没有它，LibreChat 会同时冒充 chatgpt/azure/langchain。
 *
 * ⚠️ 词干容错是 2026-07-27 补的：只做全词包含会漏掉「仓库用简称、关键词用全称」的一大类——
 * `postgresql` 匹配不上 `crystaldba/postgres-mcp`（而这正是我们 postgres 落地页指向的 server），
 * `nextjs`/`monday.com` 同理。做法是从长到短试关键词的前缀，命中即算匹配，但**前缀不短于 6 位**。
 */
export function repoMatchesKeyword(keyword: string, repoFullName: string): boolean {
  const head = keyword.split(/\s+/)[0] ?? "";
  const key = normalize(head);
  if (key.length < 3) return false;
  const repo = normalize(repoFullName);
  if (repo.includes(key)) return true;
  for (let len = key.length - 1; len >= MIN_STEM; len--) {
    if (repo.includes(key.slice(0, len))) return true;
  }
  return false;
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

/** 关键词搜索取前几条。
 *  ⚠️ 原来是 3，太窄：`shadcnui` 的真身 `Jpisnice/shadcn-ui-mcp-server` 排不进前 3，
 *  被一个 ★0 的同名仓库顶掉后判星数不足直接丢了。改 per_page 不增加请求数，只是同一次搜索多要几条。 */
const SEARCH_PER_PAGE = Number(process.env.MCP_DISCOVER_SEARCH_PER_PAGE ?? 10);

// ---------- 兜底解析：官方 registry ----------

const REGISTRY = "https://registry.modelcontextprotocol.io";

interface RegistrySearchPage {
  servers: Array<{
    server: {
      name: string;
      repository?: { url?: string };
      packages?: Array<{ registryType?: string; registry_name?: string; identifier?: string; name?: string }>;
    };
  }>;
}

/**
 * GitHub 关键词搜索找不到时，问官方 registry。
 *
 * 为什么需要这一路：厂商自己发布的 server 常住 monorepo，仓库名既不带工具名也不带 mcp
 * （`stripe/agent-toolkit`），GitHub 的名字/描述搜索天然够不着，但 registry 里有条目——
 * 那是发布者主动提交的，比搜索结果可信。registry 的 `search=` + `version=latest` 都实测可用。
 */
export async function resolveFromRegistry(
  keyword: string,
): Promise<{ repo: string; npmPackage: string | null } | null> {
  const url = `${REGISTRY}/v0/servers?search=${encodeURIComponent(keyword)}&version=latest&limit=20`;
  const res = await cachedGetJson<RegistrySearchPage>(url);
  if (!res.ok || !res.data?.servers?.length) return null;

  for (const item of res.data.servers) {
    const repoUrl = item.server?.repository?.url;
    if (!repoUrl) continue; // 纯 remote 条目拿不到健康数据，跟第一轮定的规则冲突
    const m = repoUrl.match(/github\.com[/:]([^/]+)\/([^/#?.]+)/i);
    if (!m) continue;
    const full = `${m[1]}/${m[2]}`;
    // 门槛 ① 照旧：registry 的 search 也会返回一堆沾边的
    if (!repoMatchesKeyword(keyword, full)) continue;
    const npm = (item.server.packages ?? []).find(
      (p) => (p.registryType ?? p.registry_name)?.toLowerCase() === "npm",
    );
    return { repo: full, npmPackage: npm?.identifier ?? npm?.name ?? null };
  }
  return null;
}

/** 把一个已知的 owner/repo 拉成跟搜索结果同构的对象，好走同一套门槛。
 *  用的是普通 REST（5000/h），不吃 search 那个 30/min 的限流，不用节流。 */
async function fetchRepoAsSearchItem(repoFullName: string): Promise<SearchItem | null> {
  const res = await cachedGetJson<SearchItem>(`${GH}/repos/${repoFullName}`, ghHeaders());
  if (!res.ok || !res.data?.full_name) return null;
  return res.data;
}

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
): Promise<{ found: Candidate[]; rejected: Rejection[]; alreadyKnown: number }> {
  const pages = opts.pages ?? 3;
  const found: Candidate[] = [];
  const rejected: Rejection[] = [];
  const seen = new Set<string>();
  let alreadyKnown = 0;

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
      if (known.has(repo)) { alreadyKnown++; continue; } // 已在库里/清单里，不重复提
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
  return { found, rejected, alreadyKnown };
}

// ---------- 发现：关键词待办清单 ----------

export interface KeywordTarget {
  keyword: string;
  volume: number;
  /** 来自哪份待办清单，透传到候选上供报告分组 */
  backlog?: string;
}

/**
 * 拿关键词研究产出的待采集清单，逐个 GitHub 搜索 + 相关性验证。
 * 这是「用户在搜但我们没有」的直接证据，比趋势发现更贴需求。
 */
export async function discoverFromKeywords(
  targets: KeywordTarget[],
  known: Set<string>,
): Promise<{ found: Candidate[]; rejected: Rejection[]; alreadyKnown: number }> {
  const found: Candidate[] = [];
  const rejected: Rejection[] = [];
  /** 搜到了但库里已经有 —— 既不是命中也不是挡掉。必须单独计数：
   *  2026-07-26 首跑 60 个词只出 1 个候选，看着像门槛太严，实际是前 60 个词
   *  刚被人工采进白名单，搜到的 repo 全在库里。这个数不报出来就会误判成门槛问题。 */
  let alreadyKnown = 0;

  for (const t of targets) {
    const q = encodeURIComponent(`${t.keyword} mcp in:name,description`);
    const url = `${GH}/search/repositories?q=${q}&sort=stars&order=desc&per_page=${SEARCH_PER_PAGE}`;
    const res = await cachedGetJson<{ items: SearchItem[] }>(url, ghHeaders());
    await sleep(SEARCH_DELAY_MS);
    const items = res.ok ? (res.data?.items ?? []) : [];

    // 门槛 ①：在结果里找仓库名与关键词对得上的，而不是无脑取第一个。
    // items 按 star 降序，find 命中的自然是最高星的那个匹配项。
    let match = items.find((i) => repoMatchesKeyword(t.keyword, i.full_name)) ?? null;

    // GitHub 搜不到、或搜出来全是误命中 → 兜底问官方 registry
    let npmHint: string | null = null;
    let trusted = false;
    if (!match) {
      const hit = await resolveFromRegistry(t.keyword);
      if (hit) {
        match = await fetchRepoAsSearchItem(hit.repo);
        if (match) {
          npmHint = hit.npmPackage;
          trusted = true;
        }
      }
    }

    if (!match) {
      rejected.push({
        repo: t.keyword,
        reason: items.length
          ? `搜索误命中（首位是 ${items[0].full_name}，与词无关），registry 里也没有`
          : "GitHub 和 registry 都搜不到仓库",
      });
      continue;
    }

    const repo = match.full_name.toLowerCase();
    if (known.has(repo)) { alreadyKnown++; continue; }
    if (match.archived) { rejected.push({ repo: match.full_name, reason: "已归档" }); continue; }
    if (match.stargazers_count < MIN_STARS) {
      rejected.push({ repo: match.full_name, reason: `★${match.stargazers_count} < ${MIN_STARS}` });
      continue;
    }
    const notServer = looksLikeServer(match, { trusted });
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
      backlog: t.backlog,
      viaRegistry: trusted,
      npmHint,
    });
    known.add(repo); // 同一批里多个词命中同一个 repo 只提一次
  }
  return { found, rejected, alreadyKnown };
}

/** 给候选补 npm 包名（过门槛 ③ 才填）。
 *  registry 自报的包名当**第一个猜测**，但不豁免门槛 ③——registry 条目也有填错 repository 的。 */
export async function attachNpmPackages(cands: Candidate[]): Promise<void> {
  for (const c of cands) {
    const guesses = c.npmHint ? [c.npmHint, ...npmGuesses(c.repo)] : npmGuesses(c.repo);
    c.npmPackage = await resolveNpmPackage(c.repo, guesses);
  }
}
