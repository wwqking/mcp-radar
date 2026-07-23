// 独立采集脚本 —— 供 CI 每日跑：采集 registry+GitHub+npm，算分/分类，写当天快照。
// 不跑 next build，只产出 data/snapshots/YYYY-MM-DD.json（趋势/diff 的数据基础）。
//
// 用法：npm run collect
// 依赖 .env 里的 GITHUB_TOKEN + MCP_COLLECT_LIMIT（CI 里用 GitHub Secrets 注入）。

import { collectServers } from "../lib/collector/build-data";

async function main() {
  const limit = Number(process.env.MCP_COLLECT_LIMIT ?? 300);
  console.log(`[collect] 开始采集，limit=${limit}，token=${process.env.GITHUB_TOKEN ? "有" : "无（限流 60/h）"}`);

  const start = Date.now();
  const servers = await collectServers(limit);
  const secs = ((Date.now() - start) / 1000).toFixed(1);

  const byLifecycle = servers.reduce<Record<string, number>>((acc, s) => {
    acc[s.lifecycle] = (acc[s.lifecycle] ?? 0) + 1;
    return acc;
  }, {});

  console.log(`[collect] 完成：${servers.length} 个 server，用时 ${secs}s`);
  console.log(`[collect] 生命周期分布：`, byLifecycle);
  console.log(`[collect] 快照已写入 data/snapshots/（collectServers 内部）`);

  // 明确退出，避免任何遗留句柄卡住 CI
  process.exit(0);
}

main().catch((err) => {
  console.error("[collect] 采集失败：", err);
  process.exit(1);
});
