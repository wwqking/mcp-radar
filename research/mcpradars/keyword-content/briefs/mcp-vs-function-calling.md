# Content brief: MCP vs function calling

## Decision

- Decision: `create_content`
- Priority: `P1`
- Recommended URL: `/en/guides/mcp-vs-function-calling`
- Page type: concept comparison

## Keyword evidence

- Primary: `mcp vs function calling` — 110 volume, KD 10, CPC $0.00.
- Supporting: `model context protocol vs function calling` — metrics pending.
- SERP: medium; independent technical comparisons and product learning centers rank, with no single official exact-match page dominating.

## User task and answer goal

- Task: understand whether MCP replaces model function/tool calling and decide which layer to implement.
- Direct answer: function calling is the model/API mechanism for selecting structured calls; MCP standardizes how a host discovers, connects to and invokes external capabilities. A host may expose MCP tools to a model through function calling.

## Required sections

1. Forty-word verdict and layered diagram.
2. Model API, host/client, MCP server and downstream API roles.
3. Implement one small capability as direct function calling and through an MCP server.
4. Discovery, schemas, transport, auth, lifecycle, portability and operational cost table.
5. When to use direct function calling, MCP or both.
6. Common misconceptions and decision checklist.

## Evidence required before drafting

- Build and capture both implementations with the same underlying function.
- Cite current MCP architecture/spec docs and the chosen model provider's official function-calling docs.
- Record schema, message flow, setup code and failure modes; disclose provider/client versions.

## Internal links and boundaries

- Link to `/en/what-is-mcp-server`, `/en/guides/mcp-resources-vs-tools`, `/en/guides/mcp-vs-cli` and `/en/guides/mcp-production-checklist`.
- This page owns protocol-layer versus model-invocation-layer choice; it does not compare every agent framework.

## Unsupported claims

- Do not say MCP eliminates provider tool/function calling or that all providers implement it identically.
- Do not claim portability, latency or token advantages without the disclosed example and limits.

## Review

- Evidence status: `required`
- Last verified: 2026-08-12
- Review on MCP architecture or provider function-calling changes; otherwise every six months.
