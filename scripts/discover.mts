// 候选发现脚本 —— 找「用户在搜、但库里没有」的 MCP server，过门槛后写 discovered.ts + 报告。
//
// 用法：npm run discover
// CI 每周跑一次，把结果开成 PR 让人过目（见 .github/workflows/discover-candidates.yml）。
// **不自动合并**：三道机器门槛过完仍会漏（实测 huggingface/mcp-course 是课程不是 server、
// open-multi-agent-canvas 是 canvas 撞了 canva），最后一道必须是人。

import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import {
  discoverFromGithub,
  discoverFromKeywords,
  attachNpmPackages,
  knownRepos,
  type Candidate,
  type Rejection,
  type KeywordTarget,
} from "../lib/collector/discover";
import { readDataset } from "../lib/collector/dataset";

const ROOT = process.cwd();
const SEEDS_FILE = join(ROOT, "lib", "collector", "discovered.ts");
const REPORT_FILE = join(ROOT, "data", "discover-report.md");
/** 验过的关键词记在这里，下次跳过 —— 否则每周都在重验同样的 top 60，
 *  621 个待办清单永远推进不到第 61 个（首次实测就是这个症状：关键词来源 0 命中）。 */
const STATE_FILE = join(ROOT, "data", "discover-state.json");
/**
 * 关键词待办清单，**按优先级分层**：先烧人工标注过「库里缺 server」的，再烧竞品采词的长尾。
 *
 * 为什么分层而不是按搜索量混排 —— 2026-07-26 首跑的教训：
 * 当时只读 collect-priority.csv（竞品 organic 导出），按量取前 60 个词，结果这 60 个里
 * 近一半（chrome-devtools / blender / serena / clickup / postman / splunk / databricks /
 * excalidraw / todoist / zendesk / godot / zerodha …）刚被人工采进白名单，搜到的 repo
 * 全被 `known.has(repo)` 跳过，等于拿 60 次 search 配额验了一遍已经有的东西，只捞到 1 个新的。
 * 第二轮那 160 个工具是人逐个确认过「库里确实没有」的，命中率天然高于竞品长尾——先烧这批。
 */
const KEYWORD_BACKLOGS: Array<{ file: string; label: string; keyCol: number; volCol: number }> = [
  {
    // tool,keyword,volume,kd,intent,cpc,note —— note 全是「库里缺server,先采集」
    file: join(ROOT, "research", "mcpradars", "seo-mcp-server", "2-collect-targets.csv"),
    label: "人工缺口清单",
    keyCol: 0,
    volCol: 2,
  },
  {
    // tool_candidate,merged_volume,kw_count,sample_keywords（第三轮竞品采词，见 seo-r3/README.md）
    file: join(ROOT, "research", "mcpradars", "seo-r3", "collect-priority.csv"),
    label: "竞品采词",
    keyCol: 0,
    volCol: 1,
  },
];
/** 每次最多提多少个 —— PR 太大没人看得动。 */
const MAX_PER_RUN = Number(process.env.MCP_DISCOVER_MAX ?? 25);
/**
 * 趋势来源单次配额。关键词来源不受这个限制。
 *
 * 为什么要卡：趋势来源产量远高于关键词来源（实测 54 : 0），不卡的话每期 PR 都被
 * 「GitHub 上星高但没人搜」的东西填满——那就退回成「为了增加而增加」，
 * 跟"只收有人要的 server"的定位相反。宁可某期 PR 只有 10 个。
 */
const TREND_QUOTA = Number(process.env.MCP_DISCOVER_TREND_MAX ?? 10);
/** 关键词清单每次验多少个（GitHub search 有 30/min 限流）。 */
const KEYWORD_BATCH = Number(process.env.MCP_DISCOVER_KEYWORD_BATCH ?? 60);

