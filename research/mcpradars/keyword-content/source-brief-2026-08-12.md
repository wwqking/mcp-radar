# Source and evidence brief: 15-page English content batch

- author/editor: MCP Radar Editorial
- target locale: `en-US`
- last verified: 2026-08-12
- refresh due: 2026-09-12 for client/security/directory pages; 2026-11-12 for stable concept pages
- dataset snapshot: `data/servers.json`, collected 2026-08-05
- scope: the 15 create/enrich decisions in `research/mcpradars/keyword-content/briefs/`

## Source values

| Claim | Locked value | Primary source | Retrieved | Confidence | Used by |
|---|---|---|---|---|---|
| Current MCP documentation revision | The live architecture documentation is versioned `2026-07-28`. | https://modelcontextprotocol.io/docs/2026-07-28/learn/architecture | 2026-08-12 | High | definition, resources/tools, A2A, RAG, function calling, proxy/gateway |
| MCP participants | A host creates one MCP client per MCP server; servers may run locally or remotely. | https://modelcontextprotocol.io/docs/2026-07-28/learn/architecture | 2026-08-12 | High | definition and comparison pages |
| MCP primitives | Servers expose tools, resources and prompts. Tools are executable functions; resources provide context data; prompts are reusable interaction templates. | https://modelcontextprotocol.io/docs/2026-07-28/learn/architecture | 2026-08-12 | High | definition, resources/tools |
| MCP transport terminology | The standard transports are stdio and Streamable HTTP. Cursor also documents legacy SSE client support. | https://modelcontextprotocol.io/docs/2026-07-28/learn/architecture and https://cursor.com/docs/mcp | 2026-08-12 | High | definition, remote, setup, proxy/gateway |
| MCP discovery and invocation | Current MCP docs describe `server/discover`, primitive list methods and `tools/call`; do not freeze older initialize-only flows as current. | https://modelcontextprotocol.io/docs/2026-07-28/learn/architecture | 2026-08-12 | High | definition, timeout, function calling |
| Claude Code configuration scopes | Local is private to the current project and stored in `~/.claude.json`; project is shared through `.mcp.json`; user is private and applies across projects. | https://code.claude.com/docs/en/mcp | 2026-08-12 | High | Claude Code config |
| Claude Code verification commands | Official CLI documents `claude mcp list`, `claude mcp get`, `claude mcp remove` and `reset-project-choices`. | https://code.claude.com/docs/en/mcp | 2026-08-12 | High | Claude Code config |
| Cursor configuration | Project config is `.cursor/mcp.json`; global config is `~/.cursor/mcp.json`; logs are in the Output panel under MCP Logs. | https://cursor.com/docs/mcp | 2026-08-12 | High | Cursor best-of and ENOENT |
| Cursor executable rule | A stdio `command` must be on Cursor's process PATH or use a full path. | https://cursor.com/docs/mcp | 2026-08-12 | High | ENOENT |
| Windows `.cmd` launch behavior | Node documents that `.cmd` files are not executable by themselves on Windows; use a shell or spawn `cmd.exe` with the file as an argument. | https://nodejs.org/api/child_process.html | 2026-08-12 | High | ENOENT |
| MCP authorization boundary | Token passthrough is forbidden; validate audience, minimize scope and do not use session IDs as authentication. | https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices | 2026-08-12 | High | security, remote, proxy/gateway |
| Local-server risk | Local MCP startup commands execute with the client's privileges; consent, source verification and sandboxing are required controls. | https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices | 2026-08-12 | High | security and setup pages |
| A2A release and role | The current A2A specification reports release 1.0.0 and defines agent discovery, message/task coordination, artifacts and asynchronous work. | https://a2a-protocol.org/latest/specification | 2026-08-12 | High | A2A vs MCP |
| A2A comparison limits | The July 2026 paper is an implementation-grounded comparison in one inter-agent coordination scenario, not a universal benchmark. | https://arxiv.org/abs/2607.23884 | 2026-08-12 | Medium | A2A vs MCP |
| Function calling layer | A model API receives tool definitions and may return structured function/tool calls; the application executes them and returns results. | https://developers.openai.com/api/docs/guides/function-calling | 2026-08-12 | High | MCP vs function calling |
| RAG definition | The original RAG work combines parametric generation with retrieved non-parametric memory. | https://arxiv.org/abs/2005.11401 | 2026-08-12 | High | RAG vs MCP |
| Directory inventory | The frozen snapshot contains 2,636 records: 2,526 active, 2,490 with a runnable entry, 1,040 with at least one remote endpoint, and 1,087 remote endpoints (1,039 Streamable HTTP, 48 SSE). | `data/servers.json` | 2026-08-12 | High | homepage, remote directory, best-of pages |
| Compatibility evidence | 2,400 records have Claude Code and Cursor compatibility rows; 2 are `verified`, 2,398 are `derived`. | `data/servers.json` | 2026-08-12 | best-of pages |
| Install evidence | Two sample packages have stored sandbox startup and tool-list evidence dated 2026-07-30. | `data/install-verification.json` and `data/servers.json` | 2026-08-12 | best-of methodology |

