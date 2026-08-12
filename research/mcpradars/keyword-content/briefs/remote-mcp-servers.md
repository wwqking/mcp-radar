# Content brief: Remote MCP server directory

## Decision

- Decision: `enrich`
- Priority: `P0`
- Recommended URL: `/en/remote-mcp-servers`
- Page type: directory landing

## Keyword evidence

- Primary: `remote mcp servers` — 480 volume, KD 24, CPC $4.08.
- Supporting: `remote mcp` — 390/KD 29; `hosted mcp servers` — 320/KD 52.
- SERP: medium and directory-led. Current competing pages expose hosted inventory, transport and connect flows.

## User task and answer goal

- Task: find a currently reachable hosted server, understand auth/transport, and judge whether sending data to it is acceptable.
- Direct answer: expose filterable inventory first, with endpoint type, auth state, operator/source, last checked date and evidence caveats.

## Required sections/modules

1. Current server and endpoint counts with one shared evidence timestamp.
2. Filters for Streamable HTTP/SSE, auth, official/community, lifecycle and last checked.
3. Each card: endpoint evidence, operator/source, transport, auth, health and auditability.
4. Remote-versus-local chooser and credential/data boundary warning.
5. Connect-by-URL steps linking to client-specific guides.

## Evidence required before implementation

- Reconcile the live page's 427 server count with its 432 HTTP and 30 SSE endpoint counts.
- Fix the visible 2026-07-28 source label so it cannot conflict with daily inventory freshness.
- Sample endpoint handshakes; distinguish registry-declared, derived and actually verified status.

## Internal links and boundaries

- Link to `/en/guides/self-host-vs-remote`, `/en/guides/mcp-remote`, `/en/guides/mcp-security-red-lines`, `/en/leaderboard`, and entity health pages.
- The page owns remote discovery; do not publish a blog article that merely lists the same inventory.

## Unsupported claims

- Do not say an endpoint “works” solely because it appears in registry metadata.
- Do not imply TrustScore is a security certification or that remote servers are safer/easier in every case.

## Review

- Evidence status: `required`
- Last verified: 2026-08-12
- Inventory daily; copy and methodology monthly or on schema changes.
