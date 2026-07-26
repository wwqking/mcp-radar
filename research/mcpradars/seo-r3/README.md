# mcpradars 关键词研究 · 第三轮 · 2026-07-25

**这一轮和前两轮的根本区别：第一次从竞品采词，而不是扩展种子词。**

前两轮（`seo-mcp-server/` 种子 `mcp server`、`seo/` 种子 `mcp`）都是 seed-only。
seed 扩展只能返回**含种子词**的关键词——所以只要品类里有一块需求恰好不含 "mcp"，
两轮都结构性看不见它。本轮 Stage A1/A2 先找到真实排名竞品，再从他们的 sitemap
和自然排名采词，把这个盲区打开了。

## 漏斗

| 阶段 | 结果 |
|---|---|
| A1 找竞品（真 Google, pws=0） | mcp.so · pulsemcp.com · glama.ai · mcp.directory |
| A2 竞品采词（sitemap + organic + top pages） | 38 个 sitemap 文件 / 6 份 organic 导出 |
| A3 种子扩展补长尾 | +5 个种子（含 `agent skills`、`mcp client`、`remote mcp server`） |
| B–C 清洗+聚类+打分 | **25,479 → 10,149 词**，5 个集群 |
| B2 路由+分类 | entity 2,870 · attribute 1,226 · junk 957 · judge 5,096 |
| **× 真实数据求交** | **117 个可建详情页**（而非脚本算的 5,142） |
| D SERP 验证 | 11 个决定性主词实测 |
| E–F 页面映射 | **129 个页面** + 3 篇 brief |

## 三个核心发现

### 1. Skills 是完全没被发现过的一块 —— 389 词 / 124,480 月量，一个 "mcp" 都不含

| 词 | 量 | KD |
|---|---|---|
| claude skills | **27,100** | 58 |
| claude code skills | 8,100 | 51 |
| agent skills | 4,400 | 52 |
| awesome-claude-skills | 1,300 | **0** |
| skill-creator | 1,600 | 28 |

其中 **KD<30 的有 181 词 / 36,870 月量**。
竞品 mcp.so 已经建了 `/skills/*` 共 **9,793 页**。

SERP 实测证明可打：`agent skills` 首页 **#1 是 agentskills.io（纯目录站）**；
`awesome-claude-skills` 首页全是 awesome-skills.com / awesomeclaude.ai /
awesomeclaudeskills.com 这类小域名，没有任何权威站占位。

### 2. 缺两个整模块：`/clients` 和 remote 分类

竞品都建了、我们一个页都没有：

| 模块 | 竞品页数 | SERP 证据 |
|---|---|---|
| `/clients/*` | 1,359（三家合计） | `mcp clients` 首页同时有 mcpmarket / mcp.so / pulsemcp 三家的 /clients |
| remote servers | glama 5,000（`/mcp/connectors/*`） | `remote mcp servers` **#1 是 mcpservers.org 的分类页** |
| `/skills/*` | 9,793（mcp.so） | 见上 |

这类列表/枢纽页几乎没有自己的高量词，**keyword-first 的流程永远发现不了**——
只有看竞品架构才能看到。而它们正是让详情页排上去的内链骨架。

顺带：`cursor mcp spawn npx enoent`（1,600, KD24）是个**报错词**——
配置炸了来搜的人转化意图极强。每个 client 详情页都该留「常见报错」区块。

### 3. 详情页从 21 → 138，但天花板是 117 不是 5,142

`plan.py` 按目录站规则算出 entry_detail 簇要建 **5,142 页**。这是幻觉。
按第一轮定下的硬规则（只给有真实 server 数据的工具建页，否则是 thin content）逐层收敛：

```
entry_detail 且含 mcp 的词          4,718 词 / 784,360 月量
  ├─ 能匹配到 data/servers.json      2,074 词 → 208 个工具
  ├─ 剔除通用词(tools/api/web/…)             → 179 个真实体
  ├─ 去掉已建的 21 个                        → 161 待建
  └─ 且 TrustScore ≥ 50                     → 117 个值得建   ← 真实天花板
剩下 2,644 词 / 515,080 月量 = 采集清单，抓到数据前一个页都别建
```

W1 前 25 个合计 **94,670/mo**，全部有真 server + TrustScore≥50。

**厂商垄断要认**：`unity mcp`、`grafana mcp`、`google drive mcp`、`aws mcp` 等
首页被厂商自有域名通吃（🔴）。这些页仍然建——长尾和内链价值在——但别指望主词。
反过来 `servicenow mcp server`(KD17)、`asana mcp`(KD19)、`shadcn mcp`(KD33) 的首页
**已经有竞品目录详情页在榜**，说明我们同型页能打，位置在 5–9 区间。

