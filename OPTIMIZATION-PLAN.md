# MCP Radar 优化执行计划

> 建立日期：2026-07-28  
> 目标：先消除流量放大后的信任风险，再改善抓取、速度和转化基础，最后进入可持续内容增长与变现。

## 当前状态

本轮 P0/P1 代码优化已经完成并通过生产构建。需要外部账号、DNS 或长期内容生产的事项单独列在文末，避免把“代码已接入”和“线上已经生效”混为一谈。

## Phase 1：数据可信度止损 — 已完成

- [x] Official Registry 改为“本次 Registry API 明确验证”才展示，旧数据标记为等待重新验证
- [x] “仓库可审计”不再等于“存在可运行入口”
- [x] 保存任意 Registry package 的发布事实，不再只识别 npm
- [x] 将伪“issue 中位响应时间”改为真实可测的“近期 issue 获回复比例”
- [x] 重新计算旧数据的 TrustScore、生命周期和 verdict，避免等待下一次采集才纠偏
- [x] `active` 不再翻译成“适合生产”
- [x] 同一仓库包含多个 server 时，不再复用整仓 README 配置
- [x] 详情页来源只展示实际存在的 GitHub、npm、Registry 来源
- [x] 新增 `npm run validate:data` 数据质量门禁

当前 2026-07-28 数据快照验证结果：

- 817 条记录（本次新增 230 条）
- 704 条有可证明的 package 或 remote endpoint
- 371 条有近期 issue 回复率数据
- 663 条已带 Registry 验证日期，151 条已知不在 Registry，3 条宽限期旧记录等待重验
- 数据质量脚本通过

## Phase 2：内容与信任 — 已完成

- [x] 删除公开作者占位符，改成不过度背书的编辑团队说明
- [x] 方法论字段与实际评分代码对齐
- [x] 删除 1,247、1,200+、12 个生产案例等不可复核数字
- [x] 修正 Roots、安全边界、本地 stdio 和旧 HTTP/SSE 等错误表述
- [x] 删除未实现的会员墙，全部指南全文开放并可索引
- [x] 指南增加 `dateModified`，修正虚高阅读时间
- [x] Newsletter 示例改为当前真实 Radar 数据
- [x] 新增隐私政策、使用条款、编辑与赞助政策
- [x] About 和 Sponsor 邮箱改为可点击入口
- [x] 详情页新增免费认领/纠错 GitHub Issue 入口

## Phase 3：Schema、GEO 与索引 — 已完成

- [x] 删除伪 `AggregateRating` 和统一免费 `Offer`
- [x] TrustScore 改用有边界说明的 `PropertyValue`
- [x] Organization 修复 logo，增加稳定 `@id`、GitHub `sameAs` 和 `knowsAbout`
- [x] 删除不能落地的 `SearchAction`
- [x] WebSite/Organization 按语言输出
- [x] Article 增加发布日期、修改日期、图片和稳定 publisher
- [x] 榜单增加 `Dataset` schema
- [x] 新增 `/dataset.json` 可引用公开快照
- [x] 全部主要页面统一 en/zh/x-default hreflang
- [x] x-default 统一指向英文
- [x] sitemap 使用数据或内容的真实更新时间，不再每次构建伪造全站更新
- [x] sitemap 加入隐私、条款和编辑政策页
- [x] llms.txt 改为英文主入口，加入快照、引用方式、边界和直接 200 URL
- [x] 中文内容容器服务端输出 `lang="zh-CN"`，响应增加 `Content-Language`

## Phase 4：性能与移动体验 — 已完成

- [x] 搜索数据从完整 `MCPServer[]` 缩减为 5 字段索引
- [x] 搜索索引由布局级 Provider 只序列化一次
- [x] 桌面/移动导航共用一个响应式 SearchBar
- [x] 搜索加入精确名称、前缀、tagline、生命周期和 TrustScore 相关性排序
- [x] 全局导航关闭低价值 Next Link 预取
- [x] 移动端语言、主题和导航点击区域增至约 44px
- [x] 修复英文首页中文句号
- [x] 相似 server 增加类别、关键词、部署形态和分数相近度，不再只按大类分数
- [x] 删除 Radar 中不可用的“上周/历史”假切换

体积验证：

| 页面 | 优化前原始 HTML | 优化后原始 HTML | 变化 |
|---|---:|---:|---:|
| 英文首页 | 1,994,269 B | 255,011 B | -87.2% |
| About | 约 1.9 MB | 172,615 B | 约 -91% |
| Server 详情 | 约 1.92 MB | 221,122 B | 约 -88% |
| 指南 | 约 1.9 MB | 166,477 B | 约 -91% |

