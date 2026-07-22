# MCP Radar

找到能用的 MCP server —— 按用途分类，标注哪个还活着。

基于 Next.js 14 App Router + TypeScript + Tailwind CSS 的公开前台。设计文档见上级目录 `mcp-radar.md` / `mcp-radar-frontend.md`。

## 开发

```bash
npm install
npm run dev   # http://localhost:3000
npm run build # 全站 SSG
```

## 结构

```
app/            页面（App Router）
  page.tsx      / 首页
  category/[cat]/  分类页（SEO 主力）
  server/[name]/   详情页（SEO 长尾 + schema.org）
  radar/        趋势雷达
  leaderboard/  质量榜
  graveyard/    MCP 墓地
  about/ newsletter/ sponsor/  信任与变现页
  sitemap.ts robots.ts
components/     TrustScore / LifecycleBadge / ServerCard / SearchBar / SignalRow 等
lib/            types.ts 数据类型 · data.ts mock 数据层
```

## 数据源（可切换）

数据层做了 provider 抽象，**引擎逻辑在本项目内实现，不依赖外部服务**。
页面只从 `lib/data.ts` import，不关心数据从哪来：

```
lib/constants.ts      客户端安全常量（CATEGORIES / LIFECYCLE_META / formatNumber）
lib/provider.ts       数据源契约（MCPDataProvider 接口）
lib/mock-provider.ts   mock：写死的演示数据（默认）
lib/live-provider.ts   live：用本项目采集器拉真实数据
lib/data.ts            按 NEXT_PUBLIC_DATA_SOURCE 选 provider（服务端专用）

lib/collector/        本项目内置「引擎」——构建期采集：
  curated.ts           知名 server 白名单（直采种子，见下）
  registry.ts          官方 MCP registry：拿 server 清单 + repo url + 包名
  github.ts            GitHub API 富化：stars / 提交活跃 / archived / license / 贡献者
  npm.ts               npm 富化：周下载量 + 发版频率
  score.ts             TrustScore 五维评分 + 生命周期判定（设计文档 §2）
  classify.ts          关键词自动分类（设计文档 §3）
  snapshots.ts         历史快照读写 + 周增量/趋势计算（见下）
  build-data.ts        编排：白名单+registry → 富化 → 打分 → 分类 → 排序 → 趋势
  cached-fetch.ts      磁盘缓存（.cache/），避开 GitHub 限流重复打

  dataset.ts           全量数据集读写（build 直接读，不再采集）

data/servers.json     采集好的全量 server 数据（CI 提交，build 直接读）
data/snapshots/       历史快照（提交进 git，趋势/diff 的数据基础）
```

> **build 不采集**：`npm run collect`（CI 每日跑）采集并写 `data/servers.json` + 快照，提交进 git。
> Vercel/本地 build 只**读** `data/servers.json`（瞬时），不重新拓 API——彻底避开 build 超时、
> 且 Vercel 无需 GITHUB_TOKEN。数据集缺失时才回退实时采集（兜底）。

**趋势 / 周增量**（`snapshots.ts`）：每次 live 采集写一份 `data/snapshots/YYYY-MM-DD.json`
（slug → stars/downloads）。下次采集读最近的旧快照做 diff：
- `starsWeeklyDelta`（雷达「爆火」榜）= 今天 stars − 上次 stars，按相隔天数折算成周增量。
- sparkline 趋势 = 历史各期 stars/downloads 序列（最多近 12 期）。
- 与 `.cache/`（gitignored 的 API 缓存）不同，快照**要提交进 git** 才能跨构建/CI 累积历史。
- 首次运行（无历史）：delta=0、sparkline 显示「无数据」，自动降级不报错。
- 想让趋势有意义，需**定期构建**（如每日 cron）让快照按天累积。

**采集策略**（`build-data.ts`）：白名单直采 + registry 补量，合并后**按 stars 降序取 top N**。
- 白名单（`curated.ts`）：实测知名官方 server（playwright/github/filesystem…）多数**不在**官方
  registry 里，靠内置 repo 清单直接富化保底优质数据。
