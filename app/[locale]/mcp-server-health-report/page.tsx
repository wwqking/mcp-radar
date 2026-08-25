import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { CATEGORIES, formatNumber, getAllServers, getLastUpdated } from "@/lib/data";
import { buildEcosystemReport } from "@/lib/ecosystem-report";
import { hreflangAlternates, localizedHref } from "@/lib/i18n/href";
import type { Locale } from "@/lib/i18n/locales";
import { ORGANIZATION_ID, breadcrumbSchema } from "@/lib/schema";
import { absoluteUrl } from "@/lib/site";

const REPORT_PATH = "/mcp-server-health-report";
const REPORT_PUBLISHED_AT = "2026-08-03";

const copy = {
  en: {
    title: "MCP Server Health Report",
    metaTitle: "MCP Server Health Report 2026: Maintenance, Remote & Registry Data",
    description:
      "A reproducible health snapshot of auditable MCP server records, covering maintenance signals, remote endpoints, runnable entries, licenses, and weekly growth.",
    eyebrow: "Public data report · August 2026",
    dek: "A reproducible snapshot of the MCP servers we can audit—not a claim to count the entire ecosystem.",
    snapshot: "Dataset snapshot",
    download: "Download the public JSON dataset",
    methodology: "Read the scoring methodology",
    citationHeading: "Citation-ready summary",
    citationBody: (total: string, date: string, remote: string, active: string) =>
      `MCP Radar tracked ${total} auditable MCP server records in its ${date} snapshot. ${remote} exposed at least one hosted remote endpoint, while ${active} had no explicit abandonment signal under the published lifecycle rules.`,
    citationNote:
      "Please cite the snapshot date and methodology. “Active” means no abandonment rule matched; it is not a security or compatibility certification.",
    citeAs: "Suggested citation",
    scopeHeading: "What this sample contains",
    scopeBody: (repos: string) =>
      `The records map to ${repos} distinct declared repositories. One repository may back multiple server records, so every metric below uses server records unless explicitly stated otherwise.`,
    total: "Server records",
    active: "Active-signal records",
    remote: "Hosted remote endpoint",
    runnable: "Runnable entry or remote",
    recent: "Commit within 30 days",
    median: "Median TrustScore",
    lifecycleHeading: "Lifecycle signals",
    lifecycleBody:
      "Lifecycle is deliberately narrow: archived repositories are dead; records stale for more than 180 days with no sampled issue replies and no release signal are dying; repositories without auditable source are unverifiable.",
    activeLabel: "Active signal",
    dyingLabel: "At risk",
    deadLabel: "Archived",
    unverifiableLabel: "Unverifiable",
    availabilityHeading: "Distribution and provenance",
    availabilityBody:
      "These are catalog and source-code signals. They do not prove that a server currently starts, authenticates, or returns a successful tools/list response. Missing verification fields are treated as unknown, not false.",
    official: "Registry listing explicitly verified in this snapshot",
    packages: "Published runnable-entry signal",
    license: "Detected license",
    verified: "Installation-tested by MCP Radar",
    growthHeading: "Fastest weekly GitHub growth",
    growthBody:
      "Weekly deltas are normalized from stored snapshots. Stars belong to the repository declared by the server record and are not usage counts.",
    server: "Server",
    weekly: "Weekly stars",
    stars: "Total stars",
    score: "TrustScore",
    categoriesHeading: "Largest category cohorts",
    categoriesBody:
      "A record may appear in more than one category, so category percentages are coverage rates and do not sum to 100%.",
    category: "Category",
    records: "Records",
    coverage: "Coverage",
    limitsHeading: "Limits that matter",
    limits: [
      "The sample is intentionally biased toward records with auditable repositories and usable registry/package metadata.",
      "A recent commit, a high TrustScore, or an official-registry listing does not establish security or production readiness.",
      "Only explicit MCP Radar installation tests count as verified; metadata-derived compatibility is kept separate.",
      "GitHub stars and npm downloads are adoption proxies, not active-user counts, and repository-level metrics can be shared by multiple records.",
      "Remote endpoint presence does not mean the endpoint was reachable or authenticated during this snapshot.",
    ],
    sourcesHeading: "Sources and reproducibility",
    sourcesBody:
      "The public dataset exposes record-level dates, lifecycle labels, score inputs, source URLs, and the corresponding MCP Radar page. Recalculate the aggregates from the JSON file or use the methodology to challenge a classification.",
    registrySource: "Official MCP Registry",
    githubSource: "GitHub REST API",
    npmSource: "npm registry data",
    corrections: "Report a correction",
    updated: "Report published {published}; dataset snapshot {date}.",
  },
  zh: {
    title: "MCP Server 健康度报告",
    metaTitle: "2026 MCP Server 健康度报告：维护、远程端点与 Registry 数据",
    description:
      "一份可复算的 MCP Server 健康度样本，覆盖维护信号、远程端点、可运行入口、许可证与每周增长。",
    eyebrow: "公开数据报告 · 2026 年 8 月",
    dek: "这是对可审计 MCP Server 记录的健康度快照，不声称覆盖整个生态。",
    snapshot: "数据快照",
    download: "下载公开 JSON 数据集",
    methodology: "查看评分方法",
    citationHeading: "可直接引用的摘要",
    citationBody: (total: string, date: string, remote: string, active: string) =>
      `MCP Radar 在 ${date} 快照中追踪了 ${total} 条可审计 MCP Server 记录，其中 ${remote} 条提供至少一个托管远程端点，${active} 条在公开生命周期规则下未触发明确停更信号。`,
    citationNote:
      "引用时请同时标注快照日期和方法。“活跃”只表示未命中停更规则，不代表安全认证或兼容性验证。",
    citeAs: "建议引用格式",
    scopeHeading: "这个样本包含什么",
    scopeBody: (repos: string) =>
      `这些记录对应 ${repos} 个不同的声明仓库。一个仓库可能支持多条 Server 记录，因此除非另有说明，以下指标均以 Server 记录为口径。`,
    total: "Server 记录",
    active: "活跃信号记录",
    remote: "带托管远程端点",
    runnable: "有可运行入口或远程端点",
    recent: "30 天内有提交",
    median: "TrustScore 中位数",
    lifecycleHeading: "生命周期信号",
    lifecycleBody:
      "生命周期规则刻意保持克制：仓库 archived 判为死亡；超过 180 天未提交、抽样 issue 无回复且没有发版信号才判为衰退；没有可审计源码则标为无法验证。",
    activeLabel: "活跃信号",
    dyingLabel: "存在风险",
    deadLabel: "已归档",
    unverifiableLabel: "无法验证",
    availabilityHeading: "分发与来源",
    availabilityBody:
      "这些是目录和源码信号，不能证明 Server 当前一定能启动、完成认证或成功返回 tools/list。缺少验证字段时按未知处理，而不是按否处理。",
    official: "本快照中明确验证的 Registry 收录",
    packages: "存在已发布可运行入口信号",
    license: "检测到许可证",
    verified: "经 MCP Radar 安装实测",
    growthHeading: "GitHub 周增长最快",
    growthBody:
      "周增量由历史快照折算。Stars 属于 Server 声明的仓库，不等同于实际使用量。",
    server: "Server",
    weekly: "每周 Stars",
    stars: "Stars 总数",
    score: "TrustScore",
    categoriesHeading: "最大的类别样本",
    categoriesBody: "一条记录可进入多个类别，因此覆盖率之和不会等于 100%。",
    category: "类别",
    records: "记录数",
    coverage: "覆盖率",
    limitsHeading: "必须了解的限制",
    limits: [
      "样本刻意偏向有可审计仓库及可用 Registry/安装包元数据的记录。",
      "最近提交、高 TrustScore 或官方 Registry 收录都不等于安全或生产可用。",
      "只有 MCP Radar 明确执行过安装测试的记录才算实测；由元数据推导的兼容性会单独标注。",
      "GitHub Stars 与 npm 下载只是采用度代理，不是活跃用户数；多条记录也可能共享同一个仓库指标。",
      "存在远程端点并不表示本次快照已验证它可访问或可完成认证。",
    ],
    sourcesHeading: "来源与复算",
    sourcesBody:
      "公开数据集提供记录级日期、生命周期、评分输入、来源链接和对应详情页。你可以从 JSON 重新计算聚合结果，也可以按公开方法对分类提出纠正。",
    registrySource: "官方 MCP Registry",
    githubSource: "GitHub REST API",
    npmSource: "npm Registry 数据",
    corrections: "提交数据纠正",
    updated: "报告发布于 {published}；数据快照为 {date}。",
  },
} as const;

