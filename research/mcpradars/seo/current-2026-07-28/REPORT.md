# MCP Radar 当前项目关键词复跑报告

> 研究日期：2026-07-28  
> 市场：United States / English  
> 站点类型：MCP Server directory  
> 变现假设：subscription（按当前 newsletter、Pro/team waitlist 和付费规划推断）  
> 原始搜索量证据：2026-07-23～2026-07-25  
> 实时验证：Google US `hl=en&gl=us&pws=0`，2026-07-28

> **当前执行目标已调整为扩流量页面。** 本文保留保守审计与证据门结果；实际新增
> URL、搜索量、KD 和两批发布顺序请以
> [`FULL-PAGE-PLAN.md`](../full-skill-run-2026-07-28/FULL-PAGE-PLAN.md) 为准。
> 新结果来自技能脚本的全量执行与当前实体求交，不再使用人工限定的 50 页计划。

## 保守审计结论（已由扩页计划覆盖）

当前项目不应该再按关键词批量扩 `/servers/*` 页面。真正的优先级是：

1. 先处理 25 个已上线、但当前没有 package 或 remote endpoint 的 Setup 页面；
2. Wave 0 新建 2 篇故障页、2 篇对比页、2 篇数据型 best-of；
3. 同期增强安全指南和 remote 目录页；
4. 其余 3 篇对比与 marketing best-of 放到 Wave 1；
5. 后续复核已找到 active 且可运行的 `gogcli-mcp-drive` 实体，因此 Google Drive
   MCP 页面进入扩页计划 Wave 2；页面必须说明它不是 Google 官方 server。

当前 44 个 SEO 落地页只有 19 个仍有可运行入口，25 个页面只能给出源码仓库或
`<see README>` 占位配置。它们的 Setup/Config 搜索承诺与当前证据不一致，应先
noindex、修复或重定向。新增内容不能掩盖这个基础质量问题。

## 计数漏斗

| 阶段 | 数量 | 说明 |
|---|---:|---|
| 合并前关键词记录 | 25,418 | 5 个种子导出 + 5 个竞品 Organic 导出 |
| A2.5 桶裁决后清洗词 | 7,620 | 丢弃 12 个范围外/杂烩模块，共移除 2,154 词 |
| 当前数据集记录 | 817 | 2026-07-28 快照 |
| A1 canonical entities | 817 | 以 server slug/package 为边界，避免把 monorepo 子包错误合并 |
| A4 enrich | 234 | URL 已存在，证据足以继续增强 |
| A4 merge | 105 | 88 个不够“五占二”，17 个证据区块不足 |
| A4 noindex | 96 | 当前 collector lifecycle=`dying` |
| A4 reject | 382 | 373 个 adoption 不过线，9 个 lifecycle=`dead` |
| 编辑型内容意图 | 15 | 10 create / 3 enrich / 1 merge / 1 reject |
| Wave 0 | 6 个新页 + 2 个增强 | 另含 25 个现有 Setup 页修复/noindex |
| 新页 P0 意图 | 9 | 2 error + 5 comparison + 2 best-of |

全量关键词池有 1,214 个 P0，但它们不是 1,214 个 URL。A3/A4 证据门和“一意图一
URL”把它们收敛成上面的编辑计划。

## Stage 0

沿用仓库已有确认：目录站、US English、核心种子 `mcp server` / `mcp`，并加入
`mcp tools`、`remote mcp server` 补漏。Agent Skills 和 client directory 继续按
当前 README 的产品边界排除。

本轮新增的假设是 `monetization: subscription`。因此 A6 对问题解决型和商业调查型
意图加权，弱化 CPC。若实际改做 AdSense 或线索生意，应修改 `config.yaml` 后重算。

## A1 · 实体图谱

当前 `data/servers.json` 有 817 条记录：

- 666 条来自 Official MCP Registry；
- 425 条带 remote endpoint；
- 704 条有 runnable entry；
- 712 个 candidate、96 个 stale、9 个 deprecated。

通用 `entities.py` 首次把 817 条压成 747 个实体，因为它把“同 GitHub repo”视为
同一实体。MCP 生态存在 monorepo，一个仓库可发布 filesystem、memory、fetch 等多个
独立 server/package，所以该合并会误伤。本轮最终用 slug/package 作为实体边界，
并保留 `entities-hard-link-merged.csv` 作为诊断证据。

这不是放弃去重：registry/GitHub/npm 仍通过 package、slug、repo 互指核对；只是
“同 repo”单独不能覆盖 monorepo 子包边界。

## A2 · 竞品和模块桶

实时 Google 核心词仍由以下同型站占据：

- `mcpservers.org`
- `mcp.directory`
- `mcp.so`
- `pulsemcp.com`
- `glama.ai/mcp`

