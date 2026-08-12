# Keyword-to-content plan: MCP Radar

- Market: United States
- Language: English
- Site type: directory/marketplace with an editorial guide layer
- Research date: 2026-08-12
- Writing state: `planning complete; writing not started`

## Executive decision

Do not restart the July plan as if nothing shipped. The live/code inventory now contains the ENOENT, `-32001`, RAG, A2A, CLI and business best-of pages, so those are enrichment jobs. Admit only four genuinely missing content URLs:

1. `/en/guides/mcp-resources-vs-tools`
2. `/en/guides/best-mcp-servers-for-claude-code`
3. `/en/guides/best-mcp-servers-for-cursor`
4. `/en/guides/mcp-vs-function-calling`

Remote-server intent must stay on the working directory. Generic definition, cost and setup variants must stay on the existing pillar. High-volume logo, client and incompatible-integration terms do not become articles.

## Sources and limitations

### Sources

- Product and supply: `data/servers.json` (2,636 local records, collected 2026-08-05), route/sitemap code, 49 curated setup entities, 18 English guides, and the live MCP Radar site.
- Keyword demand: Semrush-style US exports from 2026-07-23 and 2026-07-29 across `mcp server`, `mcp tools`, and `best mcp servers` seeds.
- Competitors: organic exports for PulseMCP, mcp.so, mcpservers.org, mcp.directory and Glama.
- Existing demand language: current live SERPs, community discussions and natural reverse-order/error variants.
- Current SERPs: 21 US-English live query captures on 2026-08-12.

### Limitations

- Google Search Console query/page data was unavailable. First-party impressions, positions, clicks and page-level cannibalization are pending.
- Conversion and paid-customer data was unavailable, so business value is ranked by product fit and likely action proximity rather than observed revenue.
- The newest keyword metrics are 14 days old; comparison/error rows that were not in the July 29 seed set retain their July 23 verified date.
- Of the 62 decision-shortlist keywords, 13 have an unavailable field and 11 are pending; they are never represented as KD 0 or volume 0.
- Live capture cannot reliably expose US Google AI Overview/PAA state. Those features are marked unavailable rather than inferred.
- Client compatibility is often derived from manifest transport, not sandbox-tested. Best-of pages require real client tests before drafting.

## Count funnel

- Raw Keyword Magic rows collected: 16,109.
- Deduplicated candidate pool: 13,648.
- Decision-shortlist keywords documented: 62.
- Metrics fully verified: 38; unavailable fields: 13; pending metrics: 11.
- Intent clusters formed: 25.
- Live SERP validations: 21, including every P0/P1 primary plus long-tail samples.
- Decisions: 4 `create_content`, 0 `create_tool`, 11 `enrich`, 3 `merge`, 1 `develop_first`, 2 `hold`, 4 `reject`.
- Queue labels: P0 8 / P1 6 / P2 3 / none 8.

## Highest-value decisions

| Priority | Decision | Primary keyword | Volume / KD | Target URL | Why |
| --- | --- | --- | --- | --- | --- |
| P0 | enrich | `cursor mcp spawn npx enoent` | 1,600 / 24 | `/en/guides/cursor-mcp-spawn-npx-enoent` | Existing exact-error page; reproduce OS-specific fixes and close the depth gap. |
| P0 | enrich | `claude code mcp server configuration` | 880 / 21 | `/en/guides/claude-code-mcp-config` | Official docs dominate; current page is too short and must be re-tested. |
| P0 | create_content | `mcp resources vs tools` | 590 / 24 | `/en/guides/mcp-resources-vs-tools` | Independent architecture task with a spec-backed runnable-example angle. |
| P0 | enrich | `remote mcp servers` | 480 / 24 | `/en/remote-mcp-servers` | SERP expects inventory. Fix the visible freshness mismatch and expose transport/auth evidence. |
| P0 | merge | `are mcp servers free` | 390 / 5 | `/en/what-is-mcp-server` | High-winability question already answered by the pillar; expand it without a duplicate URL. |
| P0 | create_content | `best mcp servers for claude code` | 320 / 10 | `/en/guides/best-mcp-servers-for-claude-code` | Data and real client tests can beat opaque opinion lists. |
| P0 | create_content | `best mcp servers for cursor` | 260 / 19 | `/en/guides/best-mcp-servers-for-cursor` | Strong fit if Cursor-specific setup and redundancy tests are real. |
| P0 | enrich | `mcp error -32001: request timed out` | 260 / 0 | `/en/guides/mcp-error-32001-timeout` | Existing exact-error URL; add a protocol-stage diagnostic flow. |
| P1 | enrich | `mcp proxy server vs mcp gateway` | 720 / 19 | `/en/guides/mcp-proxy-vs-gateway` | Existing URL owns the task; strong SERP requires production evidence. |
| P1 | enrich | `mcp vs rag` | 590 / 28 | `/en/guides/rag-vs-mcp` | Existing page must add original analysis or a reproducible example. |
| P1 | enrich | `mcp vs a2a` | 590 / 28 | `/en/guides/a2a-vs-mcp` | Recent implementation research raises the bar; update instead of duplicating. |
| P1 | enrich | `mcp vs cli` | 390 / 28 | `/en/guides/mcp-vs-cli` | Current competitors publish measurements; reproduce them rather than echo claims. |
| P1 | enrich | `mcp security best practices` | 210 / 24 | `/en/guides/mcp-security-red-lines` | One canonical security guide should absorb official/OWASP/NSA evidence. |
| P1 | create_content | `mcp vs function calling` | 110 / 10 | `/en/guides/mcp-vs-function-calling` | Distinct layer-comparison task; build the same tool both ways. |

