// 全量页面库存枚举：实体 × 修饰词 × 客户端 → 候选 URL，每行带证据和闸门裁决。
//
// 这不是「先做哪些」的排期，是完整机会空间的清单。每一行都要能回答：
//   这个 URL 凭什么存在？证据是什么？它是 create / enrich / merge / noindex / reject？
//
// 关键约束（技能 A3/A5）：
//   - 修饰词矩阵是【条件矩阵】，不是平铺。没有 auth_type 的实体不生成 api-key 页。
//   - 一个实体 = 一个页面，修饰词默认作为【区块】吃掉长尾，不各自开页。
//     只有修饰词自身量够大（>=200/mo 实测）才 standalone。
//   - client × server 集成页只在实体声明支持该客户端时生成。
import fs from "node:fs";
import path from "node:path";

// 路径含中文，import.meta.url 是百分号编码的，必须 decodeURIComponent。
const BASE = path.dirname(decodeURIComponent(new URL(import.meta.url).pathname));
const ROOT = path.resolve(BASE, "../../../..");

const servers = JSON.parse(fs.readFileSync(path.join(ROOT, "data/servers.json"), "utf8"));
const list = Array.isArray(servers) ? servers : servers.servers ?? servers;
const bySlug = new Map(list.map((s) => [s.slug, s]));

// ---- A4 闸门裁决 ----
function readCsv(p) {
  const txt = fs.readFileSync(p, "utf8").trim();
  const [head, ...rows] = txt.split("\n");
  const cols = parseLine(head);
  return rows.map((r) => Object.fromEntries(parseLine(r).map((v, i) => [cols[i], v])));
}
function parseLine(line) {
  const out = [];
  let cur = "", q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') { if (q && line[i + 1] === '"') { cur += '"'; i++; } else q = !q; }
    else if (c === "," && !q) { out.push(cur); cur = ""; }
    else cur += c;
  }
  out.push(cur);
  return out;
}

const elig = new Map(readCsv(path.join(BASE, "page-eligibility.csv")).map((r) => [r.entity_id, r]));
const keywords = readCsv(path.join(BASE, "keywords-final.csv"));

