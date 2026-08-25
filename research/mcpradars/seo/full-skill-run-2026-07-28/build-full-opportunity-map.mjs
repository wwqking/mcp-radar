import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const runDir = path.join(
  root,
  "research/mcpradars/seo/full-skill-run-2026-07-28",
);

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];
    if (quoted) {
      if (char === '"' && next === '"') {
        field += '"';
        index += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        field += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  const header = rows[0];
  return rows
    .slice(1)
    .filter((candidate) => candidate.some(Boolean))
    .map((candidate) =>
      Object.fromEntries(
        header.map((column, index) => [column, candidate[index] ?? ""]),
      ),
    );
}

function csvCell(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text)
    ? `"${text.replaceAll('"', '""')}"`
    : text;
}

function writeCsv(filename, rows, headers) {
  const output = [
    headers.join(","),
    ...rows.map((row) =>
      headers.map((header) => csvCell(row[header])).join(","),
    ),
  ].join("\n");
  fs.writeFileSync(path.join(runDir, filename), `${output}\n`);
}

function normalize(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function slugify(value) {
  return normalize(value).replaceAll(" ", "-");
}

const keywords = parseCsv(
  fs.readFileSync(path.join(runDir, "keywords.csv"), "utf8"),
);
const classifications = parseCsv(
  fs.readFileSync(path.join(runDir, "entity-classification.csv"), "utf8"),
);
const classificationByKeyword = new Map(
  classifications.map((row) => [row.keyword.toLowerCase(), row]),
);
const toolOpportunities = parseCsv(
  fs.readFileSync(
    path.join(root, "research/mcpradars/seo-r3/buildable-tools-clean.csv"),
    "utf8",
  ),
);
const servers = JSON.parse(
  fs.readFileSync(path.join(root, "data/servers.json"), "utf8"),
).servers;
const serversBySlug = new Map(servers.map((server) => [server.slug, server]));
const viableServers = servers.filter(
  (server) =>
    server.lifecycle === "active" &&
    server.signals?.hasRunnableEntry &&
    Number(server.trustScore || 0) >= 50,
);

const landingSource = fs.readFileSync(
  path.join(root, "lib/seo-landing.ts"),
  "utf8",
);
const existingToolSlugs = new Set(
  [...landingSource.matchAll(/toolSlug:\s*"([^"]+)"/g)].map(
    (match) => match[1],
  ),
);
const existingServerSlugs = new Set(
  [...landingSource.matchAll(/serverSlug:\s*"([^"]+)"/g)].map(
    (match) => match[1],
  ),
);
const existingGuideSource = fs.readFileSync(
  path.join(root, "lib/guides.ts"),
  "utf8",
);
const existingGuideSlugs = new Set(
  [...existingGuideSource.matchAll(/\{\s*slug:\s*"([^"]+)"/g)].map(
    (match) => match[1],
  ),
);

const entityStopWords = new Set(["mcp", "server", "servers", "the", "a", "an"]);
function entityPhrase(keyword) {
  return normalize(keyword)
    .split(" ")
    .filter((token) => !entityStopWords.has(token))
    .join(" ");
}

