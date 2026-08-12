# 15-page content implementation report

- implemented: 2026-08-12
- editor: MCP Radar Editorial
- source brief: `source-brief-2026-08-12.md`
- dataset snapshot: 2026-08-05
- build: Next.js production build passed

## Page status

| Decision | URL | Implementation |
|---|---|---|
| Enrich | `/en/guides/claude-code-mcp-config` | Rewritten with scope matrix, stdio/HTTP config, verification gates, failure tree, FAQ and sources |
| Enrich | `/en/guides/mcp-proxy-vs-gateway` | Rewritten with responsibility matrix, deployment shapes, trust-boundary trade-offs and decision rules |
| Create | `/en/guides/mcp-resources-vs-tools` | New structured primitive comparison including prompts, decision tree, visual and FAQ |
| Enrich | `/en/remote-mcp-servers` | Live counts, timestamp, endpoint reconciliation, transport/source/auth filters, evidence cards and connect flow |
| Create | `/en/guides/best-mcp-servers-for-claude-code` | New data-backed shortlist with dynamic ranking and explicit verified/derived split |
| Create | `/en/guides/best-mcp-servers-for-cursor` | New data-backed shortlist with current Cursor config and explicit missing-IDE limitation |
| Enrich | `/en/guides/cursor-mcp-spawn-npx-enoent` | Rewritten stage-by-stage OS guide using current Cursor and Node primary docs |
| Enrich | `/en/guides/mcp-error-32001-timeout` | Rewritten stage map; removes universal timeout/default claims |
| Enrich | `/en/guides/mcp-security-red-lines` | Rewritten threat-boundary guide and printable control checklist |
| Enrich | `/en/guides/rag-vs-mcp` | Rewritten layer comparison with combined architecture and measurement limits |
| Enrich | `/en/guides/a2a-vs-mcp` | Rewritten against MCP 2026-07-28 and A2A 1.0.0 terminology |
| Enrich | `/en/guides/mcp-vs-cli` | Rewritten per-integration decision guide without copied token/latency multipliers |
| Create | `/en/guides/mcp-vs-function-calling` | New layered comparison with direct/both decision rules |
| Enrich | `/en/what-is-mcp-server` | Rewritten pillar with current participants, primitives, transports, setup and cost answer |
| Enrich | `/en` | Added one-timestamp evidence strip and entry points for remote, leaderboard, health, guides, method, policy and dataset |

## Editorial QA

- [x] Every page has one clear query/intent boundary from its brief.
- [x] Volatile protocol, client, version, and dataset facts map to the dated source brief.
- [x] Unknown client/platform evidence is disclosed rather than invented.
- [x] Current MCP 2026-07-28, A2A 1.0.0, Claude Code, Cursor, Node, security, OpenAI function-calling and RAG sources were checked.
- [x] Strategic pages include original tables, workflow visuals, live scorecards, or dataset counts.
- [x] Direct answers are concise and independently extractable.
- [x] Each of the 12 guide records has at least five answer sections, three FAQs, two sources and three internal links.
- [x] Comparison and decision tables are present where the intent benefits from them.
- [x] Author/editor, dateModified, last-verified date and refresh-due date are visible on new/rewritten guide pages.
- [x] Article schema includes publication/update dates and citations; directory remains a `CollectionPage`.
- [x] FAQ content is visible and does not depend on search-engine rich-result eligibility.
- [x] Best-of compatibility distinguishes `verified` from `derived`; TrustScore is not described as certification.
- [x] Remote endpoint declarations are not described as successful handshakes.
- [x] Canonical/hreflang stays on the existing route helpers; new guide slugs feed static params and sitemap automatically.

## Verification

- `npx tsc --noEmit --incremental false`: passed.
- `npm run validate:data`: passed for 2,636 records.
- Content gate: 12/12 guide records passed required field checks.
- `npm run build`: compiled, type-checked and produced the prerender manifest.
- All 15 English URLs returned HTTP 200 from the production build.
- The four new guide URLs and all three product URLs were found in `.next/prerender-manifest.json`.
- Desktop screenshot QA passed for the structured guide template and remote directory; no table overflow or hierarchy defect was observed at 1440px.

## Evidence limits retained on-page

- Cursor IDE is not installed in the verification environment; the Cursor page is a derived-evidence shortlist pending real IDE tests.
- Windows and Linux `spawn npx ENOENT` were not locally reproduced; the guide uses official Cursor/Node behavior and states this limit.
- The temporary Claude Code stdio config was created, but the health check did not finish within the observation window; it is not counted as successful client evidence.
- No universal `-32001` timeout default, token multiplier, latency win, or security certification is claimed.
