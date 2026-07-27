# 候选发现报告 · 2026-07-27

扫了 290 个候选，过三道门槛的 **25** 个，挡掉 215 个。

三道门槛：① 仓库名与关键词对得上（挡 GitHub 搜索误命中）② 确实是 server 不是清单/客户端/教程 ③ npm 包的 repository 要指回同一个仓库（否则填 null）。

**合并前请人工扫一眼**——机器门槛会漏，历史上漏过「课程被当成 server」「canvas 撞了 canva」。

## 有人在搜、但我们没有（关键词来源）

| 搜索量 | 仓库 | ★ | npm | 说明 |
|---|---|---|---|---|
| 730/mo | [ryaker/outlook-mcp](https://github.com/ryaker/outlook-mcp) | 412 | — | MCP server for Claude to access Outlook data via Microsoft G |

## GitHub 上高星但库里没有（趋势来源）

| ★ | 仓库 | 最近提交 | npm | 说明 |
|---|---|---|---|---|
| 2982 | [bethington/ghidra-mcp](https://github.com/bethington/ghidra-mcp) | 2天前 | — | Ghidra MCP Server — 200+ MCP tools for AI-powered reverse en |
| 2892 | [zcaceres/markdownify-mcp](https://github.com/zcaceres/markdownify-mcp) | 19天前 | — | A Model Context Protocol server for converting almost anythi |
| 2559 | [zinja-coder/jadx-ai-mcp](https://github.com/zinja-coder/jadx-ai-mcp) | 60天前 | — | Plugin for JADX to integrate MCP server |
| 2539 | [brightdata/brightdata-mcp](https://github.com/brightdata/brightdata-mcp) | 0天前 | — | A powerful Model Context Protocol (MCP) server that provides |
| 2328 | [chrisryugj/korean-law-mcp](https://github.com/chrisryugj/korean-law-mcp) | 1天前 | korean-law-mcp | 법제처 국가법령정보를 LLM에서 바로 조회하는 MCP 서버. 법령·판례·조례 검색과 인용 검증 | MCP s |
| 2321 | [zhizhuodemao/js-reverse-mcp](https://github.com/zhizhuodemao/js-reverse-mcp) | 12天前 | js-reverse-mcp | AI Agent-first JS 逆向 MCP Server：有头 Chrome 调试、断点、网络/WebSocket |
| 2319 | [knowsuchagency/mcp2cli](https://github.com/knowsuchagency/mcp2cli) | 27天前 | — | Turn any MCP, OpenAPI, or GraphQL server into a CLI — at run |
| 2265 | [jamubc/gemini-mcp-tool](https://github.com/jamubc/gemini-mcp-tool) | 6天前 | gemini-mcp-tool | MCP server that enables AI assistants to interact with Googl |
| 2114 | [joshuayoes/ios-simulator-mcp](https://github.com/joshuayoes/ios-simulator-mcp) | 97天前 | ios-simulator-mcp | MCP server for interacting with the iOS simulator |
| 2052 | [modelcontextprotocol/mcpb](https://github.com/modelcontextprotocol/mcpb) | 62天前 | — | Desktop Extensions: One-click local MCP server installation  |
| 1882 | [samuelgursky/davinci-resolve-mcp](https://github.com/samuelgursky/davinci-resolve-mcp) | 0天前 | davinci-resolve-mcp | MCP server integration for DaVinci Resolve Studio |
| 1852 | [containers/kubernetes-mcp-server](https://github.com/containers/kubernetes-mcp-server) | 0天前 | kubernetes-mcp-server | Model Context Protocol (MCP) server for Kubernetes and OpenS |
| 1690 | [Mcp-Brasil/mcp-brasil](https://github.com/Mcp-Brasil/mcp-brasil) | 92天前 | — | MCP Server para 70 APIs públicas brasileiras |
| 1663 | [mixelpixx/KiCAD-MCP-Server](https://github.com/mixelpixx/KiCAD-MCP-Server) | 1天前 | — | KiCAD MCP is a Model Context Protocol (MCP) implementation t |
| 1573 | [datagouv/datagouv-mcp](https://github.com/datagouv/datagouv-mcp) | 10天前 | — | Official data.gouv.fr Model Context Protocol (MCP) server th |
| 1571 | [isaacphi/mcp-language-server](https://github.com/isaacphi/mcp-language-server) | 148天前 | — | mcp-language-server gives MCP enabled clients access semanti |
| 1541 | [MiniMax-AI/MiniMax-MCP](https://github.com/MiniMax-AI/MiniMax-MCP) | 68天前 | — | Official MiniMax Model Context Protocol (MCP) server that en |
| 1506 | [mattt/iMCP](https://github.com/mattt/iMCP) | 81天前 | — | A macOS app that provides an MCP server to your Messages, Co |
| 1469 | [neka-nat/freecad-mcp](https://github.com/neka-nat/freecad-mcp) | 1天前 | — | FreeCAD MCP(Model Context Protocol) server |
| 1375 | [nickclyde/duckduckgo-mcp-server](https://github.com/nickclyde/duckduckgo-mcp-server) | 0天前 | — | A Model Context Protocol (MCP) server that provides web sear |
| 962 | [xing5/mcp-google-sheets](https://github.com/xing5/mcp-google-sheets) | 74天前 | — | This MCP server integrates with your Google Drive and Google |
| 946 | [iosifache/annas-mcp](https://github.com/iosifache/annas-mcp) | 32天前 | — | MCP server and CLI tool for searching and downloading docume |
| 934 | [rohitg00/kubectl-mcp-server](https://github.com/rohitg00/kubectl-mcp-server) | 110天前 | kubectl-mcp-server | Published in CNCF Landscape: A MCP server for Kubernetes. |
| 918 | [suekou/mcp-notion-server](https://github.com/suekou/mcp-notion-server) | 11天前 | @suekou/mcp-notion-server | A Model Context Protocol server for connecting Notion to MCP |

## 挡掉的 215 个（抽样 30）

| 候选 | 挡掉原因 |
|---|---|
| PleasePrompto/notebooklm-mcp | 像是 client 而不是 server |
| CopilotKit/open-multi-agent-canvas | 仓库名不带 mcp（多半只是描述里顺带提到） |
| toolkit | 搜索误命中（首位是 oraios/serena，与词无关） |
| framer | 搜索误命中（首位是 JiaboLi-GitHub/renderdoc-mcp，与词无关） |
| ksysoev/smcp-proxy | 已归档 |
| pip dip | 搜索误命中（首位是 kthlong/ProprioceptiveAcuity_Data，与词无关） |
| sse | 搜索误命中（首位是 u14app/deep-research，与词无关） |
| definition | 搜索误命中（首位是 isaacphi/mcp-language-server，与词无关） |
| streamable http | 搜索误命中（首位是 sparfenyuk/mcp-proxy，与词无关） |
| agentailor/fullstack-langgraph-nextjs-agent | 仓库名不带 mcp（多半只是描述里顺带提到） |
| dorucioclea/Rube | ★14 < 50 |
| luckyPipewrench/pipelock | 仓库名不带 mcp（多半只是描述里顺带提到） |
| official | 搜索误命中（首位是 github/github-mcp-server，与词无关） |
| tron 1982 | GitHub 上搜不到仓库 |
| xpzouying/xiaohongshu-mcp | 没有 server/tool 语义 |
| Simon-Kansara/ableton-live-mcp-server | 488 天没提交 |
| flipped-aurora/gin-vue-admin | 仓库名不带 mcp（多半只是描述里顺带提到） |
| maydali28/memcp | ★17 < 50 |
| 54yyyu/zotero-mcp | 没有 server/tool 语义 |
| langchain-ai/langchain-mcp-adapters | 没有 server/tool 语义 |
| pupeteer | GitHub 上搜不到仓库 |
| hspedro/mcp-server-time | ★3 < 50 |
| next.js | 搜索误命中（首位是 op7418/CodePilot，与词无关） |
| punkpeye/awesome-mcp-servers | 像是 awesome 而不是 server |
| punkpeye/awesome-mcp-servers | 像是 awesome 而不是 server |
| PostHog/posthog | 仓库名不带 mcp（多半只是描述里顺带提到） |
| gleanwork/mcp-server | 已归档 |
| lharries/whatsapp-mcp | 379 天没提交 |
| LaurieWired/GhidraMCP | 400 天没提交 |
| Geo-Joy/mcp-elicitation-example | ★8 < 50 |
