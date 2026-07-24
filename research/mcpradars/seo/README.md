# mcpradars 关键词研究 · 种子词 `mcp` · 2026-07-23

第二轮研究（第一轮种子是 `mcp server`，产出已建站的 `/servers` 落地页体系）。
本轮用更宽的种子 `mcp`，目标是**找 server 类之外的新主题集群**。

## 漏斗

| 阶段 | 结果 |
|---|---|
| A 拉词（Semrush, US, KD 0–29） | 1,621 词 / 28.9万月量 / 均 KD 18% |
| B–C 清洗+聚类+打分 | 1,151 词（去医学/游戏/同名噪音 470）/ 24.1万月量 / do 410 · watch 735 |
| D SERP 验证（真 Google, pws=0） | 7 个主词实测首页 |
| E–F 映射页面 + brief | 5 篇新页 brief（全在 comparison 集群） |

## 核心发现

1. **comparison（对比）集群是这轮唯一真正的新蓝海**：25 词 / 5,780 月量 / 均 KD 21 /
   均分 3.74（全场最高）/ **100% 带 AI Overview**。SERP 实测多为中型 SaaS 博客+Reddit，
   无巨头/官方垄断 → 可打，且吃 AI Overview 对 GEO 极有利。
2. **协议/安全/建服务器类词是坑**：`mcp inspector`、`mcp security best practices`、
   `how to build an mcp server` 首页被官方 modelcontextprotocol.io / GitHub / NSA / 大厂
   SDK 垄断（🔴 strong）→ 已 DROP/DEMOTE，别硬打。
3. **server-detail 是最大集群（824 词 / 16.9万量）但已被现有 `/servers` 体系承接**，
   本轮不重复规划，只建议按数据继续扩工具落地页。

## 5 篇待建新页（都是 /compare/*，对应 comparison 集群）

| 优先级 | URL | 主词 | 合并量 | KD | SERP |
|---|---|---|---|---|---|
| **P0 W1** | /compare/mcp-vs-rag | mcp vs rag | 1,310 | 19–28 | 🟢 弱中 |
| P1 W1 | /compare/mcp-resources-vs-tools | mcp resources vs tools | ~730 | 17–24 | 🟡 中 |
| P1 W2 | /compare/mcp-vs-a2a | mcp vs a2a | ~1,100 | 14–29 | 🟡 中 |
| P1 W2 | /compare/mcp-vs-cli | mcp vs cli | ~870 | 20–27 | 🟡 中(provisional) |
| P2 W3 | /compare/mcp-vs-function-calling | mcp vs function calling | ~810 | 10–26 | 🟡 中(provisional) |

Brief 在 `briefs/`，每篇含直接回答目标、支撑长尾词、H2 大纲、内链、FAQ、原创资产要求、指标。

## 落地建议（接现有代码）

- 这 5 篇天然适合放进 **`/guides` 系统**（已有 Article schema + free tier + hreflang），
  或新开 `/compare/*` 路由（你已有一个 `/compare` 对比工具页，注意别冲突——建议内容型对比文走
  `/guides/{slug}` 或独立 `/compare/{slug}` 文章路由，与工具页区分）。
- 每篇必配**原创对比表/层次图**（brief 里标了 REQUIRED）——SERP 上多数竞品缺清晰表格，这是超越点。
- 全部内链回支柱页 `/what-is-mcp-server`，强化主题权威。
- 100% 带 AI Overview → 直接回答段写成可被 AI 引擎摘引的自足句子（配合已建的满配 Schema）。

## 文件

- `config.yaml` — 本轮配置
- `raw/mcp_broad_us_2026-07-23.csv` — 原始导出（只读证据）
- `keywords.csv` — 清洗打分后全量 1,151 词
- `clusters.csv` — 14 个集群汇总
- `serp-validation.csv` — 7 词真实 SERP 判读
- `content-map-validated.csv` — 页面映射（含已建/待建/放弃标注）
- `briefs/*.md` — 5 篇写作 brief
- `process.py` — 可复现的清洗聚类打分脚本
