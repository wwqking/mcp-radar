# SEO Plan

## Executive Summary

MCP Radar already has the right SEO foundation for an evidence-led directory: 817 server records, health and lifecycle signals, bilingual URLs, self-canonical pages, hreflang, a sitemap, and indexable server/category/guide templates. The next growth step should not be indiscriminate programmatic expansion.

The 2026-07-29 Keyword Magic run produced 16,109 raw rows and 13,648 deduplicated candidates. Of these, 468 MCP-relevant candidates have measured volume of at least 50 and KD at most 29; another 245 relevant candidates with volume of at least 50 are missing KD and must not be treated as easy wins. These candidates were consolidated into 24 page-level decisions: 10 create, 6 enrich, 1 merge, 2 noindex, and 5 reject.

The fastest gains are:

1. Repair or temporarily noindex the 25 setup pages whose install promise is not backed by a package or remote endpoint.
2. Expand the existing Claude Code configuration guide around the measured 880-volume, KD 21 query and current official configuration model.
3. Publish a diagnostic `spawn npx ENOENT` guide with OS-specific decision trees and tested fixes.
4. Create a data-backed `MCP resources vs tools` comparison for the measured 590-volume, KD 24 query.
5. Enrich the remote-server directory and existing proxy/gateway guide with live transport, auth, health, and governance evidence.

Live SERPs show that direct competitors are publishing rapidly in troubleshooting, comparison, best-of, and marketing-list formats. MCP Radar should win by exposing dated, reproducible health evidence—not by imitating generic listicles.

## Site Scope

- Site: `https://www.mcpradars.com`
- Status: existing bilingual directory
- Primary SEO market: United States
- Primary publishing language: English; create the Chinese mirror only after the English page clears the evidence gate
- Audience: developers, AI engineering teams, technical evaluators, and operations/security teams choosing or troubleshooting MCP servers
- Business: MCP server discovery, health scoring, setup guidance, comparisons, and monitoring
- Monetization assumption: subscription, newsletter/waitlist, team monitoring, and sponsorship
- Approved Keyword Magic seeds: `mcp server`, `mcp tools`, `best mcp servers`
- Designated keyword source: `https://zh.trends.fast.wmxpro.com/analytics/keywordmagic/`
- Excluded product modules: MCP client directory and Agent Skills directory
- Existing evidence reused: the 2026-07-28 entity, eligibility, competitor-module, and SERP audit in `research/mcpradars/seo/current-2026-07-28/`

Current inventory:

- 817 server records; 711 active, 96 dying, 9 dead
- 704 records with a runnable entry and 666 in the official registry
- 11 category templates
- 44 SEO setup landing pages
- 6 guides
- 13 static content/product routes
- Approximately 891 logical pages and 1,782 locale URLs in the sitemap when the live data provider is used
- 25 of 44 setup landing pages failed the previous runnable-entry gate and require repair, retargeting, redirect, or noindex

## Opportunity Summary

### Evidence funnel

| Stage | Count | Interpretation |
|---|---:|---|
| Raw Keyword Magic rows | 16,109 | 3 seeds × Broad / Questions / Related |
| Deduplicated candidates | 13,648 | Exact normalized-keyword deduplication |
| MCP-relevant, volume ≥50, known KD ≤29 | 468 | Measured quick-win pool |
| MCP-relevant, volume ≥50, KD missing | 245 | Evidence incomplete; not scored as KD 0 |
| Page-level decision clusters | 24 | Consolidated by intent and existing URL |
| Create | 10 | Net-new intent with independent SERP/page job |
| Enrich | 6 | Existing URL already owns the intent |
| Merge | 1 | Sales is a subsection of the marketing guide |
| Noindex | 2 | Quality/utility cohorts not fit for indexation |
| Reject | 5 | Out of scope, misleading, or unrankable |

### Highest-confidence measured opportunities

