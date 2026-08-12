# Content brief: Best MCP servers for Claude Code

## Decision

- Decision: `create_content`
- Priority: `P0`
- Recommended URL: `/en/guides/best-mcp-servers-for-claude-code`
- Page type: data-backed best-of

## Keyword evidence

- Primary: `best mcp servers for claude code` — 320 volume, KD 10, CPC $5.50.
- Supporting: `best mcp servers for claude` — 30/KD 14; question variant — 10 volume/KD unavailable.
- SERP: medium; multiple fresh 2026 lists, usually with weak or opaque scoring.

## User task and answer goal

- Task: pick the smallest useful Claude Code server set for repository, documentation, browser, database and issue workflows without unnecessary risk/context cost.
- Direct answer: recommend by task, show tested setup and exclusion reasons, and state that there is no universal “best.”

## Required sections

1. Dated methodology, candidate count and pass/fail gates.
2. Starter stack by job: code/repo, docs, browser/testing, database and project tracking.
3. Comparison table: official status, transport, permissions, maintenance, adoption, setup friction and verified/derived compatibility.
4. Actual Claude Code setup and smoke-test result per included server.
5. What was excluded and why; context/tool overload and secret-handling cautions.

## Evidence required before drafting

- Test every included server in a current Claude Code release and retain commands, screenshots/logs and one real tool result.
- Freeze a dated `data/servers.json` snapshot and publish the scoring formula.
- Verify official ownership, package/endpoint identity, permissions and maintenance from primary repositories/docs.

## Internal links and boundaries

- Link to `/en/guides/claude-code-mcp-config`, `/en/guides/claude-mcp-list-command`, `/en/guides/mcp-security-red-lines`, categories and each selected entity page.
- This page ranks for Claude Code workflows; it must not compete with the broad `/en/guides/awesome-mcp-servers` list or individual setup pages.

## Unsupported claims

- Do not label derived compatibility as tested.
- Do not call a server safe, official or free without current primary evidence; disclose paid upstream API requirements.

## Review

- Evidence status: `required`
- Last verified: 2026-08-12
- Recompute monthly and immediately after a selected server is archived, breaks or changes ownership.
