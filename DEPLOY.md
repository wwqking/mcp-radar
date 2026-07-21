# 部署与持续更新（Vercel + 方案 A）

数据更新机制 = **每日 GitHub Actions 采集 → commit 快照 → 触发 Vercel 部署**。
采集/快照持久化在 CI 做（有 git 写权限，趋势能累积），Vercel 只负责 build + 上线。

```
GitHub Actions（每日 cron）
  └─ npm run collect  →  拉 registry+GitHub+npm，算分/分类，写 data/snapshots/当天.json
  └─ commit 快照回仓库（趋势历史随仓库累积）
  └─ 触发 Vercel Deploy Hook
        └─ Vercel 全新 build（此时仓库已带最新快照）→ 上线
```

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
   | `NEXT_PUBLIC_SITE_URL` | `https://mcpradars.com` | 域名（sitemap/canonical/schema 用） |
   | `NEXT_PUBLIC_DATA_SOURCE` | `live` | 用真实采集数据 |
   | `GITHUB_TOKEN` | `ghp_...` | Vercel build 时也要采集，需 token（只读 public_repo） |
   | `MCP_COLLECT_LIMIT` | `40` | 采集数量 |

   > 注意：Vercel build 也会跑采集（因为页面 SSG 时调采集器）。所以 Vercel 环境同样需要
   > `GITHUB_TOKEN`。它和 CI 里的 token 可以是同一个，但**分别**配在两处 Secret。

### 3. 绑定域名

Vercel → Project → Domains → 添加 `mcpradars.com`，按提示在域名服务商配 DNS。

### 4. 创建 Vercel Deploy Hook

Vercel → Project Settings → Git → Deploy Hooks → Create Hook（分支 `master`）→ 复制 URL。

### 5. 配 GitHub Secrets / Variables

仓库 → Settings → Secrets and variables → Actions：

| 类型 | 名称 | 值 |
|---|---|---|
| Secret | `MCP_GITHUB_TOKEN` | GitHub token（只读 public_repo），CI 采集用 |
| Secret | `VERCEL_DEPLOY_HOOK` | 第 4 步复制的 Deploy Hook URL |
| Variable | `MCP_COLLECT_LIMIT` | `40`（可选，默认 40） |

### 6. 关掉 Vercel 对 bot commit 的重复构建（重要）

默认 Vercel 会监听**每次 git push** 自动 build。而我们的 bot 每天 push 快照 → 会触发一次 Vercel
自动 build，Deploy Hook 又触发一次 → **重复部署**。二选一：

- **推荐**：Vercel → Settings → Git → 关闭 "Automatic deployments from Git"（或用 `vercel.json`
  的 `git.deploymentEnabled: false`），只靠 Deploy Hook 部署。这样人工改代码 push 时手动触发或
  也走 Hook。
- 或者：保留自动部署，删掉 workflow 里「触发 Vercel 部署」那一步（靠 bot push 快照自动触发 Vercel）。
  缺点是人工改代码时也会各触发一次，且无法控制部署时机。

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
