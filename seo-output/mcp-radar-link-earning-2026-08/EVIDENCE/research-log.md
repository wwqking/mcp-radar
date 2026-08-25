# Research Log

## Existing site and first-party data

- Source: local MCP Radar repository and `data/servers.json`.
- Collected: 2026-08-03; final snapshot in use is 2026-08-02.
- Coverage: 1,977 server records and 1,860 distinct declared repositories.
- Limitation: sample is biased toward auditable repositories and usable metadata; it is not a full ecosystem census.

## Competitor backlink evidence

- Source: unchanged CSV exports under `EVIDENCE/raw/backlinks/`.
- Targets: pulsemcp.com, mcp.so, mcp.directory, and mcpservers.org; gap export also includes mcpradars.com.
- Market/language: global, mixed language.
- Collected by prior run: 2026-08-01.
- Coverage: 19,050 CSV lines across the domain-gap and four per-domain exports.
- Limitation: observed Follow status is historical evidence for the competitor link only. It does not prove a future MCP Radar placement will use the same attributes.

## Live citation and report SERPs

- Queries: `MCP server directory`, `MCP ecosystem report server directory 2026`, `best MCP server directories 2026`, `where to find MCP servers`, `MCP ecosystem server health`.
- Market/language: global English web results.
- Collected: 2026-08-03.
- Coverage: report, resource-guide, editorial, newsletter, and research-page types.
- Preserved findings: `EVIDENCE/live-citation-serp.csv`.
- Limitation: this was opportunity and page-type validation, not a full rank-tracking study. Search-result presence does not prove link attributes or contactability.

## Policy sources

- Google spam policies: https://developers.google.com/search/docs/essentials/spam-policies
- Google link qualification guidance: https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links
- Collected: 2026-08-03.
- Use: reject paid ranking links, automated links, excessive exchanges, and optimized-anchor guest-post campaigns; distinguish ordinary links from sponsored/nofollow/ugc links.