21,031 个竞品词被归入 77 个 `(domain,module)` 桶。主要保留桶：

| 模块 | 词数 | 月量 | 类目命中率 | 裁决 |
|---|---:|---:|---:|---|
| mcpservers.org `/servers` | 5,849 | 1,364,190 | 86% | keep |
| mcp.so `/server` | 3,011 | 588,810 | 85% | keep |
| pulsemcp.com `/servers` | 1,708 | 367,810 | 83% | keep |
| glama.ai `/mcp` | 966 | 179,350 | 81% | keep |
| mcpservers.org `/remote-mcp-servers` | 206 | 63,470 | 84% | keep |
| mcp.directory `/compare` | 35 | 5,800 | 77% | keep |

关键删除桶：

| 模块 | 词数 | 命中率 | 为什么删除 |
|---|---:|---:|---|
| mcpservers.org `/agent-skills` | 2,987 | 19% | 真实且高价值的类目，但已决定迁往独立站；不是因为低纯度 |
| mcp.directory `/skills` | 421 | 42% | 同上，混入的 MCP 实体词由 server 桶保留 |
| 三组 `/client(s)` | 331 | 67%～90% | 相关，但当前产品明确不建 client 模块 |
| mcp.so `/cli` | 106 | 9% | 头部是通用 CLI 品牌词，不是 MCP server 发现意图 |
| pulsemcp.com `/use-cases` | 107 | 27% | 图片生成、航班、Claude 功能等分散主题 |
| pulsemcp.com `/posts` | 53 | 28% | 泛 Claude/多代理新闻杂烩 |
| glama.ai `/models` | 48 | 0% | 模型目录，范围不符 |

本轮没有保留低纯度桶。最有价值的低纯度发现仍是 Agent Skills，但它被路由到已存在
的独立站研究，而不是被误判为“没需求”。

## A2c / A3 · 修饰词模式与适用性

对 20 个头部实体执行了 `{entity} mcp [a-z]` 与 base query：

- 540 次 Google Autocomplete 请求；
- 0 次失败；
- 6,434 条原始建议；
- 4,986 个去重后的 entity × suggestion 对。

稳定模式：

| 模式 | 证据数 | 页面规则 |
|---|---:|---|
| client integration | 738 | 必须先验证客户端兼容性 |
| install/setup/config | 209 | 默认并入实体页；必须有 runnable entry |
| remote/url/transport | 125 | 必须有 endpoint/transport 证据 |
| tutorial/how-to | 112 | 默认并入实体页 |
| comparison/alternative | 111 | 只有 SERP 与可比维度成立才独立建页 |
| api key/oauth/token | 109 | 仅适用于对应 auth_type |
| troubleshooting | 74 | 可复现失败或重复 issue + 有量才独立建页 |
| pricing/free | 59 | 必须有日期明确的一手价格来源 |
| docker | 53 | 必须有 Dockerfile 或官方镜像 |
| security/permission | 3 | 低 Autocomplete 频次不代表不重要，仍按一手安全证据处理 |

Autocomplete 只是“需求存在”证据，不是搜索量。实时页面未观察到 PAA，所以本轮没有
虚构 FAQ 问题。

## A4 · 页面准入

### 现有 health detail 页

817 个 `/server/{slug}` 实体页经过条件规则和“五占二”门：

- 234 enrich；
- 105 merge；
- 96 noindex；
- 382 reject。

reject/noindex 的主要原因：

- 373 个低于 adoption floor（stars < 20 且 downloads < 100）；
- 88 个只有一个独特性类别；
- 17 个证据区块少于两个；
- 96 个当前为 `dying`，暂时 noindex；
- 9 个当前为 `dead`，reject。

### 现有 Setup 落地页

44 个 `/servers/{tool}-mcp-server`：

- 19 enrich；
- 25 noindex，直到 exact entity 恢复 package 或 remote endpoint。

这 25 页不是永久删除：修复目标实体、换到准确且可运行的实现，或把页面从“安装”
意图 retarget 成有证据可兑现的内容后可以重新准入。

## A5 / A6 · 最终关键词与 URL 计划

