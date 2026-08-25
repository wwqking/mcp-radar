# Content Briefs

## BRIEF-001

- Target URL: `/en/guides/claude-code-mcp-config`
- Page action: Enrich
- Primary intent: Configure and verify MCP servers in Claude Code.
- Primary keyword: `claude code mcp server configuration`
- Supporting keywords: `claude code add mcp server` | `claude desktop mcp server configuration` | `how to add mcp server to claude code`
- User job: Add the correct transport at the correct scope, confirm it loaded, and fix the most common configuration failures.
- SERP pattern: Official Claude documentation leads; secondary pages focus on setup snippets and restart failures.
- Competitor examples: `https://code.claude.com/docs/en/mcp` | `https://www.runxbuild.com/blog/claude-code-mcp-server-setup/`
- Required answer: Give the current CLI and `.mcp.json` paths, explain local/project/user scope, then show how to verify with `claude mcp list`, `claude mcp get`, and `/mcp`.
- Required sections: Quick setup chooser; scope matrix; stdio vs HTTP examples; environment variables and secrets; verification; no-tools/connecting/path troubleshooting; remove/update; safe team sharing.
- Original value: Link every example server to a current MCP Radar record and show runnable/lifecycle/permission signals before recommending it.
- Evidence and sources: Official Claude docs; current server dataset; Keyword Magic candidate row; existing guide copy.
- Claims to verify: Current CLI syntax; config file locations; scope storage; reserved names; tool-search behavior; server package commands.
- Media/tool requirements: Config matrix; annotated `.mcp.json`; verification checklist; copy buttons; screenshots only if captured from the current Claude Code UI.
- Internal links: `/en/remote-mcp-servers` | `/en/guides/mcp-security-red-lines` | `/en/guides/best-mcp-servers-for-claude-code`
- CTA: Browse verified runnable servers, then subscribe to health-change alerts.
- Update owner/frequency: Developer-content owner; monthly and after Claude Code MCP changes.
- Definition of done: All commands run in a clean test project; official docs cited; at least three failure states reproduced; schema/meta/internal links validated.

## BRIEF-002

- Target URL: `/en/guides/mcp-proxy-vs-gateway`
- Page action: Enrich
- Primary intent: Choose a production routing/control layer for MCP traffic.
- Primary keyword: `mcp proxy server vs mcp gateway`
- Supporting keywords: `mcp gateway vs proxy` | `mcp router vs gateway` | `mcp gateway architecture`
- User job: Decide whether the system only needs transport mediation or also identity, policy, consent, audit, and lifecycle control.
- SERP pattern: Direct verdict, comparison table, production architecture, then vendor-oriented examples.
- Competitor examples: `https://www.permit.io/blog/mcp-gateway-vs-mcp-proxy` | `https://www.truefoundry.com/blog/mcp-gateway-vs-proxy-vs-router`
- Required answer: A proxy primarily moves/normalizes traffic; a gateway governs access and operations. Explain overlaps and when terminology differs by product.
- Required sections: 60-second answer; responsibilities table; local-to-remote proxy pattern; gateway control plane; router distinction; decision tree; failure/security scenarios; implementation checklist.
- Original value: Use MCP Radar's remote endpoint, auth, lifecycle, and health data to show which controls are needed for representative servers.
- Evidence and sources: Permit; TrueFoundry; Microsoft MCP Gateway docs; current remote-server dataset.
- Claims to verify: Transport support; session handling; auth delegation; audit behavior; vendor-specific definitions.
- Media/tool requirements: Architecture diagram; proxy/gateway/router matrix; downloadable decision checklist.
- Internal links: `/en/remote-mcp-servers` | `/en/guides/mcp-security-red-lines` | `/en/guides/mcp-production-checklist`
- CTA: Inspect remote servers by auth and lifecycle before selecting a control layer.
- Update owner/frequency: Infrastructure editor; quarterly or after transport/spec changes.
- Definition of done: Neutral terminology caveat included; at least two architecture examples; every vendor claim sourced; current thin copy replaced, not appended blindly.

## BRIEF-003

