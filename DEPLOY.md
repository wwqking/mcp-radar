# 部署与持续更新（Cloudflare Workers Builds）

生产环境使用 Cloudflare Workers + OpenNext。GitHub 仓库与 Worker 直接连接，push 到 `master` 后由 Workers Builds 自动构建和发布。

```text
人工 push 代码到 master
  └─ Cloudflare Workers Builds
       └─ npm run deploy
            ├─ opennextjs-cloudflare build
            └─ opennextjs-cloudflare deploy

GitHub Actions 每日采集
  └─ npm run collect
       └─ commit data/ 并 push master
            └─ 触发同一条 Cloudflare 自动部署链路
```

## 生产目标

- Cloudflare 账户 ID：`c761ce097f5d90ecc01ed8dff5f1acab`
- Worker：`mcp-radar`
- 生产分支：`master`
- 生产域名：`https://www.mcpradars.com`
- 备用域名：`https://mcpradars.com`
- Workers.dev：`https://mcp-radar.wangknit.workers.dev`

Worker 名、路由、兼容性日期和静态资产绑定均在 `wrangler.jsonc` 内版本化。

## Workers Builds 配置

Cloudflare Dashboard → Workers & Pages → `mcp-radar` → Settings → Builds：

| 配置 | 值 |
|---|---|
| Git repository | `wwqking/mcp-radar` |
| Production branch | `master` |
| Root directory | `/` |
| Build command | 留空 |
| Deploy command | `npm run deploy` |
| Non-production deploy command | `npm run upload` |

Build Variables and secrets：

| 名称 | 类型 | 值 / 说明 |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Variable | `https://www.mcpradars.com` |
| `NEXT_PUBLIC_DATA_SOURCE` | Variable | `live` |
| `NEXT_PUBLIC_GTM_ID` | Variable | `GTM-M27PF8G6` |
| `BUTTONDOWN_API_KEY` | Secret | 从 Buttondown 取得，不得提交到 Git |

Workers Builds 会在 Cloudflare 侧自动管理部署凭据，不需把 `CLOUDFLARE_API_TOKEN` 放进 GitHub Secrets。

## 日常发布

```bash
git add <files>
git commit -m "feat: ..."
git push origin master
```

push 成功后，Cloudflare 会在 GitHub commit 上回写 build check。只有 `master` 的成功构建会提升为生产版本；其他分支使用 `npm run upload` 上传预览版本，不覆盖生产。

## 每日数据更新

`.github/workflows/daily-update.yml` 每天执行一次：

1. 运行 `npm run collect`。
2. 如果 `data/` 有变化，提交数据集与快照。
3. push 回 `master`。
4. Workers Builds 自动发布新数据。

采集仍需 GitHub 仓库中的 `MCP_GITHUB_TOKEN` secret，及可选的 `MCP_COLLECT_LIMIT` / `MCP_NEW_SERVER_LIMIT` / `MCP_MISSING_GRACE_RUNS` variables。

## 本地手动发布（兜底）

```bash
npx wrangler auth activate mcp-radar-cloudflare
npm run deploy
```

这条路径仅用于 CI 故障或紧急修复。正常情况下应该通过 `master` push 发布，确保生产版本与 Git 可追溯。

## 验证

```bash
curl -I https://www.mcpradars.com/en
curl -sS --compressed https://www.mcpradars.com/en \
  | rg 'ca-pub-5972123080217605'
```

发布后应同时检查：

- Cloudflare build 状态为 Success。
- `www.mcpradars.com` 返回 HTTP 200。
- 页面 HTML 包含当前 AdSense client ID。
- `/dataset.json` 与 `/sitemap.xml` 可访问。
