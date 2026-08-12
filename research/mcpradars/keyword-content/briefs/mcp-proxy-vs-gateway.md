# Content brief: MCP proxy vs gateway

## Decision

- Decision: `enrich`
- Priority: `P1`
- Recommended URL: `/en/guides/mcp-proxy-vs-gateway`
- Page type: architecture comparison

## Keyword evidence

- Primary: `mcp proxy server vs mcp gateway` — 720 volume, KD 19, CPC $0.00.
- Supporting: `mcp gateway vs proxy` — current natural variant; metrics pending.
- SERP: strong; focused comparisons from MCPForge, Permit and Airbyte plus Microsoft gateway documentation.

## User task and answer goal

- Task: decide whether the problem is transport/reachability or centralized routing, auth and policy.
- Direct answer: use a proxy to bridge or mediate a connection; use a gateway to govern many clients/servers; the two can be combined.

## Required sections

1. One-paragraph verdict and terminology caveat.
2. Responsibility matrix: transport, routing, identity, policy, audit, rate limits and lifecycle.
3. Three architectures: direct, proxy and gateway-with-proxies.
4. Failure, latency, credential and blast-radius trade-offs.
5. Decision tree for solo developer, small team and enterprise platform.

## Evidence required before drafting

- Run one stdio-to-HTTP proxy and capture request flow, configuration and failure behavior.
- Document one current gateway from primary product docs without generalizing vendor features to the protocol.
- Tie remote/auth examples to current directory records and the 2026 authentication research cited in the SERP capture.

## Internal links and boundaries

- Link to `/en/remote-mcp-servers`, `/en/guides/mcp-remote`, `/en/guides/mcp-security-red-lines`, and `/en/guides/mcp-server-hosting`.
- This page compares infrastructure roles; it must not become a vendor roundup or duplicate the `mcp-remote` setup guide.

## Unsupported claims

- Do not claim a gateway automatically makes MCP secure, compliant or zero-trust.
- Do not present “proxy” and “gateway” as specification-defined product classes when vendors use the terms inconsistently.

## Review

- Evidence status: `required`
- Last verified: 2026-08-12
- Review quarterly and when MCP transport or authorization guidance changes.
