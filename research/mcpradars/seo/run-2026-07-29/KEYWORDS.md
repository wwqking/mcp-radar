# mcpradars · 关键词数据（2026-07-29 重跑）

上一版报告只跑了 A3/A4 闸门，没给关键词。这份补上。
**A2/A5/A6 全部是离线跑的**——raw 导出早就在 `seo-r3/raw/`（11 个 CSV，
25,479 条），脚本直接吃这些文件，不需要浏览器。上一轮说"没浏览器所以不跑"
是我判断错了。

真正需要浏览器的只有两件事：采**新**词、验**新** SERP。
沿用的是 `current-2026-07-28/serp-validation.csv` 的既有裁决。

## 漏斗

```
25,479 raw
  → 8,052 clean（volume_floor 50 + exclude + 模块裁决砍掉 1,841）
  → 7,921 过相关性（砍掉 131 条同形异义/裸品牌）
  → P0 767 / P1 2,247 / P2 4,907
```

5 个词簇：

| 簇 | 词数 | 月搜索量 | 平均 KD |
|---|---:|---:|---:|
| Entry / Detail | 6,325 | 1,263,150 | 22.3 |
| Client Integration | 802 | 89,130 | 22.1 |
| Concept & Compare | 339 | 41,320 | 13.6 |
| How-to / Build | 265 | 23,730 | 19.4 |
| Ops / Infra / Security | 321 | 20,000 | 11.3 |

## 模块裁决（A2 闸门）

7 个低纯度桶需要人判。**留 3 个、丢 4 个**：

| 裁决 | 桶 | 词数 | 纯度 | 理由 |
|---|---|---:|---:|---|
| **丢** | mcpservers.org`/agent-skills` | 2,987 | 16% | Agent Skills 是**另一个站**的主题，刻意排除的范围。头部 `claude skills` 27,100/mo 很诱人但不属于这里 |
| **留** | mcp.directory`/skills` | 421 | 41% | 低纯度是混入的 skills 词，但 `chrome-devtools mcp` / `codex mcp` / `shadcn mcp` / `excalidraw mcp` 全是我们的实体长尾 |
| **留** | pulsemcp.com`/use-cases` | 107 | 27% | **按用途找 server** 的需求面，我们只有 category 没有 use-case——这是没覆盖的品类 |
| **丢** | mcp.so`/cli` | 106 | 9% | 通用 CLI 词（xh 49,500/mo、pnpm、azure cli），跟 MCP 无关，典型 grab-bag |
| **留** | pulsemcp.com`/posts` | 53 | 26% | 含真实故障/安装长尾：`mcp installer` / `install mcp` / `uvx mcp` / `mcp is dead` |
| **丢** | glama.ai`/models` | 48 | 0% | LLM 模型词（glm 4.5 / grok / llama），是 glama 的另一条产品线 |
| **丢** | glama.ai`(home)` | 44 | 16% | 裸品牌词 |

留下 `/use-cases` 这个 27% 纯度的桶是这轮最值得你挑战的判断：
它量不大（23,140/mo），但它指向一个**站点结构缺口**——按用途检索。

## 砍掉的 131 条：同形异义 + 裸品牌

`mcp` 这个缩写撞车很严重，旧 exclude 没拦住：

- **医学**：`mcp metacarpophalangeal` 5,400、`mcp joints` 1,900、`mcp joint pain` 1,300、`thumb mcp` 1,900
- **餐饮/地名**：`mcp's taphouse grill` 2,400、`mcp's in coronado` 2,400
- **硬件**：`battery connector for blade mcp-s` 880
- **裸品牌（MCP 只是侧面集成）**：`puppeteer` 22,200、`context7` 14,800、`roo code` 9,900、`browser-use` 5,400、`cherry studio` 5,400

按技能规则：裸品牌**删词不删页**——保留实体页，改打限定变体
（`puppeteer mcp` 而不是 `puppeteer`）。

## 覆盖缺口：323 个词没有对应的已上线实体

`KEYWORD-GAPS.csv` 是 3,014 条 P0+P1，带 `covered_by_live_entity` 标记。
其中 vol≥300 且**未覆盖**的有 323 条。头部：

| 量 | KD | 簇 | 词 | 性质 |
|---:|---:|---|---|---|
| 74,000 | 71 | entry | `mcp` | 支柱页，KD 太高，长期 |
| 40,500 | 69 | entry | `mcp server` | 支柱页，同上 |
| 5,400 | 26 | entry | `next js mcp server` | **缺实体页** |
| 4,400 | 29 | entry | `mcp inspector` | **缺实体页**（官方工具） |
| 3,600 | 29 | entry | `astro mcp` | **缺实体页** |
| 2,900 | 13 | entry | `best mcp servers for business sales marketing` | **best-of 指南，KD 13** |
| 2,900 | 30 | client | `can claude generate images` | 客户端能力问答 |
| 2,400 | 18 | entry | `copilotkit mcp` | **缺实体页** |
| 2,400 | 25 | client | `posthog mcp claude code` | 集成页 |
| 1,900 | 29 | client | `claude mcp list command` | **命令速查，KD 低** |
| 1,600 | 24 | client | `cursor mcp spawn npx enoent` | **故障页，KD 24** |
| 1,600 | 41 | entry | `huggingface mcp server` | 缺实体页 |
| 1,300 | 11 | client | `sequential thinking claude code` | **KD 11** |
| 1,300 | 32 | client | `blender mcp with claude code` | 集成页 |
| 1,000 | 15 | entry | `burp suite mcp` | 缺实体页 |
| 1,000 | 26 | client | `linear mcp codex` | 集成页 |

## 最该先做的（低 KD × 有量 × 无人覆盖）

1. `best mcp servers for business sales marketing` — 2,900/mo，**KD 13**
2. `sequential thinking claude code` — 1,300/mo，**KD 11**
3. `cursor mcp spawn npx enoent` — 1,600/mo，KD 24，故障词
4. `claude mcp list command` — 1,900/mo，KD 29
5. `mcp inspector` — 4,400/mo，KD 29，官方工具却没有实体页
6. `next js mcp server` / `astro mcp` / `copilotkit mcp` — 前端框架集成，KD 26–29

注意 3/4 两条是**客户端使用问题**，不是 server 实体——跟 memory 里
"从行情盘转向帮你解决问题" 的方向一致。

## 文件

- `KEYWORD-GAPS.csv` — 3,014 条 P0+P1，带 `covered_by_live_entity`（**从这里开始看**）
- `keywords-final.csv` — 7,921 条清洗后全量，带 cluster/score/priority/serp_adjusted
- `keywords.csv` — plan.py 原始输出（含 131 条后来砍掉的）
- `relevance-to-judge.csv` — 60 条相关性裁决及理由
- `module-buckets.csv` / `.md` — 7 个模块裁决及理由
- `entity-classification.csv` — classify.py 的 entity/attribute/junk/judge

## 仍然 pending

- **新词采集**：需要浏览器进关键词工具。当前词表基于 07-23/07-25 的导出。
- **新 SERP 验证**：本轮 P0 里的新词（如 `mcp inspector`、`astro mcp`）没有
  实跑 Google，沿用的是旧裁决文件。上线前该补验头部几个。