## Experience notes

| Evidence | Method | Result | Asset/path | Checked |
|---|---|---|---|---|
| Local client availability | Ran `command -v` and version commands. | Claude Code 2.1.117 is installed. Cursor CLI is present, but reports that no Cursor IDE installation is available. | terminal output for this task | 2026-08-12 |
| Claude Code config surface | Ran `claude mcp help` and `claude mcp list` in the trusted repository. | Current CLI exposes add, list, get, remove and reset commands; no servers were configured. | terminal output for this task | 2026-08-12 |
| Harmless stdio probe | In a temporary project, added `@modelcontextprotocol/server-everything` at project scope and asked Claude Code to check health. | Config creation succeeded, but health checking did not complete within the observation window. The process and temporary directory were removed. This is not counted as a successful client test. | terminal output for this task | 2026-08-12 |
| Dataset recomputation | Parsed the frozen JSON snapshot directly. | Counts above were recomputed in one process; endpoint counts exceed server counts because one server can declare more than one endpoint. | `data/servers.json` | 2026-08-12 |
| Existing sandbox evidence | Inspected `installVerified` records. | Only `@modelcontextprotocol/server-memory` and `@modelcontextprotocol/server-everything` have stored startup/tool-list results. | `data/install-verification.json` | 2026-08-12 |

## Visual evidence plan

| Asset | Type | Purpose | Alt/caption | Checked | Refresh |
|---|---|---|---|---|---|
| Structured comparison tables in guide template | original table | Make protocol/control/failure differences independently extractable. | Page-specific caption and headers | 2026-08-12 | when a source value changes |
| Layer/workflow cards in guide template | original diagram | Show ordered actors and decision boundaries without implying performance. | Page-specific flow title and caption | 2026-08-12 | when protocol roles change |
| Live best-of ranking table | original dataset scorecard | Separate adoption/maintenance evidence from editorial prose. | Formula and candidate pool disclosed below each table | 2026-08-12 | each dataset build |
| Homepage evidence strip | live metrics | Give all directory counts one timestamp and explain what is measured. | Counts are measurements, not security certification | 2026-08-12 | each dataset build |

## Internal-link map

| Anchor intent | Target |
|---|---|
| MCP definition | `/en/what-is-mcp-server` |
| Remote inventory | `/en/remote-mcp-servers` |
| Claude configuration | `/en/guides/claude-code-mcp-config` |
| Cursor launch troubleshooting | `/en/guides/cursor-mcp-spawn-npx-enoent` |
| Primitive choice | `/en/guides/mcp-resources-vs-tools` |
| Security controls | `/en/guides/mcp-security-red-lines` |
| Integration interface choice | `/en/guides/mcp-vs-cli` and `/en/guides/mcp-vs-function-calling` |
| Architecture composition | `/en/guides/rag-vs-mcp` and `/en/guides/a2a-vs-mcp` |
| Production validation | `/en/guides/mcp-production-checklist` |

## Unknowns and publishing limits

- `[待核实]` Cursor IDE smoke tests: the IDE is not installed on this machine. Cursor recommendations must say `derived`, not `tested`.
- `[待核实]` Windows and Linux reproduction of `spawn npx ENOENT`: the guide may document official Node/Cursor behavior but must not claim a local reproduction.
- `[待核实]` Cross-client timeout defaults: do not state a universal default or universal `-32001` root cause.
- `[待核实]` Endpoint reachability/auth: registry declaration is not a successful handshake. Remote cards must distinguish declaration from verification.
- Best-of pages are publishable as transparent, dated shortlists only. They must expose the two verified samples and describe the remaining compatibility as transport-derived until the full client matrix is executed.
