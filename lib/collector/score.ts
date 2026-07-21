// TrustScore 五维评分 + 生命周期判定。忠实设计文档 §2。
//
// 五维权重：维护 30% / 采用 25% / 可用 20% / 健康 15% / 社区 10%
// 采用度里 GitHub stars 权重高于 npm 下载（很多 server 走 npx/直装，npm 低估真实采用）。

import type { HealthSignals, Lifecycle, ScoreBreakdown } from "../types";

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

/** 对数缩放：把「越多越好但边际递减」的量（stars/下载）映射到 0-100 */
function logScore(value: number, midpoint: number): number {
  if (value <= 0) return 0;
  // value == midpoint 时约 70 分
  return clamp((Math.log10(value + 1) / Math.log10(midpoint + 1)) * 70);
}

export function computeBreakdown(sig: HealthSignals): ScoreBreakdown {
  // ---- 维护活跃度 30% ----
  let maintenance = 0;
  if (sig.archived) {
    maintenance = 5;
  } else {
    const commitRecency =
      sig.lastCommitDaysAgo === null
        ? 30
        : sig.lastCommitDaysAgo <= 14
          ? 100
          : sig.lastCommitDaysAgo <= 30
            ? 85
            : sig.lastCommitDaysAgo <= 90
              ? 60
              : sig.lastCommitDaysAgo <= 180
                ? 35
                : 10;
    const commitVolume = sig.commits90d === null ? 40 : clamp((sig.commits90d / 60) * 100);
    const issueResp = sig.issueResponseDays === null ? 20 : sig.issueResponseDays <= 3 ? 100 : sig.issueResponseDays <= 7 ? 70 : 45;
    maintenance = clamp(commitRecency * 0.5 + commitVolume * 0.3 + issueResp * 0.2);
  }

  // ---- 采用度 25%（stars 权重 > 下载）----
  const starsScore = logScore(sig.stars, 5000);
  const dlScore = sig.npmWeeklyDownloads === null ? starsScore : logScore(sig.npmWeeklyDownloads, 30000);
  const releaseScore = sig.releaseFrequencyPerMonth === null ? 40 : clamp((sig.releaseFrequencyPerMonth / 3) * 100);
  const adoption = clamp(starsScore * 0.55 + dlScore * 0.3 + releaseScore * 0.15);

  // ---- 可用性 20% ----
  let usability = 0;
  usability += sig.inOfficialRegistry ? 45 : 0;
  usability += sig.hasRunnableEntry ? 35 : 0;
  usability += sig.repoAuditable ? 20 : 0;
  usability = clamp(usability);

  // ---- 健康度 15% ----
  const licenseScore = sig.license ? 100 : 30;
  const issueBacklog =
    sig.openIssues === null ? 60 : sig.openIssues <= 20 ? 100 : sig.openIssues <= 60 ? 70 : 45;
  const health = clamp(licenseScore * 0.5 + issueBacklog * 0.5);

  // ---- 社区信号 10% ----
  const contribScore = sig.contributors === null ? 30 : clamp((sig.contributors / 40) * 100);
  const forkScore = logScore(sig.forks ?? 0, 500);
  const community = clamp(contribScore * 0.6 + forkScore * 0.4);

  return { maintenance, adoption, usability, health, community };
}

export function computeTrustScore(b: ScoreBreakdown): number {
  return clamp(
    b.maintenance * 0.3 + b.adoption * 0.25 + b.usability * 0.2 + b.health * 0.15 + b.community * 0.1,
  );
}

/** 生命周期判定（设计文档 §2） */
export function computeLifecycle(sig: HealthSignals): Lifecycle {
  if (!sig.repoAuditable) return "unverifiable"; // 纯 remotes 型，无仓库可审计
  if (sig.archived) return "dead";
  const stale = sig.lastCommitDaysAgo !== null && sig.lastCommitDaysAgo > 180;
  const noResponse = sig.issueResponseDays === null;
  const noRelease = (sig.releaseFrequencyPerMonth ?? 0) === 0;
  if (stale && noResponse && noRelease) return "dying";
  return "active";
}

/** 一句策展判断 */
export function computeVerdict(lifecycle: Lifecycle, sig: HealthSignals): string {
  switch (lifecycle) {
    case "active":
      return "✅ 活跃维护，适合生产";
    case "dying":
      return `⚠️ 已 ${sig.lastCommitDaysAgo ?? "半年+"} 天未更新，issue 响应弱，谨慎用于生产`;
    case "dead":
      return "⛔ 仓库已 archived，作者停止维护，别装";
    case "unverifiable":
      return "⚪ 纯远程服务、无开源仓库，无法审计其行为，谨慎授权权限";
  }
}