function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const c = copy[locale];
  return {
    title: c.metaTitle,
    description: c.description,
    alternates: hreflangAlternates(locale, REPORT_PATH),
    openGraph: {
      title: c.metaTitle,
      description: c.description,
      url: localizedHref(locale, REPORT_PATH),
      type: "article",
    },
    twitter: { card: "summary_large_image", title: c.metaTitle, description: c.description },
  };
}

export default async function McpServerHealthReportPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const c = copy[locale];
  const [servers, snapshotDate] = await Promise.all([getAllServers(), getLastUpdated()]);
  const report = buildEcosystemReport(servers);
  const number = (value: number) => value.toLocaleString(locale === "zh" ? "zh-CN" : "en-US");
  const categoryLabels = new Map(
    CATEGORIES.map((category) => [category.slug, locale === "zh" ? category.name : category.name_en ?? category.name]),
  );
  const reportUrl = absoluteUrl(`/${locale}${REPORT_PATH}`);
  const citation = `MCP Radar. “${c.title}.” ${c.snapshot}: ${snapshotDate}. ${reportUrl}`;
  const summary = c.citationBody(
    number(report.total),
    snapshotDate,
    `${number(report.remote)} (${formatPercent(report.remotePercent)})`,
    `${number(report.active)} (${formatPercent(report.activePercent)})`,
  );

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: c.metaTitle,
    description: c.description,
    datePublished: REPORT_PUBLISHED_AT,
    dateModified: REPORT_PUBLISHED_AT,
    url: reportUrl,
    author: { "@id": ORGANIZATION_ID },
    publisher: { "@id": ORGANIZATION_ID },
    isAccessibleForFree: true,
    mainEntity: { "@id": `${reportUrl}#dataset` },
  };
  const datasetSchema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "@id": `${reportUrl}#dataset`,
    name: c.title,
    description: c.description,
    url: reportUrl,
    dateModified: snapshotDate,
    creator: { "@id": ORGANIZATION_ID },
    measurementTechnique:
      "MCP Registry metadata combined with public GitHub and npm signals under the published MCP Radar methodology.",
    variableMeasured: [
      "lifecycle",
      "TrustScore",
      "last commit age",
      "remote endpoint availability",
      "published package availability",
      "license",
      "GitHub stars",
    ],
    distribution: {
      "@type": "DataDownload",
      encodingFormat: "application/json",
      contentUrl: absoluteUrl("/dataset.json"),
    },
  };
  const crumb = breadcrumbSchema([{ name: c.title, path: `/${locale}${REPORT_PATH}` }]);

  const kpis = [
    { label: c.total, value: number(report.total), note: `${number(report.uniqueRepositories)} repos` },
    { label: c.active, value: formatPercent(report.activePercent), note: number(report.active) },
    { label: c.remote, value: formatPercent(report.remotePercent), note: number(report.remote) },
    { label: c.runnable, value: formatPercent(report.runnablePercent), note: number(report.runnable) },
    { label: c.recent, value: formatPercent(report.recentCommitPercent), note: number(report.recentCommit) },
    { label: c.median, value: String(report.medianTrustScore), note: "/ 100" },
  ];
  const lifecycleLabels: Record<string, string> = {
    active: c.activeLabel,
    dying: c.dyingLabel,
    dead: c.deadLabel,
    unverifiable: c.unverifiableLabel,
  };
  const lifecycleColors: Record<string, string> = {
    active: "bg-emerald-500",
    dying: "bg-amber-500",
    dead: "bg-red-500",
    unverifiable: "bg-neutral-400",
  };

  return (
    <div className="container-site py-10 sm:py-14">
      <JsonLd data={[articleSchema, datasetSchema, crumb]} />

      <header className="max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-600 dark:text-brand-400">
          {c.eyebrow}
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-neutral-50 sm:text-5xl">
          {c.title}
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-neutral-600 dark:text-neutral-300">{c.dek}</p>
        <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400">
          <span className="rounded-full border border-neutral-200 bg-white px-3 py-1 dark:border-neutral-700 dark:bg-neutral-900">
            {c.snapshot}: <strong className="text-neutral-800 dark:text-neutral-100">{snapshotDate}</strong>
          </span>
          <a href="/dataset.json" className="link-accent font-medium">{c.download}</a>
          <Link href={localizedHref(locale, "/about")} className="link-accent font-medium">{c.methodology}</Link>
        </div>
      </header>

      <section className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {kpis.map((item) => (
          <div key={item.label} className="card p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">{item.label}</p>
            <p className="mt-2 text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-neutral-50">{item.value}</p>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{item.note}</p>
          </div>
        ))}
      </section>

      <section className="mt-10 rounded-2xl border border-brand-200 bg-brand-50 p-6 dark:border-brand-900 dark:bg-brand-950/40 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-300">{c.citationHeading}</p>
        <p className="mt-3 max-w-4xl text-lg font-medium leading-8 text-brand-950 dark:text-brand-50">{summary}</p>
        <p className="mt-3 max-w-4xl text-sm leading-6 text-brand-800 dark:text-brand-200">{c.citationNote}</p>
        <div className="mt-5 rounded-lg border border-brand-200/80 bg-white/80 p-4 dark:border-brand-800 dark:bg-neutral-950/50">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">{c.citeAs}</p>
          <p className="mt-2 break-words font-mono text-sm leading-6 text-neutral-700 dark:text-neutral-300">{citation}</p>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-bold tracking-tight text-neutral-950 dark:text-neutral-50">{c.scopeHeading}</h2>
        <p className="mt-3 max-w-3xl leading-7 text-neutral-600 dark:text-neutral-400">
          {c.scopeBody(number(report.uniqueRepositories))}
        </p>
      </section>

      <section className="mt-12 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-950 dark:text-neutral-50">{c.lifecycleHeading}</h2>
          <p className="mt-3 max-w-3xl leading-7 text-neutral-600 dark:text-neutral-400">{c.lifecycleBody}</p>
          <div className="mt-6 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800" aria-label={c.lifecycleHeading}>
            <div className="flex h-4 w-full">
              {report.lifecycle.map((item) => (
                <span
                  key={item.key}
                  className={lifecycleColors[item.key]}
                  style={{ width: `${item.percent}%` }}
                  title={`${lifecycleLabels[item.key]}: ${item.count}`}
                />
              ))}
            </div>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {report.lifecycle.map((item) => (
              <div key={item.key} className="flex items-center justify-between rounded-lg border border-neutral-200 px-4 py-3 dark:border-neutral-800">
                <span className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
                  <span className={`h-2.5 w-2.5 rounded-full ${lifecycleColors[item.key]}`} />
                  {lifecycleLabels[item.key]}
                </span>
                <span className="font-mono text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  {number(item.count)} · {formatPercent(item.percent)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-bold text-neutral-950 dark:text-neutral-50">{c.availabilityHeading}</h2>
          <p className="mt-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400">{c.availabilityBody}</p>
          <dl className="mt-5 space-y-4">
            {[
              [c.official, report.officialRegistry, report.officialRegistryPercent],
              [c.packages, report.localRunnable, report.localRunnablePercent],
              [c.license, report.knownLicense, report.knownLicensePercent],
              [c.verified, report.installVerified, report.installVerifiedPercent],
            ].map(([label, count, pct]) => (
              <div key={String(label)} className="border-b border-neutral-100 pb-4 last:border-0 last:pb-0 dark:border-neutral-800">
                <dt className="text-sm text-neutral-600 dark:text-neutral-300">{label}</dt>
                <dd className="mt-1 flex items-baseline justify-between gap-4">
                  <span className="font-mono text-lg font-bold text-neutral-950 dark:text-neutral-50">{number(Number(count))}</span>
                  <span className="text-sm text-neutral-400">{formatPercent(Number(pct))}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-bold tracking-tight text-neutral-950 dark:text-neutral-50">{c.growthHeading}</h2>
        <p className="mt-3 max-w-3xl leading-7 text-neutral-600 dark:text-neutral-400">{c.growthBody}</p>
        <div className="mt-6 overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="bg-neutral-50 text-xs uppercase tracking-wider text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400">
              <tr>
                <th className="px-4 py-3 font-semibold">{c.server}</th>
                <th className="px-4 py-3 text-right font-semibold">{c.weekly}</th>
                <th className="px-4 py-3 text-right font-semibold">{c.stars}</th>
                <th className="px-4 py-3 text-right font-semibold">{c.score}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {report.fastestGrowing.map((item) => (
                <tr key={item.slug}>
                  <td className="px-4 py-3">
                    <Link href={localizedHref(locale, `/server/${item.slug}`)} className="font-medium text-neutral-900 hover:text-brand-600 dark:text-neutral-100 dark:hover:text-brand-400">
                      {item.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-semibold text-emerald-600 dark:text-emerald-400">+{formatNumber(item.starsWeeklyDelta)}</td>
                  <td className="px-4 py-3 text-right font-mono text-neutral-600 dark:text-neutral-300">{formatNumber(item.stars)}</td>
                  <td className="px-4 py-3 text-right font-mono text-neutral-600 dark:text-neutral-300">{item.trustScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-bold tracking-tight text-neutral-950 dark:text-neutral-50">{c.categoriesHeading}</h2>
        <p className="mt-3 max-w-3xl leading-7 text-neutral-600 dark:text-neutral-400">{c.categoriesBody}</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {report.categories.slice(0, 10).map((item) => (
            <div key={item.key} className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800">
              <div className="flex items-center justify-between gap-4">
                <Link href={localizedHref(locale, `/category/${item.key}`)} className="font-semibold text-neutral-900 hover:text-brand-600 dark:text-neutral-100 dark:hover:text-brand-400">
                  {categoryLabels.get(item.key) ?? item.key}
                </Link>
                <span className="font-mono text-sm text-neutral-500 dark:text-neutral-400">{number(item.count)} · {formatPercent(item.percent)}</span>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                <div className="h-full rounded-full bg-brand-500" style={{ width: `${Math.min(item.percent, 100)}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-950 dark:text-neutral-50">{c.limitsHeading}</h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
            {c.limits.map((limit) => (
              <li key={limit} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                <span>{limit}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="card p-6">
          <h2 className="text-xl font-bold text-neutral-950 dark:text-neutral-50">{c.sourcesHeading}</h2>
          <p className="mt-3 text-sm leading-6 text-neutral-600 dark:text-neutral-400">{c.sourcesBody}</p>
          <ul className="mt-5 space-y-2 text-sm">
            <li><a className="link-accent" href="https://registry.modelcontextprotocol.io" rel="noreferrer">{c.registrySource}</a></li>
            <li><a className="link-accent" href="https://docs.github.com/en/rest" rel="noreferrer">{c.githubSource}</a></li>
            <li><a className="link-accent" href="https://docs.npmjs.com" rel="noreferrer">{c.npmSource}</a></li>
            <li><a className="link-accent" href="/dataset.json">{c.download}</a></li>
            <li><Link className="link-accent" href={localizedHref(locale, "/about")}>{c.methodology}</Link></li>
            <li><Link className="link-accent" href={localizedHref(locale, "/about")}>{c.corrections}</Link></li>
          </ul>
        </div>
      </section>

      <p className="mt-12 border-t border-neutral-200 pt-6 text-xs text-neutral-400 dark:border-neutral-800">
        {c.updated.replace("{published}", REPORT_PUBLISHED_AT).replace("{date}", snapshotDate)}
      </p>
    </div>
  );
}
