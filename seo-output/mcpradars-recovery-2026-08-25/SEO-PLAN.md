# SEO Plan

## Executive Summary

- Site: www.mcpradars.com
- Objective: recover Google Search visibility after the 2026-08-18 spam update while preserving the useful MCP catalog.
- Diagnosis: GSC impressions fell from an average of 258.8/day on 2026-08-15–18 to 9/day on 2026-08-19–22, a 96.5% decline. The timing matches Google's August 2026 spam update.
- Strategic decision: stop treating every catalog record as an indexable landing page. Keep the catalog for users, but admit a URL to Search only when it has demand or strong entity evidence, technical completeness, and at least two material differentiators.
- Emergency target: reduce the submitted/indexable surface from 10,812 URLs to an initial quality set of approximately 300–500 URLs. The final number is produced by the admission rules, not by a fixed quota.
- Recovery stance: no new SEO URLs during the first 30 days. Prioritize cleanup, consolidation, verification, and enrichment.

## Site Scope

- Market: Global; the United States is the primary English market based on current GSC impressions.
- Languages: English primary; Simplified Chinese secondary.
- Audience: Developers and AI-tool users evaluating, installing, and comparing MCP servers.
- Core user jobs: determine whether a server is alive and trustworthy; install it correctly; understand permissions and failure modes; compare alternatives.
- Business: MCP server directory and evidence layer.
- Monetization: AdSense and sponsorship. Risky third-party ad delivery is suspended during recovery.
- Seed intents: MCP server; `{entity} MCP server`; MCP server health; best MCP servers; MCP install/configuration; MCP troubleshooting.
- Site type: Existing but very young programmatic directory.
- Existing evidence: GSC export dated 2026-08-25; live sitemap and HTTP checks; repository implementation; live SERP/competitor review.

## Opportunity Summary

### Evidence funnel

- First-party page candidates inspected: 1,000 GSC page rows.
- Programmatic server-detail rows: 935.
- Server pages with a click or at least 5 impressions and average position at or above 20: 213.
- Manually written capability records in the repository: about 62.
- Live install-verified records: 2.
- Decision clusters in PAGE-PLAN.csv: 15.
- Create: 0.
- Enrich: 8.
- Merge: 2.
- Noindex: 3.
- Reject: 2.
- P0: 8; P1: 4; P2: 1; Reject: 2.

### Index admission rule

An entity page remains indexable only when it passes all three gates:

1. Demand or entity gate
   - GSC click greater than 0; or
   - at least 5 impressions with average position 20 or better; or
   - strategically important entity with strong adoption/maintenance evidence.
2. Technical completeness gate
   - 200 response on the canonical HTTPS/www URL;
   - self-canonical and unique title/description;
   - exact runnable package or remote endpoint, not a placeholder;
   - source attribution and honest evidence date.
3. Added-value gate
   - at least two of: firsthand install/tool verification, original calculation/data, original editorial judgment, useful comparison/tool, verified maintainer feedback.

Pages that fail a gate remain available in the catalog with `noindex, follow` and are removed from the XML sitemap. `robots.txt` must not block them until Google has processed the noindex.

### Competitor and SERP findings

- Official Playwright documentation wins setup intent with exact prerequisites, client-specific commands, configuration, and security warnings. MCP Radar should not attempt to outrank official documentation by paraphrasing it; it should add independent verification, failure evidence, and comparison judgment.
- MCP Reference demonstrates a small curated model: 30 servers, 19 verified, and 223 tools catalogued. Verification coverage is a stronger trust signal than raw directory size.
- Zevruna differentiates with continuous polling, contract stability, and advisories rather than generic repository metadata.
- SafeMCP competes on scale while explicitly claiming verification and an ad-free experience. Raw catalog size alone is not a defensible differentiator.
- Result: MCP Radar's reachable position is an evidence-first screening layer: tested installs, observed tool surfaces, lifecycle changes, permission/risk notes, and transparent methodology.

## Site Architecture

### Keep and strengthen

- `/en` as the canonical discovery homepage.
- `/en/mcp-server-health-report` as the primary original-data asset.
- `/en/server/{slug}` for entities that pass the admission rule.
- Selected `/en/guides/{slug}` for real troubleshooting demand.
- Selected category/topic pages only when they provide editorial selection and useful comparisons.

### Merge

- Redirect HTTP and non-www variants to the HTTPS/www canonical in one hop.
- For each duplicated entity intent, choose either `/server/{slug}` or `/servers/{tool}-mcp-server`; do not keep two indexable URLs answering the same job.

### Retain but noindex

- Entity records that are useful for catalog completeness but fail the admission rule.
- Chinese entity pages whose entity-specific content is still English or materially incomplete.
- Thin category/topic pages without selection logic or unique editorial guidance.

### Reject during recovery

- Bulk creation of new entity or keyword landing pages.
- Mass URL inspection/indexing requests, indiscriminate backlink acquisition, and generic SEO copy expansion.

## Priorities