- Target URL: `/en/compare/mcp-resources-vs-tools`
- Page action: Create
- Primary intent: Decide whether an MCP capability belongs as a resource or a tool.
- Primary keyword: `mcp resources vs tools`
- Supporting keywords: `mcp server resources` | `mcp tools vs resources` | `model context protocol resources`
- User job: Design a server surface with the right control, side effects, caching, schemas, and token behavior.
- SERP pattern: Definitions, side-by-side table, examples, decision framework, FAQs.
- Competitor examples: `https://fast.io/resources/mcp-resources-vs-tools/` | `https://dvnc.dev/blog/mcp-resources-vs-tools-production-server`
- Required answer: Resources expose context identified by URI; tools expose model-invoked operations. Read-only data can still be a tool when retrieval requires model-selected parameters.
- Required sections: Quick verdict; protocol definitions; control and lifecycle table; four concrete examples; edge cases; resources+tools hybrid; security/token implications; implementation checklist.
- Original value: Show parallel resource/tool schemas for the same data source and connect the examples to actual MCP Radar server capabilities.
- Evidence and sources: Current MCP documentation; official SDK examples; Keyword Magic row; audited competitor pages.
- Claims to verify: Client-controlled/model-controlled wording; subscription/caching support; side-effect expectations; current SDK schema syntax.
- Media/tool requirements: Interactive decision flow; syntax-highlighted TypeScript/Python examples; comparison table; simple protocol sequence diagram.
- Internal links: `/en/what-is-mcp-server` | `/en/guides/mcp-production-checklist` | `/en/guides/mcp-security-red-lines`
- CTA: Browse real servers and inspect how their capabilities are exposed.
- Update owner/frequency: Protocol editor; with every MCP spec revision.
- Definition of done: Static compare route exists; examples compile; protocol claims cite dated official docs; Article/Breadcrumb schema passes validation.

## BRIEF-004

- Target URL: `/en/remote-mcp-servers`
- Page action: Enrich
- Primary intent: Find and evaluate hosted MCP servers that do not require local installation.
- Primary keyword: `remote mcp servers`
- Supporting keywords: `remote mcp` | `hosted mcp servers` | `remote mcp server directory`
- User job: Filter to reachable, current endpoints and understand auth, transport, trust, and operational trade-offs.
- SERP pattern: Directory/filter pages plus general “connect remote server” documentation.
- Competitor examples: `https://www.pulsemcp.com/servers` | `https://glama.ai/mcp/servers`
- Required answer: Show current remote entries first, explain connection/auth fields, and make the last verification date visible.
- Required sections: Definition; live totals; filters; comparison columns; how to connect; OAuth/API-key caveats; local vs remote; failure and security checklist; methodology.
- Original value: Endpoint presence, transport, auth, lifecycle, TrustScore, runnable status, and data freshness in one filterable table.
- Evidence and sources: `data/servers.json`; current MCP remote connection docs; live SERP validation.
- Claims to verify: Endpoint reachability; transport label; auth method; official ownership; last checked date.
- Media/tool requirements: Filterable table; auth/transport badges; last-checked timestamp; copy endpoint action only for verified public endpoints.
- Internal links: `/en/guides/self-host-vs-remote` | `/en/guides/mcp-security-red-lines` | `/en/leaderboard`
- CTA: Open a server record or subscribe to endpoint/health changes.
- Update owner/frequency: Data/editorial owner; daily data refresh, monthly explanatory-copy review.
- Definition of done: No endpoint shown as verified without a check date; filters are crawl-safe; empty states are useful; schema and pagination tested.

## BRIEF-005