function identityText(server) {
  return normalize([server.slug, server.name, server.npmPackage]
    .filter(Boolean)
    .join(" "))
    .replace(/\b(ai smithery|io github|app)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function identityMatch(server, phrase) {
  if (!phrase) return 0;
  const identity = identityText(server);
  const identityWords = new Set(identity.split(" "));
  const phraseWords = phrase.split(" ");
  if (identity.includes(phrase)) return 3;
  if (phraseWords.every((token) => identityWords.has(token))) return 2;
  return 0;
}

const semanticReviewTools = new Set([
  "analytics",
  "atlas",
  "catalog",
  "chart",
  "download",
  "email",
  "legal",
  "manager",
  "plane",
  "reddit",
  "scan",
  "stock",
]);

const entityRows = toolOpportunities.map((opportunity) => {
  const classification =
    classificationByKeyword.get(opportunity.primary_keyword.toLowerCase());
  const classifierVerdict = classification?.verdict ?? "missing";
  const phrase = entityPhrase(opportunity.primary_keyword);
  const oldServer = serversBySlug.get(opportunity.server_slug);
  const candidates = viableServers
    .map((server) => ({
      server,
      match: identityMatch(server, phrase),
    }))
    .filter((candidate) => candidate.match > 0)
    .sort(
      (left, right) =>
        right.match - left.match ||
        Number(right.server.trustScore || 0) -
          Number(left.server.trustScore || 0),
    );

  let currentServer = null;
  let matchConfidence = "";
  if (
    oldServer &&
    viableServers.includes(oldServer) &&
    identityMatch(oldServer, phrase) > 0
  ) {
    currentServer = oldServer;
    matchConfidence = "original hard-linked entity still viable";
  } else if (
    candidates[0]?.match === 3 &&
    (
      candidates.length === 1 ||
      candidates[0].match > candidates[1].match ||
      Number(candidates[0].server.trustScore || 0) -
        Number(candidates[1].server.trustScore || 0) >=
        5
    )
  ) {
    currentServer = candidates[0].server;
    matchConfidence = "unique current identity phrase";
  } else if (candidates.length === 1 && candidates[0].match === 2) {
    currentServer = candidates[0].server;
    matchConfidence = "unique current identity tokens";
  }

  let action;
  let reason;
  if (existingToolSlugs.has(opportunity.tool)) {
    action = "enrich_existing";
    reason = "tool landing already exists; absorb its keyword cluster";
  } else if (opportunity.tool === "skills") {
    action = "scope_excluded";
    reason = "Agent Skills belongs to the separate skills site";
  } else if (!["entity", "missing"].includes(classifierVerdict)) {
    action = "semantic_review";
    reason = `skill classifier verdict=${classifierVerdict}`;
  } else if (semanticReviewTools.has(opportunity.tool)) {
    action = "semantic_review";
    reason = "broad noun does not prove the selected implementation matches the search intent";
  } else if (!currentServer) {
    action = candidates.length ? "semantic_review" : "collect_required";
    reason = candidates.length
      ? `${candidates.length} current identity matches; no unique winner`
      : "measured demand exists, but no active runnable current entity matches the intent";
  } else if (existingServerSlugs.has(currentServer.slug)) {
    action = "enrich_existing";
    reason = "matched entity already powers an existing tool landing";
  } else {
    action = "create_ready";
    reason = "measured demand + unique current identity + active runnable entity + trust>=50";
  }

  return {
    module: "entity",
    action,
    target_url: `/servers/${opportunity.tool}-mcp-server`,
    page_title: `${opportunity.primary_keyword.replace(/\bmcp\b/gi, "MCP")} — setup, health, and alternatives`,
    primary_keyword: opportunity.primary_keyword,
    primary_volume_us: opportunity.primary_volume,
    primary_kd: opportunity.primary_kd,
    cluster_volume_us: opportunity.merged_volume,
    keyword_count: opportunity.kw_count,
    classifier_verdict: classifierVerdict,
    current_entity_slug: currentServer?.slug ?? "",
    trust_score: currentServer?.trustScore ?? "",
    runnable_now: currentServer ? "yes" : "",
    match_confidence: matchConfidence,
    reason,
    source: "seo-r3/buildable-tools-clean.csv + full skill classifier + current data/servers.json",
  };
});

// One canonical entity gets one page. When two demand labels map to the same
// entity (for example Magic and 21st Dev), keep the larger cluster as the URL
// and explicitly merge the smaller cluster into it.
const readyByEntity = new Map();
for (const row of entityRows
  .filter((candidate) => candidate.action === "create_ready")
  .sort(
    (left, right) =>
      Number(right.cluster_volume_us) - Number(left.cluster_volume_us),
  )) {
  const canonical = readyByEntity.get(row.current_entity_slug);
  if (canonical) {
    row.action = "merge_into_entity_page";
    row.reason = `same current entity as ${canonical.target_url}; merge keyword cluster`;
    row.target_url = canonical.target_url;
  } else {
    readyByEntity.set(row.current_entity_slug, row);
  }
}

const contentDefinitions = [
  {
    id: "cursor-enoent",
    url: "/guides/cursor-mcp-spawn-npx-enoent",
    type: "troubleshooting",
    action: "create_ready",
    patterns: [/cursor mcp spawn npx enoent/i],
  },
  {
    id: "timeout-32001",
    url: "/guides/mcp-error-32001-request-timed-out",
    type: "troubleshooting",
    action: "create_ready",
    patterns: [/mcp error -?32001|mcp (tool |client )?timeout/i],
  },
  {
    id: "best-marketing",
    url: "/guides/best-mcp-servers-for-marketing",
    type: "best-of",
    action: "create_ready",
    patterns: [/best mcp servers? for business sales marketing/i],
  },
  {
    id: "best-claude-code",
    url: "/guides/best-mcp-servers-for-claude-code",
    type: "best-of",
    action: "create_ready",
    patterns: [/best .*mcp.*claude code|best .*claude code.*mcp/i],
  },
  {
    id: "best-cursor",
    url: "/guides/best-mcp-servers-for-cursor",
    type: "best-of",
    action: "create_ready",
    patterns: [/best .*mcp.*cursor|best .*cursor.*mcp/i],
  },
  {
    id: "best-ai-tools",
    url: "/guides/best-mcp-servers-for-ai-tools",
    type: "best-of",
    action: "create_ready",
    patterns: [/best mcp servers? ai tools/i],
  },
  {
    id: "best-developers",
    url: "/guides/best-mcp-servers-for-developers",
    type: "best-of",
    action: "create_ready",
    patterns: [
      /best mcp servers? for (developers|coding|vibe coding)/i,
      /useful mcp servers? for developers/i,
    ],
  },
  {
    id: "best-seo",
    url: "/guides/best-mcp-servers-for-seo",
    type: "best-of",
    action: "create_ready",
    patterns: [/best mcp servers? for seo/i],
  },
  {
    id: "best-search",
    url: "/guides/best-search-mcp-servers",
    type: "best-of",
    action: "create_ready",
    patterns: [/best search mcp/i],
  },
  {
    id: "best-ui",
    url: "/guides/best-ui-mcp-servers",
    type: "best-of",
    action: "create_ready",
    patterns: [/best ui mcp/i],
  },
  {
    id: "best-general",
    url: "/guides/best-mcp-servers",
    type: "best-of",
    action: "create_ready",
    patterns: [
      /^(best|top) mcps?( servers?)?( 20\d\d)?$/i,
      /^best mcp server$/i,
    ],
  },
  {
    id: "build-server",
    url: "/guides/how-to-build-an-mcp-server",
    type: "how-to",
    action: "create_ready",
    patterns: [
      /how to (build|create|make|write|develop|implement).*mcp server/i,
      /(build|create|make|writing|creating|developing) (an? )?mcp server/i,
      /mcp server tutorial python|mcp tutorial python/i,
    ],
  },
  {
    id: "server-examples",
    url: "/guides/mcp-server-examples",
    type: "examples",
    action: "create_ready",
    patterns: [
      /mcp (python )?server examples?/i,
      /examples? of mcp servers?/i,
      /model context protocol example/i,
    ],
  },
  {
    id: "claude-desktop",
    url: "/guides/add-mcp-server-to-claude-desktop",
    type: "client setup",
    action: "create_ready",
    patterns: [
      /claude desktop.*mcp.*(config|setup|add|connect|install|use)/i,
      /(add|connect|use).*mcp.*claude desktop/i,
    ],
  },
  {
    id: "vscode",
    url: "/guides/use-mcp-servers-in-vscode",
    type: "client setup",
    action: "create_ready",
    patterns: [
      /(vs code|vscode).*mcp.*(client|server|extension|add|use|config)/i,
      /(add|use).*mcp.*(vs code|vscode)/i,
    ],
  },
  {
    id: "cursor",
    url: "/guides/add-mcp-server-to-cursor",
    type: "client setup",
    action: "create_ready",
    patterns: [
      /(add|configure|setup|connect).*mcp.*cursor/i,
      /cursor.*(add|configure|setup|connect).*mcp/i,
    ],
  },
  {
    id: "chatgpt",
    url: "/guides/add-mcp-server-to-chatgpt",
    type: "client setup",
    action: "create_ready",
    patterns: [
      /(add|connect|use).*mcp.*chatgpt/i,
      /chatgpt.*(add|connect|use).*mcp/i,
    ],
  },
  {
    id: "gemini",
    url: "/guides/add-mcp-server-to-gemini-cli",
    type: "client setup",
    action: "create_ready",
    patterns: [
      /gemini.*(add|connect|setup|configure).*mcp/i,
      /(add|connect|setup|configure).*mcp.*gemini/i,
    ],
  },
  {
    id: "codex",
    url: "/guides/add-mcp-server-to-codex",
    type: "client setup",
    action: "create_ready",
    patterns: [/codex.*(add|install|connect|setup|configure).*mcp/i],
  },
  {
    id: "claude-free",
    url: "/guides/use-mcp-with-claude-free-plan",
    type: "client setup",
    action: "create_ready",
    patterns: [/mcp.*claude free plan|claude.*mcp free/i],
  },
  {
    id: "test-inspector",
    url: "/guides/test-mcp-server-with-inspector",
    type: "testing",
    action: "create_ready",
    patterns: [/how to test an? mcp server|how to use mcp inspector/i],
  },
  {
    id: "deploy-host",
    url: "/guides/how-to-deploy-and-host-an-mcp-server",
    type: "how-to",
    action: "create_ready",
    patterns: [
      /(deploy|host|hosting).*mcp server/i,
      /how to (deploy|host).*mcp server/i,
    ],
  },
  {
    id: "registry",
    url: "/guides/mcp-registry",
    type: "explainer",
    action: "create_ready",
    patterns: [/mcp (server )?registry|model context protocol registry/i],
  },
  {
    id: "oauth-auth",
    url: "/guides/mcp-authentication-and-oauth",
    type: "security guide",
    action: "create_ready",
    patterns: [
      /mcp.*(oauth|authentication|authorization)/i,
      /(oauth|authentication|authorization).*mcp/i,
    ],
  },
  {
    id: "open-source-license",
    url: "/guides/is-mcp-open-source",
    type: "explainer",
    action: "create_ready",
    patterns: [/model context protocol.*open source|mcp.*open source.*license/i],
  },
  {
    id: "free-pricing",
    url: "/guides/are-mcp-servers-free",
    type: "explainer",
    action: "create_ready",
    patterns: [/are mcp servers free|free mcp (servers|tools)/i],
  },
  {
    id: "tools-list",
    url: "/guides/how-to-list-mcp-tools",
    type: "how-to",
    action: "create_ready",
    patterns: [
      /^(mcp )?(server )?tools list$/i,
      /^(list|list of) mcp tools$/i,
      /^mcp list tools$/i,
      /mcp tools directory/i,
    ],
  },
  {
    id: "tools-explained",
    url: "/guides/mcp-tools-explained",
    type: "explainer",
    action: "create_ready",
    patterns: [
      /mcp (server )?tool (definition|meaning|examples?)/i,
      /mcp tools (meaning|examples?)/i,
    ],
  },
  {
    id: "alternatives",
    url: "/guides/mcp-alternatives",
    type: "alternatives",
    action: "create_ready",
    patterns: [/^mcp alternatives$/i],
  },
  {
    id: "mcp-vs-rag",
    url: "/compare/mcp-vs-rag",
    type: "comparison",
    action: "create_ready",
    patterns: [/\b(mcp vs rag|rag vs mcp)\b/i],
  },
  {
    id: "mcp-vs-a2a",
    url: "/compare/mcp-vs-a2a",
    type: "comparison",
    action: "create_ready",
    patterns: [/\b(mcp vs a2a|a2a( protocol)? vs mcp|agent to agent vs mcp)\b/i],
  },
  {
    id: "mcp-vs-cli",
    url: "/compare/mcp-vs-cli",
    type: "comparison",
    action: "create_ready",
    patterns: [/\b(mcp vs cli|cli vs mcp)\b/i],
  },
  {
    id: "resources-vs-tools",
    url: "/compare/mcp-resources-vs-tools",
    type: "comparison",
    action: "create_ready",
    patterns: [
      /mcp.*(resources? vs tools?|tools? vs resources?)/i,
      /resources? vs tools? mcp/i,
    ],
  },
  {
    id: "function-calling",
    url: "/compare/mcp-vs-function-calling",
    type: "comparison",
    action: "create_ready",
    patterns: [
      /mcp vs (function|tool) calling/i,
      /(function|tool) calling vs mcp/i,
      /tool call vs mcp/i,
      /tool use vs mcp/i,
    ],
  },
  {
    id: "agents",
    url: "/compare/mcp-vs-ai-agents",
    type: "comparison",
    action: "create_ready",
    patterns: [
      /mcp vs (ai )?agents?/i,
      /(ai )?agents? vs mcp/i,
      /agentic ai vs mcp/i,
    ],
  },
  {
    id: "langchain",
    url: "/compare/langchain-vs-mcp",
    type: "comparison",
    action: "create_ready",
    patterns: [/langchain.*vs mcp|mcp vs langchain/i],
  },
  {
    id: "api",
    url: "/compare/api-vs-mcp",
    type: "comparison",
    action: "create_ready",
    patterns: [/\b(api vs mcp|mcp.*vs api)\b/i],
  },
  {
    id: "client-server",
    url: "/compare/mcp-client-vs-server",
    type: "comparison",
    action: "create_ready",
    patterns: [
      /mcp client vs (mcp )?server/i,
      /mcp server vs (mcp )?client/i,
      /mcp host vs client|mcp client vs host/i,
    ],
  },
  {
    id: "sse-http",
    url: "/compare/mcp-sse-vs-streamable-http",
    type: "comparison",
    action: "create_ready",
    patterns: [/mcp sse vs streamable http/i],
  },
  {
    id: "acp",
    url: "/compare/acp-vs-mcp",
    type: "comparison",
    action: "create_ready",
    patterns: [/\bacp vs mcp\b/i],
  },
  {
    id: "dcp",
    url: "/compare/mcp-vs-dcp",
    type: "comparison",
    action: "create_ready",
    patterns: [/\bmcp vs dcp\b/i],
  },
  {
    id: "graphql",
    url: "/compare/graphql-vs-mcp",
    type: "comparison",
    action: "create_ready",
    patterns: [/\bgraphql vs mcp\b/i],
  },
  {
    id: "http",
    url: "/compare/http-vs-mcp",
    type: "comparison",
    action: "create_ready",
    patterns: [/\bhttp vs mcp\b/i],
  },
  {
    id: "openai-agents",
    url: "/compare/openai-agents-sdk-vs-mcp",
    type: "comparison",
    action: "create_ready",
    patterns: [/openai agents sdk vs mcp/i],
  },
  {
    id: "playwright-puppeteer",
    url: "/compare/playwright-vs-puppeteer-mcp",
    type: "comparison",
    action: "create_ready",
    patterns: [/playwright vs puppeteer mcp/i],
  },
  {
    id: "remotion-install",
    url: "/guides/install-remotion-mcp-server",
    type: "entity integration",
    action: "create_ready",
    patterns: [/remotion mcp server.*install/i],
  },
  {
    id: "google-sheets-manus",
    url: "/guides/google-sheets-mcp-server-for-manus",
    type: "entity integration",
    action: "create_ready",
    patterns: [/google sheets mcp server for manus/i],
  },
  {
    id: "gateway-security",
    url: "/guides/mcp-gateway-security",
    type: "security guide",
    action: "create_ready",
    patterns: [/mcp gateways?.*(security|compliance)/i],
  },
  {
    id: "head-pillar",
    url: "/what-is-mcp-server",
    type: "pillar",
    action: "enrich_existing",
    patterns: [
      /^mcp(-server| servers?| server)?$/i,
      /mcp servers? (meaning|definition)/i,
      /mcp meaning server/i,
    ],
  },
  {
    id: "directory",
    url: "/",
    type: "directory hub",
    action: "enrich_existing",
    patterns: [
      /^(list of )?mcp servers? list$/i,
      /^mcp server directory$/i,
      /awesome mcp servers/i,
      /mcp directory/i,
    ],
  },
  {
    id: "claude-code-existing",
    url: "/guides/claude-code-mcp-config",
    type: "client setup",
    action: "enrich_existing",
    patterns: [
      /claude code.*mcp.*(config|setup|install|add|connect|list)/i,
      /(add|install|connect).*mcp.*claude code/i,
      /claude mcp (list|add)/i,
    ],
  },
  {
    id: "proxy-gateway-existing",
    url: "/guides/mcp-proxy-vs-gateway",
    type: "comparison",
    action: "enrich_existing",
    patterns: [/mcp proxy server vs mcp gateway/i],
  },
  {
    id: "security-existing",
    url: "/guides/mcp-security-red-lines",
    type: "security guide",
    action: "enrich_existing",
    patterns: [
      /mcp security (architecture|best practices)/i,
      /mcp.*(vulnerabilit|tool poisoning|security flaw)/i,
    ],
  },
  {
    id: "remote-existing",
    url: "/guides/self-host-vs-remote",
    type: "comparison",
    action: "enrich_existing",
    patterns: [
      /(local|self hosted) vs remote mcp/i,
      /mcp server local vs remote/i,
    ],
  },
];

const usedKeywords = new Set();
const contentRows = [];
for (const definition of contentDefinitions) {
  const supporting = keywords
    .filter((row) => {
      if (usedKeywords.has(row.keyword.toLowerCase())) return false;
      if (Number(row.volume || 0) < 20) return false;
      return definition.patterns.some((pattern) => pattern.test(row.keyword));
    })
    .sort(
      (left, right) =>
        Number(right.volume || 0) - Number(left.volume || 0) ||
        Number(left.kd || 0) - Number(right.kd || 0),
    );
  if (!supporting.length) continue;
  for (const row of supporting) {
    usedKeywords.add(row.keyword.toLowerCase());
  }
  const primary = supporting[0];
  const clusterVolume = supporting.reduce(
    (total, row) => total + Number(row.volume || 0),
    0,
  );
  contentRows.push({
    module: "content",
    action: definition.action,
    target_url: definition.url,
    page_title: definition.id.replaceAll("-", " "),
    primary_keyword: primary.keyword,
    primary_volume_us: primary.volume,
    primary_kd: primary.kd,
    cluster_volume_us: clusterVolume,
    keyword_count: supporting.length,
    supporting_keywords: supporting
      .map((row) => `${row.keyword} (${row.volume})`)
      .join("; "),
    evidence: supporting.some(
      (row) =>
        classificationByKeyword.get(row.keyword.toLowerCase())?.relevance ===
        "core",
    )
      ? "skill-classified core demand"
      : "exact problem/integration query from cleaned keyword pool",
    page_type: definition.type,
    source: "full-skill-run keywords.csv + semantic one-intent clustering",
  });
}

const unmatchedContent = classifications
  .filter(
    (row) =>
      row.verdict === "attribute" &&
      row.relevance === "core" &&
      Number(row.volume || 0) >= 20 &&
      !usedKeywords.has(row.keyword.toLowerCase()),
  )
  .sort(
    (left, right) =>
      Number(right.volume || 0) - Number(left.volume || 0),
  );

const entityHeaders = [
  "module",
  "action",
  "target_url",
  "page_title",
  "primary_keyword",
  "primary_volume_us",
  "primary_kd",
  "cluster_volume_us",
  "keyword_count",
  "classifier_verdict",
  "current_entity_slug",
  "trust_score",
  "runnable_now",
  "match_confidence",
  "reason",
  "source",
];
writeCsv("ENTITY-PAGE-OPPORTUNITIES.csv", entityRows, entityHeaders);

const contentHeaders = [
  "module",
  "action",
  "target_url",
  "page_title",
  "primary_keyword",
  "primary_volume_us",
  "primary_kd",
  "cluster_volume_us",
  "keyword_count",
  "supporting_keywords",
  "evidence",
  "page_type",
  "source",
];
writeCsv("CONTENT-PAGE-CLUSTERS.csv", contentRows, contentHeaders);

writeCsv("UNMATCHED-CONTENT-KEYWORDS.csv", unmatchedContent, [
  "keyword",
  "modifier",
  "verdict",
  "reason",
  "relevance",
  "volume",
  "kd",
  "priority",
]);

const writeNow = [
  ...entityRows
    .filter((row) => row.action === "create_ready")
    .map((row) => ({
      module: row.module,
      target_url: row.target_url,
      page_type: "entity landing",
      primary_keyword: row.primary_keyword,
      primary_volume_us: row.primary_volume_us,
      primary_kd: row.primary_kd,
      cluster_volume_us: row.cluster_volume_us,
      keyword_count: row.keyword_count,
      current_entity_slug: row.current_entity_slug,
      evidence: row.reason,
      supporting_keywords: "",
    })),
  ...contentRows
    .filter((row) => row.action === "create_ready")
    .map((row) => ({
      module: row.module,
      target_url: row.target_url,
      page_type: row.page_type,
      primary_keyword: row.primary_keyword,
      primary_volume_us: row.primary_volume_us,
      primary_kd: row.primary_kd,
      cluster_volume_us: row.cluster_volume_us,
      keyword_count: row.keyword_count,
      current_entity_slug: "",
      evidence: row.evidence,
      supporting_keywords: row.supporting_keywords,
    })),
]
  .filter(
    (row) =>
      Number(row.cluster_volume_us || 0) >= 50 &&
      !(
        row.target_url.startsWith("/guides/") &&
        existingGuideSlugs.has(row.target_url.slice("/guides/".length))
      ),
  )
  .sort(
    (left, right) =>
      Number(right.cluster_volume_us || 0) -
        Number(left.cluster_volume_us || 0) ||
      Number(left.primary_kd || 0) - Number(right.primary_kd || 0),
  );

writeNow.forEach((row, index) => {
  row.rank = index + 1;
});
writeCsv("WRITE-NOW-PAGES.csv", writeNow, [
  "rank",
  "module",
  "target_url",
  "page_type",
  "primary_keyword",
  "primary_volume_us",
  "primary_kd",
  "cluster_volume_us",
  "keyword_count",
  "current_entity_slug",
  "evidence",
  "supporting_keywords",
]);

const actionCounts = {};
for (const row of entityRows) {
  actionCounts[row.action] = (actionCounts[row.action] ?? 0) + 1;
}
const contentActionCounts = {};
for (const row of contentRows) {
  contentActionCounts[row.action] =
    (contentActionCounts[row.action] ?? 0) + 1;
}
const writeNowDemand = writeNow.reduce(
  (total, row) => total + Number(row.cluster_volume_us || 0),
  0,
);
const skillSummary = JSON.parse(
  fs.readFileSync(path.join(runDir, "analysis-summary.json"), "utf8"),
);
const eligibilitySummaryPath = path.join(
  runDir,
  "eligibility-summary.json",
);
const eligibilitySummary = fs.existsSync(eligibilitySummaryPath)
  ? JSON.parse(fs.readFileSync(eligibilitySummaryPath, "utf8"))
  : null;

const summary = {
  raw_keywords: skillSummary.raw_keywords,
  cleaned_keywords: skillSummary.after_clean,
  mechanical_candidate_pages: skillSummary.total_planned_pages,
  priority_counts: skillSummary.priority_counts,
  classifier_counts: Object.fromEntries(
    ["entity", "attribute", "junk", "judge"].map((verdict) => [
      verdict,
      classifications.filter((row) => row.verdict === verdict).length,
    ]),
  ),
  entity_page_opportunities: entityRows.length,
  entity_actions: actionCounts,
  content_page_clusters: contentRows.length,
  content_actions: contentActionCounts,
  unmatched_core_content_keywords: unmatchedContent.length,
  write_now_pages: writeNow.length,
  write_now_cluster_demand_us: writeNowDemand,
  a4_entity_eligibility: eligibilitySummary?.verdicts ?? {},
};
fs.writeFileSync(
  path.join(runDir, "FULL-RUN-SUMMARY.json"),
  `${JSON.stringify(summary, null, 2)}\n`,
);

const topRows = writeNow.slice(0, 30);
const markdown = `# MCP Radar · SEO Keyword Research Skill 全量扩页结果

## 这次实际跑了什么

- 技能输入：${summary.raw_keywords.toLocaleString("en-US")} 条原始关键词。
- 模块裁决、去重和排除后：${summary.cleaned_keywords.toLocaleString("en-US")} 条。
- \`plan.py\` 的机械候选页信号：${summary.mechanical_candidate_pages.toLocaleString("en-US")}。
- A6 优先级：P0 ${summary.priority_counts.P0.toLocaleString("en-US")} / P1 ${summary.priority_counts.P1.toLocaleString("en-US")} / P2 ${summary.priority_counts.P2.toLocaleString("en-US")}。
- \`classify.py\`：entity ${summary.classifier_counts.entity.toLocaleString("en-US")} / attribute ${summary.classifier_counts.attribute.toLocaleString("en-US")} / junk ${summary.classifier_counts.junk.toLocaleString("en-US")} / judge ${summary.classifier_counts.judge.toLocaleString("en-US")}。
- A4 当前 817 个实体页：${Object.entries(summary.a4_entity_eligibility).map(([key, value]) => `${key}=${value}`).join("，")}。
- 与旧版 demand×supply 映射、当前 817 个实体、现有 URL 再求交：${summary.entity_page_opportunities} 个实体页面机会。
- 内容词按“一意图一 URL”聚合：${summary.content_page_clusters} 个内容页面簇。

## 可以立即新增

- 新页面：**${summary.write_now_pages} 页**
- 页面词簇需求合计：**${summary.write_now_cluster_demand_us.toLocaleString("en-US")}/月**（有同义词和跨页重叠，只用于排序）
- 实体机会状态：${Object.entries(summary.entity_actions).map(([key, value]) => `${key}=${value}`).join("，")}
- 内容机会状态：${Object.entries(summary.content_actions).map(([key, value]) => `${key}=${value}`).join("，")}
- 另有 ${summary.unmatched_core_content_keywords} 条核心内容词保留在未匹配池，等待下一轮语义聚类；没有被静默删除。

## 前 30 个 write-now 页面

| # | URL | 主词 | 主词量 | KD | 词簇量 | 类型 |
|---:|---|---|---:|---:|---:|---|
${topRows
  .map(
    (row) =>
      `| ${row.rank} | \`${row.target_url}\` | ${row.primary_keyword} | ${Number(row.primary_volume_us).toLocaleString("en-US")} | ${row.primary_kd} | ${Number(row.cluster_volume_us).toLocaleString("en-US")} | ${row.page_type} |`,
  )
  .join("\n")}

## 文件

- \`WRITE-NOW-PAGES.csv\`：已通过需求、去重和当前供给检查的新增页面。
- \`ENTITY-PAGE-OPPORTUNITIES.csv\`：全部 ${summary.entity_page_opportunities} 个实体页面机会，含 create/enrich/collect/review。
- \`CONTENT-PAGE-CLUSTERS.csv\`：一意图一 URL 的内容页面簇及全部支持词。
- \`UNMATCHED-CONTENT-KEYWORDS.csv\`：保留未完成语义归并的核心词，不冒充页面。
- \`keywords.csv\`、\`entity-classification.csv\`：技能脚本的原始输出。
`;
fs.writeFileSync(path.join(runDir, "FULL-PAGE-PLAN.md"), markdown);

console.log(JSON.stringify(summary, null, 2));
