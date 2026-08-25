---
brief_id: mcpradar-skill-md--skill-md-guide
status: planned
priority: P0
wave: Wave 0
target_url: /guides/skill-md/
primary_keyword: "skill md"
search_intent: "Informational"
page_type: "guide"
expert_review: false
last_verified: 2026-07-28
refresh_due: 2026-09-26
---

# SKILL.md: Format, Examples, and Validation

## Direct answer goal

Define `SKILL.md` as the instruction entry point inside an Agent Skill folder, then show the smallest valid example and a “Validate this file” action. Make it clear which fields are part of a client-agnostic convention and which behaviors vary by agent.

## Supporting keywords

- skills file
- Claude skill.md
- Claude skill files
- skill.md example
- skills.md Claude
- skill schema
- validate SKILL.md

## Required sections

1. Minimal folder tree and annotated `SKILL.md`.
2. Frontmatter fields and naming rules.
3. Progressive disclosure: what is indexed first and what loads later.
4. Optional scripts, references, and assets.
5. Client behavior table for Claude Code, Codex, Cursor, and VS Code.
6. Security review: remote commands, hidden instructions, and untrusted assets.
7. Common validation failures.
8. Live validator and downloadable starter template.

## Internal links

- `/what-are-agent-skills/`
- `/guides/create-agent-skill/`
- `/guides/install-agent-skills/`
- `/tools/skill-md-validator/`
- `/compare/agent-skills-vs-mcp/`

## FAQ

1. What is a `SKILL.md` file?
2. Where should `SKILL.md` be placed?
3. What frontmatter does an Agent Skill need?
4. Can a skill include scripts and assets?
5. How do I validate a skill before installing it?

## Evidence requirements

- Base format claims on current official client documentation and the Agent Skills specification.
- Test the example in at least two clients.
- Include a machine-readable validation fixture in the site repository.
- Distinguish syntax validity from safety; a valid file can still be unsafe.

## Metrics snapshot

- Gross cluster volume: 1,330
- Average KD: 29
- Opportunity: P0 when paired with a useful validator
- SERP competition: medium — specification sites, exact-match domains, documentation, and forums rank

