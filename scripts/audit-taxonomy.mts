import { readFile } from "node:fs/promises";
import { normalizePublishedServers } from "../lib/collector/build-data";
import { buildTaxonomyAudit, writeTaxonomyAudit } from "../lib/collector/taxonomy-report";
import type { MCPServer } from "../lib/types";

interface Dataset {
  servers: MCPServer[];
}

const dataset = JSON.parse(
  await readFile(new URL("../data/servers.json", import.meta.url), "utf8"),
) as Dataset;
const servers = normalizePublishedServers(dataset.servers);
const report = process.argv.includes("--write")
  ? await writeTaxonomyAudit(servers)
  : buildTaxonomyAudit(servers);

console.log(
  JSON.stringify(
    {
      total: report.total,
      summary: report.summary,
      alerts: report.alerts,
      categories: report.categoryCounts,
      topics: report.topicCounts,
      emergingTerms: report.emergingTerms.slice(0, 20),
      reportWritten: process.argv.includes("--write") ? "data/taxonomy-review.json" : null,
    },
    null,
    2,
  ),
);
