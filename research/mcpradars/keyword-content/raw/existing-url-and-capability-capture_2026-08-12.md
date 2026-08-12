# Existing URL and capability capture

Observed: 2026-08-12
Market/language: United States / English

## Code inventory

- Canonical production host: `https://www.mcpradars.com` (`lib/site.ts`).
- Primary type: MCP server directory/marketplace; mixed with editorial guides.
- Local dataset: 2,636 server records, collected 2026-08-05 (`data/servers.json`).
- Setup landing registry: 49 `toolSlug` entries (`lib/seo-landing.ts`).
- English editorial registry: 18 guides (`lib/guides.ts`, `lib/guides.en.ts`).
- Existing scalable page types: home directory, category hubs, topic hubs, entity health pages, setup landings, remote directory, leaderboard, radar, graveyard, health report, guides, and a query-driven compare utility.
- The query-driven server comparison utility is intentionally `noindex`; conceptual comparisons currently live as guide URLs.
- Current evidence fields include lifecycle, TrustScore components, stars, downloads, commit recency, issue response rate, license, registry status, runnable-entry status, packages, derived client compatibility, and limited sandbox install verification.

## Existing English editorial URLs relevant to this plan

- `/en/what-is-mcp-server`
- `/en/remote-mcp-servers`
- `/en/guides/claude-code-mcp-config`
- `/en/guides/mcp-proxy-vs-gateway`
- `/en/guides/mcp-security-red-lines`
- `/en/guides/mcp-production-checklist`
- `/en/guides/best-mcp-servers-for-business`
- `/en/guides/cursor-mcp-spawn-npx-enoent`
- `/en/guides/mcp-error-32001-timeout`
- `/en/guides/rag-vs-mcp`
- `/en/guides/a2a-vs-mcp`
- `/en/guides/mcp-vs-cli`
- `/en/guides/awesome-mcp-servers`

## Live-site checks

- The live guides index exposed all 18 English guides and reported the site dataset as updated 2026-08-11.
- The live remote directory exposed 427 hosted-endpoint servers: 432 Streamable HTTP endpoints and 30 SSE endpoints. Endpoint count and server count differ because a server can expose more than one endpoint.
- The remote page's source label still displayed 2026-07-28, creating a visible freshness mismatch with the daily inventory.
- The live explainer already answers “Do MCP servers cost money?”; a new URL for “are MCP servers free” would compete with it.

## First-party data gap

No Search Console or analytics query export was present in the workspace. Existing URL decisions therefore use route/content inspection and live-page checks, not impression or conversion data.