- Target URL: `/en/guides/best-mcp-servers-for-claude-code`
- Page action: Create
- Primary intent: Select reliable MCP servers that improve Claude Code workflows.
- Primary keyword: `best mcp servers for claude code`
- Supporting keywords: `top mcp servers for claude code` | `claude code mcp servers` | `best claude code mcp`
- User job: Build a small, useful Claude Code stack without adding dead, redundant, or over-privileged servers.
- SERP pattern: Top-10 lists with short setup snippets and mostly subjective ranking.
- Competitor examples: `https://mcpcatalog.dev/blog/best-mcp-servers-claude-code` | `https://www.mcpforge.tech/blog/best-mcp-servers-for-claude-code`
- Required answer: Recommend by job, state when to skip each server, and make the scoring date/method explicit.
- Required sections: Methodology; shortlist table; coding/docs/repo/browser/database/ops picks; setup links; permission risks; minimal starter stack; exclusions; FAQ.
- Original value: Ranking calculated from runnable entry, maintenance, adoption, TrustScore, permissions, transport, and Claude Code fit; include exclusion reasons.
- Evidence and sources: Current server dataset; official repositories/docs for shortlisted servers; official Claude Code MCP docs.
- Claims to verify: Package/endpoint; official status; required scopes; current maintenance; Claude Code compatibility; pricing if mentioned.
- Media/tool requirements: Sortable score table; methodology card; “best for / skip if” cards; dated snapshot.
- Internal links: `/en/guides/claude-code-mcp-config` | `/en/category/dev` | `/en/guides/mcp-security-red-lines`
- CTA: Open a verified server record and copy the validated setup after reviewing permissions.
- Update owner/frequency: Directory editor; monthly and whenever any listed server becomes stale/dead.
- Definition of done: Every listed server passes exact-entity and runnable gates; no undisclosed affiliate ranking; calculation reproducible; at least three excluded popular servers explained.

## BRIEF-006

- Target URL: `/en/guides/best-mcp-servers-for-cursor`
- Page action: Create
- Primary intent: Select reliable MCP servers that work well in Cursor.
- Primary keyword: `best mcp servers for cursor`
- Supporting keywords: `best cursor mcp` | `top mcp servers for cursor` | `cursor mcp servers`
- User job: Choose a compact Cursor stack with clear project value, working setup, and recoverable failures.
- SERP pattern: Fresh 2026 lists, marketplaces, compatibility badges, and basic setup notes.
- Competitor examples: `https://latenode.com/blog/best-mcp-servers-cursor` | `https://mcpnest.io/best-mcp-servers-for-cursor`
- Required answer: Rank by Cursor workflow and explain setup friction, permissions, transport, and when the server is unnecessary.
- Required sections: Methodology; shortlist; project vs global setup; docs/code/browser/database/design/ops picks; security; troubleshooting link; exclusions.
- Original value: Use current lifecycle and runnable evidence, not self-reported marketplace labels, and include a Cursor-specific setup/verification result.
- Evidence and sources: Current server dataset; Cursor documentation/community evidence; official repositories for selected servers.
- Claims to verify: Cursor configuration format; tool visibility; package commands; platform support; maintenance; auth.
- Media/tool requirements: Data-backed score table; `.cursor/mcp.json` example; setup-friction and permission badges.
- Internal links: `/en/guides/cursor-mcp-spawn-npx-enoent` | `/en/category/dev` | `/en/guides/mcp-security-red-lines`
- CTA: Review health evidence before adding a server to Cursor.
- Update owner/frequency: Directory editor; monthly and after Cursor MCP configuration changes.
- Definition of done: Shortlist tested in current Cursor; exact entities linked; data date shown; scoring code/query documented; all setup claims sourced.

## BRIEF-007

- Target URL: `/en/guides/cursor-mcp-spawn-npx-enoent`
- Page action: Create
- Primary intent: Fix Cursor failing to launch an MCP server because `npx` cannot be found.
- Primary keyword: `cursor mcp spawn npx enoent`
- Supporting keywords: `mcp server spawn enoent` | `cursor mcp npx not found` | `spawn npx enoent windows`
- User job: Identify whether the failure is PATH, Windows command resolution, runtime manager, config syntax, or a missing package.
- SERP pattern: Quick fix, causes, OS sections, configuration snippets, community reports.
- Competitor examples: `https://www.mcpforge.tech/blog/cursor-mcp-spawn-npx-enoent` | `https://forum.cursor.com/t/facing-spawn-npx-enoent-error-when-setting-up-mcp-servers/120410`
- Required answer: Start with `which/where npx`; then branch by OS, Cursor environment, absolute executable path, `.cmd`, runtime manager, and package validation.
- Required sections: Symptom match; five-minute triage; macOS/Linux; Windows; nvm/fnm/Volta; config examples; package test; Cursor verification; rollback; adjacent errors.
- Original value: Reproduce each branch in clean environments and label fixes by OS and Cursor version instead of presenting an undifferentiated command list.
- Evidence and sources: Cursor community thread; Node/npm documentation; current competitor pages; tested local environments.
- Claims to verify: Windows `npx.cmd` behavior; GUI PATH inheritance; Cursor config location/format; current error text.
- Media/tool requirements: Decision tree; before/after configs; terminal captures with secrets removed; copyable diagnostics.
- Internal links: `/en/guides/best-mcp-servers-for-cursor` | `/en/guides/mcp-security-red-lines` | `/en/remote-mcp-servers`
- CTA: After launch succeeds, verify the server's health and maintenance record.
- Update owner/frequency: Technical support editor; quarterly or after Cursor/Node runtime changes.
- Definition of done: At least macOS, Linux, and Windows branches tested; commands safe and reversible; no secret paths shown; troubleshooting outcome verifiable.