## Enrich, merge, develop first, hold and reject

| Decision | Cluster | Existing or future URL | Reason | Next action |
| --- | --- | --- | --- | --- |
| enrich | What is an MCP server | `/en/what-is-mcp-server` | 5,400 volume but KD 46 and official dominance. | Refresh terminology, dated examples and evidence; keep one canonical pillar. |
| enrich | MCP server directory | `/en` | The SERP expects working inventory, not an article. | Strengthen current counts, filters, methodology and freshness proof. |
| merge | Cost/free question | `/en/what-is-mcp-server` | Same pre-install explainer task. | Add software/hosting/API/SaaS cost layers and examples. |
| merge | Generic MCP setup | `/en/what-is-mcp-server` | Generic flow overlaps the pillar; client/entity mechanics already have pages. | Improve the chooser and internal links. |
| merge | Resources/tools/prompts | `/en/guides/mcp-resources-vs-tools` | 30 volume, KD unavailable and the same comparison task. | Add prompts to the shared table; no second URL. |
| develop_first | Google Sheets MCP for Manus | none | 880 directional volume but KD, exact server identity and Manus compatibility are unavailable. | Prove one real current workflow before page admission. |
| hold | Business/sales/marketing best-of | `/en/guides/best-mcp-servers-for-business` | Live page exists, but the 2,900 phrase is awkward and KD is unavailable. | Refresh natural variants and exact runnable entity coverage before retitling/expanding. |
| hold | Interactive server comparison | `/en/compare?ids=` | Utility is live and correctly noindex; stable query demand is unavailable. | Instrument use and keep parameter combinations noindex. |
| reject | Build an MCP server | none | 390/KD 24 but official docs satisfy the task; no unique builder/test harness. | Reconsider only after building differentiated validation capability. |
| reject | MCP logo assets | none | Up to 1,600/KD 23 but asset intent does not fit the product. | Do not chase trademark/icon traffic. |
| reject | MCP client directory | none | Up to 1,000 volume; entity and capability are outside the server-only boundary. | Separate product decision if revisited. |
| reject | Agent Skills directory | none | Separate entity graph and already assigned to another site. | Keep MCP Radar focused. |

## Why high-volume terms did not become articles

- `remote mcp servers` (480) is a directory task, so its destination is the working remote inventory.
- `what is an mcp server` (5,400) already has a canonical pillar and faces KD 46/official dominance; wording variants do not justify new URLs.
- `best mcp servers for business sales marketing` (2,900) has missing KD and unnatural phrasing; the existing page is held until natural variants are verified.
- `mcp server logo mcp icon` (1,600) is an asset task unrelated to server quality/discovery.
- `mcp clients` (1,000) expects a client directory that the product does not provide.
- `google sheets mcp server for manus ai` (880) requires exact compatibility that has not been demonstrated.
- `how to build an mcp server` (390) is served by official developer docs; a generic rewrite would add no unique evidence.

## Evidence required before drafting

- Client pages: real current-client configuration, screenshots/logs, tool discovery and a successful non-destructive call.
- Best-of pages: frozen dataset, explicit candidate/pass/fail counts, official identity checks, permissions, exclusions and a published scoring method.
- Troubleshooting: reproduced failures across applicable OS/client paths with exact versions and sanitized diagnostics.
- Comparisons: current primary specifications plus a runnable same-task example or disclosed benchmark.
- Security: normative MCP/OAuth sources and current OWASP/Microsoft/NSA guidance; no unsupported absolutes.
- Directory/homepage: one coherent production timestamp and clear distinction among declared, derived and verified evidence.

## Queue

### P0 — fix evidence gaps and ship only after tests

1. Enrich Claude Code config, ENOENT, `-32001`, remote directory and the free/cost section.
2. Build and verify the resources-versus-tools example.
3. Test and publish Claude Code and Cursor best-of pages from a frozen dataset.

### P1 — strong intent, higher evidence bar

1. Enrich proxy/gateway and security guidance from primary sources.
2. Add original examples/measurements to RAG, A2A and CLI comparisons.
3. Create function-calling comparison from one capability implemented both ways.

### P2 — consolidate product ownership

1. Refresh the canonical MCP explainer.
2. Improve homepage directory proof and counts.
3. Merge generic setup wording into the explainer and client/entity routes.

Planning is complete. Article writing has not started.
