# Content Briefs

## BRIEF-001

- Target URL: https://www.mcpradars.com/en
- Page action: enrich
- Primary intent: Establish site trust and a safe page experience.
- Primary keyword: MCP Radar
- Supporting keywords: MCP server directory; verified MCP servers
- User job: Decide whether the directory and its scores are safe and credible enough to use.
- SERP pattern: Large directories emphasize scale; stronger trust-oriented competitors emphasize verification, tools, continuous checks, or an ad-free experience.
- Competitor examples: SafeMCP; MCP Reference; Zevruna.
- Required answer: What is measured, what is actually tested, what remains derived, how recent the evidence is, and what the score does not certify.
- Required sections: Evidence summary; verified coverage; methodology limits; latest data date; safe-use warning; correction/claim path.
- Original value: Publish verified versus derived coverage and link directly to first-hand evidence.
- Evidence and sources: Repository scoring logic; live dataset; GSC; dated test results.
- Claims to verify: Record count; verified count; data date; no security-certification claim; ad behavior.
- Media/tool requirements: Evidence filters and clear verified/derived badges; no redirecting or popunder script.
- Internal links: Health report; methodology; editorial policy; tested entity pages.
- CTA: Browse tested servers or inspect the health report.
- Update owner/frequency: Data owner daily for metrics; editor monthly for claims and methodology.
- Definition of done: nap5k script removed; verified/derived distinction visible above the fold; all counts share one data timestamp; canonical variants 301 to HTTPS/www; mobile and Googlebot render pass.

## BRIEF-002

- Target URL: https://www.mcpradars.com/en/server/{slug}
- Page action: enrich
- Primary intent: Evaluate and install one MCP server.
- Primary keyword: {server name} MCP server
- Supporting keywords: is {server} reliable; {server} install; {server} tools; {server} permissions
- User job: Decide whether to trust the server and get it working without reading multiple upstream sources.
- SERP pattern: Official documentation dominates basic setup; directory pages can win only with independent verification, comparison, and current health evidence.
- Competitor examples: Official project documentation; MCP Reference; Zevruna.
- Required answer: What it does; who publishes it; how to install; what permissions it needs; whether it actually starts; exposed tools; observed failures; alternatives.
- Required sections: Answer-first verdict; provenance; verified install result; tool surface; permissions/risk; health changes; alternatives; source/date block.
- Original value: At least two of firsthand test, original score/trend, editorial judgment, useful comparison, or maintainer feedback.
- Evidence and sources: Clean-sandbox test log; registry manifest; official repository; npm/PyPI/OCI; GitHub API; maintainer correction where available.
- Claims to verify: Publisher identity; package/endpoint; supported clients; tool count; version; test date; license; maintenance status.
- Media/tool requirements: Copyable exact commands; structured test log; screenshot only when it proves a UI/client-specific step.
- Internal links: Health report; relevant category; one true alternative; one troubleshooting guide.
- CTA: Copy verified command or compare the best alternative.
- Update owner/frequency: Automated signals daily; install tests on material version changes; editorial review quarterly.
- Definition of done: Passes all three admission gates; contains no placeholder command; has two documented differentiators; self-canonical; included in sitemap with truthful lastmod; claims trace to sources.

## BRIEF-003

- Target URL: https://www.mcpradars.com/en/mcp-server-health-report
- Page action: enrich
- Primary intent: Understand MCP ecosystem health and change.
- Primary keyword: MCP server health report
- Supporting keywords: active MCP servers; abandoned MCP servers; MCP maintenance data
- User job: Learn what proportion of the ecosystem is active, testable, risky, or unverifiable and how that changed.
- SERP pattern: Strong competitors publish continuous polls, advisories, verification coverage, or behavior-based scoring.
- Competitor examples: Zevruna; Dominion Observatory.
- Required answer: Scope; cohort definitions; current results; change over time; limitations; methodology; downloadable evidence.
- Required sections: Executive findings; methodology/version; cohort table; change timeline; tested-versus-derived coverage; notable changes; limitations; data download.
- Original value: Dated, reproducible calculations over the MCP Radar dataset and transparent methodology changes.
- Evidence and sources: Repository ecosystem report; data snapshots; install verification; public dataset.
- Claims to verify: Denominators; date windows; lifecycle definitions; verified counts; sampling limitations.
- Media/tool requirements: Lightweight server-rendered charts/tables; downloadable CSV/JSON; no multi-megabyte payload.
- Internal links: Homepage; leaderboard; methodology; representative entity pages.
- CTA: Download the evidence or inspect tested servers.
- Update owner/frequency: Data owner weekly; methodology versioned on change.
- Definition of done: Every figure reconciles to a downloadable source; all charts render without client JS dependency; page under agreed payload budget; methodology and limitations visible.

## BRIEF-004

