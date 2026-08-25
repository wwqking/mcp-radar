import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const runDir = path.dirname(fileURLToPath(import.meta.url));
const rawDir = path.join(runDir, "raw");
const collectedAt = "2026-07-28";
const entities = [
  "context7",
  "github",
  "filesystem",
  "playwright",
  "figma",
  "n8n",
  "aws",
  "supabase",
  "slack",
  "notion",
  "sequential thinking",
  "gitlab",
  "shadcn",
  "snowflake",
  "cloudflare",
  "vercel",
  "brave search",
  "grafana",
  "stripe",
  "dbt",
];
const suffixes = ["", ..."abcdefghijklmnopqrstuvwxyz"];
const jobs = entities.flatMap((entity) =>
  suffixes.map((suffix) => ({
    entity,
    query: `${entity} mcp${suffix ? ` ${suffix}` : ""}`,
  })),
);

function inferIntent(suggestion) {
  const text = suggestion.toLowerCase();
  if (/\b(vs|versus|alternative|best|review)\b/.test(text)) return "commercial";
  if (/\b(install|setup|configure|configuration|download|api key|url)\b/.test(text)) {
    return "transactional";
  }
  if (/\b(error|not working|failed|timeout|enoent|fix)\b/.test(text)) {
    return "problem-solving";
  }
  return "informational";
}

async function fetchSuggestions(job) {
  const url = new URL("https://suggestqueries.google.com/complete/search");
  url.searchParams.set("client", "chrome");
  url.searchParams.set("hl", "en");
  url.searchParams.set("gl", "us");
  url.searchParams.set("q", job.query);
  const response = await fetch(url, {
    headers: { "user-agent": "Mozilla/5.0 MCP-Radar-SEO-Research/1.0" },
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) {
    return { ...job, status: response.status, suggestions: [] };
  }
  const data = await response.json();
  return {
    ...job,
    status: response.status,
    suggestions: Array.isArray(data?.[1]) ? data[1] : [],
  };
}

async function mapLimit(items, limit, worker) {
  const output = new Array(items.length);
  let next = 0;
  async function runner() {
    while (next < items.length) {
      const index = next++;
      try {
        output[index] = await worker(items[index]);
      } catch (error) {
        output[index] = {
          ...items[index],
          status: "error",
          error: error instanceof Error ? error.message : String(error),
          suggestions: [],
        };
      }
    }
  }
  await Promise.all(Array.from({ length: limit }, runner));
  return output;
}

await fs.mkdir(rawDir, { recursive: true });
const rawPath = path.join(rawDir, `google-autocomplete-us-en-${collectedAt}.json`);
try {
  await fs.access(rawPath);
  throw new Error(`Raw evidence already exists and will not be overwritten: ${rawPath}`);
} catch (error) {
  if (error?.code !== "ENOENT") throw error;
}

const responses = await mapLimit(jobs, 6, fetchSuggestions);
await fs.writeFile(
  rawPath,
  `${JSON.stringify(
    {
      source: "Google Autocomplete",
      country: "US",
      language: "en",
      collected_at: collectedAt,
      disclaimer:
        "Autocomplete is demand-existence evidence, not search volume; results vary by locale and time.",
      queries: responses,
    },
    null,
    2,
  )}\n`,
  "utf8",
);

const rows = [];
const seen = new Set();
for (const response of responses) {
  for (const suggestion of response.suggestions) {
    const key = `${response.entity}\t${suggestion.toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    rows.push({
      query: response.query,
      suggestion,
      source: "google_autocomplete",
      country: "US",
      language: "en",
      collected_at: collectedAt,
      entity: response.entity,
      intent: inferIntent(suggestion),
      evidence_strength: "autocomplete",
    });
  }
}

function csvCell(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

const csvPath = path.join(runDir, "modifier-patterns.csv");
const columns = [
  "query",
  "suggestion",
  "source",
  "country",
  "language",
  "collected_at",
  "entity",
  "intent",
  "evidence_strength",
];
const csv = [
  columns.join(","),
  ...rows.map((row) => columns.map((column) => csvCell(row[column])).join(",")),
].join("\n");
await fs.writeFile(csvPath, `${csv}\n`, "utf8");

const failed = responses.filter((response) => response.status !== 200).length;
console.log(
  JSON.stringify({
    queries: responses.length,
    failed_queries: failed,
    unique_suggestions: rows.length,
    raw: rawPath,
    csv: csvPath,
  }),
);
