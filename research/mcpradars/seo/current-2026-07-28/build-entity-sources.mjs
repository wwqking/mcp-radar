import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const runDir = path.dirname(fileURLToPath(import.meta.url));
const projectDir = path.resolve(runDir, "../../../..");
const data = JSON.parse(
  await fs.readFile(path.join(projectDir, "data/servers.json"), "utf8"),
);
const servers = Array.isArray(data) ? data : data.servers;
const collectedAt = data.collectedAt ?? "2026-07-28";
const outDir = path.join(runDir, "raw/entity-sources");

function repoId(repoUrl) {
  const match = String(repoUrl ?? "").match(/github\.com\/([^/]+\/[^/#?]+)/i);
  return match?.[1]?.replace(/\.git$/i, "") ?? "";
}

function ownerOf(repoUrl) {
  return repoId(repoUrl).split("/")[0] ?? "";
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

function base(server, source) {
  return {
    name: server.name || server.slug,
    source,
    github_repo: repoId(server.repoUrl),
    npm_package: server.npmPackage || "",
    owner: ownerOf(server.repoUrl),
    official: server.signals?.inOfficialRegistry ? "true" : "false",
    auth_type: authType(server),
    license: server.signals?.license || "",
    latest_release: "",
    maintenance_status: server.lifecycle || "",
    registry_status: server.signals?.inOfficialRegistry ? "active" : "unverified",
    stars: server.signals?.stars ?? 0,
    downloads: server.signals?.npmWeeklyDownloads ?? 0,
    last_commit: lastCommit(server),
  };
}

const registry = [];
const github = [];
const npm = [];
for (const server of servers) {
  if (server.signals?.inOfficialRegistry) {
    registry.push({
      ...base(server, "official_mcp_registry"),
      registry_id: server.slug,
    });
  }
  if (server.repoUrl) {
    github.push({
      ...base(server, "github"),
      registry_id: server.signals?.inOfficialRegistry ? server.slug : "",
    });
  }
  if (server.npmPackage) {
    npm.push({
      ...base(server, "npm"),
      registry_id: server.signals?.inOfficialRegistry ? server.slug : "",
    });
  }
}

await fs.mkdir(outDir, { recursive: true });
for (const [name, rows] of Object.entries({ registry, github, npm })) {
  const file = path.join(outDir, `${name}-${collectedAt}.json`);
  try {
    await fs.access(file);
    throw new Error(`Raw entity source already exists: ${file}`);
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
  await fs.writeFile(file, `${JSON.stringify(rows, null, 2)}\n`, "utf8");
}

console.log(
  JSON.stringify({
    collected_at: collectedAt,
    dataset_entities: servers.length,
    registry_rows: registry.length,
    github_rows: github.length,
    npm_rows: npm.length,
  }),
);