| Opportunity | Current evidence | Decision |
|---|---|---|
| Claude Code MCP server configuration | 880 volume / KD 21 | Enrich existing guide |
| MCP proxy server vs MCP gateway | 720 / KD 19 | Enrich existing guide |
| MCP resources vs tools | 590 / KD 24 | Create comparison |
| Remote MCP servers | 480 / KD 24 | Enrich live directory |
| Best MCP servers for Claude Code | 320 / KD 10 | Create data-backed best-of |
| Best MCP servers for Cursor | 260 / KD 19 | Create data-backed best-of |
| Are MCP servers free? | 390 / KD 5 | Merge into existing explainer |

The prior 2026-07-28 evidence remains relevant for opportunities not returned by the three approved seed exports: Cursor `spawn npx ENOENT` (1,600 / KD 24 in the prior pool), MCP error `-32001` (260 / KD 0), MCP vs RAG (590 / KD 28), MCP vs A2A (590 / KD 28), MCP vs CLI (390 / KD 28), and MCP vs function calling (110 / KD 10). Live 2026-07-29 SERP checks were used before retaining them.

### Competitor modules and SERP findings

- Directory intent is crowded by PulseMCP, Glama, MCP Server Directory, MCP Zone, and other large inventories. A generic “more servers” strategy has weak differentiation.
- Claude Code configuration is dominated by official Claude documentation. MCP Radar should target the diagnostic and verification layer: scopes, `.mcp.json`, transport, status checks, common failures, and links to verified server records.
- `spawn npx ENOENT` and `-32001` now have direct specialist articles. The opportunity still exists, but only with reproducible OS/client decision trees and dated fixes.
- `MCP resources vs tools`, proxy vs gateway, and MCP vs RAG SERPs favor structured comparisons, decision tables, diagrams, and implementation examples.
- Best-of SERPs are crowded with subjective lists. MCP Radar's defensible format is a dated ranking computed from runnable status, maintenance, adoption, transport, auth, and TrustScore.
- Marketing SERPs now contain multiple purpose-built lists. The measured 2,900-volume phrase is unnatural and lacks KD, so use it only as directional evidence and publish a natural “for marketers” page after entity validation.

## Site Architecture

Recommended English-first URL structure:

```text
/en/
├── category/{category}
├── server/{registry-slug}
├── servers/{tool}-mcp-server
├── remote-mcp-servers
├── guides/
│   ├── claude-code-mcp-config
│   ├── cursor-mcp-spawn-npx-enoent
│   ├── mcp-error-32001-request-timed-out
│   ├── best-mcp-servers-for-claude-code
│   ├── best-mcp-servers-for-cursor
│   └── best-mcp-servers-for-marketing-teams
└── compare/
    ├── mcp-resources-vs-tools
    ├── mcp-vs-rag
    ├── mcp-vs-a2a
    ├── mcp-vs-cli
    └── mcp-vs-function-calling
```

Architecture rules:

- One intent, one canonical URL. Do not create separate pages for minor word-order variants.
- Keep server records, setup landings, editorial guides, and conceptual comparisons as distinct templates.
- Every setup page must have an exact entity and a runnable package or remote endpoint before indexation.
- Best-of pages must be regenerated from the current dataset and display a visible “data updated” date and scoring method.
- Comparison pages need a static route. The current query-driven `/en/compare?ids=` utility should remain `noindex,follow`.
- New English pages must link to relevant category, server, remote, security, and newsletter pages. Add `/zh/` only after translation and claim verification.

## Priorities

### P0

- Repair/noindex the 25 unsupported setup pages before publishing a new setup cohort.
- Enrich Claude Code config, proxy vs gateway, remote servers, and security guidance.
- Create `resources vs tools`, two troubleshooting guides, and the Claude Code/Cursor best-of pages.
- Add event tracking for search-result clicks, compare actions, setup-copy actions, newsletter signup, and monitoring/waitlist signup.

