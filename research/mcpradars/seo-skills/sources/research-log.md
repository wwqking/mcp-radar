# Research source log

Run date: 2026-07-28  
Market: United States, English  
Base term: `skills`

## Keyword tool

- Seed broad match: 1,779,851 keywords, 21,155,330 aggregate monthly searches, average KD 24%.
- Low-KD view (KD 0–29): 25,445 keywords, 4,568,870 aggregate monthly searches, average KD 17%.
- AI Agent Skills include-filter: 165 rows, 33,700 aggregate monthly searches, average KD 18%.
- The include-filter still contained ambiguity leakage, so it was not treated as a publishable page list.
- Exact raw file: `../raw/skills_broad_us_2026-07-28.csv`.

## Competitor organic exports

| Domain | US ranking keywords | Estimated traffic | Traffic cost | Raw file SHA-1 |
|---|---:|---:|---:|---|
| skills.sh | 211 | 1.6K | $14.2K | `caf71028bef880957ad12aa7ce0147e9f9ced9df` |
| skillsmp.com | 320 | 4.7K | $17.8K | `8517f1b0b474b714e3033490a2b0b3e956af7ef3` |
| agentskill.sh | 21 | 7 | $27 | `b029191faa9474c22bd23afe82475870475654b1` |

The Top Pages report was attempted for `skills.sh`, but the provider returned an error. No page-level traffic values were inferred or fabricated.

## Architecture evidence

- `skills.sh`: 37,354 sitemap URLs; localized duplicates were collapsed for pattern analysis.
- `skillsmp.com`: 19,358 sitemap URLs.
- `agentskill.sh`: 20,304 URLs were retrieved, but the crawler inferred 17 nonexistent child sitemaps and marked the result incomplete. Treat its module totals as directional.
- Full outputs: `../architecture.md` and `../architecture.json`.

## Google SERP validation

Eight US English queries were checked in a real browser:

1. `agent skills`
2. `claude skills`
3. `claude skills marketplace`
4. `skill.md`
5. `npx skills`
6. `codex skills`
7. `awesome claude skills`
8. `how to install agent skills`

The evidence is normalized in `../serp-validation.csv`. Rankings and SERP features are snapshots, not permanent facts.

## Decision log

- `skills` alone is too ambiguous to own as a page target.
- `claude skills marketplace` and related directory terms map to one `/skills/` hub.
- `agent skills` is mixed informational/specification intent; it maps to an evidence-led explainer, not a generic list page.
- Client terms (`Claude Code`, `Codex`, `Cursor`) deserve separate compatibility guides because install locations and triggering behavior differ.
- Imported detail pages remain `noindex` until they pass the two-of-five evidence gate.

