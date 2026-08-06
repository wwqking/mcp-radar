import { readFile } from "node:fs/promises";
import { normalizePublishedServers } from "../lib/collector/build-data";
import type { MCPServer } from "../lib/types";
import { CATEGORIES } from "../lib/constants";
import { TAXONOMY_TOPICS, taxonomyForServer } from "../lib/taxonomy";

interface RawDataset {
  collectedAt: string;
  servers: MCPServer[];
}

const dataset = JSON.parse(
  await readFile(new URL("../data/servers.json", import.meta.url), "utf8"),
) as RawDataset;
const servers = normalizePublishedServers(dataset.servers);
const errors: string[] = [];
const slugs = new Set<string>();
const categorySlugs = new Set(CATEGORIES.map((category) => category.slug));
const topicSlugs = new Set(TAXONOMY_TOPICS.map((topic) => topic.slug));

for (const server of servers) {
  if (slugs.has(server.slug)) errors.push(`duplicate slug: ${server.slug}`);
  slugs.add(server.slug);
  const taxonomy = taxonomyForServer(server);
  for (const category of taxonomy.categories) {
    if (!categorySlugs.has(category)) errors.push(`unknown category: ${server.slug}=${category}`);
  }
  for (const topic of taxonomy.topics) {
    if (!topicSlugs.has(topic)) errors.push(`unknown topic: ${server.slug}=${topic}`);
  }
  if (taxonomy.categoryConfidence < 0 || taxonomy.categoryConfidence > 1) {
    errors.push(`invalid taxonomy confidence: ${server.slug}=${taxonomy.categoryConfidence}`);
  }

  if (!Number.isFinite(server.trustScore) || server.trustScore < 0 || server.trustScore > 100) {
    errors.push(`invalid TrustScore: ${server.slug}=${server.trustScore}`);
  }
  if (
    server.signals.inOfficialRegistry &&
    !server.signals.officialRegistryVerifiedAt
  ) {
    errors.push(`registry flag lacks verification date: ${server.slug}`);
  }
  if (
    server.signals.hasRunnableEntry &&
    !server.hasPublishedPackage &&
    !server.npmPackage &&
    !server.remoteEndpoints?.length
  ) {
    errors.push(`runnable flag lacks package or endpoint: ${server.slug}`);
  }
}

if (errors.length > 0) {
  console.error(errors.slice(0, 50).join("\n"));
  process.exitCode = 1;
} else {
  const count = (predicate: (server: MCPServer) => boolean) =>
    servers.filter(predicate).length;
  console.log(
    JSON.stringify(
      {
        snapshot: dataset.collectedAt,
        total: servers.length,
        registryVerified: count((s) => s.signals.inOfficialRegistry),
        registryPendingReverification: count(
          (s) => s.signals.officialRegistryVerifiedAt === undefined,
        ),
        runnable: count((s) => s.signals.hasRunnableEntry),
        withIssueReplyRate: count(
          (s) => s.signals.issueResponseRatePct != null,
        ),
        status: "ok",
      },
      null,
      2,
    ),
  );
}
