# mcpradars · seo-keyword-research 重跑（2026-07-29）

## 这次跑了什么、没跑什么

技能在 **2026-07-29 更新了 `SKILL.md` / `eligibility.py` / `modifier-rules-template.yaml`**，
就在昨天那次全量跑（`full-skill-run-2026-07-28`）之后。所以这次**只重跑 A3/A4**，
输入沿用昨天同一份实体证据——把变量锁死，才能看出闸门改动本身的影响。

**没重跑：A1 / A2 / A5 / A6 / A7。** 原因是这台会话没有浏览器，
拿不到关键词工具和真实 Google SERP，而这几个脚本自 2026-07-27 起没变。
昨天 `full-skill-run-2026-07-28/` 的词表、词簇、打分和页面计划**仍然有效，继续用**。
离线重推那些数字只会是编造。

## 闸门改了什么

`eligibility.py` 的「独家计算」类不再认 `last_commit + stars > 0`，
改为必须有真正算出来的字段（`activity_trend` / `health_score` / `dependency_risk`）。
技能注释写得很直白：旧口径等于把「五占二」偷偷变成「四占一」，
3 star 的实体也能凑够。

用昨天那份原始证据直接跑新闸门：

| 结局 | 07-28 旧闸门 | 07-29 新闸门（原始证据） |
|---|---:|---:|
| enrich | 234 | **27** |
| merge | 105 | **312** |
| noindex | 96 | 96 |
| reject | 382 | 382 |

崩到 27 的原因：**817 个实体里 0 个**有新闸门认的派生字段，
而按旧口径有 522 个能白拿一类。

## 但这里面有一个假阴性，也有两个真问题

### 假阴性：TrustScore 只是列名对不上

站里 `lib/collector/score.ts` 有一个五维加权评分（维护 30% / 采用 25% /
可用 20% / 健康 15% / 社区 10%），**权重和数据源在 `/editorial-policy` 上完全公开**，
817/817 都有值。这正是技能要求的「评分公开公式」。
它只是叫 `trust_score`，不叫 `health_score`，所以闸门看不见。
补上映射（外加 `activity_trend` ← starsTrend/downloadsTrend，817/817）是合理的，不是放水。

### 真问题一：`editorial_notes` 是空头支票

昨天那份 CSV 里 74 行有 `editorial_notes`，但**只有 3 个不同的值**，
内容是「人工撰写的能力卡和示例提示词」「双语落地页适配指引和 FAQ」。
去 `data/servers.json` 核对：**这些字段根本不存在**。
817 个 server 的字段只有 slug / name / tagline / description / categories /
lifecycle / trustScore / breakdown / signals / repoUrl / … ——没有能力卡，没有示例提示词。
描述超过 120 字的只有 33 个。

这一项已**下调**：只保留真有落地页的 44 个。

### 真问题二：`has_tool` 是站点功能，不是实体独特性

昨天 704 行的 `has_tool` 是**同一个常量字符串**。
配置生成器是全站功能——每个页面都有，不构成任何单个实体的独特性。
已改为只在实体有 `has_runnable_entry` 时才算（生成的配置才真的因实体而异），704 → 704 中按运行入口过滤。

## 修正证据后的最终结果

```
817 entities -> create: 0, enrich: 257, merge: 82, noindex: 96, reject: 382
```

| 结局 | 07-28 | 07-29 最终 | 说明 |
|---|---:|---:|---|
| enrich | 234 | **257** | 全部是已上线页，加新挣到的区块 |
| merge | 105 | **82** | 57 因独特性不够，25 因厚度不够 |
| noindex | 96 | 96 | lifecycle=dying/stale |
| reject | 382 | 382 | 373 采用度不达标 + 9 已死 |

`create: 0` 是对的——817 个实体页已经全部上线，所以是 enrich 而非 create。
live 匹配 257 说明匹配逻辑正常（不是那种「全都没匹配上」的告警状态）。

## 最该看的一行

**257 个 enrich 里，214 个只靠 `computed; tool` 两类过关。**

拿掉 TrustScore 或拿掉配置生成器，这 214 页立刻掉出五占二。
也就是说：**绝大多数实体页目前是被全站机器撑着的，不是被单页实质内容撑着的。**
这跟昨天靠 stars 凑数在结构上是同一种脆弱，只是这次撑着的东西（公开公式的评分 + 真配置生成）
比 stars 硬一些，站得住，但margin 很薄。

三类齐全（computed + editorial + tool）的只有 **19** 个。

## 建议的下一步（按性价比）

1. **把 `dependency_risk` 真的算出来**。`signals` 里已经有 `openIssues`/`openPRs`/
   `contributors`/`forks`/`license`/`archived`，算依赖风险分不需要新数据源，
   算完就是第三类，能把 214 页从「两类勉强」抬到「三类稳」。这是唯一一个
   **不用写人工内容**就能加固全站的动作。
2. **给头部实体补真实验证**（`install_verified` / `supported_clients`）。
   技能说这是最硬的独家内容。先做 Wave 0 的 20–40 个，别全量。
3. **别再往 CSV 里写不存在的证据**。这次两处下调都是因为标注跑在了实现前面；
   A3/A4 的质量完全取决于喂进去的字段有多真。

## 计数漏斗

```
实体候选 817
  → 过 A4 准入 257（enrich）
  → merge 82 / noindex 96 / reject 382
  → 三类齐全仅 19
```

## 文件

- `page-eligibility.csv` — 最终裁决（修正证据后）
- `page-eligibility.RAW-NO-HEALTHSCORE.csv` — 新闸门 + 未修正证据（enrich=27），保留作对照
- `entities.csv` — 已补 activity_trend / health_score，已下调 editorial_notes / has_tool
- `config.yaml` — 本次范围与全部证据修正说明
