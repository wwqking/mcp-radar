# mcpradars 执行计划（2026-07-29 起）

基于 [KEYWORDS.md](KEYWORDS.md) 的词表和 [REPORT.md](REPORT.md) 的闸门结果。

## 现状基线（已核对代码，不是假设）

| 资产 | 数量 | 位置 |
|---|---:|---|
| 实体数据 | 817 | `data/servers.json` |
| 实体详情页 | 817 | `/server/{registry-id}`（数据页） |
| SEO 落地页 | **44** | `/servers/{tool}-mcp-server`（`lib/seo-landing.ts`） |
| 指南 | **6** | `lib/guides.ts` |
| 支柱页 | 1 | `/what-is-mcp-server` |
| 对比页 | 1 | `/compare` |

**核心矛盾**：817 个实体只有 44 个有 SEO 落地页（5%），
而 A4 闸门判定 257 个够格（enrich）。中间这 213 个是最大的现成库存。

## 优先级排序逻辑

不是按搜索量排，是按 **(量 × 低KD) ÷ 成本** 排。成本差异极大：
- 已有数据 + 已有模板 → 只需写文案（**最便宜**）
- 已有数据 + 需新模板 → 写模板 + 文案
- 需新采集 → 采集 + 验证 + 文案（**最贵**）

---

## W1（第 1 周）· 零采集成本的现成库存

**这批的共同点：server 已经在 `data/servers.json` 里，只是没有落地页。**

| # | 目标词 | 量 | KD | 已有 server slug | capabilities |
|---|---|---:|---:|---|---|
| 1 | `how to get youtube transcript for claude` | 1,900 | 16 | `mcp-server-youtube-transcript` | 缺，要写 |
| 2 | `fast mcp` / `how is fast mcp better than flaskmcp` | 1,600 | 26 | `fastmcp`（26,891★，active） | 缺，要写 |
| 3 | `blender mcp with claude code` | 1,300 | 32 | `blender-mcp`（24,994★，active） | 缺，要写 |
| 4 | `r.jina.ai url format` 系列 | 3,000 合计 | 0–30 | `jina-mcp` | **已有** ✅ |

**合计约 7,800/mo，零采集成本。**

⚠️ **成本修正（核对代码后）**：这批不是「纯写文案」。落地页要渲染能力卡，
依赖 `lib/server-capabilities.ts` 里同 `serverSlug` 的条目（全站只有 59 条）。
4 个里 **3 个缺**，必须先补 capabilities 再加 landing 条目——
两份双语内容，不是一份。仍是最便宜的一档（无采集、无去重、无验证），
但工作量约为原估计的两倍。
第 4 条三个变体（`r.jina.ai usage url format` / `r.jina.ai url format` /
`jina ai reader r.jina.ai url format`）是**一个意图**，合成一页，别开三页。

同时做（不占额外调研）：
- **补 `dependency_risk`** — 已开后台任务 task_e54e5ea9。这是唯一能一次性
  加固全站 214 页独特性的动作，优先级高于任何单页。

## W2 · 低 KD 高价值内容页

需要写新模板，但 KD 极低、竞争空档明显。

| # | URL | 主词 | 量 | KD | 类型 |
|---|---|---|---:|---:|---|
| 1 | `/guides/best-mcp-servers-for-business` | best mcp servers for business sales marketing | 2,900 | **13** | best-of |
| 2 | `/guides/sequential-thinking-claude-code` | sequential thinking claude code | 1,300 | **11** | 用法 |
| 3 | `/guides/cursor-mcp-spawn-npx-enoent` | cursor mcp spawn npx enoent | 1,600 | 24 | **故障** |
| 4 | `/guides/claude-mcp-list-command` | claude mcp list command | 1,900 | 29 | 命令速查 |

**合计 7,700/mo，平均 KD 19。**

第 1 条有现成优势：`best-of` 类页面正好能用 TrustScore 排序 + 公开公式，
是「独家计算」的天然载体，不是靠人工吹。**用数据说话的 best-of 才排得动。**

