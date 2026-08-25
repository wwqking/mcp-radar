# MCP Radar SEO 关键词复跑审计

> 审计日期：2026-07-28  
> 审计对象：当前 Next.js 项目、`data/servers.json`、`research/mcpradars/seo/` 与 `research/mcpradars/seo-r3/`  
> 数据市场：United States / English  
> 关键词证据日期：2026-07-23～2026-07-25  
> 站点数据快照：2026-07-27

## 结论

当前项目不应该继续批量扩 `/servers/*` 程序化落地页。44 个工具型落地页已经覆盖既定 W1 的有效范围，下一轮最有价值的增长点是：

1. 发布已有研究支持的 5 篇静态概念对比；
2. 发布 2 篇高意图错误解决页；
3. 建 3 篇以真实目录数据为证据的 best-of 内容；
4. 扩写现有安全指南，而不是再建一个重叠页面；
5. 先修 Linear 落地页的“无可运行入口”问题，并完成 Registry 重新验证。

`/skills` 已决定迁往独立站，`/clients` 与 W2/W3 程序化落地页也已在当前项目 README 中明确不做。本报告不把这些已排除模块重新列为本站待办。

## 本轮输入与边界

本轮使用仓库内最近一轮 Semrush、竞品、SERP 与内容映射数据重新核对当前实现，没有重新拉取 Semrush，也没有重新执行完整的美国区 Google SERP 验证。因此：

- 搜索量与 KD 适合做当前执行排序，不应视为 2026-07-28 的实时排名数据；
- 发布前只需对本报告 P0 主题重新抽查 SERP，不需要重跑全部 10,149 个关键词；
- “合并搜索量”是关键词池的需求规模，不等于可获得流量或不同用户的去重总量。

## 当前关键词承接资产

| 资产 | 当前数量 | 判断 |
|---|---:|---|
| MCP server 数据记录 | 587 | 足够支撑目录、榜单和原创数据内容 |
| 带 remote endpoint 的 server | 350 | `/remote-mcp-servers` 已有真实数据支撑 |
| 工具型 SEO 落地页 | 44 | 目标 server 全部存在；不建议继续批量扩张 |
| 英文/中文落地 URL | 88 | hreflang、canonical、sitemap 已覆盖 |
| 指南 | 6 | 内容规模偏小，静态对比和故障内容尚未落地 |
| 支柱页 | 1 | `/what-is-mcp-server` 已承担核心定义和内链入口 |
| 静态概念对比页 | 0 | 现有 `/compare` 是 noindex 的动态工具页，不承接概念词 |
| 错误解决页 | 0 | 当前最大的新增长缺口 |

44 个落地页中：

- 44/44 的目标 server 都能在当前数据集中找到；
- 43/44 有 package 或 remote endpoint；
- `linear-mcp` 当前没有 package 或 remote endpoint，页面却仍以 Setup/Config 为主要搜索承诺；
- 当前 587 条记录都处于 Official Registry 待重新验证状态，发布或宣传前应先跑一次新的采集。

## 对第三轮 W1 的重新判定

第三轮原计划包含 25 个 W1 工具目标。当前实现中，24 个已经按实体语义覆盖：

- `sequential thinking mcp` 使用 `/servers/sequential-thinking-mcp-server`，比旧计划的 `/servers/sequential-mcp-server` 更准确；
- `brave search mcp` 使用 `/servers/brave-search-mcp-server`，比旧计划的 `/servers/brave-mcp-server` 更准确；
- 其余 22 个使用原计划 URL；
- `google drive mcp` 不应使用现有 Google Analytics server 建页。

### Google 实体错配

旧内容映射把 `google drive mcp` 及相关 Google 词合并为 14,440/月，并把 `google-analytics-mcp` 当作可承接 server。这是实体错配：

| 主题 | 本地关键词证据 | 当前真实资产 | 决策 |
|---|---:|---|---|
| Google Drive MCP | 主词 1,000/月，KD 64；旧合并量 14,440/月 | 没有已核验的 Google Drive 对应落地资产 | 暂不建 |
| Google Analytics MCP | 主词 480/月，KD 30 | `/servers/google-analytics-mcp-server` | 保留 |

