# Content brief: Claude Code MCP configuration

## Decision

- Decision: `enrich`
- Priority: `P0`
- Recommended URL: `/en/guides/claude-code-mcp-config`
- Page type: task guide

## Keyword evidence

- Primary: `claude code mcp server configuration` — 880 volume, KD 21, CPC $0.00.
- Supporting: `claude code add mcp server` — 320/KD 22; `how to add mcp server to claude code` — 170/KD 24.
- SERP: strong; official Claude Code documentation leads, followed by setup guides.

## User task and answer goal

- Task: add a local or remote MCP server at the correct scope, keep secrets out of shared config, and prove the connection works.
- Direct answer: provide the current command/config chooser, the local/project/user scope matrix, then the exact verification path.

## Required sections

1. Sixty-second chooser: `claude mcp add` versus `.mcp.json`.
2. Current local/project/user scopes, storage paths, sharing and approval behavior.
3. Stdio and HTTP examples; env expansion and secret handling.
4. `claude mcp list`, `claude mcp get`, `/mcp`, remove and reset commands.
5. Failure tree: executable path, auth, zero tools, background connection and restart.

## Evidence required before drafting

- Re-run every command in the current Claude Code release; capture terminal output and the `/mcp` panel.
- Cite the official Claude Code MCP docs for every scope, path and reserved-name claim.
- Test one stdio package and one remote URL from current MCP Radar records.

## Internal links and boundaries

- Link to `/en/remote-mcp-servers`, `/en/guides/claude-mcp-list-command`, `/en/guides/mcp-security-red-lines`, and verified entity/setup pages used in examples.
- Avoid competing with server-specific setup landings; this page owns Claude Code configuration mechanics, not every server's install guide.

## Unsupported claims

- Do not imply every declared client compatibility row was sandbox-tested.
- Do not invent config paths, default timeouts, or transport support from old Claude Desktop documentation.

## Review

- Evidence status: `required`
- Last verified: 2026-08-12
- Review on Claude Code MCP command, scope or config-format changes; otherwise quarterly.
