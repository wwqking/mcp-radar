# Content brief: MCP resources vs tools

## Decision

- Decision: `create_content`
- Priority: `P0`
- Recommended URL: `/en/guides/mcp-resources-vs-tools`
- Page type: concept comparison

## Keyword evidence

- Primary: `mcp resources vs tools` — 590 volume, KD 24, CPC $7.06.
- Supporting: `mcp server resources vs tools` — 40 volume/KD unavailable; `resources vs tools mcp` — 40/KD unavailable; `mcp resources vs tools vs prompts` — 30/KD unavailable.
- SERP: medium; Microsoft Community and focused technical guides dominate rather than a single unbeatable official exact-match page.

## User task and answer goal

- Task: model a capability using the correct MCP primitive and understand its control, side-effect and interaction implications.
- Direct answer: resources expose application-controlled context; tools expose model-requested operations; prompts package user-invoked workflows. Use the least powerful primitive that satisfies the task.

## Required sections

1. Forty-word verdict and three-primitive comparison table.
2. Who initiates each primitive and what the host/model/user controls.
3. Identical example domain implemented once as a resource and once as a tool.
4. Side effects, permissions, caching, token use, pagination and error behavior.
5. Decision tree and common anti-patterns.
6. Prompts as the three-way variant inside the same URL.

## Evidence required before drafting

- Verify definitions and lifecycle behavior against current MCP specification pages.
- Build a minimal sample server exposing both a resource and a tool; capture schemas, Inspector output and a real client interaction.
- Select current directory examples only after inspecting their repositories; directory classification alone is not proof.

## Internal links and boundaries

- Link to `/en/what-is-mcp-server`, `/en/guides/mcp-security-red-lines`, `/en/guides/mcp-production-checklist`, and relevant entity pages.
- Do not create a second URL for “tools vs resources vs prompts”; it is a section of this page.

## Unsupported claims

- Do not call resources universally read-only if the backing system can change; describe the protocol interaction semantics precisely.
- Do not promise token savings without a reproducible measurement and disclosed client/model setup.

## Review

- Evidence status: `required`
- Last verified: 2026-08-12
- Review on MCP specification changes; otherwise every six months.