## BRIEF-008

- Target URL: `/en/guides/mcp-error-32001-request-timed-out`
- Page action: Create
- Primary intent: Diagnose and fix an MCP request timing out with error `-32001`.
- Primary keyword: `mcp error -32001 request timed out`
- Supporting keywords: `mcp request timed out` | `mcp timeout error` | `json rpc -32001`
- User job: Find which protocol or dependency stage is stalling before increasing timeouts blindly.
- SERP pattern: Quick checks, cause list, protocol stages, logs, and config fixes.
- Competitor examples: `https://www.mcpforge.tech/blog/how-to-fix-mcp-error-32001-request-timed-out`
- Required answer: Determine whether timeout occurs at process launch, initialization, discovery, auth, upstream call, or tool execution, then test the narrowest layer.
- Required sections: Meaning/caveat; quick checks; stage decision tree; stdio; HTTP; auth; upstream latency; long-running tools; client-specific timeout; logging; prevention.
- Original value: A symptom-to-stage matrix with observable commands/log signals and server health links; distinguish timeout from connection closed/internal error.
- Evidence and sources: Current MCP/JSON-RPC documentation; competitor guide; issue examples; MCP Radar lifecycle data.
- Claims to verify: Whether `-32001` is client-specific/reserved rather than universally standardized; default timeout values by client; current Inspector behavior.
- Media/tool requirements: Sequence diagram; diagnostic worksheet; sanitized log examples; copyable health checks.
- Internal links: `/en/guides/mcp-production-checklist` | `/en/guides/mcp-security-red-lines` | `/en/remote-mcp-servers`
- CTA: Check the target server's current lifecycle and runnable evidence.
- Update owner/frequency: Protocol support editor; quarterly and after major client changes.
- Definition of done: Error-code caveat explicit; each fix tied to an observed failure stage; no recommendation starts by simply raising timeout; commands tested.

## BRIEF-009

- Target URL: `/en/guides/mcp-security-red-lines`
- Page action: Enrich
- Primary intent: Evaluate MCP server risk before installation or remote connection.
- Primary keyword: `mcp security best practices`
- Supporting keywords: `mcp security architecture` | `mcp server authentication` | `mcp security checklist`
- User job: Reject unsafe servers, minimize permission scope, and monitor changes after adoption.
- SERP pattern: Threat lists, architecture guidance, checklists, and current vulnerability research.
- Competitor examples: `https://arxiv.org/abs/2605.22333` | `https://arxiv.org/abs/2605.21392`
- Required answer: Apply source/maintainer, code, package, permissions, secrets, transport/auth, runtime isolation, and update-monitoring gates.
- Required sections: Red-line summary; local vs remote threat model; tool poisoning; auth/identity; secrets; dependency/supply chain; sandboxing; monitoring; incident response; checklist.
- Original value: Tie each gate to MCP Radar fields and show how lifecycle/maintenance/runnable evidence changes the decision without claiming it proves safety.
- Evidence and sources: Current peer-reviewed/preprint security studies; official security docs; current dataset and editorial policy.
- Claims to verify: Study dates/sample sizes/findings; current CVEs; crawler/runtime claims; wording that TrustScore is not a security certification.
- Media/tool requirements: Printable checklist; threat-boundary diagram; risk badges with caveats; dated citations.
- Internal links: `/en/remote-mcp-servers` | `/en/guides/mcp-production-checklist` | `/en/graveyard`
- CTA: Inspect evidence and subscribe to lifecycle/maintenance changes.
- Update owner/frequency: Security editor; monthly and within seven days of material MCP security disclosures.
- Definition of done: Primary sources used; no vulnerability sensationalism; all checklist items map to observable evidence; legal/security disclaimer reviewed.