- Target URL: https://www.mcpradars.com/en
- Page action: enrich
- Primary intent: Discover trustworthy MCP server candidates.
- Primary keyword: MCP server directory
- Supporting keywords: find MCP servers; verified MCP servers; MCP server comparison
- User job: Move quickly from a use case to a small set of credible candidates.
- SERP pattern: Directory results compete on size, filters, verified status, security signals, and install convenience.
- Competitor examples: MCP Reference; SafeMCP.
- Required answer: What the catalog covers, what is verified, and how to filter to credible candidates.
- Required sections: Value proposition; tested coverage; evidence filters; category entry points; health-report summary; methodology limits.
- Original value: Evidence-first discovery, not raw record count; show observed test coverage and freshness.
- Evidence and sources: Live dataset; install verification; GSC landing-page behavior when available.
- Claims to verify: Catalog count; verified count; active/dead cohorts; update date.
- Media/tool requirements: Fast search/filter interaction; server-rendered useful content; lean initial payload.
- Internal links: Health report; leaderboard; selected categories; tested entities.
- CTA: Show only tested servers.
- Update owner/frequency: Automated data daily; editorial framing monthly.
- Definition of done: Above-fold copy prioritizes evidence; verified-only path works; no unsupported superlatives; LCP/TTFB and payload meet the technical budget.

## BRIEF-005

- Target URL: https://www.mcpradars.com/en/leaderboard
- Page action: enrich
- Primary intent: Compare and shortlist MCP servers.
- Primary keyword: best MCP servers
- Supporting keywords: top MCP servers; reliable MCP servers; MCP server ranking
- User job: Select a few candidates based on meaningful, explainable trade-offs.
- SERP pattern: Ranking pages use curated shortlists, category winners, scoring methodology, and explicit selection/exclusion criteria.
- Competitor examples: MCPfinder best-mcp-servers-2026; Top MCPs directory comparison.
- Required answer: Best for what, based on which evidence, verified or derived, and what limitations affect the ranking.
- Required sections: Tested picks; category winners; methodology; evidence gaps; comparison table; excluded entries; update history.
- Original value: Separate tested ranking from derived ranking and show the evidence behind each position.
- Evidence and sources: TrustScore components; install tests; GSC; data snapshots.
- Claims to verify: Ranking inputs; data date; tie handling; publisher identity; tested status.
- Media/tool requirements: Server-rendered top subset; pagination or progressive loading; total HTML payload materially below the current 11.9 MB.
- Internal links: Health report; methodology; entity pages; category pages.
- CTA: Compare the tested finalists.
- Update owner/frequency: Data refresh daily; editorial shortlist monthly.
- Definition of done: Zero unsupported ranking claims; tested/derived split; useful answer above the fold; no duplicate entity intent; performance budget met.

## BRIEF-006

- Target URL: https://www.mcpradars.com/en/guides/{validated-slug}
- Page action: enrich
- Primary intent: Fix a specific MCP installation or runtime failure.
- Primary keyword: spawn npx ENOENT
- Supporting keywords: MCP server disconnected; MCP install error; npx MCP error
- User job: Identify the cause and apply a verified fix for the user's OS/client combination.
- SERP pattern: Official issues and troubleshooting pages win when they provide exact errors, prerequisites, and reproducible commands.
- Competitor examples: Official repositories, issue trackers, and client documentation.
- Required answer: What the error means, root-cause decision tree, verified fixes, and how to confirm recovery.
- Required sections: Symptom; causes by platform; diagnostic commands; fixes; verification; rollback; related errors.
- Original value: Reproduction matrix across at least two clients/OS paths and exact observed logs.
- Evidence and sources: GSC query/page data; official issues; local reproduction logs; client documentation.
- Claims to verify: Command syntax; supported runtime versions; error signatures; security implications.
- Media/tool requirements: Copyable commands and concise decision table; screenshots only when UI navigation matters.
- Internal links: Relevant server entity; guide index; related troubleshooting guide.
- CTA: Run the verification step, then inspect the server page.
- Update owner/frequency: Editor on upstream runtime/client changes; quarterly verification.
- Definition of done: Fix reproduced and re-tested; commands specify environment; sources linked; no generic filler; search intent is not duplicated by another guide.

## BRIEF-007

- Target URL: https://www.mcpradars.com/en/category/{qualified-slug}
- Page action: enrich
- Primary intent: Compare MCP servers for one concrete job.
- Primary keyword: best {category} MCP servers
- Supporting keywords: {category} MCP tools; compare {category} MCP servers
- User job: Choose the right server for a use case without evaluating every registry result.
- SERP pattern: Useful hubs combine an editorial shortlist, comparison criteria, and entity-level evidence rather than dumping all records.
- Competitor examples: Curated competitor category pages and official ecosystem lists.
- Required answer: Which candidates fit which sub-jobs, what trade-offs matter, and which were excluded.
- Required sections: Decision summary; comparison criteria; tested shortlist; trade-off table; exclusions; safety/permission notes; alternatives.
- Original value: Human-readable selection logic plus tested/derived evidence for each recommended candidate.
- Evidence and sources: GSC; entity tests; taxonomy; official project documentation.
- Claims to verify: Candidate fit; tested status; permissions; maintenance; comparison date.
- Media/tool requirements: Compact comparison table; filters secondary to editorial answer.
- Internal links: Entity pages; health report; relevant troubleshooting guide.
- CTA: Compare the qualified shortlist.
- Update owner/frequency: Quarterly editorial review and on major lifecycle changes.
- Definition of done: At least three qualified candidates; explicit selection/exclusion logic; no thin record dump; every recommendation passes the entity admission rule.
