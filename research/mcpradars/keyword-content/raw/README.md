# Raw evidence manifest

Captured for the United States / English keyword-content run on 2026-08-12.

## Immutable keyword-tool exports

- `keyword-tools/semrush-mcp-broad_us_2026-07-23.csv`
- `keyword-tools/semrush-best-mcp-servers-broad_us_2026-07-29.csv`
- `keyword-tools/semrush-mcp-server-broad_us_2026-07-29.csv`
- `keyword-tools/semrush-mcp-tools-broad_us_2026-07-29.csv`
- Six matching July 29 Questions/Related exports for the same three seeds.
- `keyword-tools/semrush-r3-normalized_us_2026-07-25.csv` for older comparison and out-of-scope module evidence.

These are byte-for-byte copies of the existing Semrush-style exports. They were not edited after copying. The July 29 files form the newest available metric set; older comparison and troubleshooting rows come from the July 23 export and retain that date in the normalized output.

## Immutable competitor exports

- `competitors/semrush-pulsemcp.com-organic_us_2026-07-25.csv`
- `competitors/semrush-mcp.so-organic_us_2026-07-25.csv`
- `competitors/semrush-mcpservers.org-organic_us_2026-07-25.csv`
- `competitors/semrush-mcp.directory-organic_us_2026-07-25.csv`
- `competitors/semrush-glama.ai-organic_us_2026-07-25.csv`

## Current captures

- `live-serp-capture_us-en_2026-08-12.csv`: live web-result titles and URLs used for page-type validation.
- `existing-url-and-capability-capture_2026-08-12.md`: code and live-site inventory used for the existing-page and capability gates.

## Limitations

- No Google Search Console query/page export was available, so first-party impressions, clicks, rankings, and cannibalization are pending.
- No current paid-conversion report was available.
- The live search capture exposes organic, news, video, academic, and forum results, but not a reliable US Google AI Overview or PAA panel state. Those features are recorded as unavailable rather than inferred.
- Keyword metrics are 14-20 days old at research handoff. They are still the newest available exports, but should be refreshed before a later execution wave if priorities materially change.