## BRIEF-010

- Target URL: `/en/compare/mcp-vs-rag`
- Page action: Create
- Primary intent: Decide when an AI system needs MCP, RAG, or both.
- Primary keyword: `mcp vs rag`
- Supporting keywords: `rag vs mcp` | `model context protocol vs retrieval augmented generation` | `mcp and rag together`
- User job: Choose architecture for static knowledge retrieval, live tools/data, and action-taking.
- SERP pattern: Definitions, architecture table, use cases, “they complement each other,” and diagrams.
- Competitor examples: `https://airbyte.com/agentic-data/mcp-vs-rag` | `https://www.intersystems.com/resources/rag-vs-mcp-what-each-does-when-to-use-both/`
- Required answer: RAG is a retrieval pattern; MCP is an interoperability protocol. Use both when retrieved knowledge and live actions/data are required.
- Required sections: One-minute verdict; layer diagram; freshness/actions/security/latency/cost table; three examples; combined architecture; anti-patterns; decision tree.
- Original value: Ground examples in live server categories and show where retrieval remains inside a server versus outside the protocol.
- Evidence and sources: Official MCP docs; primary RAG references where needed; current live-server dataset; audited competitors.
- Claims to verify: Protocol scope; RAG terminology; latency/cost examples; no universal performance claims.
- Media/tool requirements: Architecture diagrams for MCP-only, RAG-only, and combined; comparison table; decision flow.
- Internal links: `/en/what-is-mcp-server` | `/en/compare/mcp-resources-vs-tools` | `/en/guides/mcp-security-red-lines`
- CTA: Browse servers that expose search/knowledge capabilities and review their evidence.
- Update owner/frequency: Architecture editor; quarterly.
- Definition of done: Static compare route available; diagrams technically reviewed; examples source-backed; no false either/or framing.

## BRIEF-011

- Target URL: `/en/guides/best-mcp-servers-for-marketing-teams`
- Page action: Create
- Primary intent: Select a reliable MCP stack for marketing workflows.
- Primary keyword: `best mcp servers for marketing teams`
- Supporting keywords: `best mcp servers for marketers` | `mcp servers for marketing` | `best mcp servers for business sales marketing`
- User job: Connect analytics, research, content, CRM, ads, and operations without installing misleading or stale integrations.
- SERP pattern: Workflow-category lists with 9–25 recommendations, often vendor-biased.
- Competitor examples: `https://humblytics.com/blog/best-mcp-servers-for-marketers` | `https://www.digitalapplied.com/blog/mcp-servers-for-marketing-25-servers-reviewed-2026`
- Required answer: Recommend by marketing job, show auth/data sensitivity, and state when a server is unofficial or should be skipped.
- Required sections: Methodology; minimum stack; analytics; research/SEO; content/CMS; CRM/sales subsection; ads/social; permissions; setup; exclusions.
- Original value: Exact-entity validation plus runnable, maintenance, adoption, auth, and evidence scores from MCP Radar; no pay-to-rank inclusion.
- Evidence and sources: Current 42-entity marketing candidate set; official vendor docs/repositories; current server dataset.
- Claims to verify: Official ownership; exact service supported; scopes; pricing; endpoint/package; maintenance; client compatibility.
- Media/tool requirements: Workflow-to-server matrix; score table; data-sensitivity badges; last-verified dates.
- Internal links: `/en/category/marketing` | `/en/guides/mcp-security-red-lines` | `/en/remote-mcp-servers`
- CTA: Compare verified marketing servers and subscribe to health changes.
- Update owner/frequency: Marketing-tech editor; monthly.
- Definition of done: At least eight exact entities pass all gates; sales stays a subsection; every vendor claim sourced; directional keyword caveat remains in research, not copy.

## BRIEF-012