硬规则：页面主实体、目标 server 和安装能力必须一致。不能为了高量词把 Google Analytics 写成 Google Drive，也不能把 14,440 的旧合并量归因给当前 Google Analytics 页面。

## P0 关键词机会

### 1. 错误解决内容

| 主主题 | 关键词需求 | Volume | KD | 建议 URL | 决策 |
|---|---|---:|---:|---|---|
| Cursor `spawn npx ENOENT` | `cursor mcp spawn npx enoent` | 1,600 | 24 | `/guides/cursor-mcp-spawn-npx-enoent` | 新建 |
| MCP request timed out | `mcp error -32001: request timed out` 等 | 260 | 0 | `/guides/mcp-error-32001-request-timed-out` | 新建 |

两页都应包含：

- 错误含义的一句话直接答案；
- Windows/macOS/Linux 分支诊断；
- Node/npx、PATH、客户端重启、server 启动命令的验证步骤；
- 可复制的最小配置与命令；
- “仍未解决”诊断树；
- 链到 Claude Code 配置指南和相关 server 健康页。

这类词的用户已经在安装或使用 MCP，意图比泛定义词更接近产品核心行为。

### 2. 静态概念对比

本地第三轮关键词池中，以下选定变体原始搜索量合计约 4,440/月，KD 10～32：

| 页面 | 主要意图 | 状态 |
|---|---|---|
| `/compare/mcp-vs-rag` | MCP 与 RAG 的边界和组合方式 | brief 已有，页面未建 |
| `/compare/mcp-resources-vs-tools` | Resource、Tool 的差异与选择 | brief 已有，页面未建 |
| `/compare/mcp-vs-a2a` | 工具协议与 agent-to-agent 协议 | brief 已有，页面未建 |
| `/compare/mcp-vs-cli` | 标准协议与 CLI 调用方式 | brief 已有，页面未建 |
| `/compare/mcp-vs-function-calling` | MCP 与模型函数调用的关系 | brief 已有，页面未建 |

现有 `/compare?ids=...` 是 server 对比工具且明确 `noindex`，与上面的静态内容不是同一搜索意图。建议保留工具页 noindex，新增 `/compare/[slug]` 可索引文章路由，并把 5 篇页面加入 sitemap。

每篇至少需要：

- 开头 40～60 词直接回答；
- 原创对比表；
- “什么时候选 A / B / 两者一起用”决策块；
- 一个准确的调用流程图或架构图；
- 官方一手来源和最后核验日期；
- FAQ、Article 与 Breadcrumb schema。

### 3. Best-of 决策内容

| 内容集群 | 关键词需求 | 合并 Volume | KD | 建议 |
|---|---|---:|---:|---|
| Sales & Marketing MCP servers | `best mcp servers for business sales marketing` | 2,900 | 13 | SERP 复核后建一篇数据型榜单 |
| Claude Code MCP servers | 3 个主要变体 | 460 | 10～18 | 建一篇按任务与风险分组的榜单 |
| Cursor MCP servers | 4 个主要变体 | 460 | 0～19 | 建一篇按开发工作流分组的榜单 |

Sales & Marketing 的关键词措辞不自然，发布前必须先复核 SERP 与真实意图；如果 SERP 实际拆成 sales、marketing、business 三种需求，应拆成两个更自然的主题，而不是机械照抄关键词作标题。

Best-of 页面不能只是现有卡片的重排。至少加入：

- 快照日期、样本量和筛选方法；
- 官方/社区、local/remote、权限范围、可审计性对比；
- 适用任务、限制和淘汰理由；
- 可复核的 TrustScore 字段与来源链接；
- “最佳”只对明确场景成立的边界说明。

## P1 机会

### 扩写现有安全指南

安全相关词合计约 940/月，KD 24～30：

- `mcp security architecture`
- `mcp security best practices`
- `mcp server security`
- `mcp server security best practices`

