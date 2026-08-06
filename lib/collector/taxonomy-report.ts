import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { MCPServer } from "../types";
import { taxonomyForServer } from "../taxonomy";

const REVIEW_REPORT_PATH = join(process.cwd(), "data", "taxonomy-review.json");

const STOP_WORDS = new Set([
  "about", "access", "agent", "agents", "allows", "based", "claude", "context", "data",
  "from", "github", "into", "model", "mcp", "mcp-server", "official", "open", "protocol", "provide", "provides", "server", "servers", "smithery",
  "service", "support", "supports", "that", "their", "this", "through", "tool", "tools", "using",
  "with", "your",
]);

export interface TaxonomyAudit {
  generatedAt: string;
  total: number;
  summary: {
    needsReview: number;
    needsReviewRatePct: number;
    uncategorized: number;
    uncategorizedRatePct: number;
    largestCategory: string | null;
    largestCategoryRatePct: number;
  };
  alerts: string[];
  categoryCounts: Record<string, number>;
  topicCounts: Record<string, number>;
  emergingTerms: Array<{ term: string; count: number }>;
  reviewQueue: Array<{
    slug: string;
    name: string;
    confidence: number;
    topics: string[];
    description: string;
  }>;
}

function increment(target: Record<string, number>, key: string): void {
  target[key] = (target[key] ?? 0) + 1;
}

function percent(value: number, total: number): number {
  return total === 0 ? 0 : Number(((value / total) * 100).toFixed(1));
}

/** 每次采集都生成同口径的分类健康报告，避免 taxonomy 随目录增长静默失效。 */
export function buildTaxonomyAudit(servers: MCPServer[]): TaxonomyAudit {
  const categoryCounts: Record<string, number> = {};
  const topicCounts: Record<string, number> = {};
  const reviewQueue: TaxonomyAudit["reviewQueue"] = [];
  const termCounts = new Map<string, number>();

  for (const server of servers) {
    const taxonomy = taxonomyForServer(server);
    for (const category of taxonomy.categories) increment(categoryCounts, category);
    for (const topic of taxonomy.topics) increment(topicCounts, topic);
    if (!taxonomy.needsCategoryReview) continue;

    reviewQueue.push({
      slug: server.slug,
      name: server.name,
      confidence: taxonomy.categoryConfidence,
      topics: taxonomy.topics,
      description: server.description.slice(0, 240),
    });
    if (taxonomy.topics.length > 0) continue;
    const tokens = new Set(
      `${server.name} ${server.description}`
        .toLowerCase()
        .match(/[a-z][a-z0-9-]{3,}/g)
        ?.filter((token) => !STOP_WORDS.has(token)) ?? [],
    );
    for (const token of tokens) termCounts.set(token, (termCounts.get(token) ?? 0) + 1);
  }

  reviewQueue.sort((a, b) => a.confidence - b.confidence || a.name.localeCompare(b.name));
  const total = servers.length;
  const uncategorized = categoryCounts.misc ?? 0;
  const categoryRows = Object.entries(categoryCounts).filter(([slug]) => slug !== "misc");
  const largestCategory = categoryRows.sort((a, b) => b[1] - a[1])[0] ?? null;
  const needsReviewRatePct = percent(reviewQueue.length, total);
  const uncategorizedRatePct = percent(uncategorized, total);
  const largestCategoryRatePct = percent(largestCategory?.[1] ?? 0, total);
  const alerts: string[] = [];
  if (uncategorizedRatePct > 5) alerts.push(`待归类占比 ${uncategorizedRatePct}%，超过 5% 审核线`);
  if (largestCategory && largestCategoryRatePct > 30) {
    alerts.push(`${largestCategory[0]} 占比 ${largestCategoryRatePct}%，超过 30% 拆分评估线`);
  }
  if (needsReviewRatePct > 10) alerts.push(`低置信度/待审核占比 ${needsReviewRatePct}%，超过 10%`);

  return {
    generatedAt: new Date().toISOString(),
    total,
    summary: {
      needsReview: reviewQueue.length,
      needsReviewRatePct,
      uncategorized,
      uncategorizedRatePct,
      largestCategory: largestCategory?.[0] ?? null,
      largestCategoryRatePct,
    },
    alerts,
    categoryCounts: Object.fromEntries(Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])),
    topicCounts: Object.fromEntries(Object.entries(topicCounts).sort((a, b) => b[1] - a[1])),
    emergingTerms: Array.from(termCounts.entries())
      .filter(([, count]) => count >= 3)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 50)
      .map(([term, count]) => ({ term, count })),
    reviewQueue,
  };
}

export async function writeTaxonomyAudit(servers: MCPServer[]): Promise<TaxonomyAudit> {
  const report = buildTaxonomyAudit(servers);
  await mkdir(join(process.cwd(), "data"), { recursive: true });
  await writeFile(REVIEW_REPORT_PATH, JSON.stringify(report, null, 2), "utf8");
  return report;
}
