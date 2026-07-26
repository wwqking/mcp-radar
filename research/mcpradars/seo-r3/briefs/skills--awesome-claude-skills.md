# Brief · `/skills/awesome-claude-skills` （本轮最易吃的入口页）

## 为什么先做这页

`awesome-claude-skills` = **1,300/mo，KD 0**。SERP 首页：github(ComposioHQ)、
**awesome-skills.com**、**awesomeclaude.ai**、**awesomeclaudeskills.com**、reddit、substack。
——三个专门为这一个词注册的小域名都排上去了。判读 **🟢 弱**：没有任何权威站占位，
纯粹比谁的清单更全、更新更勤。这正好是目录站的主场。

## 目标词

| 关键词 | 月量 | KD |
|---|---|---|
| awesome-claude-skills | 1,300 | 0 |
| awesome claude skills（空格变体） | 合并 | — |
| claude skills list / skills marketplace | ~640 | 26–29 |
| find skills | 390 | 3 |
| best claude skills | 长尾 | — |

## 页面形态

**不是文章，是一个带数据的精选清单页**——这是我们相对那三个小域名的唯一结构优势：
它们是手写 markdown，我们能自动跑数据。

必须有：
- 每个 skill 一行：名称 / 一句话作用 / 来源仓库 / **stars** / **最近更新时间** / 装法
- 按分类分组（coding / writing / design / data / devops …）
- **排序和筛选**（stars、更新时间、分类）—— 静态 awesome list 做不到
- 「本页 N 个 skill，最后更新于 X」——新鲜度是这类词的核心排名信号

## 差异化（REQUIRED）

1. **活跃度信号**：直接复用 `lib/collector/github.ts` 现有的 stars / lastCommit /
   archived 抓取逻辑，给每个 skill 打分。竞品 awesome list 全是死链和废弃仓库，
   我们能标出「⚠️ 8 个月没更新」——这是 mcpradars 在 servers 上已经在做的事，平移过来即可。
2. **可复制的安装命令**，跟 `/servers/*` 落地页一致的组件。

## 内链

- ← `/what-are-agent-skills`（支柱页）
- → `/skills`（全量列表）
- → `/skills/skill-creator`、`/skills/marketplace`
- → `/servers`（「skill 不够用时，你要的可能是 MCP server」交叉引流）

## Schema

ItemList + BreadcrumbList；每个条目 SoftwareSourceCode。

## 数据依赖 ⚠️

需要先采集 skills。最小可行采集清单（都是 GitHub 仓库，现有管道直接能跑）：
`anthropics/skills` · `ComposioHQ/awesome-claude-skills` · `travisvn/awesome-claude-skills`
· `vercel-labs/agent-skills` · `obra/superpowers`

**建议顺序：先跑采集 → 再建这页。** 没数据就建 = 空壳页，跟第一轮定的规则冲突。

## 成功指标

- 6 周内 `awesome-claude-skills` 进前 10（KD 0，竞争者都是小站）
- 页面 skill 条目数 > 那三个小域名
