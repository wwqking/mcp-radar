# 候选发现报告 · 2026-08-03

扫了 284 个候选，过三道门槛的 **19** 个，搜到但库里已有 99 个，挡掉 203 个。

> 「库里已有」单列是有原因的：它既不是命中也不是被门槛挡掉，混进任何一边都会让人误判门槛太严。这个数高说明清单这一段已经采过了，正常往下走即可。

三道门槛：① 仓库名与关键词对得上（挡 GitHub 搜索误命中）② 确实是 server 不是清单/客户端/教程 ③ npm 包的 repository 要指回同一个仓库（否则填 null）。

**合并前请人工扫一眼**——机器门槛会漏，历史上漏过「课程被当成 server」「canvas 撞了 canva」。

## 有人在搜、但我们没有（关键词来源）

| 搜索量 | 来自哪份清单 | 仓库 | ★ | npm | 说明 |
|---|---|---|---|---|---|
| 170/mo | 人工缺口清单 | [serpapi/serpapi-mcp](https://github.com/serpapi/serpapi-mcp) | 162 | — | SerpApi MCP Server for Google and other search engine result |
| 140/mo | 人工缺口清单 | [alpacahq/alpaca-mcp-server](https://github.com/alpacahq/alpaca-mcp-server) | 899 | — | Alpaca’s official MCP Server lets you trade stocks, ETFs, cr |
| 140/mo | 人工缺口清单 | [HealthyApps/health-auto-export-mcp-server](https://github.com/HealthyApps/health-auto-export-mcp-server) | 59 | — | An MCP server that provides Apple Health data via the Health |
| 140/mo | 人工缺口清单 | [okta/okta-mcp-server](https://github.com/okta/okta-mcp-server) | 52 | — | Okta Self-Hosted MCP Server |
| 140/mo | 人工缺口清单 | [pab1it0/prometheus-mcp-server](https://github.com/pab1it0/prometheus-mcp-server) | 510 | — | A Model Context Protocol (MCP) server that enables AI agents |
| 140/mo | 人工缺口清单 | [SonarSource/sonarqube-mcp-server](https://github.com/SonarSource/sonarqube-mcp-server) | 613 | — | Official SonarQube MCP Server for code quality and security  |
| 110/mo | 人工缺口清单 | [nickclyde/duckduckgo-mcp-server](https://github.com/nickclyde/duckduckgo-mcp-server) | 1394 | — | A Model Context Protocol (MCP) server that provides web sear |
| 110/mo | 人工缺口清单 | [ryaker/outlook-mcp](https://github.com/ryaker/outlook-mcp) | 419 | — | MCP server for Claude to access Outlook data via Microsoft G |
| 110/mo | 人工缺口清单 | [classfang/ssh-mcp-server](https://github.com/classfang/ssh-mcp-server) | 718 | — | 基于 SSH 的 MCP 服务 🧙‍♀️。已被MCP官方收录 🎉。 SSH MCP Server 🧙‍♀️. It |

## GitHub 上高星但库里没有（趋势来源）

| ★ | 仓库 | 最近提交 | npm | 说明 |
|---|---|---|---|---|
| 3125 | [bethington/ghidra-mcp](https://github.com/bethington/ghidra-mcp) | 0天前 | — | Ghidra MCP Server — 200+ MCP tools for AI-powered reverse en |
| 2901 | [zcaceres/markdownify-mcp](https://github.com/zcaceres/markdownify-mcp) | 5天前 | — | A Model Context Protocol server for converting almost anythi |
| 2592 | [zinja-coder/jadx-ai-mcp](https://github.com/zinja-coder/jadx-ai-mcp) | 67天前 | — | Plugin for JADX to integrate MCP server |
| 2556 | [brightdata/brightdata-mcp](https://github.com/brightdata/brightdata-mcp) | 7天前 | — | A powerful Model Context Protocol (MCP) server that provides |
| 2381 | [zhizhuodemao/js-reverse-mcp](https://github.com/zhizhuodemao/js-reverse-mcp) | 19天前 | js-reverse-mcp | AI Agent-first JS 逆向 MCP Server：有头 Chrome 调试、断点、网络/WebSocket |
| 2363 | [chrisryugj/korean-law-mcp](https://github.com/chrisryugj/korean-law-mcp) | 0天前 | korean-law-mcp | 법제처 국가법령정보를 LLM에서 바로 조회하는 MCP 서버. 법령·판례·조례 검색과 인용 검증 | MCP s |
| 2337 | [knowsuchagency/mcp2cli](https://github.com/knowsuchagency/mcp2cli) | 34天前 | — | Turn any MCP, OpenAPI, or GraphQL server into a CLI — at run |
| 2269 | [jamubc/gemini-mcp-tool](https://github.com/jamubc/gemini-mcp-tool) | 13天前 | gemini-mcp-tool | MCP server that enables AI assistants to interact with Googl |
| 2118 | [joshuayoes/ios-simulator-mcp](https://github.com/joshuayoes/ios-simulator-mcp) | 104天前 | ios-simulator-mcp | MCP server for interacting with the iOS simulator |
| 2063 | [modelcontextprotocol/mcpb](https://github.com/modelcontextprotocol/mcpb) | 69天前 | — | Desktop Extensions: One-click local MCP server installation  |

## 挡掉的 203 个（抽样 30）

| 候选 | 挡掉原因 |
|---|---|
| signerlabs/ShipSwift | 仓库名不带 mcp（多半只是描述里顺带提到） |
| TronTram/ShadcnUI_MCP_Store | ★0 < 50 |
| zilliztech/claude-context | 仓库名不带 mcp（多半只是描述里顺带提到） |
| pdcolandrea/mobbin-mcp | 已归档 |
| BlackSnufkin/LitterBox | 仓库名不带 mcp（多半只是描述里顺带提到） |
| yynxxxxx/Codex-X | 像是 skills? 而不是 server |
| run-llama/llamaindex-docusearcher | ★13 < 50 |
| Mofedul-Joy/make-com-claude-skills | ★1 < 50 |
| microsoft/SharePoint-Embedded-Samples | 像是 fors+building 而不是 server |
| seriallazer/ibkr-mcp-server | 像是 client 而不是 server |
| pythonastrepltool | GitHub 和 registry 都搜不到仓库 |
| Prat011/mcp-server-monday | ★34 < 50 |
| semgrep/mcp | 已归档 |
| otaviocmaciel/DAC-MCP482x-VHDL-core | ★1 < 50 |
| gleanwork/mcp-server | 已归档 |
| gifflet/graphiti-mcp-server | 368 天没提交 |
| Adrninistrator/java-all-call-graph-server | ★8 < 50 |
| verygoodplugins/robinhood-mcp | ★37 < 50 |
| Jakedismo/codegraph-rust | 仓库名不带 mcp（多半只是描述里顺带提到） |
| teddytennant/wizard | 像是 gateway 而不是 server |
| CDataSoftware/workday-mcp-server-by-cdata | ★14 < 50 |
| aws-solutions-library-samples/guidance-for-scalable-model-inference-and-agentic-ai-on-amazon-eks | ★19 < 50 |
| blurrah/mcp-graphql | 329 天没提交 |
| GuDaStudio/GrokSearch | 仓库名不带 mcp（多半只是描述里顺带提到） |
| hyperb1iss/lucidity-mcp | 没有 server/tool 语义 |
| interface360/xh-demystify-mulesoft-mcp | ★1 < 50 |
| agentailor/fullstack-langgraph-nextjs-agent | 像是 template 而不是 server |
| recursechat/mcp-server-apple-shortcuts | 590 天没提交 |
| punkpeye/awesome-mcp-servers | 像是 awesome 而不是 server |
| headroomlabs-ai/headroom | 像是 proxy 而不是 server |
