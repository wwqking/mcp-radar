# Content brief: MCP vs CLI

## Decision

- Decision: `enrich`
- Priority: `P1`
- Recommended URL: `/en/guides/mcp-vs-cli`
- Page type: architecture comparison

## Keyword evidence

- Primary: `mcp vs cli` — 390 volume, KD 28, CPC $12.11.
- Supporting: `mcp vs cli tools` — 10 volume/KD unavailable.
- SERP: strong; current pages compare token cost, native model familiarity, auth, governance, state and hybrid patterns.

## User task and answer goal

- Task: choose the interface for one agent-tool integration rather than declare one paradigm the universal winner.
- Direct answer: prefer an existing well-known CLI for local developer loops; prefer MCP when standardized discovery, typed schemas, per-user auth or cross-client reuse matter; mix them per tool.

## Required sections

1. Direct verdict and per-integration decision rule.
2. Same task through CLI and MCP with exact inputs/outputs.
3. Comparison: setup, token/context cost, parsing, state, auth, audit, portability and failure recovery.
4. Human-terminal versus model/host caller differences.
5. Hybrid patterns and decision tree.
6. Measurement method and limits.

## Evidence required before drafting

- Benchmark identical representative tasks with disclosed model, client, tool schema, commands and repetitions.
- Capture tool-definition context cost and end-to-end latency rather than copying third-party numbers.
- Review current Claude Code/Cursor behavior because built-in CLI access changes the recommendation.

## Internal links and boundaries

- Link to `/en/guides/claude-code-mcp-config`, `/en/guides/best-mcp-servers-for-cursor`, `/en/guides/mcp-resources-vs-tools` and `/en/guides/mcp-security-red-lines`.
- The page owns integration-interface choice, not MCP server versus operating-system server definitions.

## Unsupported claims

- Do not repeat third-party “4–32x” or fixed token numbers without reproducing them.
- Do not claim CLI lacks governance or MCP automatically supplies complete enterprise governance.

## Review

- Evidence status: `required`
- Last verified: 2026-08-12
- Quarterly and after major client tool-loading changes.
