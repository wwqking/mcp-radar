import { getAllServers, getLastUpdated } from "@/lib/data";
import { taxonomyForServer } from "@/lib/taxonomy";

export const dynamic = "force-static";

export async function GET() {
  const [servers, snapshotDate] = await Promise.all([
    getAllServers(),
    getLastUpdated(),
  ]);

  return Response.json(
    {
      name: "MCP Radar server health dataset",
      snapshotDate,
      methodology: "https://www.mcpradars.com/en/about",
      report: "https://www.mcpradars.com/en/mcp-server-health-report",
      caveat:
        "TrustScore is a maintenance and adoption screening signal, not a user rating, security certification, or production-readiness guarantee.",
      count: servers.length,
      servers: servers.map((server) => {
        const taxonomy = taxonomyForServer(server);
        return {
          slug: server.slug,
          name: server.name,
          categories: taxonomy.categories,
          primaryCategory: taxonomy.primaryCategory,
          topics: taxonomy.topics,
          categoryConfidence: taxonomy.categoryConfidence,
          needsCategoryReview: taxonomy.needsCategoryReview,
          lifecycle: server.lifecycle,
          trustScore: server.trustScore,
          dataUpdatedAt: server.signals.dataUpdatedAt,
          signals: {
          lastCommitDaysAgo: server.signals.lastCommitDaysAgo,
          commits90d: server.signals.commits90d,
          recentIssuesWithRepliesPct:
            server.signals.issueResponseRatePct ?? null,
          archived: server.signals.archived,
          stars: server.signals.stars,
          npmWeeklyDownloads: server.signals.npmWeeklyDownloads,
          license: server.signals.license,
          officialRegistryStatus:
            server.signals.officialRegistryVerifiedAt === undefined
              ? "unknown"
              : server.signals.inOfficialRegistry
                ? "verified"
                : "not-listed",
          hasPublishedRunnableEntry:
            server.signals.hasRunnableEntry,
          repositoryAuditable:
            server.signals.repoAuditable ?? Boolean(server.repoUrl),
          },
          sources: [
          ...(server.repoUrl ? [server.repoUrl] : []),
          ...(server.npmPackage
            ? [`https://www.npmjs.com/package/${server.npmPackage}`]
            : []),
          ...(server.signals.inOfficialRegistry
            ? [server.registryUrl]
            : []),
          ],
          page: `https://www.mcpradars.com/en/server/${server.slug}`,
        };
      }),
    },
    {
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
        "Content-Disposition": `inline; filename="mcp-radar-${snapshotDate}.json"`,
      },
    },
  );
}
