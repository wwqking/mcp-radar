import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const runDir = path.dirname(fileURLToPath(import.meta.url));
const projectDir = path.resolve(runDir, "../../../..");
const landingSource = await fs.readFile(
  path.join(projectDir, "lib/seo-landing.ts"),
  "utf8",
);
const dataset = JSON.parse(
  await fs.readFile(path.join(projectDir, "data/servers.json"), "utf8"),
);
const servers = Array.isArray(dataset) ? dataset : dataset.servers;
const bySlug = new Map(servers.map((server) => [server.slug, server]));
const landings = [
  ...landingSource.matchAll(
    /toolSlug:\s*"([^"]+)"[\s\S]*?serverSlug:\s*"([^"]+)"/g,
  ),
].map((match) => ({ toolSlug: match[1], serverSlug: match[2] }));

function csvCell(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

const rows = landings.map((landing) => {
  const server = bySlug.get(landing.serverSlug);
  const runnable = Boolean(server?.signals?.hasRunnableEntry);
  return {
    url: `/servers/${landing.toolSlug}-mcp-server`,
    entity_id: landing.serverSlug,
    canonical_name: server?.name ?? "",
    trust_score: server?.trustScore ?? "",
    lifecycle: server?.lifecycle ?? "missing",
    package: server?.npmPackage ?? "",
    remote_endpoint_count: server?.remoteEndpoints?.length ?? 0,
    current_runnable_entry: runnable ? "yes" : "no",
    verdict: runnable ? "enrich" : "noindex",
    reasons: runnable
      ? "Exact entity exists with a runnable entry; retain URL and add dated install verification plus troubleshooting evidence"
      : "Setup/config promise currently has no package or remote endpoint; keep out of the index until the exact entity is runnable or retarget the page",
    uniqueness_classes: runnable
      ? "editorial; tool; computed"
      : "editorial; computed (install tool cannot be counted while commands are placeholders)",
  };
});

const columns = Object.keys(rows[0]);
const csv = [
  columns.join(","),
  ...rows.map((row) => columns.map((column) => csvCell(row[column])).join(",")),
].join("\n");
await fs.writeFile(
  path.join(runDir, "landing-page-eligibility.csv"),
  `${csv}\n`,
  "utf8",
);

console.log(
  JSON.stringify({
    landing_pages: rows.length,
    enrich: rows.filter((row) => row.verdict === "enrich").length,
    noindex: rows.filter((row) => row.verdict === "noindex").length,
  }),
);