| 主题 | 方向量 | 主词量 / KD | 实时 SERP | 决策 | 波次 |
|---|---:|---:|---|---|---|
| Cursor `spawn npx ENOENT` | 1,600 | 1,600 / 24 | weak | create `/guides/cursor-mcp-spawn-npx-enoent` | Wave 0 |
| MCP `-32001` timeout | 270 | 260 / 0 | weak | create `/guides/mcp-error-32001-request-timed-out` | Wave 0 |
| Best MCP for Claude Code | 510 | 320 / 10 | weak | create data-backed best-of | Wave 0 |
| Best MCP for Cursor | 410 | 260 / 19 | medium | create data-backed best-of | Wave 0 |
| MCP vs RAG | 1,310 | 590 / 28 | medium | create `/compare/mcp-vs-rag` | Wave 0 |
| Resources vs Tools | 800 | 590 / 24 | medium | create `/compare/mcp-resources-vs-tools` | Wave 0 |
| MCP vs A2A | 1,560 | 590 / 28 | medium | create | Wave 1 |
| MCP vs CLI | 650 | 390 / 28 | medium | create | Wave 1 |
| MCP vs Function Calling | 150 | 110 / 10 | medium | create | Wave 1 |
| Best MCP for Marketing | 2,900 directional | 未测自然标题 | medium | create after intent/data lock | Wave 1 |
| MCP security best practices | 940 | 210 / 24 | strong | enrich existing security guide | Wave 0 |
| Remote MCP servers | 1,280 | 480 / 24 | medium | enrich existing `/remote-mcp-servers` | Wave 0 |
| Google Drive MCP | 2,530 | 1,000 / 64 | strong | reject/collect target | Backlog |

“Best MCP Servers for Business Sales Marketing” 是导出里的不自然措辞。实时 SERP
把它拆成 sales 和 marketing；当前数据有 42 个 marketing 实体，但只有 6 个明确
sales 实体。因此先做自然标题的 marketing 页面，把 sales 作为 subsection，不单独建
sales URL。

Google Drive MCP 的首页已出现 Google Developers、Google Cloud 官方支持与多个明确
实现。当前数据只有一个 generic Drive wrapper，没有完全匹配的官方实体；绝不能把
Google Analytics 或其他 Google server 映射到该关键词。

## Wave 0

这是已有站的“修复 + 内容 cohort”，不是新站的批量发布：

- 修复/noindex 25 个 Setup 页；
- 新建 2 个 troubleshooting；
- 新建 2 个 comparison；
- 新建 2 个 best-of；
- 增强 security 与 remote 两页；
- 观察 8～12 周。

跟踪：

- 发现、抓取、索引率；
- 每页非品牌曝光、进入 Top 20 比例、零曝光比例；
- install copy、search result click、compare add；
- newsletter/waitlist 转化；
- 每页验证与维护耗时。

## 收益三档（只作规划，不是预测）

Wave 0 六个新页的方向月量约 4,900。由于付费产品尚无真实转化和客单数据，只能用
“qualified signup 的假设价值”做占位：

| 场景 | 90 天自然会话 | qualified signups | 90 天假设毛值 | 假设成本 | 90 天净值 |
|---|---:|---:|---:|---:|---:|
| Low | 294 | 1.5 | $7 | $3,280 | -$3,273 |
| Medium | 735 | 11.0 | $165 | $3,280 | -$3,115 |
| High | 1,470 | 44.1 | $1,323 | $3,280 | -$1,957 |

假设：

- 自然 capture rate：2% / 5% / 10%；
- qualified signup rate：0.5% / 1.5% / 3%；
- 每个 qualified signup 的 90 天价值：$5 / $15 / $30；
- 六页生成 $1,200、验证 $1,200、维护 $480、风险 $400。

在没有真实付费转化前，90 天直接收入不能证明这批内容值得做。Wave 0 的合理目标是
验证排名、行为与订阅信号。上线后必须用真实页面组转化和付费数据替换这些假设。

## Pending / 限制

- 没有在 2026-07-28 重新拉 Semrush；搜索量/KD 来自 2026-07-23～2026-07-25。
- 只对 16 个决定性词抽样实时 Google，不是全量 P0。
- 没有 GSC 导出，无法识别当前 8～20 位词与真实蚕食。
- 没有进行沙箱安装验证；需要“verified”独特性的新页仍未达到发布门槛。
- PAA 未观察到；FAQ 素材 pending。
- 收入模型没有真实付费转化、客单和留存数据。
- 本轮只产出研究与页面计划，没有构建页面。

## 文件

- `config.yaml`：Stage 0
- `raw/`：Autocomplete 与 entity source 原始证据
- `module-buckets.csv` / `.md`：A2 桶与裁决
- `entities.csv`：A1 当前实体图谱
- `modifier-patterns.csv` / `.yaml`：A2c
- `modifier-rules.yaml`：A3
- `page-eligibility.csv`：817 个 health 页 A4
- `landing-page-eligibility.csv`：44 个 Setup 页 A4
- `serp-validation.csv`：实时 Google 抽样
- `keywords.csv` / `clusters.csv`：完整词池与 subscription 分数
- `content-map-validated.csv`：最终 URL 映射
- `coverage-curve.csv`：新建内容覆盖曲线
- `wave0.csv`：实验队列
- `revenue-scenarios.csv`：低/中/高假设