1. **P0-1 — Freeze and verify (day 0–1).** Freeze new indexable URLs, remove the `nap5k.com` script, preserve the current GSC baseline, and check Manual Actions, Security Issues, Page Indexing, and Crawl Stats.
2. **P0-2 — Canonical infrastructure (day 1–2).** One-hop 301 all HTTP/non-www variants to `https://www.mcpradars.com`; align canonical, sitemap, internal links, and Cloudflare rules.
3. **P0-3 — Index admission and sitemap reduction (day 2–7).** Implement the three-gate rule, apply `noindex, follow` to failed pages, and submit only admitted canonical URLs with truthful lastmod dates.
4. **P0-4 — Consolidate duplicate intent (day 3–7).** Resolve `/server/` versus `/servers/` overlap and noindex untranslated Chinese entity pages.
5. **P0-5 — Publish an evidence core (day 5–14).** Strengthen the health report, homepage, and the first 50 highest-value entity pages with tested or original evidence.
6. **P1-1 — Expand verified coverage (day 15–30).** Enrich the next 50–100 entity pages; each must pass two added-value differentiators before indexing.
7. **P1-2 — Repair supporting hubs (day 15–30).** Improve leaderboard performance and selected guide/category pages; noindex weak hubs.
8. **P2 — Controlled growth (after measurable recovery).** Resume Chinese localization and new entity admission only through the same gates. Reintroduce monetization only through a trusted, non-redirecting implementation.

### P0 deployment order and rollback

- Deploy ad removal and canonical redirects first; verify with curl and browser tests.
- Deploy index admission metadata and sitemap second; export the admitted URL list before release.
- Deploy content enrichments third, in batches of 25–50 URLs.
- Roll back only on functional regressions, incorrect noindex targeting, redirect loops, or loss of canonical pages. Do not roll back merely because rankings do not recover immediately.

### Acceptance metrics

- 100% of protocol/host variants resolve to HTTPS/www in at most one redirect.
- Zero risky third-party redirect/popunder scripts on indexable pages.
- XML sitemap contains only self-canonical, 200, indexable URLs and uses truthful lastmod values.
- 100% of indexable programmatic pages have at least two documented differentiators.
- No overlap where `/server/` and `/servers/` target the same entity intent.
- First 50 enriched entity pages include exact source dates; priority pages include firsthand verification or explicit editorial judgment.
- GSC leading indicator: Page Indexing stabilizes, crawled-currently-not-indexed does not continue growing, and impressions stop making new lows over a rolling 14-day window.
- Recovery indicator: admitted page set regains impressions and query breadth over 28–90 days. No guaranteed traffic target is assumed.

## 30/60/90-Day Plan

### Days 0–7

- Freeze new indexable page creation.
- Remove the `nap5k.com` script.
- Check and record GSC Manual Actions, Security Issues, Page Indexing, Crawl Stats, and 10 representative URL inspections.
- Add HTTPS/www one-hop redirects.
- Implement the index-admission function and generate an auditable admitted/rejected URL list.
- Apply `noindex, follow` to failed records and remove them from sitemap.
- Merge duplicate `/server/` and `/servers/` intents.
- Noindex untranslated Chinese entity pages.

### Days 8–30

- Enrich the health report and homepage around original data and methodology.
- Enrich 50–100 high-value entity pages selected from GSC and adoption evidence.
- Add exact install/test results, observed tools, permission scope, failure modes, test environment/date, and alternatives.
- Optimize leaderboard and large aggregation pages for payload and crawl efficiency.
- Resubmit the clean sitemap once; request indexing only for the homepage, health report, major hubs, and a small representative set.
- Review GSC at 7-, 14-, and 28-day checkpoints by page type.

### Days 31–60

- Expand the verified/enriched set toward 200–300 entity pages only where the gates pass.
- Strengthen selected troubleshooting guides using first-party GSC demand and verified fixes.
- Collect maintainer corrections/claims as attributable evidence.
- Review pages that remain indexed without impressions; noindex or merge those unable to add value.

### Days 61–90

- Compare admitted versus noindexed cohorts in GSC.
- Resume limited Chinese indexing only for genuinely localized, evidence-complete pages.
- Admit new entities in small batches and require two differentiators at publication time.
- Reintroduce monetization only after security and behavior review; keep ad load below the point where it obscures the primary task.
- If there is no recovery, run a second whole-site quality review focused on scraped/derived content, misleading functionality, and external reputation/links rather than publishing more pages.

## Assumptions and Pending Evidence

- Assumption: the United States/global English market remains the primary acquisition target; current GSC country data supports this but conversion data is unavailable.
- Assumption: there is no manual action or security issue. This must be confirmed in the authenticated GSC reports before implementation decisions are finalized.
- Pending: Page Indexing export before and after 2026-08-18, including indexed, crawled-not-indexed, duplicate, soft-404, and canonical states.
- Pending: Crawl Stats host-status history and Googlebot response distribution.
- Pending: GA4 engagement/conversion data by landing page; it should break ties between otherwise similar entity pages.
- Pending: Revenue by page/ad network; monetization must not override recovery and trust requirements.
- Pending: Designated Keyword Magic expansion. It is deliberately deferred because this is a recovery plan with zero new-page recommendations; complete it only after the indexable core stabilizes.
- Limitation: GSC page and query tables are capped/sampled; the provided page export contains 1,000 rows and query privacy suppression means totals do not fully reconcile.
- Recovery expectation: algorithmic reassessment can take weeks or months. A reconsideration request is appropriate only if GSC shows a manual action.