/** 跨品类噪音 —— 竞品 organic 导出带进来的，不是我们的品类。 */
const NOISE = [
  "joint", "pain", "thumb", "elisa", "antibody", "coronado", "taphouse", "grill", "skyward",
  "nurse", "real estate", "digimon", "robot", "imsg", "texting", "battery", "drip",
  "medical", "clinic", "hospital", "therapy", "arthritis", "surgery",
];
/** 泛词 —— 不是产品名，搜出来必然误命中。 */
const GENERIC = new Set([
  "next", "awesome", "browser", "ui", "library", "context", "documentation", "apps", "gateway",
  "inspector", "server", "tools", "tool", "registry", "proxy", "directory", "marketplace",
  "store", "hub", "platform", "service", "framework", "sdk", "cli", "desktop", "web", "search",
  "data", "news", "agent", "agents", "skills", "skill", "memory", "prompt", "prompts",
  "resource", "resources", "protocol", "spec", "connector", "connectors", "integration",
  "integrations", "list", "guide", "docs", "doc", "test", "demo", "anthropic",
  // 人工缺口清单里的泛词：这批 tool 列是从关键词里切出来的，切出了动词/介词/品类名
  // （"add mcp server to cursor" → add、"mcp server for google analytics" → for）。
  // 拿它们去 GitHub 搜必然误命中，先挡掉省配额。
  "add", "creating", "create", "free", "local", "simple", "for", "file", "time", "word",
  "business", "email", "weather", "rag", "trigger", "roo", "mac", "uvx",
]);

/** 引号感知的 CSV 切列 —— 人工缺口清单的 note 列是 `"库里缺server,先采集"`，
 *  裸 split(",") 会把它切成两列，往后加列就会串位。 */
function splitCsv(line: string): string[] {
  const cols: string[] = [];
  let cur = "";
  let quoted = false;
  for (const ch of line) {
    if (ch === '"') quoted = !quoted;
    else if (ch === "," && !quoted) { cols.push(cur); cur = ""; }
    else cur += ch;
  }
  cols.push(cur);
  return cols;
}

/** 合并各层清单：层内按搜索量降序，层间保持 KEYWORD_BACKLOGS 的顺序（高优先级整层烧完再动下一层）。
 *  跨层同名词只留优先级高的那份。 */
async function loadKeywordBacklog(): Promise<KeywordTarget[]> {
  const out: KeywordTarget[] = [];
  const seen = new Set<string>();

  for (const src of KEYWORD_BACKLOGS) {
    let raw: string;
    try {
      raw = await readFile(src.file, "utf8");
    } catch {
      console.warn(`[discover] 没找到关键词清单 ${src.file}，跳过这一层`);
      continue;
    }
    const tier: KeywordTarget[] = [];
    for (const line of raw.split("\n").slice(1).filter(Boolean)) {
      const cols = splitCsv(line);
      const keyword = (cols[src.keyCol] ?? "").trim().toLowerCase();
      if (!keyword || keyword.length < 3) continue;
      if (GENERIC.has(keyword)) continue;
      if (NOISE.some((n) => keyword.includes(n))) continue;
      if (/^[\d.\s]+$/.test(keyword)) continue;
      if (seen.has(keyword)) continue;
      seen.add(keyword);
      tier.push({ keyword, volume: Number(cols[src.volCol]) || 0, backlog: src.label });
    }
    tier.sort((a, b) => b.volume - a.volume);
    out.push(...tier);
    console.log(`[discover] 清单「${src.label}」→ ${tier.length} 个词`);
  }
  return out;
}

/** 把本期候选追加到数组尾部；旧种子和旧注释原样保留，目录才能单调积累。 */
function appendSeedsFileContent(current: string, cands: Candidate[]): string {
  const rows = cands
    .map((c) => {
      const npm = c.npmPackage ? JSON.stringify(c.npmPackage) : "null";
      const why =
        c.source === "keyword"
          ? `${c.volume}/mo 有人搜`
          : `GitHub 趋势`;
      return `  { name: ${JSON.stringify(c.name)}, repoUrl: "https://github.com/${c.repo}", npmPackage: ${npm} }, // ★${c.stars} · ${why}`;
    })
    .join("\n");
  if (!rows) return current;
  const marker = "\n];";
  const at = current.lastIndexOf(marker);
  if (at < 0) throw new Error(`discovered.ts 缺少数组结束标记 ${marker}`);
  const block = `\n  // 自动追加：${new Date().toISOString().slice(0, 10)}\n${rows}`;
  return `${current.slice(0, at)}${block}${current.slice(at)}`;
}