## Phase 5：转化与安全基础 — 已完成代码接入

- [x] 全站接入 Google Tag Manager 容器 `GTM-M27PF8G6`
- [x] 现有转化事件同步推送到 GTM `dataLayer`
- [x] 搜索结果点击事件
- [x] 安装命令复制事件
- [x] GitHub/npm 出站事件
- [x] Newsletter 成功、重复订阅和错误事件
- [x] Pro/Team waitlist 展开与来源事件
- [x] Sponsor 联系和厂商认领事件
- [x] Subscribe API 增加请求体限制、蜜罐和基础限流
- [x] 增加 HSTS、nosniff、X-Frame-Options、Referrer-Policy、Permissions-Policy

## 验证结果

- [x] `npx tsc --noEmit`
- [x] `npm run validate:data`
- [x] `npm run build`
- [x] 1,795 个静态页面生成成功
- [x] 首页、About、详情、指南、隐私政策、dataset、llms.txt、sitemap 本地生产响应均为 200
- [x] 详情页无 `AggregateRating`、无 `SearchAction`
- [x] hreflang 和 x-default 已输出
- [x] 安全响应头已输出
- [x] `git diff --check` 通过

项目当前没有 ESLint 配置或依赖，`npm run lint` 会进入 Next.js 的交互式初始化，因此本轮不自动安装依赖；TypeScript 与 Next 生产构建均已通过。

## 需要外部配置后才能真正生效

### 上线前

- [x] 已运行新的 `npm run collect`，写入 Registry verification date 和新的 issue 回复率字段
- [x] 公开联系邮箱已统一改为 `wangknit@gmail.com`，当前阶段不再依赖域名邮箱 MX
- [x] 本地环境已确认配置 `BUTTONDOWN_API_KEY`
- [ ] 部署后完成一次真实双重确认订阅测试
- [x] 已创建 GA4 `MCP Radar` 媒体资源与 `https://www.mcpradars.com` 网站数据流（衡量 ID：`G-PJXVHP38XQ`）
- [x] GTM 容器已发布 Google Tag，并为 Search、Install Copy、Subscribe、Waitlist、Sponsor、Claim 等 8 个 `dataLayer` 自定义事件建立动态 GA4 Event 标签（Version 3）
- [ ] 部署当前版本；线上 `/dataset.json`、政策页目前仍返回 404，说明线上仍是旧构建
- [ ] 部署后验证 CSP 兼容性，再从 Report-Only 逐步启用正式 CSP

### 30 天增长计划

- [ ] 发布第一份带数据快照和方法的 MCP Ecosystem Health Report
- [ ] 建立真实 Newsletter 公开归档，至少连续发布 4 期
- [ ] 完成 3 个可靠性榜单、3 个 alternatives、3 个静态对比、3 个错误解决页
- [ ] 给核心指南补 MCP 官方一手引用和“最后核验日期”
- [ ] 把 `misc` 大类拆成更有搜索和商业价值的二级分类
- [ ] 争取前 20 个项目维护者完成页面认领并从 README 链回

### 90 天变现门槛

- [ ] 能按 landing page 计算订阅、出站和赞助询盘转化
- [ ] 至少 12 期真实 Newsletter 归档
- [ ] 至少 20 个验证厂商认领
- [ ] 至少 10 个来自维护者、社区或媒体的有效外链
- [ ] 完成 2–3 个 Founding Sponsor 试单
- [ ] Watchlist/alerts 有真实活跃用户后，再决定是否开发 Pro 支付
- [ ] 展示广告保持最后测试，不牺牲速度、信任和邮件转化

## 仍需继续改进但不阻塞本轮上线

- 根 `<html>` 仍使用默认 `lang="en"`；中文内容容器与响应头已经正确标注。若要根节点也完全精确，需要重构为多 root layout/route group。
- CSP 尚未正式启用，因为主题初始化使用内联脚本，且可选统计域名需要先确定。
- 44 个程序化落地页仍需要更深的真实安装、版本、截图和故障内容。
- 品牌仍缺真实个人作者/技术审校者和独立第三方提及；不能通过代码自动补齐。
- 当前使用 Gmail 接收联系邮件；若未来切回 `@mcpradars.com` 发信或收信，再配置 MX、SPF、DKIM、DMARC。
