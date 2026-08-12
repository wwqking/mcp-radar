# Content brief: MCP error -32001 request timed out

## Decision

- Decision: `enrich`
- Priority: `P0`
- Recommended URL: `/en/guides/mcp-error-32001-timeout`
- Page type: troubleshooting guide

## Keyword evidence

- Primary: `mcp error -32001: request timed out` — 260 volume, measured KD 0, CPC $0.00.
- Supporting exact and natural variants have incomplete metrics.
- SERP: medium; one focused guide and one broader MCP error hub.

## User task and answer goal

- Task: locate the stage that exceeded its timeout and fix the cause rather than blindly increasing a number.
- Direct answer: test process/endpoint, initialization and `tools/list` first; then isolate auth, network/upstream and long-running handler problems.

## Required sections

1. Fast triage checklist and stage map.
2. Local stdio versus remote HTTP reachability.
3. Initialize, tool/resource discovery and auth failures.
4. Upstream API and tool-handler latency; progress and cancellation.
5. Client-specific logs and safe timeout changes only after diagnosis.
6. Neighboring errors and escalation packet.

## Evidence required before drafting

- Reproduce at launch, initialize/list and tool-call stages with controlled delays.
- Capture request timestamps, server logs and client-visible error text without secrets.
- Verify which timeout setting belongs to each tested client/server; do not invent universal environment variables.

## Internal links and boundaries

- Link to `/en/guides/mcp-production-checklist`, `/en/guides/mcp-server-hosting`, `/en/remote-mcp-servers` and relevant entity health pages.
- Keep all `-32001` timeout variants on this URL; connection-closed or internal-error families require separate validation.

## Unsupported claims

- Do not assert a universal default timeout or that `-32001` has one protocol-wide root cause.
- Do not recommend large timeouts before checking liveness, auth and upstream behavior.

## Review

- Evidence status: `required`
- Last verified: 2026-08-12
- Review on SDK/client error-code or timeout behavior changes.