- Target URL: `/en/compare/mcp-vs-a2a`
- Page action: Create
- Primary intent: Understand and choose between MCP and Agent2Agent protocol roles.
- Primary keyword: `mcp vs a2a`
- Supporting keywords: `a2a vs mcp` | `agent2agent vs model context protocol` | `mcp and a2a`
- User job: Place each protocol correctly in a multi-agent architecture.
- SERP pattern: Protocol definitions, layer diagrams, side-by-side capabilities, and coexistence examples.
- Competitor examples: `https://www.ibm.com/think/topics/agent2agent-protocol` | `https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/`
- Required answer: MCP connects agents/hosts to tools and context; A2A coordinates agents. They can coexist in one system.
- Required sections: Quick verdict; actors and message flow; discovery/tasks/tools table; combined architecture; three scenarios; security/governance; decision checklist.
- Original value: Connect abstract layers to real MCP server records and show exactly where A2A stops and MCP begins in a working example.
- Evidence and sources: Current MCP and A2A specifications/documentation; dated vendor examples.
- Claims to verify: Current A2A ownership/version; task/artifact concepts; MCP host/client/server roles; auth claims.
- Media/tool requirements: Layer diagram; sequence diagram; comparison table.
- Internal links: `/en/what-is-mcp-server` | `/en/compare/mcp-vs-rag` | `/en/compare/mcp-resources-vs-tools`
- CTA: Explore the tool/server layer in MCP Radar.
- Update owner/frequency: Protocol editor; on protocol-version changes.
- Definition of done: Both protocols reviewed against current primary docs; version/date shown; no vendor-marketing claims treated as standard.

## BRIEF-013

- Target URL: `/en/compare/mcp-vs-cli`
- Page action: Create
- Primary intent: Decide whether an agent should use an MCP server or invoke a CLI.
- Primary keyword: `mcp vs cli`
- Supporting keywords: `mcp server vs cli` | `claude code mcp vs cli` | `when to use mcp or cli`
- User job: Minimize setup, context, token, permission, and reliability costs for a concrete workflow.
- SERP pattern: Opinion/community discussion and architecture commentary; limited neutral task-level testing.
- Competitor examples: `https://www.reddit.com/r/claude/comments/1v9aa4z/for_claude_code_what_do_you_prefer_mcp_tools/`
- Required answer: Use a CLI for compact deterministic commands when the agent has safe shell access; use MCP for discoverable typed capabilities, remote services, controlled tool surfaces, and cross-client reuse.
- Required sections: Verdict; same-task benchmark; setup/discovery/schema/permission/latency/token table; local/remote; failure recovery; hybrid wrappers; decision tree.
- Original value: Run the same repository/search/database task through both paths and publish commands, tool schemas, timings, and caveats.
- Evidence and sources: Current MCP docs; CLI primary docs for benchmark tools; reproducible test notes; community pain points.
- Claims to verify: Token and latency numbers; permission boundaries; client tool discovery; shell availability.
- Media/tool requirements: Benchmark table; terminal/tool-call traces; architecture diagram; downloadable test method.
- Internal links: `/en/guides/claude-code-mcp-config` | `/en/guides/mcp-security-red-lines` | `/en/compare/mcp-resources-vs-tools`
- CTA: Inspect reliable servers before adding protocol overhead.
- Update owner/frequency: Developer-experience editor; semiannually.
- Definition of done: Benchmark reproduced twice; environment disclosed; no universal winner claim; safety review complete.

## BRIEF-014

- Target URL: `/en/compare/mcp-vs-function-calling`
- Page action: Create
- Primary intent: Understand the relationship between MCP and model-provider function calling.
- Primary keyword: `mcp vs function calling`
- Supporting keywords: `model context protocol vs function calling` | `mcp tools vs function calls` | `mcp vs api tools`
- User job: Decide which layer standardizes tools across clients/providers and which layer a model uses to request an action.
- SERP pattern: Conceptual comparisons, architecture diagrams, code examples, and “MCP uses tool calling” clarification.
- Competitor examples: `https://modelcontextprotocol.io/docs/learn/architecture` | `https://platform.openai.com/docs/guides/function-calling`
- Required answer: Function calling is a model/API interaction primitive; MCP standardizes discovery, schemas, transport, lifecycle, and capability access between hosts/clients and servers.
- Required sections: Quick answer; layers/actors; lifecycle table; same weather-tool example; portability; auth/security; when plain functions suffice; when MCP pays off.
- Original value: Render one capability as a provider function and as an MCP tool, then show what MCP adds beyond the JSON schema.
- Evidence and sources: Current MCP architecture docs; current provider function-calling docs; SDK examples.
- Claims to verify: Provider-specific APIs; MCP lifecycle messages; transport support; portability caveats.
- Media/tool requirements: Layer diagram; paired code snippets; message sequence table.
- Internal links: `/en/what-is-mcp-server` | `/en/compare/mcp-resources-vs-tools` | `/en/guides/mcp-production-checklist`
- CTA: Browse server implementations of real tool surfaces.
- Update owner/frequency: Protocol editor; quarterly.
- Definition of done: Examples execute; provider-specific wording clearly labeled; official docs dated; no conflation of tools with all MCP capabilities.