// 已上线
const landingSrc = fs.readFileSync(path.join(ROOT, "lib/seo-landing.ts"), "utf8");
const liveLanding = new Set([...landingSrc.matchAll(/serverSlug: *"([^"]+)"/g)].map((m) => m[1]));
const capsSrc = fs.readFileSync(path.join(ROOT, "lib/server-capabilities.ts"), "utf8");
const haveCaps = new Set([...capsSrc.matchAll(/^ {2}"([a-z0-9._-]+)":/gm)].map((m) => m[1]));
const guidesSrc = fs.readFileSync(path.join(ROOT, "lib/guides.ts"), "utf8");
const liveGuides = new Set([...guidesSrc.matchAll(/slug: *"([^"]+)"/g)].map((m) => m[1]));

// ---- 关键词 → 实体的量匹配 ----
const vol = new Map();
function norm(s) { return (s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
for (const k of keywords) {
  const kn = norm(k.keyword);
  const v = Number(k.volume || 0);
  if (!v) continue;
  for (const s of list) {
    const core = s.slug
      .replace(/^(io-github-|ai-smithery-|ai-com-|app-|dev-|com-|ai-)/, "")
      .replace(/-mcp-server$|-mcp$|^mcp-/g, "");
    if (core.length > 3 && kn.includes(core)) {
      vol.set(s.slug, (vol.get(s.slug) || 0) + v);
      break;
    }
  }
}

// ---- 修饰词：只有实体挣到该区块才算，且默认是【区块】不是页面 ----
// standalone_if：该修饰词自身有独立搜索需求时才配独立 URL。
const MODIFIERS = [
  { id: "install", section: "install", standalone: false },
  { id: "configuration", section: "configuration", standalone: false },
  { id: "api-key", section: "api_key", standalone: false },
  { id: "docker", section: "docker", standalone: false },
  { id: "remote", section: "remote_connection", standalone: false },
  { id: "troubleshooting", section: "troubleshooting", standalone: true },
  { id: "alternatives", section: "comparison", standalone: true },
];

// 客户端集成：只在实体声明支持时生成
const CLIENTS = ["claude-desktop", "claude-code", "cursor", "vscode", "windsurf"];

const rows = [];
let idCounter = 0;

for (const s of list) {
  const e = elig.get(s.slug);
  const verdict = e?.verdict || "reject";
  const sections = (e?.applicable_sections || "").split(";").map((x) => x.trim()).filter(Boolean);
  const stars = s.signals?.stars ?? 0;
  const kwVol = vol.get(s.slug) || 0;
  const live = liveLanding.has(s.slug);

  // --- 主实体页 ---
  rows.push({
    id: ++idCounter,
    url: `/servers/${s.slug}-mcp-server`,
    page_type: "entity_landing",
    entity: s.slug,
    modifier: "",
    primary_keyword: `${s.name || s.slug} mcp server`,
    measured_volume: kwVol,
    stars,
    trust_score: s.trustScore ?? "",
    lifecycle: s.lifecycle ?? "",
    a4_verdict: verdict,
    sections_earned: sections.join("|"),
    richness: e?.richness || 0,
    uniqueness: e?.uniqueness_classes || "",
    status: live ? "live" : verdict === "enrich" ? "ready_to_build" : "gated",
    has_capabilities: haveCaps.has(s.slug) ? "yes" : "no",
    blocker: live ? "" : verdict !== "enrich" ? e?.reasons?.slice(0, 90) || "" : haveCaps.has(s.slug) ? "" : "needs capabilities entry",
  });

  // --- 修饰词：区块 vs 独立页 ---
  for (const m of MODIFIERS) {
    if (!sections.includes(m.section)) continue; // 无证据不生成 —— A3 条件矩阵
    const standalone = m.standalone && verdict === "enrich";
    rows.push({
      id: ++idCounter,
      url: standalone ? `/servers/${s.slug}-mcp-server/${m.id}` : `/servers/${s.slug}-mcp-server#${m.id}`,
      page_type: standalone ? "modifier_page" : "modifier_section",
      entity: s.slug,
      modifier: m.id,
      primary_keyword: `${s.name || s.slug} mcp ${m.id.replace("-", " ")}`,
      measured_volume: "",
      stars,
      trust_score: s.trustScore ?? "",
      lifecycle: s.lifecycle ?? "",
      a4_verdict: verdict,
      sections_earned: m.section,
      richness: "",
      uniqueness: "",
      status: standalone ? "candidate" : "section_of_entity_page",
      has_capabilities: "",
      blocker: standalone ? "" : "长尾由实体页区块吸收，不单独开 URL",
    });
  }

  // --- client × server 集成页 ---
  if (verdict === "enrich" && stars >= 200) {
    for (const c of CLIENTS) {
      rows.push({
        id: ++idCounter,
        url: `/guides/${s.slug}-with-${c}`,
        page_type: "client_integration",
        entity: s.slug,
        modifier: c,
        primary_keyword: `${s.name || s.slug} mcp ${c.replace("-", " ")}`,
        measured_volume: "",
        stars,
        trust_score: s.trustScore ?? "",
        lifecycle: s.lifecycle ?? "",
        a4_verdict: verdict,
        sections_earned: "",
        richness: "",
        uniqueness: "",
        status: "candidate_unvalidated",
        has_capabilities: "",
        blocker: "无 supported_clients 证据，需先采集客户端兼容性再建",
      });
    }
  }
}

// --- 内容页：从关键词簇来，不是从实体来 ---
const contentClusters = new Map();
for (const k of keywords) {
  if (k.cluster === "entry_detail") continue;
  const v = Number(k.volume || 0);
  if (v < 200) continue;
  const key = k.cluster;
  if (!contentClusters.has(key)) contentClusters.set(key, []);
  contentClusters.get(key).push(k);
}
for (const [cluster, ks] of contentClusters) {
  ks.sort((a, b) => Number(b.volume || 0) - Number(a.volume || 0));
  for (const k of ks) {
    const slug = norm(k.keyword).slice(0, 60);
    rows.push({
      id: ++idCounter,
      url: `/guides/${slug}`,
      page_type: `content_${cluster}`,
      entity: "",
      modifier: "",
      primary_keyword: k.keyword,
      measured_volume: Number(k.volume || 0),
      stars: "",
      trust_score: "",
      lifecycle: "",
      a4_verdict: "",
      sections_earned: "",
      richness: "",
      uniqueness: "",
      status: liveGuides.has(slug) ? "live" : "candidate",
      has_capabilities: "",
      blocker: Number(k.kd || 0) > 40 ? `KD ${k.kd} 偏高` : "",
    });
  }
}

const cols = Object.keys(rows[0]);
const esc = (v) => {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
fs.writeFileSync(
  path.join(BASE, "FULL-INVENTORY.csv"),
  [cols.join(","), ...rows.map((r) => cols.map((c) => esc(r[c])).join(","))].join("\n")
);

const byType = {};
const byStatus = {};
for (const r of rows) {
  byType[r.page_type] = (byType[r.page_type] || 0) + 1;
  byStatus[r.status] = (byStatus[r.status] || 0) + 1;
}
console.log("总行数:", rows.length);
console.log("\n按页面类型:");
for (const [k, v] of Object.entries(byType).sort((a, b) => b[1] - a[1])) console.log(`  ${String(v).padStart(5)}  ${k}`);
console.log("\n按状态:");
for (const [k, v] of Object.entries(byStatus).sort((a, b) => b[1] - a[1])) console.log(`  ${String(v).padStart(5)}  ${k}`);