- registry：补长尾（SEO 基数）。
- 排序：按真实 stars 降序，避免采到字母序开头的冷门项。

所有查询函数返回 Promise，页面/组件用 `await` 调用。

> ⚠️ **客户端组件只能从 `lib/constants.ts` import**（不能从 `data.ts`）——
> 后者透传了服务端采集器（用到 `node:fs`），进浏览器 bundle 会构建失败。

### 切到真实数据（live）

```bash
cp .env.example .env
# 编辑 .env：
#   NEXT_PUBLIC_DATA_SOURCE=live
#   GITHUB_TOKEN=<你的 token>    # 可选但建议：未认证 60/h，token 5000/h
#   MCP_COLLECT_LIMIT=40         # 先采少量，控制 GitHub 调用量
npm run build
```

采集在**构建期**跑一次，结果内置进 SSG 静态页；带磁盘缓存（`.cache/`），重复构建近乎瞬时。

> 冷缓存首次构建会触发整批网络采集，已在 `next.config.mjs` 把 `staticPageGenerationTimeout`
> 放宽到 300s。有 token 时约 25 个 server 冷构建 ~1 分钟，暖缓存 ~55s。

## SEO / GEO（已就绪）

- **域名**：集中在 `lib/site.ts`（`NEXT_PUBLIC_SITE_URL`，默认 `https://mcpradars.com`），
  sitemap / robots / canonical / schema / feed 全部引用它。
- **每页 metadata**：canonical + OpenGraph + Twitter card（`summary_large_image`）。
- **结构化数据**（`lib/schema.ts`）：全站 Organization + WebSite(SearchAction)；
  详情页 SoftwareApplication + BreadcrumbList；分类页 CollectionPage(ItemList)；指南 Article。
- **GEO**：
  - `robots.ts` 明确放行 GPTBot / ClaudeBot / PerplexityBot / Google-Extended 等 AI 爬虫。
  - `/llms.txt`（`app/llms.txt/route.ts`）：给 AI 引擎的站点地图 + 方法论 + 数据边界，含实时高分 server。
- **OG 图**：`app/opengraph-image.tsx` 用 next/og 代码生成的品牌图，全站默认。

## 变现 / 交互功能

- **订阅（真实生效）**：`/api/subscribe`（`app/api/subscribe/route.ts`）转发 Buttondown。
  配 `BUTTONDOWN_API_KEY` 才开启；未配返回 503，前端提示「订阅暂未开放」不假成功。
  客户端表单 `components/SubscribeForm.tsx`（加载/成功/错误态 + 蜜罐反爬）；
  内嵌位 `SubscribeInline`、newsletter 免费档直接订阅、Pro/团队档 `WaitlistCta` 收候补邮箱（`source` 打标区分入口）。
- **每页动态 OG 图**：`app/[locale]/server/[name]/opengraph-image.tsx`——带 server 名 + TrustScore 环 + 生命周期 + stars/下载，随详情页 SSG 各出一张（全站默认图仍是 `app/[locale]/opengraph-image.tsx`）。
- **复制安装命令**：详情页 `InstallCommandCard`（`lib/install.ts` 生成 `claude mcp add` / JSON 配置，多 tab + 一键复制）。
- **对比**：`/[locale]/compare?ids=a,b,c`（noindex 工具页）。详情页「加入对比」（`CompareButton`）→ 浮动对比栏（`CompareTray`，全局挂在 layout）→ 并排对比表（`CompareTable`）。状态存 localStorage（`lib/compare-store.ts`），跨页/刷新/多标签同步。

## 待办

- [ ] 扩充白名单 / 调大 `MCP_COLLECT_LIMIT` 铺更多长尾页面（当前 curated ~26 个 + registry 补量）
- [ ] 每日 cron 跑 `npm run build` 让快照按天累积（趋势/爆火才有真实历史）
- [ ] 上线后 Google/Bing Search Console 提交 sitemap，启动沙盒期倒计时
- [ ] 上线后在 Vercel env 配 `BUTTONDOWN_API_KEY` 开启订阅
- [ ] Pro/团队档的真正支付（Stripe）——目前只收候补邮箱
