# Brief · `/what-are-agent-skills` （Skills 模块支柱页）

## 为什么这页存在

前两轮关键词研究（种子 `mcp server`、`mcp`）**结构性看不见这个主题**：seed 扩展只返回
含种子词的关键词，而整个 skills 池 389 词 / 124,480 月量里**一个 "mcp" 都没有**。
本轮从竞品 organic 采词才暴露出来。同时 mcp.so 已经建了 `/skills/*` 共 **9,793 页**。

## 目标词

| 角色 | 关键词 | 月量 | KD |
|---|---|---|---|
| 主词 | claude skills | 27,100 | 58 |
| 副词 | claude code skills | 8,100 | 51 |
| 副词 | agent skills | 4,400 | 52 |
| 副词 | anthropic skills | 3,600 | 64 |
| 副词 | claude skill / claude code skill | 6,300 | 45–62 |
| 长尾 | claude agent skills · claude skills documentation · what are claude skills | ~1,500 | 28–35 |

## SERP 实测（pws=0, gl=us）

`claude skills`：platform.claude.com / support.claude.com（官方占前 3）→ 之后是
chrislema.com、**claudeskills.info**（小目录）、reddit、medium。
判读 **🟡 中等**：官方吃掉导航意图，但 4–8 位全是小站 → 目录站能挤进去。

`agent skills`：**agentskills.io（纯目录站）稳居 #1** —— 这是最重要的证据：
这个 SERP 明确接受目录型页面，不是官方文档独占。

## 直接回答目标（AI 引擎可摘引）

开篇 40–60 词必须自足回答「Agent Skills 是什么、和 MCP 什么关系」：

> Agent Skills are packaged instructions, scripts, and resources that an AI agent
> loads on demand to perform a specific task. Unlike MCP servers — which connect an
> agent to external *systems* — skills extend what the agent *knows how to do*.

**这个「skills vs MCP」的区分是本页最大的差异化点**：SERP 上几乎没人讲清楚，
而我们是 MCP 目录站，天然有资格讲。

## 必须有的段落

1. **一句话定义** + 上面的直接回答段
2. **Skills vs MCP servers vs Tools 三方对比表**（REQUIRED 原创资产 —— 竞品普遍缺）
   维度：解决什么问题 / 加载方式 / 运行在哪 / 谁提供 / 何时该用哪个
3. **一个 skill 长什么样** — SKILL.md 结构真实示例，带 frontmatter
4. **在 Claude Code / Claude Desktop 里怎么装** — 真实命令，不要伪代码
5. **什么时候该写 skill、什么时候该接 MCP server** — 决策清单
6. **常见 skill 类型** → 内链到 `/skills` 列表页各分类
7. FAQ（见下）

## 内链

- → `/skills`（模块列表页，本页是它的支柱）
- → `/skills/awesome-claude-skills`（KD0 入口页）
- → `/what-is-mcp-server`（已有支柱页，双向互链，强化「两种扩展方式」的主题簇）
- → `/guides/choosing-mcp-server`（已有）

## FAQ（从长尾词直接生成）

- What's the difference between Claude Skills and MCP servers?
- Are agent skills only for Claude? （→ 讲 vercel-labs/agent-skills、openai/skills 的跨厂商现状）
- Where do I find Claude skills? （→ 内链 `/skills`）
- Do skills replace MCP servers?
- How do I create my own skill? （→ 内链 skill-creator 页）

## Schema

Article + FAQPage + BreadcrumbList，复用 `/what-is-mcp-server` 已有的满配实现 + hreflang。

## 数据依赖 ⚠️

`/skills` 列表页和 `/skills/{slug}` 详情页**需要先采集 skills 数据**才能建，否则是空壳页。
好消息：skills 都住在 GitHub 仓库里（`anthropics/skills`、`vercel-labs/agent-skills`、
`ComposioHQ/awesome-claude-skills` 等），`lib/collector/github.ts` 的现有管道可以直接复用。
**本支柱页本身不依赖采集数据，可以先建。**

## 成功指标

- 3 个月内 `agent skills` / `claude agent skills` 进前 20
- 该页成为 `/skills/*` 全模块的内链枢纽
- 被 AI Overview / ChatGPT 引用（直接回答段是为此写的）
