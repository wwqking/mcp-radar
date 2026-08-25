import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const runDir = path.dirname(fileURLToPath(import.meta.url));
const projectDir = path.resolve(runDir, "../../../..");
const entitiesPath = path.join(runDir, "entities.csv");
const summaryPath = path.join(runDir, "entities-summary.json");
const dataset = JSON.parse(
  await fs.readFile(path.join(projectDir, "data/servers.json"), "utf8"),
);
const servers = Array.isArray(dataset) ? dataset : dataset.servers;
const collectedAt = dataset.collectedAt ?? "2026-07-28";
const landingSource = await fs.readFile(
  path.join(projectDir, "lib/seo-landing.ts"),
  "utf8",
);
const capabilitySource = await fs.readFile(
  path.join(projectDir, "lib/server-capabilities.ts"),
  "utf8",
);

await fs.copyFile(
  entitiesPath,
  path.join(runDir, "entities-hard-link-merged.csv"),
);
await fs.copyFile(
  summaryPath,
  path.join(runDir, "entities-hard-link-merge-summary.json"),
);

const landings = new Map(
  [
    ...landingSource.matchAll(
      /toolSlug:\s*"([^"]+)"[\s\S]*?serverSlug:\s*"([^"]+)"/g,
    ),
  ].map((match) => [
    match[2],
    {
      toolSlug: match[1],
      serverSlug: match[2],
    },
  ]),
);
const capabilitySlugs = new Set(
  [...capabilitySource.matchAll(/^\s*"([^"]+)":\s*\{/gm)].map(
    (match) => match[1],
  ),
);

