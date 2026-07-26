# 候选发现报告 · 2026-07-26

扫了 290 个候选，过三道门槛的 **25** 个，挡掉 201 个。

三道门槛：① 仓库名与关键词对得上（挡 GitHub 搜索误命中）② 确实是 server 不是清单/客户端/教程 ③ npm 包的 repository 要指回同一个仓库（否则填 null）。

**合并前请人工扫一眼**——机器门槛会漏，历史上漏过「课程被当成 server」「canvas 撞了 canva」。

## 有人在搜、但我们没有（关键词来源）

| 搜索量 | 仓库 | ★ | npm | 说明 |
|---|---|---|---|---|
| 1600/mo | [szeider/mcp-solver](https://github.com/szeider/mcp-solver) | 176 | — | Model Context Protocol (MCP) server for constraint optimizat |

## GitHub 上高星但库里没有（趋势来源）

| ★ | 仓库 | 最近提交 | npm | 说明 |
|---|---|---|---|---|
| 35349 | [DeusData/codebase-memory-mcp](https://github.com/DeusData/codebase-memory-mcp) | 0天前 | codebase-memory-mcp | High-performance code intelligence MCP server. Indexes codeb |
| 8843 | [wonderwhy-er/DesktopCommanderMCP](https://github.com/wonderwhy-er/DesktopCommanderMCP) | 1天前 | — | This is MCP server for Claude that gives it terminal control |
| 8285 | [idosal/git-mcp](https://github.com/idosal/git-mcp) | 79天前 | — | Put an end to code hallucinations! GitMCP is a free, open-so |
| 7043 | [firecrawl/firecrawl-mcp-server](https://github.com/firecrawl/firecrawl-mcp-server) | 0天前 | — | 🔥 Official Firecrawl MCP Server - Adds powerful web scrapin |
| 5636 | [mobile-next/mobile-mcp](https://github.com/mobile-next/mobile-mcp) | 14天前 | — | Model Context Protocol Server for Mobile Automation and Scra |
| 4135 | [MarkusPfundstein/mcp-obsidian](https://github.com/MarkusPfundstein/mcp-obsidian) | 72天前 | — | MCP server that interacts with Obsidian via the Obsidian res |
| 4058 | [haris-musa/excel-mcp-server](https://github.com/haris-musa/excel-mcp-server) | 105天前 | — | A Model Context Protocol server for Excel file manipulation |
| 1360 | [robotmcp/ros-mcp-server](https://github.com/robotmcp/ros-mcp-server) | 1天前 | — | Connect AI models like Claude & GPT with robots using MCP an |
| 1342 | [designcomputer/mysql_mcp_server](https://github.com/designcomputer/mysql_mcp_server) | 35天前 | — | A Model Context Protocol (MCP) server that enables secure in |
| 1332 | [chigwell/telegram-mcp](https://github.com/chigwell/telegram-mcp) | 0天前 | — | Telegram MCP server powered by Telethon to let MCP clients r |
| 1281 | [caol64/wenyan-mcp](https://github.com/caol64/wenyan-mcp) | 88天前 | — | 文颜 MCP Server 可以让 AI 自动将 Markdown 文章排版后发布至微信公众号。 |
| 1255 | [matlab/matlab-mcp-server](https://github.com/matlab/matlab-mcp-server) | 16天前 | — | Run MATLAB® using AI applications with the official MATLAB M |
| 1252 | [DaxianLee/cocos-mcp-server](https://github.com/DaxianLee/cocos-mcp-server) | 18天前 | — | 一款全面的、便捷的cocos creator AI MCP服务插件，适用于3.8.0以上cocos版本，一键安装，一键启 |
| 1235 | [philschmid/mcp-cli](https://github.com/philschmid/mcp-cli) | 170天前 | — | Lighweight CLI to interact with MCP servers |
| 1227 | [datalayer/jupyter-mcp-server](https://github.com/datalayer/jupyter-mcp-server) | 0天前 | — | 🪐 🔧 Model Context Protocol (MCP) Server for Jupyter. |
| 1173 | [mcpjungle/MCPJungle](https://github.com/mcpjungle/MCPJungle) | 67天前 | — | One place to manage & connect to all your MCP servers |
| 1118 | [Joooook/12306-mcp](https://github.com/Joooook/12306-mcp) | 16天前 | — | This is a 12306 ticket search server based on the Model Cont |
| 1095 | [mukul975/cve-mcp-server](https://github.com/mukul975/cve-mcp-server) | 9天前 | — | Production-grade MCP server giving Claude 27 security intell |
| 1080 | [saidsurucu/yargi-mcp](https://github.com/saidsurucu/yargi-mcp) | 12天前 | — | MCP Server For Turkish Legal Databases |
| 1043 | [irinabuht12-oss/google-meta-ads-ga4-mcp](https://github.com/irinabuht12-oss/google-meta-ads-ga4-mcp) | 110天前 | — | MCP server for Google Ads, Meta Ads & GA4 — works with ChatG |
| 1012 | [PortSwigger/mcp-server](https://github.com/PortSwigger/mcp-server) | 29天前 | — | MCP Server for Burp |
| 997 | [microsoft/powerbi-modeling-mcp](https://github.com/microsoft/powerbi-modeling-mcp) | 16天前 | @microsoft/powerbi-modeling-mcp | The Power BI Modeling MCP Server, brings Power BI semantic m |
| 990 | [cisco-ai-defense/mcp-scanner](https://github.com/cisco-ai-defense/mcp-scanner) | 2天前 | — | Scan MCP servers for potential threats & security findings. |
| 986 | [johnhuang316/code-index-mcp](https://github.com/johnhuang316/code-index-mcp) | 75天前 | — | A Model Context Protocol (MCP) server that helps large langu |

## 挡掉的 201 个（抽样 30）

| 候选 | 挡掉原因 |
|---|---|
| chatgpt | 搜索误命中（首位是 danny-avila/LibreChat，与词无关） |
| withastro/docs-mcp | 像是 docs? 而不是 server |
| huggingface/mcp-course | 像是 course 而不是 server |
| rafaorleaes/playright-test | ★1 < 50 |
| confluence | 搜索误命中（首位是 sooperset/mcp-atlassian，与词无关） |
| azure | 搜索误命中（首位是 danny-avila/LibreChat，与词无关） |
| BofAI/mcp-server-tron | ★13 < 50 |
| components system | 搜索误命中（首位是 southleft/design-systems-mcp，与词无关） |
| Yasirrazaa/notebookllm | ★5 < 50 |
| antigravity | 搜索误命中（首位是 google-labs-code/stitch-skills，与词无关） |
| postgresql | 搜索误命中（首位是 t8y2/dbx，与词无关） |
| langchain4j/langchain4j | 仓库名不带 mcp（多半只是描述里顺带提到） |
| ZenNotes/zennotes | 仓库名不带 mcp（多半只是描述里顺带提到） |
| ollama | 搜索误命中（首位是 PDFMathTranslate/PDFMathTranslate，与词无关） |
| sql | 搜索误命中（首位是 zylon-ai/private-gpt，与词无关） |
| liangdabiao/amazon-sorftime-research-MCP-skill | 像是 skills? 而不是 server |
| dip pip | 搜索误命中（首位是 kthlong/ProprioceptiveAcuity_Data，与词无关） |
| specification | 搜索误命中（首位是 harsha-iiiv/openapi-mcp-generator，与词无关） |
| app | 搜索误命中（首位是 SigNoz/signoz，与词无关） |
| six2dez/burp-ai-agent | 仓库名不带 mcp（多半只是描述里顺带提到） |
| mcse certification | GitHub 上搜不到仓库 |
| model context protocol | 搜索误命中（首位是 microsoft/mcp-for-beginners，与词无关） |
| johnlindquist/mcpez | ★7 < 50 |
| PCSX2/myMCpp | ★37 < 50 |
| updates | 搜索误命中（首位是 6551Team/opennews-mcp，与词无关） |
| six2dez/burp-ai-agent | 仓库名不带 mcp（多半只是描述里顺带提到） |
| irish pub | 搜索误命中（首位是 the-fluid-company/ireland-public-context-graph，与词无关） |
| chrome-mcp-server | 搜索误命中（首位是 hangwin/mcp-chrome，与词无关） |
| google-labs-code/stitch-skills | 仓库名不带 mcp（多半只是描述里顺带提到） |
| punkpeye/awesome-mcp-servers | 像是 awesome 而不是 server |
