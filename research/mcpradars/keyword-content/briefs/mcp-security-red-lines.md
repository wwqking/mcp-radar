# Content brief: MCP security best practices

## Decision

- Decision: `enrich`
- Priority: `P1`
- Recommended URL: `/en/guides/mcp-security-red-lines`
- Page type: security guide/checklist

## Keyword evidence

- Primary: `mcp security best practices` — 210 volume, KD 24, CPC $12.31.
- Supporting: `mcp server security best practices` — 140/KD 30; `mcp server security` — 110/KD 28.
- SERP: strong; official MCP guidance, Microsoft, OWASP and NSA material dominate.

## User task and answer goal

- Task: evaluate and operate an MCP server with appropriate source, identity, permission, transport, runtime and monitoring controls.
- Direct answer: treat each server as an independent trust domain; verify identity/source, minimize privileges, isolate execution and monitor tool/schema changes.

## Required sections

1. Audience and threat-boundary diagram.
2. Pre-install source/package/repository and dependency checks.
3. Credentials, token audience, OAuth, consent and least privilege.
4. Local runtime sandboxing and remote transport/session controls.
5. Tool-description/schema integrity, prompt injection and cross-server interactions.
6. Logging, change monitoring, revocation and incident response.
7. Printable checklist mapped to MCP Radar evidence fields and their limits.

## Evidence required before drafting

- Base normative claims on current MCP security/authorization docs and OAuth guidance.
- Use OWASP, Microsoft and NSA as primary/high-authority controls; verify dates and scope.
- Audit every existing “red line” claim; remove unsourced absolutes and distinguish observable directory signals from security testing.

## Internal links and boundaries

- Link to `/en/guides/choosing-mcp-server`, `/en/remote-mcp-servers`, `/en/guides/mcp-production-checklist`, `/en/graveyard` and evidence-rich entity pages.
- One canonical security guide owns best-practices, architecture and checklist variants.

## Unsupported claims

- Do not claim TrustScore, open source, registry presence or recent commits prove security.
- Do not claim all secrets must or must not be in environment variables; follow the tested client/server secret model.
- Do not publish sensational vulnerability counts without the study sample, date and limitation.

## Review

- Evidence status: `required`
- Last verified: 2026-08-12
- Monthly and within seven days of material MCP security/spec changes.