第 3/4 条是**客户端使用问题**而非 server 实体——和你「从行情盘转向帮你
解决问题」的方向一致，也是 GSC 里最容易起量的一类。

## W3 · 需要采集的新实体

这批量大但**当前 catalog 里没有**，要先过采集 + 去重（记住 memory 里的教训：
GitHub 误命中 32%、npm 同名 63%）。

| 词 | 量 | KD | 状态 |
|---|---:|---:|---|
| `next js mcp server` | 5,400 | 26 | 需确认是哪个 server / 还是框架集成指南 |
| `mcp inspector` | 4,400 | 29 | **官方工具，必收** |
| `astro mcp` | 3,600 | 29 | 需采集 |
| `copilotkit mcp` | 2,400 | 18 | 需采集 |
| `posthog mcp claude code` | 2,400 | 25 | 需采集 |
| `skyvern` | 1,300 | 18 | 需采集（裸品牌，打 `skyvern mcp`） |
| `burp suite mcp` | 1,000 | 15 | 需采集 |

**合计约 20,500/mo。**

`mcp inspector` 是这里最值得先做的：官方工具、4,400/mo、KD 29，
站上完全没有——这是个明显的漏。

`next js mcp server` 5,400/mo 要先判性质：是某个具体 server，
还是「在 Next.js 里用 MCP」的集成指南？**SERP 会告诉你**，这条必须验。

## W4 · Wave 0 队列实验（技能 A7）

前三周上线约 15 页后，**停止扩量 8 周**，用真实数据校准，别凭感觉往下堆。

对照组要覆盖所有页面类型：
- 已有量的实体落地页（W1 的 4 个）
- 零量但高 adoption 的实体页（从 257 个 enrich 里抽 20 个）
- 内容/故障页（W2 的 4 个）
- category hub

看这几个指标决定扩到 500 / 2,000 还是不扩：
- 收录率（掉了就是模板质量问题，先修再放）
- 每页曝光 + 非品牌查询数
- 排 8–20 名的词 → 这些是回报最高的加强目标
- 零曝光比例

---

## 必须先解决的两个前提

### 1. SERP 验证（阻塞 W3，不阻塞 W1/W2）

W3 的新词**一条都没验过真实 Google**。当前沿用的是 07-28 的旧裁决文件。
至少要验这几条再投入采集成本：
`mcp inspector` / `next js mcp server` / `astro mcp` / `copilotkit mcp`

需要浏览器。W1/W2 的词大多在旧验证覆盖内，可以先动。

### 2. 别再让标注跑在实现前面

上一轮发现 `editorial_notes` 和 `has_tool` 写了 817 行"人工能力卡"、
"配置生成器"，但 `data/servers.json` 里**根本没有这些字段**。
这次两处都已下调。

规矩：**证据字段只能从 `data/servers.json` 生成，不能手写。**
A3/A4 的裁决质量完全取决于喂进去的字段有多真。

---

## 一句话总结

**先吃零成本的现成库存（W1），再打低 KD 的内容空档（W2），
最后才花采集成本追大词（W3），然后停下来用数据说话（W4）。**

不要一上来就冲 `mcp`(74,000/KD 71) 和 `mcp server`(40,500/KD 69)——
这两个是支柱页的长期目标，新站打不动。

## 量的预期（三档，都是假设）

技能明确要求收入预估带三档和假设，不给单点数字。

前三周约 15 页，词簇合计约 36,000/mo。**搜索量 ≠ 访问量**，
中间隔着排名、CTR、索引率、词间重叠：

| 档 | 假设 | 90 天自然会话/月 |
|---|---|---:|
| 低 | 平均排 15–20 名，CTR 1%，索引率 70% | ~250 |
| 中 | 平均排 8–12 名，CTR 3%，索引率 85% | ~900 |
| 高 | 平均排 4–8 名，CTR 6%，索引率 90% | ~1,900 |

**全部是假设**，上线后必须用 GSC 分组真实数据替换。
`monetization: subscription`，所以问题解决型页面（W2 的故障/命令页）
价值高于纯流量页——转化路径更短。
