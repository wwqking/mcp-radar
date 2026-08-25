---
brief_id: mcpradar-install-cli--install-agent-skills
status: planned
priority: P0
wave: Wave 0
target_url: /guides/install-agent-skills/
primary_keyword: "npx skills"
search_intent: "Transactional"
page_type: "guide"
expert_review: false
last_verified: 2026-07-28
refresh_due: 2026-08-27
---

# How to Install Agent Skills with `npx skills` or Manually

## Direct answer goal

Give a copyable, source-pinned install command, then immediately show how to inspect what was installed and how to undo it. Ask the reader to choose a client because Claude Code, Codex, Cursor, VS Code, and other agents may use different folders and discovery behavior.

## Supporting keywords

- how to install agent skills
- how to add skills to Claude Code
- add skills to Claude Code
- skill-installer
- `.agents/skills`
- download Claude skills
- npx add skill

## Required sections

1. Before you install: identify the repository, owner, license, and requested scripts.
2. CLI path: current `npx skills` syntax verified against the official repository.
3. Manual path: exact folder layout and minimal `SKILL.md`.
4. Client matrix: project and global paths for each tested client.
5. Confirm the skill is detected; include explicit and implicit triggering.
6. Update, pin, remove, and roll back.
7. Common failures, linked only after each has been reproduced.
8. Security checklist: inspect remote commands, scripts, encoded payloads, network access, and secrets usage.

## Internal links

- `/skills/`
- `/guides/skill-md/`
- `/skills/claude-code/`
- `/skills/codex/`
- `/tools/skill-md-validator/`
- `/tools/agent-skill-security-checker/`

## FAQ

1. What does `npx skills` install?
2. Where are Agent Skills stored?
3. How do I install a skill globally?
4. Can the same skill work in Claude Code and Codex?
5. How do I remove an Agent Skill?
6. Is it safe to run an install command from a directory?

## Evidence requirements

- Re-run every command in a disposable project before publication.
- Record Node, CLI, and client versions.
- Do not execute third-party scripts before a static review.
- Prefer the Vercel CLI repository and each client’s official documentation.
- Add dated screenshots or terminal excerpts that reveal no secrets.

## Metrics snapshot

- Gross cluster volume: 4,630
- Average KD: 33
- Opportunity: P0
- SERP competition: medium — GitHub, Vercel, official IDE docs, and community guides all appear

