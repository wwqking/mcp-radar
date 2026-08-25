# “Skills” 基础词 SEO 研究结论

研究日期：2026-07-28  
市场：美国 / 英文  
站点：MCP Radar  
解释范围：AI Agent Skills、Claude/Codex Skills、`SKILL.md`、安装、目录、兼容性与安全

## 一句话结论

这个词根值得做，但不能做成“再一个批量镜像 Skills 目录”。正确入口是：

1. 用 `/skills/` 承接 marketplace / directory 商业意图；
2. 用 Claude、Codex、安装、`SKILL.md`、创建指南承接明确任务；
3. 用“真实安装 + 客户端兼容 + 安全检查 + 固定任务测试”建立竞品没有的证据层；
4. 所有抓取来的详情页默认 `noindex`，达到“五占二”后再进入 sitemap。

## 数据结论

- `skills` 广泛匹配有 1,779,851 个词、约 2,115 万月搜索，但绝大多数是就业技能、软技能和游戏含义，不属于本站。
- 低 KD 视图仍有 25,445 个词；加入 Agent/Claude/Codex 等限定后得到 165 个候选、约 33,700 月搜索，但仍有明显歧义泄漏。
- 合并种子、三家竞品和上一轮已验证数据后，脚本处理 1,106 行，自动清洗留下 615 行；人工意图校正后，最终保留 96 个词、19 个 URL 级集群。
- 最终页面地图覆盖约 84,360 的 gross cluster volume。该数包含同义词重叠，只用于相对排期，不能视为独立用户数。

三家竞品的美国自然词快照：

| 竞品 | 排名词 | 预估自然流量 | 预估流量价值 |
|---|---:|---:|---:|
| skills.sh | 211 | 1.6K | $14.2K |
| skillsmp.com | 320 | 4.7K | $17.8K |
| agentskill.sh | 21 | 7 | $27 |

其中：

- `skills.sh` 的主要可见需求集中在品牌、`agent skills`、`npx skills` 和 Vercel 生态。
- `skillsmp.com` 对 `claude skills marketplace` 排名最强，说明 `/skills/` 必须优先满足目录筛选和商业调查，而不是长篇概念介绍。
- `agentskill.sh` 当前可见词很少，不能作为需求上限。

## SERP 裁决

| 查询 | 月量 / KD | SERP 判断 | URL 决策 |
|---|---:|---|---|
| `awesome-claude-skills` | 1,300 / 0 | 弱 | P0：做带真实任务测试的榜单 |
| `npx skills` | 1,000 / 28 | 中 | P0：安装指南，合并 add/download/path 词 |
| `codex skills` | 110 / 0 | 中 | P0：独立 Codex hub |
| `skill md` | 260 / 33 | 中 | P0：指南 + validator，不抢裸导航词 |
| `claude skills marketplace` | 2,900 / 69 | 中 | P0/P1：由 `/skills/` 统一承接 |
| `agent skills` | 4,400 / 52 | 强 | P1：权威解释页，必须有原创证据 |
| `claude skills` | 27,100 / 58 | 强 | P1：客户端 hub，不做单一巨型列表 |

Google 样本中，`agent skills` 和 `codex skills` 都出现 AI Overview；`claude skills marketplace` 的结果则几乎完全由 marketplace、directory 和 GitHub 构成。详细快照在 `serp-validation.csv`。

## 第一批页面

建议先做八个页面组，它们覆盖约 93.2% 的 gross mapped volume：

1. `/skills/claude-code/`
2. `/skills/`
3. `/what-are-agent-skills/`
4. `/guides/install-agent-skills/`
5. `/guides/create-agent-skill/`
6. `/skills/codex/`
7. `/skills/awesome-claude-skills/`
8. `/guides/skill-md/` + `/tools/skill-md-validator/`

接着做三个可验证的分类页：

- `/skills/categories/browser-automation/`
- `/skills/categories/code-quality/`
- `/skills/categories/documents/`

设计、数据、自动化等分类放到 Wave 1。详情页不按 sitemap 库存批量放量。

## A2 竞品模块桶裁决

保留：

- `skillsmp.com (home)`：虽然核心词纯度只有 21%，但形成了真实的 marketplace、品牌、安装和 creator-intent 需求。
- `skills.sh (home)`：纯度 17%，但集中出现 Agent Skills、CLI、Vercel 与目录生态词。
- `agentskill.sh (home)`：样本小，但仍是连贯的目录、标准与品牌词。

