// GitHub 富化 —— registry 只给 repo url，健康数据全在这里拿。
// 端点：GET /repos/{o}/{r}（stars/archived/pushed_at/license/forks/open_issues）
//       GET /repos/{o}/{r}/commits?since=（90 天提交数、最近提交）
//       GET /repos/{o}/{r}/contributors（贡献者数）
//
// 认证：读 GITHUB_TOKEN（未认证 60/h，token 5000/h）。"先采少量" 下未认证也够。

import { cachedGetJson } from "./cached-fetch";

const GH = "https://api.github.com";

function ghHeaders(): Record<string, string> {
  const token = process.env.GITHUB_TOKEN;
  const h: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "mcp-radar-collector",
  };
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

interface RepoResponse {
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  archived: boolean;
  pushed_at: string;
  license: { spdx_id?: string; name?: string } | null;
}

export interface GithubHealth {
  /** 仓库 description，用作白名单种子的 tagline/描述兜底 */
  description: string | null;
  stars: number;
  forks: number;
  openIssues: number;
  archived: boolean;
  lastCommitDaysAgo: number | null;
  commits90d: number | null;
  contributors: number | null;
  license: string | null;
  /** issue 中位响应天数；null = 无法计算 / 无响应 */
  issueResponseDays: number | null;
}

function daysBetween(iso: string, now = Date.now()): number {
  return Math.max(0, Math.round((now - new Date(iso).getTime()) / 86400000));
}

function isoDaysAgo(days: number): string {
  return new Date(Date.now() - days * 86400000).toISOString();
}

/** 富化单个仓库的健康信号。任何子请求失败都降级为 null，不中断整批。 */
export async function fetchGithubHealth(owner: string, repo: string): Promise<GithubHealth | null> {
  const headers = ghHeaders();
  const repoRes = await cachedGetJson<RepoResponse>(`${GH}/repos/${owner}/${repo}`, headers);
  if (!repoRes.ok || !repoRes.data) {
    return null; // repo 不存在 / 私有 / 限流 → 无法审计，交上层处理
  }
  const r = repoRes.data;
  const since = isoDaysAgo(90);

  // 三个二级请求彼此独立，并发拉取（提速关键）
  const [commitsRes, contribRes, issuesRes] = await Promise.all([
    cachedGetJson<Array<{ commit: { committer?: { date?: string } } }>>(
      `${GH}/repos/${owner}/${repo}/commits?since=${since}&per_page=100`,
      headers,
    ),
    cachedGetJson<Array<unknown>>(
      `${GH}/repos/${owner}/${repo}/contributors?per_page=30`,
      headers,
    ),
    cachedGetJson<Array<{ created_at: string; comments: number; pull_request?: unknown }>>(
      `${GH}/repos/${owner}/${repo}/issues?state=all&per_page=30&sort=created&direction=desc`,
      headers,
    ),
  ]);

  // 90 天提交数 + 最近提交
  let commits90d: number | null = null;
  let lastCommitDaysAgo: number | null = null;
  if (commitsRes.ok && Array.isArray(commitsRes.data)) {
    commits90d = commitsRes.data.length;
    const latest = commitsRes.data[0]?.commit?.committer?.date;
    if (latest) lastCommitDaysAgo = daysBetween(latest);
  }
  if (lastCommitDaysAgo === null && r.pushed_at) lastCommitDaysAgo = daysBetween(r.pushed_at);

  // 贡献者数（近似：一页长度，30+ 视为社区规模足够）
  let contributors: number | null = null;
  if (contribRes.ok && Array.isArray(contribRes.data)) contributors = contribRes.data.length;

  // issue 响应：用「有评论的 issue 占比」粗估响应性
  let issueResponseDays: number | null = null;
  if (issuesRes.ok && Array.isArray(issuesRes.data)) {
    const responded = issuesRes.data.filter((i) => !i.pull_request && i.comments > 0);
    // 无法直接拿首评时间（需再打评论接口，成本高）；用「有评论的 issue 占比」粗估响应性：
    // 有响应的 issue 越多，给一个较小的响应天数；全无响应给 null。
    if (responded.length > 0) {
      const ratio = responded.length / Math.max(1, issuesRes.data.filter((i) => !i.pull_request).length);
      issueResponseDays = ratio >= 0.6 ? 2 : ratio >= 0.3 ? 5 : 9;
    } else {
      issueResponseDays = null;
    }
  }

  return {
    description: r.description,
    stars: r.stargazers_count,
    forks: r.forks_count,
    openIssues: r.open_issues_count,
    archived: r.archived,
    lastCommitDaysAgo,
    commits90d,
    contributors,
    license: r.license?.spdx_id && r.license.spdx_id !== "NOASSERTION" ? r.license.spdx_id : (r.license?.name ?? null),
    issueResponseDays,
  };
}