function report(found: Candidate[], rejected: Rejection[], stats: Record<string, number>): string {
  const byKeyword = found.filter((c) => c.source === "keyword");
  const byGithub = found.filter((c) => c.source === "github");
  const lines: string[] = [];

  lines.push(`# 候选发现报告 · ${new Date().toISOString().slice(0, 10)}`);
  lines.push("");
  lines.push(
    `扫了 ${stats.scanned} 个候选，过三道门槛的 **${found.length}** 个，` +
      `搜到但库里已有 ${stats.alreadyKnown} 个，挡掉 ${rejected.length} 个。`,
  );
  lines.push("");
  lines.push(
    `> 「库里已有」单列是有原因的：它既不是命中也不是被门槛挡掉，` +
      `混进任何一边都会让人误判门槛太严。这个数高说明清单这一段已经采过了，正常往下走即可。`,
  );
  lines.push("");
  lines.push("三道门槛：① 仓库名与关键词对得上（挡 GitHub 搜索误命中）② 确实是 server 不是清单/客户端/教程 ③ npm 包的 repository 要指回同一个仓库（否则填 null）。");
  lines.push("");
  lines.push("**合并前请人工扫一眼**——机器门槛会漏，历史上漏过「课程被当成 server」「canvas 撞了 canva」。");
  lines.push("");

  if (byKeyword.length) {
    lines.push("## 有人在搜、但我们没有（关键词来源）");
    lines.push("");
    lines.push("| 搜索量 | 来自哪份清单 | 仓库 | ★ | npm | 说明 |");
    lines.push("|---|---|---|---|---|---|");
    for (const c of byKeyword.sort((a, b) => (b.volume ?? 0) - (a.volume ?? 0))) {
      lines.push(`| ${c.volume}/mo | ${c.backlog ?? "—"} | [${c.repo}](https://github.com/${c.repo}) | ${c.stars} | ${c.npmPackage ?? "—"} | ${(c.description || "").slice(0, 60)} |`);
    }
    lines.push("");
  }

  if (byGithub.length) {
    lines.push("## GitHub 上高星但库里没有（趋势来源）");
    lines.push("");
    lines.push("| ★ | 仓库 | 最近提交 | npm | 说明 |");
    lines.push("|---|---|---|---|---|");
    for (const c of byGithub.sort((a, b) => b.stars - a.stars)) {
      lines.push(`| ${c.stars} | [${c.repo}](https://github.com/${c.repo}) | ${c.idleDays}天前 | ${c.npmPackage ?? "—"} | ${(c.description || "").slice(0, 60)} |`);
    }
    lines.push("");
  }

  if (rejected.length) {
    lines.push(`## 挡掉的 ${rejected.length} 个（抽样 30）`);
    lines.push("");
    lines.push("| 候选 | 挡掉原因 |");
    lines.push("|---|---|");
    for (const r of rejected.slice(0, 30)) lines.push(`| ${r.repo} | ${r.reason} |`);
    lines.push("");
  }
  return lines.join("\n");
}

interface DiscoverState {
  /** 已验过的关键词 → 验的日期。命中与否都记，避免重复烧 API 配额。 */
  attemptedKeywords: Record<string, string>;
}

async function loadState(): Promise<DiscoverState> {
  try {
    return JSON.parse(await readFile(STATE_FILE, "utf8")) as DiscoverState;
  } catch {
    return { attemptedKeywords: {} };
  }
}

