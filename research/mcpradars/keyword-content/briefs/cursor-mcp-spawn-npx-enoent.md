# Content brief: Cursor `spawn npx ENOENT`

## Decision

- Decision: `enrich`
- Priority: `P0`
- Recommended URL: `/en/guides/cursor-mcp-spawn-npx-enoent`
- Page type: troubleshooting guide

## Keyword evidence

- Primary: `cursor mcp spawn npx enoent` — 1,600 volume, KD 24, CPC $0.00.
- Supporting: `mcp server spawn enoent` and `cursor mcp npx not found` — metrics pending.
- SERP: medium; one deep exact-error guide plus Cursor community reports.

## User task and answer goal

- Task: make Cursor locate and launch `npx`, then distinguish that failure from package or MCP initialization errors.
- Direct answer: ENOENT occurs before the server package runs; verify the executable Cursor can see, then use the OS-appropriate absolute path or launcher.

## Required sections

1. Sixty-second checklist and error-stage diagram.
2. Why terminal PATH can differ from GUI-app PATH.
3. macOS/Linux: `which`, shell manager paths and app relaunch.
4. Windows: `where`, `npx.cmd`, `cmd /c` and path quoting.
5. Cursor logs, before/after config and verification.
6. ENOENT versus npm 404, immediate exit, handshake failure and missing tools.

## Evidence required before drafting

- Reproduce with a harmless test server on macOS, Windows and Linux where possible.
- Capture exact Cursor log locations/version, commands and sanitized configs.
- Verify Windows process-launch claims against current Node/Cursor behavior rather than copying a competitor.

## Internal links and boundaries

- Link to `/en/guides/best-mcp-servers-for-cursor`, `/en/guides/claude-code-mcp-config`, relevant setup pages and `/en/guides/mcp-error-32001-timeout`.
- This page owns executable-not-found launch failures, not every Cursor connection problem.

## Unsupported claims

- Do not say absolute paths are always the best permanent fix without noting version-manager path changes.
- Do not imply a successful process launch proves the MCP server initialized or is safe.

## Review

- Evidence status: `required`
- Last verified: 2026-08-12
- Review after Cursor config/log-path or Node launcher changes.
