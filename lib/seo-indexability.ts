import allowlist from "@/data/seo-index-allowlist.json";
import { getServerCapability } from "@/lib/server-capabilities";
import type { Locale } from "@/lib/i18n/locales";
import { getSeoLandingByServer } from "@/lib/seo-landing";
import type { MCPServer } from "@/lib/types";

export type ServerIndexReason =
  | "indexable"
  | "untranslated-locale"
  | "no-search-demand-or-editorial-evidence"
  | "missing-auditable-source"
  | "missing-runnable-entry";

export interface ServerIndexDecision {
  index: boolean;
  reason: ServerIndexReason;
  evidence: {
    gscDemand: boolean;
    editorialCapability: boolean;
    installVerified: boolean;
    exactRunnableEntry: boolean;
    auditableSource: boolean;
  };
}

const GSC_DEMAND_SLUGS = new Set(Object.keys(allowlist.entries));

function hasExactRunnableEntry(server: MCPServer): boolean {
  const hasPackage = Boolean(
    server.packages?.some(
      (pkg) => pkg.identifier.trim().length > 0 && pkg.registryType.trim().length > 0,
    ),
  );
  const hasRemote = Boolean(
    server.remoteEndpoints?.some((endpoint) => /^https?:\/\//.test(endpoint.url)),
  );
  return server.signals.hasRunnableEntry && (hasPackage || hasRemote);
}

/**
 * Recovery-period admission gate for programmatic server detail pages.
 *
 * New catalog records are noindex by default. An English page is admitted only
 * when it has first-party demand or editorial/firsthand evidence, an auditable
 * source, and a concrete package or remote endpoint.
 */
export function evaluateServerIndexability(
  server: MCPServer,
  locale: Locale,
): ServerIndexDecision {
  const evidence = {
    gscDemand: GSC_DEMAND_SLUGS.has(server.slug),
    editorialCapability: Boolean(
      getServerCapability(server.slug) || getSeoLandingByServer(server.slug),
    ),
    installVerified: Boolean(server.installVerified),
    exactRunnableEntry: hasExactRunnableEntry(server),
    auditableSource: Boolean(server.repoUrl) && server.signals.repoAuditable !== false,
  };

  if (locale !== "en") {
    return { index: false, reason: "untranslated-locale", evidence };
  }
  if (!evidence.auditableSource) {
    return { index: false, reason: "missing-auditable-source", evidence };
  }
  if (!evidence.exactRunnableEntry) {
    return { index: false, reason: "missing-runnable-entry", evidence };
  }
  if (!(evidence.gscDemand || evidence.editorialCapability || evidence.installVerified)) {
    return {
      index: false,
      reason: "no-search-demand-or-editorial-evidence",
      evidence,
    };
  }

  return { index: true, reason: "indexable", evidence };
}

export function isServerIndexable(server: MCPServer): boolean {
  return evaluateServerIndexability(server, "en").index;
}

export const seoIndexAllowlistMetadata = {
  version: allowlist.version,
  exportDate: allowlist.exportDate,
  demandedServerCount: GSC_DEMAND_SLUGS.size,
};