## BRIEF-015

- Target URL: `/en`
- Page action: Enrich
- Primary intent: Discover and evaluate MCP servers from a trusted directory.
- Primary keyword: `mcp server directory`
- Supporting keywords: `mcp servers directory` | `mcp directory` | `find mcp servers`
- User job: Search by need, eliminate dead/unrunnable options, and reach a defensible server choice quickly.
- SERP pattern: Large searchable directories led by inventory counts, categories, and featured servers.
- Competitor examples: `https://www.pulsemcp.com/servers` | `https://glama.ai/mcp/servers` | `https://www.mcpserver.directory/`
- Required answer: Explain why this directory is trustworthy, expose live active/runnable totals, and let users filter directly.
- Required sections: Value proposition; live search; active/runnable/official counts; categories; top verified entries; methodology; lifecycle changes; guides; editorial policy.
- Original value: Transparent TrustScore dimensions, dying/dead visibility, runnable evidence, last-updated dates, and explicit methodology.
- Evidence and sources: `data/servers.json`; site methodology/editorial policy; Keyword Magic candidate; competitor directories.
- Claims to verify: Live counts at render; official registry status; scoring method; update cadence; no unsupported “verified/safe” wording.
- Media/tool requirements: Live counters; search/filter UI; TrustScore explainer; data freshness marker; crawlable category links.
- Internal links: `/en/leaderboard` | `/en/remote-mcp-servers` | `/en/about` | `/en/editorial-policy`
- CTA: Search servers or subscribe to MCP ecosystem health changes.
- Update owner/frequency: Product/data owner; counters daily, positioning quarterly.
- Definition of done: H1/title/snippet aligned; no layout regression; live-provider build verified; critical text server-rendered; structured data and hreflang pass.

## BRIEF-016

- Target URL: `/en/what-is-mcp-server`
- Page action: Enrich
- Primary intent: Understand whether MCP servers are free and where costs arise.
- Primary keyword: `are mcp servers free`
- Supporting keywords: `are mcp servers free to use` | `mcp server cost` | `free mcp servers`
- User job: Separate protocol, open-source server, hosting, upstream API, and paid product costs before installation.
- SERP pattern: General MCP explainers and community recommendations; weak dedicated cost coverage.
- Competitor examples: `https://modelcontextprotocol.io/docs/getting-started/intro` | `https://www.reddit.com/r/mcp/comments/1sw27db/what_are_the_best_free_mcp_servers_you_are_using/`
- Required answer: MCP itself is an open protocol; a server may be open source while still requiring paid hosting, API usage, vendor subscriptions, or enterprise authentication.
- Required sections: Direct answer; five cost layers; examples; local vs remote costs; licenses vs service pricing; hidden operational costs; checklist; FAQ.
- Original value: Use current server records to illustrate package/license/remote/auth combinations without making unsupported pricing claims.
- Evidence and sources: Current MCP docs; server repositories; current dataset; official vendor pricing pages for any dated example.
- Claims to verify: Licenses; vendor pricing/date; hosting assumptions; whether specific servers are truly free to operate.
- Media/tool requirements: Cost-layer diagram; comparison table; dated examples; no automated price unless source/date stored.
- Internal links: `/en/remote-mcp-servers` | `/en/guides/choosing-mcp-server` | `/en/guides/mcp-security-red-lines`
- CTA: Compare server health and setup requirements before choosing.
- Update owner/frequency: Explainer editor; quarterly and when cited prices change.
- Definition of done: Cost answer appears above the fold/FAQ; all price examples dated; Article/FAQ schema used only for visible content; no separate cannibalizing URL.
