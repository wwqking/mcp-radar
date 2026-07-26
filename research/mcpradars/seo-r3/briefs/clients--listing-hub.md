# Brief · `/clients` + `/clients/{client}` （MCP 客户端模块）

## 为什么这个模块存在

**证据来自竞品架构，不是关键词工具**：
- glama.ai `/mcp/clients/*` — 159 页
- mcp.so `/clients/*` — 370 页
- pulsemcp.com `/clients/*` — 606 页
- 合计 **1,359 个客户端详情页**

三家排名竞品都独立建了这个模块，而 mcpradars 一个页面都没有。
纯 keyword-first 的流程发现不了它——列表/枢纽页几乎没有自己的高量词，
但它是让详情页排上去的内链骨架。

## SERP 实测：`mcp clients`（1,000/mo, KD 46）

首页：modelcontextprotocol.io ×2（官方）、**mcpmarket.com/client**、reddit、
github awesome-mcp-clients、form.io、**mcp.so/clients**、k2view、**pulsemcp.com/clients**。

判读 **🟡 中等**——**三家竞品目录的 /clients 列表页同时在首页**。
这不是「难打」，这是「这个模块的列表页本来就能排」的直接证据。

## 页面结构

### `/clients` 列表页（P0, W1）
主词 `mcp clients`（1,000）+ `mcp client`（合并）+ `mcp client ui`。
每行：客户端名 / 平台 / 支持的传输方式（stdio, SSE, HTTP）/ 是否支持 resources·prompts·sampling
/ 配置文件路径 / 官网。**支持矩阵表是这页的核心资产**——竞品大多只给名字和链接。

### `/clients/{client}` 详情页（P1, W2）
优先级按需求排（都来自本轮语料）：

| 客户端 | 相关词量 | 备注 |
|---|---|---|
| claude-code | ~2,500 | `claude code mcp servers` 720 KD26、`claude mcp list command` 1,900 KD29 |
| cursor | ~2,000 | `cursor mcp servers` 720、`cursor mcp spawn npx enoent` 1,600 KD24（报错词！） |
| vscode | ~1,400 | `vscode mcp` 720 KD63 |
| claude-desktop | — | 配置文件路径类长尾多 |
| codex | ~2,180 | `codex mcp` 1,300 KD24 P0、`codex cli mcp` 880 |

**注意 `cursor mcp spawn npx enoent`（1,600, KD24）** —— 这是个报错词，
意图是「我配置炸了怎么修」。这类词转化意图极强、竞争极低，应该在每个 client 详情页
留一个「常见报错」区块承接，而不是只写介绍。

## 内链

- `/clients` ↔ `/servers`（互为对方的「另一半」：server 提供能力，client 消费能力）
- `/clients/{client}` → 该客户端的安装命令区块 → 各 `/servers/{tool}-mcp-server`
- ← `/what-is-mcp-server`（支柱页加一段「客户端在哪」并链过来）

## Schema

`/clients`：ItemList + BreadcrumbList
`/clients/{client}`：SoftwareApplication + FAQPage + BreadcrumbList（复用 `/servers/*` 现成实现）

## 数据依赖 ⚠️

需要采集客户端数据（名称、平台、传输支持、配置路径）。数量小（合理目标 40–60 个，
不是 1,359），**可以手工维护一份 curated 列表**——`lib/collector/curated.ts` 已有这个模式。
比 skills 模块好落地得多。

## 成功指标

- `/clients` 列表页 3 个月内进 `mcp clients` 前 20
- `cursor mcp spawn npx enoent` 这类报错词吃到排名（KD24，最快见效）