丢弃：

- `skillsmp.com /creators`：由 creator 详情页带来的语义杂物，没有形成可用主题。
- `skillsmp.com /skills`：包管理器、API、监控工具等偶然排名混在一起，不能据此建类目。

## A4 页面准入

当前 31 个实体候选中，**0 个详情页已经完成“五占二”验证**。这不是研究失败，而是必须保留的质量闸门。

允许直接规划索引的是 13 个 hub、guide 或 tool，因为它们已有明确需求、独立任务或第一方工具价值。详情页统一执行：

- 至少两类经过验证的独特证据；
- 必须有独立直接答案；
- 否则 `noindex` 且不进入 sitemap。

五类证据：

1. 验证过的安装命令；
2. 客户端兼容性实测；
3. 安全扫描、权限检查或 artifact hash；
4. 仓库健康信号；
5. 固定任务测试、真实故障复现或排错证据。

优先验证的详情候选是 Frontend Design、UI UX Pro Max、Humanizer、Playwright CLI、Superpowers 和 Remotion。完整 reject/noindex 清单在 `page-eligibility.csv` 和 `entities.csv`。

## Wave 0 队列实验

`wave0.csv` 已按技能规范设计为 66 项、8–12 周观察：

- 20 个有量实体；
- 20 个零量但有 supply/adoption 信号的实体；
- 10 个 client × skill 兼容性候选；
- 10 个真实故障候选；
- 5 个 category/client hub；
- 1 个可用的 `SKILL.md` validator。

注意：故障页目前都是“待复现队列”，没有任何一篇被当作已证实内容；client × skill 页如果 SERP 不独立，就合并进详情页或客户端 hub。

第 8 周比较索引率、每页非品牌曝光、进入前 20 比例、零曝光率、安装复制/外链点击、RPM、Active View 和维护成本。连续两个周期零曝光且零行为的页面合并或 `noindex`。

## 收益情景

90 天 AdSense 估算不是预测，只是把假设显式化：

| 情景 | CTR | 索引率 | 重叠系数 | 可变现份额 | RPM | 90 天收入 | 成本 | 净贡献 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| 低 | 2% | 50% | 0.75 | 75% | $8 | $11 | $1,800 | -$1,789 |
| 中 | 5% | 70% | 0.80 | 82% | $15 | $87 | $3,000 | -$2,913 |
| 高 | 9% | 85% | 0.85 | 88% | $25 | $362 | $5,200 | -$4,838 |

公式：

`gross monthly volume × 3 × CTR × index rate × overlap factor × monetizable share ÷ 1000 × RPM`

结论很直接：如果只看 90 天 AdSense，这个项目不应靠批量详情页回本。应先用高覆盖 hub、原创测试和工具验证索引与行为，再决定是否扩到 500 / 2,000 / 5,000 页。

## 计数漏斗

- 原始处理：1,106 keyword rows
- 自动清洗：615 candidates
- 最终人工校正：96 keywords / 19 clusters
- 实体候选：31
- 当前通过 A4 的实体详情：0
- 可规划索引的 hub / guide / tool：13
- 页面地图：28 行（20 index，8 conditional）
- Wave 0：66 项
- P0 关键词：25 行
- P0 内容 brief：6 份

## 待完成的验证

- 对头部实体执行沙箱安装、兼容性和固定任务测试；
- 解析 owner 不明确的 skill，并核对 canonical repository 与 license；
- 复现故障队列后才允许生成 troubleshooting 页面；
- 上线后用 GSC、Analytics 和 AdSense 的 cohort 数据替换本报告的 RPM 与 CTR 假设；
- `agentskill.sh` sitemap 抓取被工具误判为缺少 17 个子 sitemap，因此该站架构统计只能做方向性参考。

## 文件导航

- `keywords.csv`：最终关键词
- `clusters.csv`：URL 级意图集群
- `content-map.csv`：页面地图
- `serp-validation.csv`：Google US SERP 快照
- `entities.csv`：供给侧候选
- `page-eligibility.csv`：索引准入
- `wave0.csv`：66 项队列实验
- `coverage-curve.csv`：累计覆盖曲线
- `revenue-scenarios.csv`：三档收益模型
- `briefs/`：6 份 P0 内容 brief
