import type { MCPServer } from "./types";

export interface ReportBreakdownItem {
  key: string;
  count: number;
  percent: number;
}

export interface ReportGrowthItem {
  slug: string;
  name: string;
  repoUrl: string | null;
  stars: number;
  starsWeeklyDelta: number;
  trustScore: number;
}

export interface EcosystemReport {
  total: number;
  uniqueRepositories: number;
  active: number;
  activePercent: number;
  dying: number;
  dyingPercent: number;
  dead: number;
  deadPercent: number;
  unverifiable: number;
  unverifiablePercent: number;
  remote: number;
  remotePercent: number;
  runnable: number;
  runnablePercent: number;
  officialRegistry: number;
  officialRegistryPercent: number;
  localRunnable: number;
  localRunnablePercent: number;
  recentCommit: number;
  recentCommitPercent: number;
  knownLicense: number;
  knownLicensePercent: number;
  installVerified: number;
  installVerifiedPercent: number;
  medianTrustScore: number;
  lifecycle: ReportBreakdownItem[];
  categories: ReportBreakdownItem[];
  licenses: ReportBreakdownItem[];
  fastestGrowing: ReportGrowthItem[];
}

function percent(count: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((count / total) * 1000) / 10;
}

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? Math.round(((sorted[middle - 1] + sorted[middle]) / 2) * 10) / 10
    : sorted[middle];
}

function countBy(values: string[], total: number): ReportBreakdownItem[] {
  const counts = new Map<string, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts.entries()]
    .map(([key, count]) => ({ key, count, percent: percent(count, total) }))
    .sort((a, b) => b.count - a.count || a.key.localeCompare(b.key));
}

export function buildEcosystemReport(servers: MCPServer[]): EcosystemReport {
  const total = servers.length;
  const active = servers.filter((server) => server.lifecycle === "active").length;
  const dying = servers.filter((server) => server.lifecycle === "dying").length;
  const dead = servers.filter((server) => server.lifecycle === "dead").length;
  const unverifiable = servers.filter((server) => server.lifecycle === "unverifiable").length;
  const remote = servers.filter((server) => Boolean(server.remoteEndpoints?.length)).length;
  const runnable = servers.filter(
    (server) => server.signals.hasRunnableEntry || Boolean(server.remoteEndpoints?.length),
  ).length;
  const officialRegistry = servers.filter(
    (server) =>
      server.signals.officialRegistryVerifiedAt !== undefined &&
      server.signals.inOfficialRegistry,
  ).length;
  const localRunnable = servers.filter((server) => server.signals.hasRunnableEntry).length;
  const recentCommit = servers.filter(
    (server) =>
      server.signals.lastCommitDaysAgo !== null &&
      server.signals.lastCommitDaysAgo <= 30,
  ).length;
  const knownLicense = servers.filter((server) => Boolean(server.signals.license)).length;
  const installVerified = servers.filter((server) => Boolean(server.installVerified)).length;

  const repositoryKeys = new Set(
    servers
      .map((server) => server.repoUrl?.replace(/\/$/, ""))
      .filter((repo): repo is string => Boolean(repo)),
  );

  const growthRepositoryKeys = new Set<string>();
  const fastestGrowing = [...servers]
    .filter((server) => server.signals.starsWeeklyDelta > 0)
    .sort(
      (a, b) =>
        b.signals.starsWeeklyDelta - a.signals.starsWeeklyDelta ||
        b.trustScore - a.trustScore,
    )
    .filter((server) => {
      const key = server.repoUrl?.replace(/\/$/, "") ?? `slug:${server.slug}`;
      if (growthRepositoryKeys.has(key)) return false;
      growthRepositoryKeys.add(key);
      return true;
    })
    .slice(0, 10)
    .map((server) => ({
      slug: server.slug,
      name: server.name,
      repoUrl: server.repoUrl,
      stars: server.signals.stars,
      starsWeeklyDelta: server.signals.starsWeeklyDelta,
      trustScore: server.trustScore,
    }));

  return {
    total,
    uniqueRepositories: repositoryKeys.size,
    active,
    activePercent: percent(active, total),
    dying,
    dyingPercent: percent(dying, total),
    dead,
    deadPercent: percent(dead, total),
    unverifiable,
    unverifiablePercent: percent(unverifiable, total),
    remote,
    remotePercent: percent(remote, total),
    runnable,
    runnablePercent: percent(runnable, total),
    officialRegistry,
    officialRegistryPercent: percent(officialRegistry, total),
    localRunnable,
    localRunnablePercent: percent(localRunnable, total),
    recentCommit,
    recentCommitPercent: percent(recentCommit, total),
    knownLicense,
    knownLicensePercent: percent(knownLicense, total),
    installVerified,
    installVerifiedPercent: percent(installVerified, total),
    medianTrustScore: median(servers.map((server) => server.trustScore)),
    lifecycle: [
      { key: "active", count: active, percent: percent(active, total) },
      { key: "dying", count: dying, percent: percent(dying, total) },
      { key: "dead", count: dead, percent: percent(dead, total) },
      { key: "unverifiable", count: unverifiable, percent: percent(unverifiable, total) },
    ],
    categories: countBy(servers.flatMap((server) => server.categories), total),
    licenses: countBy(
      servers.map((server) => server.signals.license ?? "Unknown"),
      total,
    ),
    fastestGrowing,
  };
}