function repoId(repoUrl) {
  const match = String(repoUrl ?? "").match(/github\.com\/([^/]+\/[^/#?]+)/i);
  return match?.[1]?.replace(/\.git$/i, "").toLowerCase() ?? "";
}

function authType(server) {
  if (server.readmeFacts?.needsApiKey === true) return "api_key";
  if (server.readmeFacts?.needsApiKey === false) return "none";
  return "";
}

function lastCommit(server) {
  const days = server.signals?.lastCommitDaysAgo;
  if (!Number.isFinite(days)) return "";
  const date = new Date(`${collectedAt}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() - days);
  return date.toISOString().slice(0, 10);
}

function csvCell(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

const columns = [
  "entity_id",
  "canonical_name",
  "aliases",
  "owner",
  "official",
  "registry_id",
  "github_repo",
  "npm_packages",
  "pypi_packages",
  "homepage",
  "auth_type",
  "license",
  "latest_release",
  "maintenance_status",
  "registry_status",
  "stars",
  "downloads",
  "last_commit",
  "sources",
  "source_confidence",
  "lifecycle",
  "last_verified_at",
  "dataset_slugs",
  "categories",
  "trust_score",
  "remote_endpoints",
  "has_runnable_entry",
  "readme_has_config",
  "dockerfile_exists",
  "verified_config_exists",
  "install_verified",
  "install_failure_reproduced",
  "confirmed_issue_count",
  "error_term_volume",
  "supported_clients",
  "comparable_entities",
  "comparison_dimensions",
  "editorial_notes",
  "has_tool",
  "user_feedback_count",
  "existing_health_url",
  "existing_landing_url",
  "data_verified_at",
];

const rows = servers.map((server) => {
  const sources = [
    server.signals?.inOfficialRegistry ? "official_mcp_registry" : "",
    server.repoUrl ? "github" : "",
    server.npmPackage ? "npm" : "",
  ].filter(Boolean);
  const landing = landings.get(server.slug);
  const hasCapability = capabilitySlugs.has(server.slug);
  const runnable = Boolean(server.signals?.hasRunnableEntry);
  const lifecycle =
    server.lifecycle === "dead"
      ? "deprecated"
      : server.lifecycle === "dying"
        ? "stale"
        : "candidate";
  const endpoints = (server.remoteEndpoints ?? [])
    .map((endpoint) => `${endpoint.type}:${endpoint.url}`)
    .join("; ");
  const editorialNotes = [
    hasCapability ? "Human-authored capability card and example prompts" : "",
    landing ? "Custom bilingual landing-page fit guidance and FAQ" : "",
  ]
    .filter(Boolean)
    .join("; ");

  return {
    entity_id: server.slug,
    canonical_name: server.name || server.slug,
    aliases: "",
    owner: repoId(server.repoUrl).split("/")[0] || "",
    official: server.signals?.inOfficialRegistry ? "true" : "false",
    registry_id: server.signals?.inOfficialRegistry ? server.slug : "",
    github_repo: repoId(server.repoUrl),
    npm_packages: server.npmPackage || "",
    pypi_packages: "",
    homepage: "",
    auth_type: authType(server),
    license: server.signals?.license || "",
    latest_release: "",
    maintenance_status: server.lifecycle || "",
    registry_status: server.signals?.inOfficialRegistry ? "active" : "unverified",
    stars: server.signals?.stars ?? 0,
    downloads: server.signals?.npmWeeklyDownloads ?? 0,
    last_commit: lastCommit(server),
    sources: sources.join("; "),
    source_confidence:
      sources.length >= 2 ? "high" : sources.length === 1 ? "medium" : "low",
    lifecycle,
    last_verified_at: collectedAt,
    dataset_slugs: server.slug,
    categories: (server.categories ?? []).join("; "),
    trust_score: server.trustScore ?? 0,
    remote_endpoints: endpoints,
    has_runnable_entry: runnable ? "yes" : "",
    readme_has_config: server.readmeFacts?.configSnippet ? "yes" : "",
    dockerfile_exists: (server.readmeFacts?.runtimes ?? []).includes("Docker")
      ? "yes"
      : "",
    verified_config_exists: "",
    install_verified: "",
    install_failure_reproduced: "",
    confirmed_issue_count: "0",
    error_term_volume: "0",
    supported_clients: "",
    comparable_entities: "",
    comparison_dimensions: "",
    editorial_notes: editorialNotes,
    has_tool: runnable
      ? "entity-specific install/config generator and copy action"
      : "",
    user_feedback_count: "0",
    existing_health_url: `/server/${server.slug}`,
    existing_landing_url: landing
      ? `/servers/${landing.toolSlug}-mcp-server`
      : "",
    data_verified_at: collectedAt,
  };
});

const csv = [
  columns.join(","),
  ...rows.map((row) => columns.map((column) => csvCell(row[column])).join(",")),
].join("\n");
await fs.writeFile(entitiesPath, `${csv}\n`, "utf8");

await fs.writeFile(
  path.join(runDir, "existing-entity-ids.txt"),
  `${rows.map((row) => row.entity_id).sort().join("\n")}\n`,
  "utf8",
);

const nonRunnableLandings = rows
  .filter((row) => row.existing_landing_url && !row.has_runnable_entry)
  .map((row) => ({
    entity_id: row.entity_id,
    canonical_name: row.canonical_name,
    url: row.existing_landing_url,
    trust_score: row.trust_score,
  }));
await fs.writeFile(
  path.join(runDir, "existing-landings-without-runnable-entry.json"),
  `${JSON.stringify(nonRunnableLandings, null, 2)}\n`,
  "utf8",
);

const lifecycleCounts = {};
const confidenceCounts = {};
for (const row of rows) {
  lifecycleCounts[row.lifecycle] = (lifecycleCounts[row.lifecycle] ?? 0) + 1;
  confidenceCounts[row.source_confidence] =
    (confidenceCounts[row.source_confidence] ?? 0) + 1;
}
const summary = {
  source_dataset_records: rows.length,
  canonical_entities: rows.length,
  canonicalization_policy:
    "Use the collector's server slug/package as the entity boundary. Same GitHub repository alone does not merge monorepo packages or distinct registry endpoints.",
  hard_link_merge_diagnostic: {
    entities: 747,
    note:
      "The generic helper collapsed 817 records to 747 because it treats a shared GitHub repository as identity. That is unsafe for MCP monorepos, so the diagnostic is preserved but not used for page gating.",
    file: "entities-hard-link-merged.csv",
  },
  confidence: confidenceCounts,
  lifecycle: lifecycleCounts,
  existing_health_pages: rows.length,
  existing_landing_pages: rows.filter((row) => row.existing_landing_url).length,
  existing_landings_without_runnable_entry: nonRunnableLandings.length,
};
await fs.writeFile(summaryPath, `${JSON.stringify(summary, null, 2)}\n`, "utf8");

console.log(JSON.stringify(summary));
