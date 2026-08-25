import { readFile } from "node:fs/promises";
import { evaluateServerIndexability } from "../lib/seo-indexability";
import { SEO_LANDINGS } from "../lib/seo-landing";
import type { MCPServer } from "../lib/types";

interface Dataset {
  collectedAt: string;
  servers: MCPServer[];
}

const dataset = JSON.parse(
  await readFile(new URL("../data/servers.json", import.meta.url), "utf8"),
) as Dataset;
const bySlug = new Map(dataset.servers.map((server) => [server.slug, server]));
const editorialTargetSlugs = new Set(
  SEO_LANDINGS.map((landing) => landing.serverSlug),
);
const reasonCounts = new Map<string, number>();
const indexable: MCPServer[] = [];
const browsable: MCPServer[] = [];

for (const server of dataset.servers) {
  const decision = evaluateServerIndexability(server, "en");
  reasonCounts.set(decision.reason, (reasonCounts.get(decision.reason) ?? 0) + 1);
  if (decision.index) indexable.push(server);
  if (decision.index || editorialTargetSlugs.has(server.slug)) browsable.push(server);
}

const missingLandingTargets = SEO_LANDINGS.flatMap((landing) => {
  const server = bySlug.get(landing.serverSlug);
  return server ? [] : [`${landing.toolSlug}: missing ${landing.serverSlug}`];
});
const noindexLandingTargets = SEO_LANDINGS.flatMap((landing) => {
  const server = bySlug.get(landing.serverSlug);
  if (!server) return [];
  const decision = evaluateServerIndexability(server, "en");
  return decision.index
    ? []
    : [`${landing.toolSlug}: ${landing.serverSlug} (${decision.reason})`];
});

const errors: string[] = [];
if (indexable.length === 0) errors.push("No English server pages passed the index gate.");
if (indexable.length > 500) {
  errors.push(`Indexable English server pages exceed recovery cap: ${indexable.length} > 500.`);
}
if (browsable.length > 500) {
  errors.push(`Browsable server detail pages exceed recovery cap: ${browsable.length} > 500.`);
}
if (missingLandingTargets.length > 0) {
  errors.push(`Legacy landing redirects have missing targets: ${missingLandingTargets.join(", ")}`);
}

console.log(
  JSON.stringify(
    {
      datasetDate: dataset.collectedAt,
      totalServerRecords: dataset.servers.length,
      indexableEnglishServerPages: indexable.length,
      browsableEnglishServerPages: browsable.length,
      noindexEnglishServerPages: browsable.length - indexable.length,
      removedEnglishServerPages: dataset.servers.length - browsable.length,
      noindexChineseServerPages: browsable.length,
      removedChineseServerPages: dataset.servers.length - browsable.length,
      legacyLandingRedirects: SEO_LANDINGS.length * 2,
      noindexLandingTargets,
      reasonCounts: Object.fromEntries([...reasonCounts.entries()].sort()),
      errors,
    },
    null,
    2,
  ),
);

if (errors.length > 0) process.exitCode = 1;
