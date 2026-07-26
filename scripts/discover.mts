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
/** 关键词研究产出的待采集清单（第三轮竞品采词，见 research/mcpradars/seo-r3/README.md）。 */
const KEYWORD_BACKLOG = join(ROOT, "research", "mcpradars", "seo-r3", "collect-priority.csv");
/** 每次最多提多少个 —— PR 太大没人看得动。 */
const MAX_PER_RUN = Number(process.env.MCP_DISCOVER_MAX ?? 25);
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
]);

async function loadKeywordBacklog(): Promise<KeywordTarget[]> {
  let raw: string;
  try {
    raw = await readFile(KEYWORD_BACKLOG, "utf8");
  } catch {
    console.warn(`[discover] 没找到关键词清单 ${KEYWORD_BACKLOG}，跳过关键词来源`);
    return [];
  }
  const lines = raw.split("\n").slice(1).filter(Boolean);
  const out: KeywordTarget[] = [];
  for (const line of lines) {
    const [kw, vol] = line.split(",");
    if (!kw) continue;
    const keyword = kw.trim().replace(/^"|"$/g, "");
    if (!keyword || keyword.length < 3) continue;
    if (GENERIC.has(keyword)) continue;
    if (NOISE.some((n) => keyword.includes(n))) continue;
    if (/^[\d.\s]+$/.test(keyword)) continue;
    out.push({ keyword, volume: Number(vol) || 0 });
  }
  out.sort((a, b) => b.volume - a.volume);
  return out;
}

function seedsFileContent(cands: Candidate[]): string {
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
  return `// 自动发现的 server 种子 —— 由 \`npm run discover\` 生成，经人工审 PR 后合并。
//
// ⚠️ 这个文件是机器写的，别手工改：下次 discover 会整体重写它。
// 手工挑的 server 请加到 curated.ts —— 两份分开是刻意的：
//   - curated.ts  手工维护，采集时**无条件保留**（优质保底）
//   - discovered.ts 机器发现，采集时仍要过 passesQualityGate（机器没人看过，不给豁免）
// 分开还有一个作用：自动开的 PR 永远只碰这个文件，改坏了也污染不到手工白名单。
//
// 上次生成：${new Date().toISOString().slice(0, 10)}

import type { CuratedSeed } from "./curated";

export const DISCOVERED_SEEDS: CuratedSeed[] = [
${rows || "  // 本次没有新候选"}
];
`;
}

function report(found: Candidate[], rejected: Rejection[], stats: Record<string, number>): string {
  const byKeyword = found.filter((c) => c.source === "keyword");
  const byGithub = found.filter((c) => c.source === "github");
  const lines: string[] = [];

  lines.push(`# 候选发现报告 · ${new Date().toISOString().slice(0, 10)}`);
  lines.push("");
  lines.push(`扫了 ${stats.scanned} 个候选，过三道门槛的 **${found.length}** 个，挡掉 ${rejected.length} 个。`);
  lines.push("");
  lines.push("三道门槛：① 仓库名与关键词对得上（挡 GitHub 搜索误命中）② 确实是 server 不是清单/客户端/教程 ③ npm 包的 repository 要指回同一个仓库（否则填 null）。");
  lines.push("");
  lines.push("**合并前请人工扫一眼**——机器门槛会漏，历史上漏过「课程被当成 server」「canvas 撞了 canva」。");
  lines.push("");

  if (byKeyword.length) {
    lines.push("## 有人在搜、但我们没有（关键词来源）");
    lines.push("");
    lines.push("| 搜索量 | 仓库 | ★ | npm | 说明 |");
    lines.push("|---|---|---|---|---|");
    for (const c of byKeyword.sort((a, b) => (b.volume ?? 0) - (a.volume ?? 0))) {
      lines.push(`| ${c.volume}/mo | [${c.repo}](https://github.com/${c.repo}) | ${c.stars} | ${c.npmPackage ?? "—"} | ${(c.description || "").slice(0, 60)} |`);
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
  const known = knownRepos(existing);
  console.log(`[discover] 已知 repo ${known.size} 个（库里 ${existing.length} + 两份种子文件）`);

  // 来源 A：关键词待办 —— 「有人在搜但我们没有」，比趋势更贴需求，所以先跑。
  // 跳过验过的，游标才能往下走完 600+ 的清单。
  const state = await loadState();
  const backlog = await loadKeywordBacklog();
  const pending = backlog.filter((t) => !state.attemptedKeywords[t.keyword]);
  const batch = pending.slice(0, KEYWORD_BATCH);
  console.log(
    `[discover] 关键词清单 ${backlog.length} 个，验过 ${backlog.length - pending.length} 个，` +
      `本次验 ${batch.length} 个（还剩 ${Math.max(0, pending.length - batch.length)} 个）`,
  );
  const kw = await discoverFromKeywords(batch, known);
  console.log(`[discover]   → 过门槛 ${kw.found.length}，挡掉 ${kw.rejected.length}`);

  const today = new Date().toISOString().slice(0, 10);
  for (const t of batch) state.attemptedKeywords[t.keyword] = today;
  await writeFile(STATE_FILE, JSON.stringify(state, null, 2), "utf8");

  // 来源 B：GitHub 趋势 —— 补关键词清单没覆盖到的新东西
  const gh = await discoverFromGithub(known, { pages: 3 });
  console.log(`[discover] GitHub 趋势 → 过门槛 ${gh.found.length}，挡掉 ${gh.rejected.length}`);

  // 关键词来源优先（有真实需求证据），趋势来源补位
  const all = [...kw.found, ...gh.found].slice(0, MAX_PER_RUN);
  console.log(`[discover] 合计 ${kw.found.length + gh.found.length} 个，取前 ${all.length} 个（单次上限 ${MAX_PER_RUN}）`);

  console.log(`[discover] 解析 npm 包归属（只认 repository 指回同一仓库的）…`);
  await attachNpmPackages(all);
  console.log(`[discover]   → ${all.filter((c) => c.npmPackage).length}/${all.length} 个确认了 npm 包`);

  await writeFile(SEEDS_FILE, seedsFileContent(all), "utf8");
  await writeFile(
    REPORT_FILE,
    report(all, [...kw.rejected, ...gh.rejected], { scanned: batch.length + gh.found.length + gh.rejected.length }),
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
