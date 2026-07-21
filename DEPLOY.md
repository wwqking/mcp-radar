# 部署与持续更新（Vercel + 方案 A）

数据更新机制 = **每日 GitHub Actions 采集 → commit 快照 push → Vercel 自动部署**。
采集/快照持久化在 CI 做（有 git 写权限，趋势能累积），Vercel 靠 Git 自动部署上线。

```
GitHub Actions（每日 cron）
  └─ npm run collect  →  拉 registry+GitHub+npm，算分/分类，写 data/snapshots/当天.json
  └─ commit 快照 push 回仓库（趋势历史随仓库累积）
        └─ Vercel 监听 master push → 全新 build（已带最新快照）→ 上线
```

> 靠 Vercel 的 Git 自动部署触发，**不需要 Deploy Hook**。bot 每天 push 快照即自动部署。

## 一次性配置清单

### 1. 推代码到 GitHub

```bash
# 在 GitHub 建空仓库 mcp-radar 后：
git remote add origin git@github.com:<你>/mcp-radar.git
git push -u origin master
```

> `.env`（含 GITHUB_TOKEN）已被 `.gitignore` 挡住，不会上传。确认 `git status` 里看不到它。

### 2. Vercel 连接项目

1. Vercel → New Project → 导入这个 GitHub 仓库。
2. Framework 自动识别 Next.js，Build Command / Output 用默认即可。
3. **环境变量**（Project Settings → Environment Variables）：

   | 变量 | 值 | 说明 |
   |---|---|---|
   | `NEXT_PUBLIC_SITE_URL` | `https://www.mcpradars.com` | 规范域名（sitemap/canonical/schema 用） |
   | `NEXT_PUBLIC_DATA_SOURCE` | `live` | 读采集好的真实数据 |

   > **Vercel build 不再采集**：build 直接读仓库里 CI 提交的 `data/servers.json`（瞬时）。
   > 所以 Vercel 环境**不需要** `GITHUB_TOKEN` / `MCP_COLLECT_LIMIT`——采集只在 GitHub Actions 跑。
   > （兜底：万一 `data/servers.json` 缺失，build 会退回实时采集，此时才需要 token；正常流程不会。）

### 3. 绑定域名

Vercel → Project → Domains → 添加 `mcpradars.com`，勾选「Redirect apex to www」→
实际访问域名为 `www.mcpradars.com`（apex 301 跳 www）。DNS 按 Vercel 提示在域名商配。

### 4. 配 GitHub Secret（每日更新用）

仓库 → Settings → Secrets and variables → Actions：

| 类型 | 名称 | 值 |
|---|---|---|
| Secret | `MCP_GITHUB_TOKEN` | GitHub token（只读 public_repo），CI 采集用 |
| Variable | `MCP_COLLECT_LIMIT` | `40`（可选，默认 40） |

> 不需要 Deploy Hook——bot 每天 push 快照，Vercel 的 Git 自动部署会接管。

### 5. 部署触发方式（保持 Vercel Git 自动部署）

Vercel 默认监听 `master` push 自动 build，**保持开启即可**：
- 人工改代码 push → 自动部署 ✅
- 每日 workflow push 快照 → 自动部署（数据每日更新）✅

无需 Deploy Hook，无重复部署问题。

## 验证

- 手动触发一次：GitHub → Actions → 「每日采集与部署」→ Run workflow。
- 看 Actions 日志：应输出「采集完成 N 个 server」+「快照已更新并推送」+「已触发 Vercel 部署」。
- Vercel 部署完成后访问站点，确认数据是当天的。

## 上线后（SEO 冷启动）

- Google Search Console / Bing Webmaster：添加 `mcpradars.com`，提交 `sitemap.xml`。
- 这是设计文档强调的「第 1 天提交索引、把沙盒期用满」，越早越好。

## 本地手动采集（可选）

```bash
cp .env.example .env   # 填 GITHUB_TOKEN
npm run collect        # 只采集写快照，不 build
npm run build && npm start   # 本地看真实数据
```
