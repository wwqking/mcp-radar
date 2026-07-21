import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  getAllServers,
  getServerBySlug,
  getSimilarServers,
  getCategoryBySlug,
  formatNumber,
} from "@/lib/data";
import TrustScore from "@/components/TrustScore";
import LifecycleBadge from "@/components/LifecycleBadge";
import SignalRow from "@/components/SignalRow";
import SourceMethodNote from "@/components/SourceMethodNote";
import ServerCard from "@/components/ServerCard";
import Sparkline from "@/components/Sparkline";
import SubscribeInline from "@/components/SubscribeInline";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

interface Props {
  params: { name: string };
}

export async function generateStaticParams() {
  const servers = await getAllServers();
  return servers.map((s) => ({ name: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = await getServerBySlug(params.name);
  if (!s) return {};
  const title = `${s.name} 靠谱吗？维护状态与健康数据`;
  const description = `${s.tagline}。TrustScore ${s.trustScore}/100，${s.verdict}。数据来自 GitHub、npm 与官方 registry，每日更新。`;
  const url = `/server/${s.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "article" },
    twitter: { card: "summary_large_image", title, description },
  };
}

function trendPct(data: number[]): string | null {
  if (data.length < 2) return null;
  const a = data[0];
  const b = data[data.length - 1];
  if (!a) return null;
  const pct = Math.round(((b - a) / a) * 100);
  return pct >= 0 ? `+${pct}%` : `${pct}%`;
}

export default async function ServerDetailPage({ params }: Props) {
  const s = await getServerBySlug(params.name);
  if (!s) notFound();

  const sig = s.signals;
  const similar = await getSimilarServers(s);
  const primaryCategory = s.categories[0] ? await getCategoryBySlug(s.categories[0]) : undefined;
  const starsTrend = trendPct(s.starsTrend);
  const dlTrend = trendPct(s.downloadsTrend);

  const appSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: s.name,
    description: s.description,
    applicationCategory: "DeveloperApplication",
    ...(s.repoUrl ? { codeRepository: s.repoUrl } : {}),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: (s.trustScore / 20).toFixed(1),
      bestRating: 5,
      ratingCount: Math.max(sig.stars, 1),
    },
  };

  const crumb = breadcrumbSchema([
    { name: "首页", path: "/" },
    ...(primaryCategory ? [{ name: primaryCategory.name, path: `/category/${primaryCategory.slug}` }] : []),
    { name: s.name, path: `/server/${s.slug}` },
  ]);

  const verifiable = s.lifecycle !== "unverifiable";

  return (
    <div className="container-site py-10 sm:py-14">
      <JsonLd data={[appSchema, crumb]} />

      <nav className="mb-4 text-sm text-neutral-400">
        <Link href="/" className="hover:text-brand-600">首页</Link>
        <span className="mx-2">/</span>
        {s.categories[0] && (
          <>
            <Link href={`/category/${s.categories[0]}`} className="hover:text-brand-600">
              {primaryCategory?.name}
            </Link>
            <span className="mx-2">/</span>
          </>
        )}
        <span className="mono text-neutral-600 dark:text-neutral-300">{s.slug}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
        {/* ===== 主栏 ===== */}
        <div>
          {/* 头部 */}
          <header className="card p-6 sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <LifecycleBadge status={s.lifecycle} />
                  {sig.inOfficialRegistry && (
                    <span className="rounded-full border border-neutral-200 px-2.5 py-1 text-xs text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
                      ✓ 官方 registry 收录
                    </span>
                  )}
                </div>
                <h1 className="mono mt-3 break-all text-xl font-bold text-neutral-900 dark:text-neutral-50 sm:text-2xl">
                  {s.name}
                </h1>
                <p className="mt-2 text-neutral-600 dark:text-neutral-400">{s.tagline}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {s.repoUrl && (
                    <a href={s.repoUrl} target="_blank" rel="noopener" className="rounded-lg border border-neutral-200 px-3 py-1.5 text-sm text-neutral-600 hover:border-brand-400 hover:text-brand-700 dark:border-neutral-700 dark:text-neutral-300 dark:hover:text-brand-300">
                      GitHub ↗
                    </a>
                  )}
                  {s.npmPackage && (
                    <a href={`https://www.npmjs.com/package/${s.npmPackage}`} target="_blank" rel="noopener" className="rounded-lg border border-neutral-200 px-3 py-1.5 text-sm text-neutral-600 hover:border-brand-400 hover:text-brand-700 dark:border-neutral-700 dark:text-neutral-300 dark:hover:text-brand-300">
                      npm ↗
                    </a>
                  )}
                  <a href={s.registryUrl} target="_blank" rel="noopener" className="rounded-lg border border-neutral-200 px-3 py-1.5 text-sm text-neutral-600 hover:border-brand-400 hover:text-brand-700 dark:border-neutral-700 dark:text-neutral-300 dark:hover:text-brand-300">
                    registry ↗
                  </a>
                </div>
              </div>
              <div className="flex shrink-0 flex-col items-center gap-1">
                <TrustScore value={s.trustScore} size="lg" />
                <span className="text-xs text-neutral-400">TrustScore</span>
              </div>
            </div>

            {/* 一句判断 */}
            <div
              className={`mt-6 rounded-lg border px-4 py-3 text-sm font-medium ${
                s.lifecycle === "active"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200"
                  : s.lifecycle === "dead"
                    ? "border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/50 dark:text-red-200"
                    : "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-200"
              }`}
            >
              {s.verdict}
              {s.deathReason && <span className="mt-1 block text-xs opacity-80">判定依据：{s.deathReason}</span>}
            </div>
          </header>

          {/* 五维信号卡 */}
          <section className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="card p-5">
              <h2 className="mb-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                🛠️ 维护活跃度 <span className="ml-1 text-xs font-normal text-neutral-400">权重 30% · {s.breakdown.maintenance}分</span>
              </h2>
              <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                <SignalRow icon="📝" label="最近提交" value={sig.lastCommitDaysAgo === null ? "—" : sig.lastCommitDaysAgo === 0 ? "今天" : `${sig.lastCommitDaysAgo} 天前`} tone={sig.lastCommitDaysAgo !== null && sig.lastCommitDaysAgo <= 30 ? "good" : sig.lastCommitDaysAgo !== null && sig.lastCommitDaysAgo > 180 ? "bad" : "default"} />
                <SignalRow icon="📈" label="90 天提交数" value={sig.commits90d ?? "—"} tone={(sig.commits90d ?? 0) > 20 ? "good" : sig.commits90d === 0 ? "bad" : "default"} />
                <SignalRow icon="💬" label="issue 中位响应" value={sig.issueResponseDays === null ? "无响应" : `${sig.issueResponseDays} 天`} tone={sig.issueResponseDays === null ? "bad" : sig.issueResponseDays <= 3 ? "good" : "default"} />
                <SignalRow icon="🗃️" label="仓库状态" value={sig.archived ? "已 archived" : "正常"} tone={sig.archived ? "bad" : "good"} />
              </div>
            </div>

            <div className="card p-5">
              <h2 className="mb-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                📊 采用度 <span className="ml-1 text-xs font-normal text-neutral-400">权重 25% · {s.breakdown.adoption}分</span>
              </h2>
              <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                <SignalRow icon="⭐" label="GitHub stars" value={sig.stars > 0 ? `${formatNumber(sig.stars)}${starsTrend ? `（90天 ${starsTrend}）` : ""}` : "—"} />
                <SignalRow icon="📦" label="npm 周下载" value={sig.npmWeeklyDownloads !== null ? `${formatNumber(sig.npmWeeklyDownloads)}${dlTrend ? `（${dlTrend}）` : ""}` : "非 npm 分发"} />
                <SignalRow icon="🚀" label="月均发版" value={sig.releaseFrequencyPerMonth !== null ? `${sig.releaseFrequencyPerMonth} 次` : "—"} tone={(sig.releaseFrequencyPerMonth ?? 0) >= 1 ? "good" : "default"} />
              </div>
            </div>

            <div className="card p-5">
              <h2 className="mb-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                ✅ 可用性 <span className="ml-1 text-xs font-normal text-neutral-400">权重 20% · {s.breakdown.usability}分</span>
              </h2>
              <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                <SignalRow icon="📋" label="官方 registry" value={sig.inOfficialRegistry ? "已收录" : "未收录"} tone={sig.inOfficialRegistry ? "good" : "warn"} />
                <SignalRow icon="▶️" label="可运行入口" value={sig.hasRunnableEntry ? "可解析（npx/远程）" : "无法解析"} tone={sig.hasRunnableEntry ? "good" : "bad"} />
                <SignalRow icon="🔍" label="可审计性" value={verifiable ? "有开源仓库可审计" : "纯远程型，无法审计"} tone={verifiable ? "good" : "warn"} />
              </div>
            </div>

            <div className="card p-5">
              <h2 className="mb-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                ❤️ 健康度 & 社区 <span className="ml-1 text-xs font-normal text-neutral-400">权重 25% · {Math.round((s.breakdown.health + s.breakdown.community) / 2)}分</span>
              </h2>
              <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                <SignalRow icon="🐛" label="open issues" value={sig.openIssues ?? "—"} tone={(sig.openIssues ?? 0) > 40 ? "warn" : "default"} />
                <SignalRow icon="🔀" label="open PRs" value={sig.openPRs ?? "—"} />
                <SignalRow icon="⚖️" label="License" value={sig.license ?? "未声明"} tone={sig.license ? "good" : "warn"} />
                <SignalRow icon="👥" label="贡献者 / fork" value={sig.contributors !== null ? `${sig.contributors} / ${formatNumber(sig.forks ?? 0)}` : "—"} />
              </div>
            </div>
          </section>
          <SourceMethodNote
            className="mt-3"
            sources={s.repoUrl ? ["GitHub API", "npm registry", "官方 registry"] : ["官方 registry"]}
            updatedAt={sig.dataUpdatedAt}
          />

          {/* 趋势图 */}
          {s.starsTrend.length > 1 && (
            <section className="card mt-6 p-5">
              <h2 className="mb-4 text-sm font-semibold text-neutral-900 dark:text-neutral-100">近 90 天趋势</h2>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="mb-1 text-xs text-neutral-400">⭐ stars {starsTrend && <span className={starsTrend.startsWith("+") ? "text-emerald-600" : "text-red-600"}>{starsTrend}</span>}</p>
                  <Sparkline data={s.starsTrend} width={280} height={56} />
                </div>
                {s.downloadsTrend.length > 1 && s.downloadsTrend[0] > 0 && (
                  <div>
                    <p className="mb-1 text-xs text-neutral-400">📦 周下载 {dlTrend && <span className={dlTrend.startsWith("+") ? "text-emerald-600" : "text-red-600"}>{dlTrend}</span>}</p>
                    <Sparkline data={s.downloadsTrend} width={280} height={56} />
                  </div>
                )}
              </div>
            </section>
          )}

          {/* 相似 server */}
          {similar.length > 0 && (
            <section className="mt-10">
              <h2 className="mb-4 text-lg font-bold text-neutral-900 dark:text-neutral-100">相似 / 替代 server</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {similar.map((x) => (
                  <ServerCard key={x.slug} server={x} />
                ))}
              </div>
            </section>
          )}

          <div className="mt-10">
            <SubscribeInline />
          </div>
        </div>

        {/* ===== 侧栏 ===== */}
        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          {/* 赞助位（明确标注） */}
          <div className="rounded-xl border border-dashed border-neutral-300 p-4 dark:border-neutral-700">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">赞助</p>
            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">你的工具可以出现在这里</p>
            <p className="mt-1 text-xs leading-5 text-neutral-400">
              同类目工具的展示位。赞助不影响本页 server 的评分与排名。
            </p>
            <Link href="/sponsor" className="link-accent mt-2 inline-block text-xs font-medium">
              了解赞助 →
            </Link>
          </div>

          <div className="card p-4">
            <h3 className="mb-3 text-sm font-semibold text-neutral-900 dark:text-neutral-100">五维得分</h3>
            <ul className="space-y-2.5">
              {(
                [
                  ["维护活跃度", s.breakdown.maintenance, 30],
                  ["采用度", s.breakdown.adoption, 25],
                  ["可用性", s.breakdown.usability, 20],
                  ["健康度", s.breakdown.health, 15],
                  ["社区信号", s.breakdown.community, 10],
                ] as [string, number, number][]
              ).map(([label, v, w]) => (
                <li key={label}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-neutral-500 dark:text-neutral-400">
                      {label} <span className="text-neutral-300 dark:text-neutral-600">· {w}%</span>
                    </span>
                    <span className="font-medium text-neutral-700 dark:text-neutral-300">{v}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                    <div
                      className={`h-full rounded-full ${v >= 80 ? "bg-emerald-500" : v >= 60 ? "bg-lime-500" : v >= 40 ? "bg-amber-500" : "bg-red-500"}`}
                      style={{ width: `${v}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
            <Link href="/about" className="link-accent mt-3 inline-block text-xs">
              评分方法论 →
            </Link>
          </div>

          <div className="card p-4 text-xs leading-5 text-neutral-500 dark:text-neutral-400">
            <p>
              认为本页数据有误？维护者可{" "}
              <Link href="/about" className="link-accent">提交更正</Link>。
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
