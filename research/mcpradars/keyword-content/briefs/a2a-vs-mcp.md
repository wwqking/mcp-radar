# Content brief: A2A vs MCP

## Decision

- Decision: `enrich`
- Priority: `P1`
- Recommended URL: `/en/guides/a2a-vs-mcp`
- Page type: protocol comparison

## Keyword evidence

- Primary: `mcp vs a2a` — 590 volume, KD 28, CPC $0.13.
- Supporting: `a2a vs mcp` — natural variant; metrics pending.
- SERP: strong; a July 2026 implementation-grounded paper and multiple current protocol comparisons are visible.

## User task and answer goal

- Task: decide which protocol belongs at which layer of a multi-agent system.
- Direct answer: MCP standardizes agent/host access to tools and context; A2A provides richer agent-to-agent task and message coordination. A system may use both.

## Required sections

1. Direct verdict with current protocol/version dates.
2. Actors, discovery, messages/tasks, artifacts, tools/resources and lifecycle table.
3. Side-by-side sequence diagrams for the same delegated task.
4. Combined A2A plus MCP architecture.
5. Trade-offs in state, async work, identity, observability and complexity.
6. Decision checklist and non-goals.

## Evidence required before drafting

- Verify terminology and version state against current MCP and A2A primary specifications.
- Reproduce or closely review one small implementation of each path.
- Incorporate the recent comparative study with its narrow scope and limitations intact.

## Internal links and boundaries

- Link to `/en/what-is-mcp-server`, `/en/guides/rag-vs-mcp`, `/en/guides/mcp-resources-vs-tools` and relevant tool-layer entities.
- This page compares protocol roles; it must not turn into a general multi-agent framework directory.

## Unsupported claims

- Do not call the protocols direct competitors or make universal performance claims.
- Do not freeze vendor ownership, versions or transport details without a verification date.

## Review

- Evidence status: `required`
- Last verified: 2026-08-12
- Review on either protocol's version/governance changes; otherwise quarterly.