### P1

- Publish MCP vs RAG, A2A, CLI, and function-calling comparisons after static compare routing exists.
- Publish the marketing best-of page only after the 42 marketing candidates are revalidated for exact identity, runnable status, and current vendor documentation.
- Improve homepage ownership of “MCP server directory” and add the “are MCP servers free?” answer to the existing explainer.

### Waste-prevention decisions

- Do not create a separate sales best-of URL; merge sales workflows into marketing.
- Do not build a general MCP-client directory or Agent Skills directory on this domain.
- Do not create logo/icon pages; the queries are asset-seeking and outside the product promise.
- Do not compete head-on with the official “build an MCP server” tutorial until MCP Radar can offer a genuinely distinct production-testing dataset or tool.
- Hold the Google Sheets/Manus query: its 880 volume is missing KD, phrasing durability is unproven, and exact entity/client compatibility still needs validation.
- Do not index setup pages whose commands are placeholders or whose target entity cannot run.

## 30/60/90-Day Plan

### Days 1–30

- Export the 25-page setup remediation list into the implementation backlog; noindex immediately where the promise cannot be met.
- Ship the four existing-page enrichments first: Claude Code config, proxy vs gateway, remote directory, and security.
- Implement static `/en/compare/[slug]` routing and the shared comparison table/schema component.
- Publish the two troubleshooting pages with macOS/Linux/Windows and client-specific diagnosis.
- Add analytics events and annotate the release cohort.

Success gates: all P0 pages crawlable, no unsupported setup page indexed, event tracking verified, and every claim tied to a source/date.

### Days 31–60

- Publish the resources/tools comparison and the Claude Code/Cursor best-of pages.
- Add dataset-generated tables, methodology notes, last-verified dates, and server-detail internal links.
- Submit updated sitemap and inspect GSC indexing/canonical reports.
- Refresh titles/snippets only where impressions are present but CTR is weak.

Success gates: at least 80% of the cohort indexed, zero accidental duplicate canonicals, and first non-brand impressions visible for at least half of new/enriched URLs.

### Days 61–90

- Publish P1 comparisons in descending evidence strength.
- Validate the marketing entity set and publish only if at least 8 candidates pass exact-entity, runnable, evidence, and uniqueness gates.
- Compare cohort performance against baseline: impressions, Top-20 entrants, clicks, setup-copy events, compare events, and signup conversion.
- Enrich winners; merge or noindex zero-impression/low-utility pages rather than multiplying variants.

Success gates: measured improvement over baseline, documented keep/merge/noindex decisions, and a refreshed evidence export.

## Assumptions and Pending Evidence

1. GSC query/page exports are unavailable. Existing rankings, cannibalization, indexed-page counts, and 8–20 position opportunities are pending.
2. First-party analytics and paid conversion data are unavailable. Subscription value and ROI cannot be forecast reliably.
3. Keyword Magic exports were intentionally unfiltered to preserve the evidence set. Language was not constrained in the UI; English relevance was applied during clustering.
4. 245 relevant candidates with volume ≥50 have no KD. They are not treated as KD 0.
5. The current run used three approved seeds. Comparison/troubleshooting opportunities absent from these seeds reuse the 2026-07-28 pool and were refreshed against live SERPs.
6. The live data file contains 817 records, while local runtime defaults to mock unless `NEXT_PUBLIC_DATA_SOURCE=live`; production/build configuration must retain the live setting.
7. No sandbox installation or endpoint handshake was performed in this SEO run. “Verified” claims require a separate technical validation pass.
8. The 25-page setup remediation count comes from the 2026-07-28 eligibility audit and should be regenerated after any entity/package updates.
9. Marketing demand uses an unnatural 2,900-volume keyword as directional evidence; exact natural-title volume/KD is pending.
10. PAA coverage was inconsistent; FAQ questions must come from actual search/user evidence, not invented variants.
