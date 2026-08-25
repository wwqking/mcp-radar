import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const runDir = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.dirname(fileURLToPath(import.meta.url));
const keywordsPath = path.join(runDir, "keywords.csv");

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];
    if (quoted) {
      if (char === '"' && next === '"') {
        field += '"';
        i += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        field += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (char !== "\r") {
      field += char;
    }
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function csvCell(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function intentValue(intent) {
  const value = String(intent ?? "").toLowerCase();
  if (value.includes("transactional")) return 100;
  if (value.includes("commercial")) return 80;
  if (value.includes("informational")) return 60;
  if (value.includes("navigational")) return 40;
  return 30;
}

function demandScore(volume) {
  return volume > 0 ? Math.min(100, 20 * Math.log10(volume + 1)) : 0;
}

function winabilityScore(kd) {
  if (kd < 15) return 100 - kd;
  if (kd < 30) return 85 - (kd - 15) * 1.67;
  if (kd < 50) return 60 - (kd - 30) * 1.5;
  if (kd < 70) return 30 - (kd - 50);
  return Math.max(0, 10 - (kd - 70) * 0.33);
}

function priority(score) {
  if (score >= 62) return "P0";
  if (score >= 52) return "P1";
  return "P2";
}

function demote(value) {
  return value === "P0" ? "P1" : "P2";
}

const parsed = parseCsv(await fs.readFile(keywordsPath, "utf8"));
const header = parsed[0];
const rows = parsed
  .slice(1)
  .filter((row) => row.length >= header.length)
  .map((row) => Object.fromEntries(header.map((key, index) => [key, row[index]])));

for (const row of rows) {
  const volume = Number(row.volume || 0);
  const kd = Number(row.kd || 0);
  const cpc = Number(row.cpc || 0);
  const iv = intentValue(row.intent);
  const business = Math.min(100, iv * 0.8 + (Math.min(cpc, 15) / 15) * 20);
  const score =
    demandScore(volume) * 0.3 +
    winabilityScore(kd) * 0.35 +
    business * 0.15 +
    iv * 0.2;
  row.score = score.toFixed(1);
  const basePriority = priority(score);
  row.priority = row.serp_adjusted ? demote(basePriority) : basePriority;
}
rows.sort((left, right) => Number(right.score) - Number(left.score));

const csv = [
  header.join(","),
  ...rows.map((row) => header.map((column) => csvCell(row[column])).join(",")),
].join("\n");
await fs.writeFile(keywordsPath, `${csv}\n`, "utf8");

const summaryPath = path.join(runDir, "analysis-summary.json");
const summary = JSON.parse(await fs.readFile(summaryPath, "utf8"));
summary.monetization_model = "subscription";
summary.scoring_note =
  "CPC is downweighted and intent is upweighted. SERP strong verdicts remain a separate one-tier demotion.";
summary.priority_counts = Object.fromEntries(
  ["P0", "P1", "P2"].map((value) => [
    value,
    rows.filter((row) => row.priority === value).length,
  ]),
);
for (const cluster of summary.cluster_summary ?? []) {
  const items = rows.filter((row) => row.cluster === cluster.cluster_id);
  cluster.avg_score = Number(
    (
      items.reduce((total, row) => total + Number(row.score), 0) /
      Math.max(1, items.length)
    ).toFixed(1),
  );
  cluster.p0_count = items.filter((row) => row.priority === "P0").length;
}
await fs.writeFile(summaryPath, `${JSON.stringify(summary, null, 2)}\n`, "utf8");

console.log(JSON.stringify(summary.priority_counts));