async function main() {
  console.log(`[discover] 开始，token=${process.env.GITHUB_TOKEN ? "有" : "无（限流 60/h，容易跑不完）"}`);

  const ds = await readDataset();
  const existing = (ds?.servers ?? []).map((s) => s.repoUrl);
  const existingNames = new Set(
    (ds?.servers ?? []).map((s) => s.name.toLowerCase()),
  );
  const known = knownRepos(existing);
  console.log(`[discover] 已知 repo ${known.size} 个（库里 ${existing.length} + 两份种子文件）`);

  // 来源 A：关键词待办 —— 「有人在搜但我们没有」，比趋势更贴需求，所以先跑。
  // 跳过验过的，游标才能往下走完 600+ 的清单。
  const state = await loadState();
  const backlog = await loadKeywordBacklog();
  const pending = backlog.filter((t) => !state.attemptedKeywords[t.keyword]);
  const batch = pending.slice(0, KEYWORD_BATCH);
  const tiers = [...new Set(batch.map((t) => t.backlog ?? "?"))]
    .map((label) => `${label} ${batch.filter((t) => t.backlog === label).length}`)
    .join(" + ");
  console.log(
    `[discover] 关键词清单 ${backlog.length} 个，验过 ${backlog.length - pending.length} 个，` +
      `本次验 ${batch.length} 个（${tiers}），还剩 ${Math.max(0, pending.length - batch.length)} 个`,
  );
  const kw = await discoverFromKeywords(batch, known);
  console.log(
    `[discover]   → 过门槛 ${kw.found.length}，库里已有 ${kw.alreadyKnown}，挡掉 ${kw.rejected.length}`,
  );

  const today = new Date().toISOString().slice(0, 10);
  for (const t of batch) state.attemptedKeywords[t.keyword] = today;
  await writeFile(STATE_FILE, JSON.stringify(state, null, 2), "utf8");

  // 来源 B：GitHub 趋势 —— 补关键词清单没覆盖到的新东西
  const gh = await discoverFromGithub(known, { pages: 3 });
  console.log(
    `[discover] GitHub 趋势 → 过门槛 ${gh.found.length}，库里已有 ${gh.alreadyKnown}，挡掉 ${gh.rejected.length}`,
  );

  // 关键词来源优先（有真实需求证据），趋势来源按配额补位
  const trend = gh.found.slice(0, TREND_QUOTA);
  const seenNames = new Set(existingNames);
  const all: Candidate[] = [];
  for (const candidate of [...kw.found, ...trend]) {
    const key = candidate.name.toLowerCase();
    if (seenNames.has(key)) continue;
    seenNames.add(key);
    all.push(candidate);
    if (all.length >= MAX_PER_RUN) break;
  }
  console.log(
    `[discover] 关键词 ${kw.found.length} + 趋势 ${gh.found.length}（配额 ${TREND_QUOTA}，取 ${trend.length}）` +
      ` → 本次提 ${all.length} 个（单次上限 ${MAX_PER_RUN}）`,
  );

  console.log(`[discover] 解析 npm 包归属（只认 repository 指回同一仓库的）…`);
  await attachNpmPackages(all);
  console.log(`[discover]   → ${all.filter((c) => c.npmPackage).length}/${all.length} 个确认了 npm 包`);

  if (all.length > 0) {
    const currentSeeds = await readFile(SEEDS_FILE, "utf8");
    await writeFile(SEEDS_FILE, appendSeedsFileContent(currentSeeds, all), "utf8");
  }
  await writeFile(
    REPORT_FILE,
    report(all, [...kw.rejected, ...gh.rejected], {
      scanned: batch.length + gh.found.length + gh.rejected.length,
      alreadyKnown: kw.alreadyKnown + gh.alreadyKnown,
    }),
    "utf8",
  );

  console.log(`[discover] 完成：${all.length} 个候选 → ${SEEDS_FILE}`);
  console.log(`[discover] 报告 → ${REPORT_FILE}`);
  process.exit(0);
}

main().catch((err) => {
  console.error("[discover] 失败：", err);
  process.exit(1);
});
