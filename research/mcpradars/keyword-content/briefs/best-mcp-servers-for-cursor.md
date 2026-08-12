# Content brief: Best MCP servers for Cursor

## Decision

- Decision: `create_content`
- Priority: `P0`
- Recommended URL: `/en/guides/best-mcp-servers-for-cursor`
- Page type: data-backed best-of

## Keyword evidence

- Primary: `best mcp servers for cursor` — 260 volume, KD 19, CPC $0.00.
- Supporting: `best cursor mcp` — 170/KD 19; `cursor mcp servers` — metrics pending.
- SERP: medium; the head term has list pages, while the long tail leans heavily toward community recommendations.

## User task and answer goal

- Task: select maintained servers that improve Cursor coding workflows and can be configured and exercised in the current client.
- Direct answer: recommend by job, prove each setup in Cursor, and explain when Cursor's built-in or CLI capabilities make an MCP server redundant.

## Required sections

1. Dated method, test environment and inclusion gates.
2. Picks by job: docs/context, browser/testing, repository, database and design.
3. Comparison table: transport, auth, permissions, maintenance, setup friction and verification basis.
4. Cursor setup plus one real successful invocation per included server.
5. Redundancy test: use built-in/CLI versus MCP; excluded and failed candidates.

## Evidence required before drafting

- Install and smoke-test every pick in the current stable Cursor release on at least macOS and Windows.
- Capture config, MCP logs, tool discovery and a non-destructive real output.
- Verify package/endpoint ownership and current server health from primary sources and the dated dataset.

## Internal links and boundaries

- Link to `/en/guides/cursor-mcp-spawn-npx-enoent`, `/en/guides/mcp-vs-cli`, `/en/guides/mcp-security-red-lines`, categories and chosen entity pages.
- Do not reuse the Claude Code ranking with the client name swapped; this page owns Cursor-specific setup and workflow evidence.

## Unsupported claims

- Do not claim broad client support from transport inference alone.
- Do not use “must-have” or “safe” without a narrowly defined task and disclosed evidence.

## Review

- Evidence status: `required`
- Last verified: 2026-08-12
- Recompute monthly and after Cursor config/transport changes.