## 落地进度（2026-07-26）

| 状态 | 内容 |
|---|---|
| ✅ 已上线 | `/remote-mcp-servers` 落地页 —— 350 个带托管端点的 server，满配 Schema + hreflang + sitemap |
| ✅ 已上线 | 采集加 `remoteEndpoints` 字段（`registry.ts` → `types.ts` → `build-data.ts`） |
| ✅ 已上线 | 白名单 92 → 126，实跑采集 **524 → 559 个 server**，34 个全部入库 TrustScore 84–92 |
| ⏸ 移出本站 | **Skills 模块整块延后，用户决定单独开域名做站**。研究产物（`skills-cluster.csv` + 2 篇 brief）留在本目录待搬 |
| ⏳ 待做 | `/clients` 模块、W1 那 25 个工具落地页 |

采集实测数据：registry 条目 82% 带 remote 端点，我们库里 350/559（63%）有；
传输方式 streamable-http 350 条、sse 25 条。

**没有改 `onlyWithRepo=true`**：registry 里另有 448 个纯 remote（无 repo）条目，
它们拿不到 stars/提交活跃度，收进来就是没有健康数据的空壳——跟第一轮定的规则冲突，
所以只收「既有 repo 能审计、又有托管端点」的那批。

## 建议的执行顺序

| 波次 | 做什么 | 依赖 |
|---|---|---|
| **W1-a** | 建 `/what-are-agent-skills` 支柱页 | **无依赖，今天就能写** |
| **W1-b** | 跑采集补 skills 数据（GitHub 管道现成的） | `lib/collector/github.ts` |
| **W1-c** | 建 `/skills` + `/skills/awesome-claude-skills` | 依赖 W1-b |
| **W1-d** | 建 `/clients` 列表页（40–60 个 curated 即可） | `lib/collector/curated.ts` 模式 |
| **W1-e** | 扩 `lib/seo-landing.ts` 到 W1 的 25 个工具 | 数据已有 ✅ |
| W2 | client 详情页 · 35 个落地页 · remote 分类页 | — |
| W3 | 剩余 57 个落地页 · skills 长尾 | — |

前两轮的 5 篇 `/compare/*` brief（`../seo/briefs/`）仍然有效，本轮没有推翻。

## 诚实性说明

- **Stage D 只验了 11 个决定性主词**，不是全部 P0。选的是能改变模块级决策的那些
  （三个新模块的头词 + 代表性详情页词）。129 个页面逐个验 SERP 不现实也不必要。
- **129 个页面 vs ~200 万月量看起来偏少**——这是刻意的。语料里 2,644 个词
  （515,080 月量）我们没有数据，建了就是空壳页；判 `judge` 的 5,096 词里
  大量是竞品带进来的跨品类噪音（`real estate agent skills`、`what does imsg mean
  in texting`、`1 elisa kit`、`battery connector for blade mcp-s`）。
  宁可少建有数据的页，也不要堆空壳。
- **skills / clients 模块的详情页全部卡在数据上**。支柱页和列表页可以先走，
  详情页必须等采集。这是本轮最大的未完成依赖。

## 文件

| 文件 | 内容 |
|---|---|
| `config.yaml` | 本轮配置（含 A1 竞品与排除理由） |
| `raw/` | 只读证据：6 份 organic/toppages 导出 + `sitemaps/` 38 个竞品 sitemap |
| `architecture.md` / `.json` | 竞品模块表 + 10,149 词的模块路由 |
| `keywords.csv` | 清洗打分后 10,149 词 |
| `clusters.csv` · `analysis-summary.json` | 5 集群汇总 |
| `entity-classification.csv` | entity/attribute/junk/judge 分类 |
| `relevance-to-judge.csv` | 需人工裁决相关性的头部词 |
| `skills-cluster.csv` | **skills 池 389 词（本轮核心发现）** |
| `buildable-detail-pages.csv` | 2,074 个有真 server 数据的词 |
| `buildable-tools-clean.csv` | 收敛后 179 个真实体工具 |
| `collect-targets.csv` | **2,644 个待采集词——喂给采集器** |
| `serp-validation.csv` | 11 个主词的真实 SERP 判读 |
| `content-map-validated.csv` | **129 个页面的最终映射** |
| `briefs/` | 3 篇新 brief（skills 支柱 / awesome-claude-skills / clients 模块） |
