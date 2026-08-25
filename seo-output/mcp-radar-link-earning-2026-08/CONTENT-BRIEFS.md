# Content Briefs

## BRIEF-001

- Target URL: `/en/mcp-server-health-report` with a matching `/zh/` locale.
- Page action: create.
- Primary intent: Understand and cite the current health characteristics of MCP Radar’s auditable server sample.
- Primary keyword: `mcp server health report`.
- Supporting keywords: `mcp ecosystem report` | `mcp server statistics` | `mcp server maintenance`.
- User job: Obtain dated, reproducible facts without mistaking catalog breadth for production readiness.
- SERP pattern: Broad census/statistics reports, security PDFs, and state-of-ecosystem articles from MCP Census, Presenc AI, AgentNDX, Major Labs, and research groups.
- Competitor examples: https://mcpcensus.com/report | https://presenc.ai/research/mcp-server-ecosystem-statistics-2026 | https://agentndx.ai/blog/state-of-mcp-ecosystem-may-2026/
- Required answer: Sample size and boundary, server-record vs repository count, lifecycle mix, remote/runnable signals, maintenance recency, category coverage, weekly growth, and what was not verified.
- Required sections: Answer-first summary | KPI cards | citation block | scope | lifecycle | distribution/provenance | growth | categories | limitations | sources and reproducibility.
- Original value: Dynamic aggregation of the current MCP Radar dataset, exact lifecycle rules, explicit unknown-field handling, record-level public JSON, and bilingual citation guidance.
- Evidence and sources: `data/servers.json` | `/dataset.json` | `lib/collector/score.ts` | `EVIDENCE/live-citation-serp.csv`.
- Claims to verify: Snapshot date and count; distinct repository count; every derived percentage; official Registry status semantics; runnable-entry semantics; install-test count.
- Media/tool requirements: CSS lifecycle bar, dynamic tables, Dataset + Article JSON-LD, downloadable JSON. No decorative illustration required.
- Internal links: `/about` | `/leaderboard` | `/radar` | `/graveyard` | `/dataset.json`.
- CTA: Download the dataset, cite the report with date/method, or submit a correction.
- Update owner/frequency: Site owner; regenerate at every dataset snapshot without changing the canonical URL.
- Definition of done: Both locales build, metadata/hreflang/schema validate, all numbers come from current data, limitations are visible before outreach, and sitemap/footer/llms.txt expose the page.

## BRIEF-002

- Target URL: `/dataset.json`.
- Page action: enrich.
- Primary intent: Download and reproduce MCP Radar’s record-level health data.
- Primary keyword: `mcp server dataset`.
- Supporting keywords: `mcp server health data` | `mcp server json dataset`.
- User job: Recalculate report metrics and trace each record to public sources.
- SERP pattern: Dataset/report pages usually expose totals but vary in record-level reproducibility.
- Competitor examples: https://mcpcensus.com/report
- Required answer: Dataset name, snapshot date, methodology URL, report URL, caveat, count, record fields, sources, and corresponding human page.
- Required sections: JSON top-level metadata and record array.
- Original value: Direct connection between each aggregate claim and downloadable source rows.
- Evidence and sources: `app/dataset.json/route.ts` | `data/servers.json`.
- Claims to verify: Field semantics for Registry status, runnable entries, auditability, and issue response.
- Media/tool requirements: Valid static JSON response, cache headers, dated filename.
- Internal links: Human-readable report and methodology URLs in the top-level payload.
- CTA: Recalculate, cite, or report a correction.
- Update owner/frequency: Site owner; every dataset snapshot.
- Definition of done: JSON parses, count matches the current provider, report/methodology URLs resolve, and missing Registry verification remains `unknown`.

## BRIEF-003

- Target URL: `/en/about` and `/zh/about`.
- Page action: enrich.
- Primary intent: Evaluate how MCP Radar computes TrustScore and lifecycle labels.
- Primary keyword: `mcp server trust score methodology`.
- Supporting keywords: `mcp server maintenance score` | `mcp lifecycle rules`.
- User job: Decide whether a report claim is reproducible and understand its limits.
- SERP pattern: Competing reports publish varying levels of methodology transparency.
- Competitor examples: https://mcpcensus.com/report | https://majorlabs.co/reports/state-of-mcp-2026.pdf
- Required answer: Weights, source fields, lifecycle thresholds, data limitations, sponsorship separation, and corrections process.
- Required sections: Existing methodology, sources, limits, disclosure, correction channel, and applied-report link.
- Original value: Exact operational definitions tied directly to code and the current report.
- Evidence and sources: `lib/collector/score.ts` | `app/[locale]/about/page.tsx`.
- Claims to verify: Weight totals; stale threshold; issue/release conditions; unverifiable rule.
- Media/tool requirements: Existing tables and lifecycle cards; no new media.
- Internal links: `/mcp-server-health-report` | `/editorial-policy` | `/sponsor`.
- CTA: Read the report or submit a correction.
- Update owner/frequency: Update whenever scoring logic changes.
- Definition of done: Both locales link to the report and every method claim matches current scoring code.

## BRIEF-004

- Target URL: `/en/leaderboard` and `/zh/leaderboard`.
- Page action: enrich.
- Primary intent: Compare current MCP server health records interactively.
- Primary keyword: `mcp server health leaderboard`.
- Supporting keywords: `mcp server quality ranking` | `maintained mcp servers`.
- User job: Filter individual records, then understand the aggregate context and limitations.
- SERP pattern: Large directory tables emphasize breadth and rankings; citation-ready aggregate context is usually separate.
- Competitor examples: https://www.pulsemcp.com/servers | https://glama.ai/mcp/servers
- Required answer: Current records, filters, score dimensions, update date, method, and report link.
- Required sections: Existing method bar and table, with a direct link to the health report.
- Original value: Interactive record comparison connected to a stable report and public source data.
- Evidence and sources: `app/[locale]/leaderboard/page.tsx` | `data/servers.json`.
- Claims to verify: Dataset date, record count, sort/filter behavior, and score labels.
- Media/tool requirements: Existing leaderboard interaction; no extra chart.
- Internal links: `/mcp-server-health-report` | `/about` | `/dataset.json`.
- CTA: Review the report before citing a leaderboard value.
- Update owner/frequency: Every dataset snapshot and scoring change.
- Definition of done: Method bar links to both methodology and report in both locales; no new competing canonical URL is introduced.
