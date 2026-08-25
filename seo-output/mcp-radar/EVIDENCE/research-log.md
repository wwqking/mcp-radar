# SEO Evidence Log

## Run

- Site: `https://www.mcpradars.com`
- Collection date: 2026-07-29
- Market/database: United States (`us`)
- Primary language: English
- Site status: existing
- Monetization assumption: subscription

## Keyword Magic

Designated source: `https://zh.trends.fast.wmxpro.com/analytics/keywordmagic/`

The exports were collected through the visible UI and preserved unchanged under `EVIDENCE/raw/keyword-magic/`. No Semrush.com, Semrush API, Ahrefs, or substitute keyword provider was used.

| Seed | Pass | Rows | Raw file |
|---|---|---:|---|
| mcp server | Broad | 11,045 | `mcp-server__us__broad__2026-07-29.csv` |
| mcp server | Questions | 831 | `mcp-server__us__questions__2026-07-29.csv` |
| mcp server | Related | 1,280 | `mcp-server__us__related__2026-07-29.csv` |
| mcp tools | Broad | 1,658 | `mcp-tools__us__broad__2026-07-29.csv` |
| mcp tools | Questions | 85 | `mcp-tools__us__questions__2026-07-29.csv` |
| mcp tools | Related | 786 | `mcp-tools__us__related__2026-07-29.csv` |
| best mcp servers | Broad | 173 | `best-mcp-servers__us__broad__2026-07-29.csv` |
| best mcp servers | Questions | 6 | `best-mcp-servers__us__questions__2026-07-29.csv` |
| best mcp servers | Related | 245 | `best-mcp-servers__us__related__2026-07-29.csv` |

- Raw rows: 16,109
- Normalized rows: 13,648
- Exact duplicates removed: 2,461
- Broad summary observed for `mcp server`: 11,045 keywords; total volume 317,760; average KD 33%
- Questions summary observed for `mcp server`: 831 keywords; total volume 26,850; average KD 36%
- Related summary observed for `mcp server`: 1,280 keywords; total volume 458,450; average KD 44%
- Normalized output: `EVIDENCE/normalized/keyword-candidates.csv`
- Initial local gate: volume ≥50, known KD ≤29, and MCP/Model Context Protocol relevance
- Result of gate: 468 measured candidates, total directional volume 81,930
- Missing-KD relevant candidates with volume ≥50: 245; held out of the easy-win count

Limitations: exports were unfiltered and the UI language selector was not constrained. The normalized pool therefore contains homonyms, non-English queries, client-directory queries, logo/assets, and unrelated meanings of MCP. Relevance and product-boundary decisions are recorded in `PAGE-PLAN.csv`.

## Site Inventory

Source files: `data/servers.json`, `app/sitemap.ts`, `lib/seo-landing.ts`, `lib/guides.ts`, route files under `app/[locale]/`.

- 817 server records
- 711 active, 96 dying, 9 dead
- 704 with runnable entries
- 666 in the official registry
- 11 categories
- 44 SEO setup landings
- 6 guides
- English and Chinese locale routes with hreflang
- Query-driven compare utility is explicitly `noindex,follow`
- `robots.ts` allows standard and named AI crawlers

Baseline eligibility reused from `research/mcpradars/seo/current-2026-07-28/`: 25 of 44 setup pages lack a package or remote endpoint that can support the setup/config promise.

## Live SERP Validation

Queries were checked on 2026-07-29. URLs and decisions are recorded in `EVIDENCE/live-serp-validation.csv`.

Main findings:

- Directory SERPs contain multiple large inventories; raw count alone is not a moat.
- Official Claude documentation leads Claude Code configuration intent.
- Troubleshooting SERPs changed quickly: dedicated ENOENT and `-32001` pages appeared in the last month.
- Comparison SERPs consistently use direct-answer introductions, decision tables, implementation examples, and FAQs.
- Best-of SERPs are list-heavy and often subjective; MCP Radar can differentiate with dated health/runnable evidence.
- Marketing has a natural, validated SERP despite the unnatural wording in the volume export.

## First-Party Data

Pending:

- GSC query/page export
- Indexed vs submitted sitemap counts
- Current cannibalization
- Page-level sessions and conversions
- Newsletter/waitlist attribution
- Paid conversion, ARPU, retention, and LTV

These gaps lower confidence in revenue forecasts and current-ranking prioritization, but do not block the P0 quality repairs or measured intent decisions.
