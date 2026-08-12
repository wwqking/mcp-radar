# Content brief: RAG vs MCP

## Decision

- Decision: `enrich`
- Priority: `P1`
- Recommended URL: `/en/guides/rag-vs-mcp`
- Page type: architecture comparison

## Keyword evidence

- Primary: `mcp vs rag` — 590 volume, KD 28, CPC $4.13.
- Supporting: `rag vs mcp` — 720 volume, KD 26, CPC $3.38.
- SERP: strong; recent enterprise comparisons and a 100-query benchmark are visible.

## User task and answer goal

- Task: decide whether a system needs indexed retrieval, live standardized capabilities, or both.
- Direct answer: RAG is a retrieval architecture; MCP is an interoperability protocol. They are complementary, and an MCP server can expose retrieval as one capability.

## Required sections

1. Direct verdict and category-error warning.
2. Side-by-side: data freshness, actions, latency, indexing, auth and failure boundaries.
3. RAG-only, MCP-only and combined diagrams.
4. Three implementation scenarios and decision tree.
5. Small reproducible comparison using the same document/live-data task.
6. Anti-patterns and operational costs.

## Evidence required before drafting

- Run a limited benchmark or worked example and disclose corpus, model, queries and constraints.
- Cite current MCP primary docs and primary RAG references where definition claims matter.
- Use current search/knowledge server examples only after repository inspection.

## Internal links and boundaries

- Link to `/en/what-is-mcp-server`, `/en/guides/mcp-resources-vs-tools`, `/en/category/search`, and `/en/guides/mcp-security-red-lines`.
- This page owns architecture choice; individual RAG server setup belongs on entity/setup pages.

## Unsupported claims

- Do not claim MCP universally replaces or outperforms RAG.
- Do not generalize benchmark cost, latency or quality beyond the disclosed setup.

## Review

- Evidence status: `required`
- Last verified: 2026-08-12
- Quarterly and after material protocol or benchmark-method changes.
