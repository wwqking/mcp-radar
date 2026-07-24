---
brief_id: mcpradars-comparison--mcp-resources-vs-tools
status: planned
priority: P1
wave: Wave 1
target_url: /compare/mcp-resources-vs-tools
primary_keyword: "mcp resources vs tools"
search_intent: "Informational"
page_type: "comparison guide"
expert_review: false
last_verified: 2026-07-23
refresh_due: 2026-10-21
---

# MCP Resources vs Tools (vs Prompts): What's the Difference?

## Direct answer goal
First 80–120 words: MCP servers expose three primitives. **Tools** are actions
the model can *invoke* (query a DB, create an issue) — model-controlled, can
have side effects. **Resources** are data the model can *read* (a file, a schema,
a record) — application-controlled, read-only context. **Prompts** are reusable
templates the *user* triggers. Rule of thumb: if the model should *do* something,
it's a Tool; if it should *read* something, it's a Resource. Then link to
/what-is-mcp-server for the broader model.

## Supporting keywords
- mcp resources vs tools (590)
- mcp resource vs tool (70), mcp tool vs resource (70)
- mcp resources tools prompts (from mcp-tools cluster), mcp primitives

## Required sections
1. **Direct answer** (snippet-optimized)
2. **Three-primitive table** — original asset: rows = Who controls it / Read or
   write / Side effects / Typical example / When to use. Columns = Tools /
   Resources / Prompts.
3. **Tools in depth** — model-invoked actions, examples from real servers.
4. **Resources in depth** — read-only context, examples.
5. **Prompts briefly** — user-triggered templates.
6. **Common mistake** — exposing read-only data as a Tool (or vice versa) and why
   it matters for safety and token cost.

## Internal links
- Up: /what-is-mcp-server
- Sideways: /compare/mcp-vs-rag, /compare/mcp-vs-function-calling
- Down: 2–3 /servers/ pages whose capability cards show real tools vs resources
  (e.g. filesystem = read/write files, postgres = query).

## FAQ
- Can one MCP server have both tools and resources? (Yes — most do)
- Are resources always read-only? (Yes by design; writes go through tools)
- What are prompts for? (User-triggered reusable templates)
- Which should I use for database access? (Tool for queries with side effects;
  resource for exposing a static schema)

## Evidence requirements
- SERP reviewed 2026-07-23: medium, reddit, workos, codesignal + 1 official doc
  — no lock; a clearer table beats the scattered blog explanations.
- Original asset REQUIRED: the three-primitive table.
- Ground the definitions against the official MCP spec (link it) so it's accurate.

## Metrics snapshot
- Volume: ~730 (590 primary + resource/tool variants)
- KD: 17–24
- Opportunity: 3.6
- SERP competition: medium — blogs + forums, official doc present but not dominant