当前已有 `/guides/mcp-security-red-lines`。应扩写这一个页面，并让 title、H1、导语和章节覆盖 security best practices / architecture；不要再建一个内容高度重叠的安全页。

建议新增：

- host → client → server → external system 的信任边界图；
- 本地 stdio、self-hosted HTTP、third-party remote 的威胁模型；
- 最小权限、凭据、prompt injection、供应链、日志与撤销检查表；
- 官方规范和安全公告的一手引用；
- 页面最后核验日期。

### 现有 44 个落地页的质量升级

继续加页之前，先给高价值页面补真实证据：

- 实际安装与验证日期；
- 支持客户端与平台；
- 常见失败模式和排错；
- package/remote endpoint 的可运行状态；
- server 版本、来源与数据快照；
- 由健康数据页反向链接到对应 Setup 页。

优先处理 `linear-mcp`：在出现可运行 package 或 remote endpoint 前，移除不能兑现的安装承诺，或对该落地页暂时 noindex。

## 关键词蚕食与信息架构

### `/server/*` 与 `/servers/*`

当前双页面架构可以保留，但必须持续区分：

| 页面 | 唯一意图 |
|---|---|
| `/servers/{tool}-mcp-server` | What / Setup / Config / FAQ |
| `/server/{registry-slug}` | 实时健康、来源、采用度、生命周期与 TrustScore |

当前 Setup 页会链向健康数据页；建议在健康数据页增加反向链接。两页 canonical 继续指向自己，title、H1、首段和 schema description 不要复制。

### `/compare`

- `/compare?ids=...`：交互工具，继续 noindex；
- `/compare/[slug]`：静态概念文章，可索引；
- 两者在导航和面包屑中使用不同名称，避免用户和搜索引擎把它们当作同一产品。

### `/skills`、`/clients` 与 W2/W3

- Skills 研究资产保留在 `seo-r3/`，迁往独立站；
- `/clients` 与 W2/W3 批量落地页按当前产品决策不做；
- 如果未来改变决策，应先修改 README 中的产品边界，再重新做模块级 SERP 验证，不要直接恢复 107 个旧 target URL。

## 4 周执行顺序

### Week 1

1. 重新采集数据，完成 Official Registry 重新验证；
2. 修正或 noindex Linear Setup 页；
3. 发布 ENOENT 与 `-32001` 两篇错误解决页；
4. 对 5 个对比主题和 Sales & Marketing 主题抽查美国区 SERP。

### Week 2

1. 发布 `mcp-vs-rag`；
2. 发布 `mcp-resources-vs-tools`；
3. 发布 Claude Code 和 Cursor 两篇 best-of；
4. 给健康详情页增加 Setup 页反向链接。

### Week 3

1. 发布 `mcp-vs-a2a`；
2. 发布 `mcp-vs-cli`；
3. 扩写安全指南；
4. 为前 10 个高价值落地页补安装核验和故障内容。

### Week 4

1. 发布 `mcp-vs-function-calling`；
2. 根据 SERP 复核结果发布或放弃 Sales & Marketing 榜单；
3. 在 Search Console 建立页面组，分别追踪 Setup、Compare、Errors、Best-of；
4. 依据 impression、CTR、安装复制和 newsletter 转化决定下一批，而不是按旧 129 页清单继续铺量。

## 质量门禁

新内容进入 sitemap 前必须满足：

- 主实体和真实 server 一致；
- 页面承诺的安装方式当前可运行；
- 有直接答案、原创判断和一手来源，不是关键词换皮；
- 无另一个页面承接相同主意图；
- canonical、hreflang、OG、Article/FAQ/Breadcrumb schema 正确；
- 标明数据或内容的最后核验日期；
- 英文页先完成，美国市场验证后再本地化中文；
- 发布后记录 Search Console query 与转化事件。

## 验证

本轮已执行：

- `npm run validate:data`：通过；
- `npx tsc --noEmit`：通过；
- 44 个 SEO 落地页目标 server 存在性检查：通过；
- 可运行入口检查：43/44 通过，Linear 为唯一例外。

