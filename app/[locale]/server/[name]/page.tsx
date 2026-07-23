import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  getAllServers,
  getServerBySlug,
  getSimilarServers,
  getCategoryBySlug,
  formatNumber,
  categoryName,
} from "@/lib/data";
import TrustScore from "@/components/TrustScore";
import LifecycleBadge from "@/components/LifecycleBadge";
import SignalRow from "@/components/SignalRow";
import SourceMethodNote from "@/components/SourceMethodNote";
import ServerCard from "@/components/ServerCard";
import Sparkline from "@/components/Sparkline";
import SubscribeInline from "@/components/SubscribeInline";
import InstallCommandCard from "@/components/InstallCommand";
import { installCommands } from "@/lib/install";
import CompareButton from "@/components/CompareButton";
import CapabilityCard from "@/components/CapabilityCard";
import { getServerCapability } from "@/lib/server-capabilities";
import ReadmeFactsCard from "@/components/ReadmeFactsCard";
import PickGuideCard from "@/components/PickGuideCard";
import { getPickGuide } from "@/lib/pick-guide";
import { getSeoLandingByServer } from "@/lib/seo-landing";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import type { Locale } from "@/lib/i18n/locales";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizedHref, hreflangAlternates } from "@/lib/i18n/href";
import { verdictText, deathReasonText } from "@/lib/i18n/verdict";

interface Props {
  params: { name: string; locale: Locale };
}

export async function generateStaticParams() {
  const servers = await getAllServers();
  return servers.map((s) => ({ name: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = await getServerBySlug(params.name);
  if (!s) return {};
  const d = getDictionary(params.locale).server;
  const title = d.metaTitleTpl.replace("{name}", s.name);
  const description = d.metaDescTpl
    .replace("{tagline}", s.tagline)
    .replace("{score}", String(s.trustScore))
    .replace("{verdict}", verdictText(s, params.locale));
  const url = `/${params.locale}/server/${s.slug}`;
  return {
    title,
    description,
    alternates: hreflangAlternates(params.locale, `/server/${s.slug}`),
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
  const { locale } = params;
  const d = getDictionary(locale).server;
  const dCompare = getDictionary(locale).compare;
  const s = await getServerBySlug(params.name);
  if (!s) notFound();

  const sig = s.signals;
  const capability = getServerCapability(s.slug);
  const similar = await getSimilarServers(s);
  const pickGuide = getPickGuide(s.categories[0]);
  const primaryCategory = s.categories[0] ? await getCategoryBySlug(s.categories[0]) : undefined;
  const seoLanding = getSeoLandingByServer(s.slug);
  const starsTrend = trendPct(s.starsTrend);
  const dlTrend = trendPct(s.downloadsTrend);
  const daysAgo = (n: number | null) =>
    n === null ? "—" : n === 0 ? d.today : d.daysAgo.replace("{n}", String(n));

  const appSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: s.name,
    description: s.description,
    applicationCategory: "DeveloperApplication",
    applicationSubCategory: "Model Context Protocol Server",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: 0, priceCurrency: "USD" },
    ...(s.repoUrl ? { codeRepository: s.repoUrl, sameAs: [s.repoUrl] } : {}),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: (s.trustScore / 20).toFixed(1),
      bestRating: 5,
      ratingCount: Math.max(sig.stars, 1),
    },
  };

  const crumb = breadcrumbSchema([
    { name: d.home, path: `/${locale}` },
    ...(primaryCategory ? [{ name: categoryName(primaryCategory, locale), path: `/${locale}/category/${primaryCategory.slug}` }] : []),
    { name: s.name, path: `/${locale}/server/${s.slug}` },
  ]);

  const verifiable = s.lifecycle !== "unverifiable";

  return (
    <div className="container-site py-10 sm:py-14">
      <JsonLd data={[appSchema, crumb]} />

      <nav className="mb-4 text-sm text-neutral-400">
        <Link href={localizedHref(locale, "/")} className="hover:text-brand-600">{d.home}</Link>
        <span className="mx-2">/</span>
        {s.categories[0] && (
          <>
            <Link href={localizedHref(locale, `/category/${s.categories[0]}`)} className="hover:text-brand-600">
              {primaryCategory ? categoryName(primaryCategory, locale) : ""}
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
                  <LifecycleBadge status={s.lifecycle} locale={locale} />
                  {sig.inOfficialRegistry && (
                    <span className="rounded-full border border-neutral-200 px-2.5 py-1 text-xs text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
                      {d.inRegistry}
                    </span>
                  )}
                </div>
                <h1 className="mono mt-3 break-all text-xl font-bold text-neutral-900 dark:text-neutral-50 sm:text-2xl">
                  {s.name}
                </h1>
                <p className="mt-2 text-neutral-600 dark:text-neutral-400">{s.tagline}</p>
                {seoLanding && (
                  <Link
                    href={localizedHref(locale, `/servers/${seoLanding.toolSlug}-mcp-server`)}
                    className="link-accent mt-3 inline-flex text-sm font-medium"
                  >
                    {locale === "zh"
                      ? `${seoLanding.zh.toolName} MCP Server 接入指南 →`
                      : `${seoLanding.en.toolName} MCP Server setup guide →`}
                  </Link>
                )}
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
                  <CompareButton
                    slug={s.slug}
                    strings={{ add: dCompare.add, added: dCompare.added, full: dCompare.full }}
                  />
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
              {verdictText(s, locale)}
              {deathReasonText(s, locale) && <span className="mt-1 block text-xs opacity-80">{d.verdictBasis}{deathReasonText(s, locale)}</span>}
            </div>
          </header>

          {/* 能解决什么问题（人工精写，仅白名单 server 有） */}
          {capability && (
            <CapabilityCard
              cap={capability}
              locale={locale}
              strings={{
                capabilitiesTitle: d.capabilitiesTitle,
                whatCanDo: d.whatCanDo,
                tryTitle: d.tryTitle,
                tryNote: d.tryNote,
              }}
            />
          )}

          {/* 接入前先知道（README 规则提取，所有有 repo 的 server 都可能有） */}
          {s.readmeFacts && (
            <ReadmeFactsCard
              facts={s.readmeFacts}
              strings={{
                factsTitle: d.factsTitle,
                needsApiKey: d.needsApiKey,
                noApiKey: d.noApiKey,
                runtimeNeeds: d.runtimeNeeds,
                configTitle: d.configTitle,
              }}
            />
          )}

          {/* 安装 / 接入命令 */}
          <InstallCommandCard
            commands={installCommands(s)}
            title={d.installTitle}
            note={d.installNote}
            copyLabel={d.copy}
            copiedLabel={d.copied}
          />

          {/* 五维信号卡 */}
          <section className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="card p-5">
              <h2 className="mb-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                {d.maintenanceTitle} <span className="ml-1 text-xs font-normal text-neutral-400">{d.weightScore.replace("{w}", "30").replace("{v}", String(s.breakdown.maintenance))}</span>
              </h2>
              <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                <SignalRow icon="📝" label={d.lastCommit} value={daysAgo(sig.lastCommitDaysAgo)} tone={sig.lastCommitDaysAgo !== null && sig.lastCommitDaysAgo <= 30 ? "good" : sig.lastCommitDaysAgo !== null && sig.lastCommitDaysAgo > 180 ? "bad" : "default"} />
                <SignalRow icon="📈" label={d.commits90d} value={sig.commits90d ?? "—"} tone={(sig.commits90d ?? 0) > 20 ? "good" : sig.commits90d === 0 ? "bad" : "default"} />
                <SignalRow icon="💬" label={d.issueResp} value={sig.issueResponseDays === null ? d.noResponse : d.nDays.replace("{n}", String(sig.issueResponseDays))} tone={sig.issueResponseDays === null ? "bad" : sig.issueResponseDays <= 3 ? "good" : "default"} />
                <SignalRow icon="🗃️" label={d.repoStatus} value={sig.archived ? d.archived : d.normal} tone={sig.archived ? "bad" : "good"} />
              </div>
            </div>

            <div className="card p-5">
              <h2 className="mb-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                {d.adoptionTitle} <span className="ml-1 text-xs font-normal text-neutral-400">{d.weightScore.replace("{w}", "25").replace("{v}", String(s.breakdown.adoption))}</span>
              </h2>
              <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                <SignalRow icon="⭐" label={d.stars} value={sig.stars > 0 ? `${formatNumber(sig.stars)}${starsTrend ? d.starsTrend.replace("{t}", starsTrend) : ""}` : "—"} />
                <SignalRow icon="📦" label={d.npmWeekly} value={sig.npmWeeklyDownloads !== null ? `${formatNumber(sig.npmWeeklyDownloads)}${dlTrend ? `（${dlTrend}）` : ""}` : d.notNpm} />
                <SignalRow icon="🚀" label={d.releaseFreq} value={sig.releaseFrequencyPerMonth !== null ? d.nTimes.replace("{n}", String(sig.releaseFrequencyPerMonth)) : "—"} tone={(sig.releaseFrequencyPerMonth ?? 0) >= 1 ? "good" : "default"} />
              </div>
            </div>

            <div className="card p-5">
              <h2 className="mb-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                {d.usabilityTitle} <span className="ml-1 text-xs font-normal text-neutral-400">{d.weightScore.replace("{w}", "20").replace("{v}", String(s.breakdown.usability))}</span>
              </h2>
              <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                <SignalRow icon="📋" label={d.officialRegistry} value={sig.inOfficialRegistry ? d.listed : d.notListed} tone={sig.inOfficialRegistry ? "good" : "warn"} />
                <SignalRow icon="▶️" label={d.runnable} value={sig.hasRunnableEntry ? d.runnableYes : d.runnableNo} tone={sig.hasRunnableEntry ? "good" : "bad"} />
                <SignalRow icon="🔍" label={d.auditability} value={verifiable ? d.auditYes : d.auditNo} tone={verifiable ? "good" : "warn"} />
              </div>
            </div>

            <div className="card p-5">
              <h2 className="mb-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                {d.healthTitle} <span className="ml-1 text-xs font-normal text-neutral-400">{d.weightScore.replace("{w}", "25").replace("{v}", String(Math.round((s.breakdown.health + s.breakdown.community) / 2)))}</span>
              </h2>
              <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                <SignalRow icon="🐛" label="open issues" value={sig.openIssues ?? "—"} tone={(sig.openIssues ?? 0) > 40 ? "warn" : "default"} />
                <SignalRow icon="🔀" label="open PRs" value={sig.openPRs ?? "—"} />
                <SignalRow icon="⚖️" label={d.license} value={sig.license ?? d.licenseNone} tone={sig.license ? "good" : "warn"} />
                <SignalRow icon="👥" label={d.contributorsForks} value={sig.contributors !== null ? `${sig.contributors} / ${formatNumber(sig.forks ?? 0)}` : "—"} />
              </div>
            </div>
          </section>
          <SourceMethodNote
            locale={locale}
            className="mt-3"
            sources={s.repoUrl ? ["GitHub API", "npm registry", d.sourceRegistry] : [d.sourceRegistry]}
            updatedAt={sig.dataUpdatedAt}
          />

          {/* 趋势图 */}
          {s.starsTrend.length > 1 && (
            <section className="card mt-6 p-5">
              <h2 className="mb-4 text-sm font-semibold text-neutral-900 dark:text-neutral-100">{d.trendTitle}</h2>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="mb-1 text-xs text-neutral-400">{d.trendStars} {starsTrend && <span className={starsTrend.startsWith("+") ? "text-emerald-600" : "text-red-600"}>{starsTrend}</span>}</p>
                  <Sparkline data={s.starsTrend} width={280} height={56} />
                </div>
                {s.downloadsTrend.length > 1 && s.downloadsTrend[0] > 0 && (
                  <div>
                    <p className="mb-1 text-xs text-neutral-400">{d.trendDownloads} {dlTrend && <span className={dlTrend.startsWith("+") ? "text-emerald-600" : "text-red-600"}>{dlTrend}</span>}</p>
                    <Sparkline data={s.downloadsTrend} width={280} height={56} />
                  </div>
                )}
              </div>
            </section>
          )}

          {/* 相似 server + 选型指南 */}
          {similar.length > 0 && (
            <section className="mt-10">
              <h2 className="mb-4 text-lg font-bold text-neutral-900 dark:text-neutral-100">{d.similarTitle}</h2>
              {pickGuide && <PickGuideCard guide={pickGuide} locale={locale} title={d.pickGuideTitle} />}
              <div className="grid gap-4 sm:grid-cols-2">
                {similar.map((x) => (
                  <ServerCard key={x.slug} server={x} locale={locale} />
                ))}
              </div>
            </section>
          )}

          <div className="mt-10">
            <SubscribeInline locale={locale} />
          </div>
        </div>

        {/* ===== 侧栏 ===== */}
        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          {/* 赞助位（明确标注） */}
          <div className="rounded-xl border border-dashed border-neutral-300 p-4 dark:border-neutral-700">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">{d.sponsorLabel}</p>
            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{d.sponsorHead}</p>
            <p className="mt-1 text-xs leading-5 text-neutral-400">{d.sponsorBody}</p>
            <Link href={localizedHref(locale, "/sponsor")} className="link-accent mt-2 inline-block text-xs font-medium">
              {d.sponsorLink}
            </Link>
          </div>

          <div className="card p-4">
            <h3 className="mb-3 text-sm font-semibold text-neutral-900 dark:text-neutral-100">{d.breakdownTitle}</h3>
            <ul className="space-y-2.5">
              {(
                [
                  [d.dimMaintenance, s.breakdown.maintenance, 30],
                  [d.dimAdoption, s.breakdown.adoption, 25],
                  [d.dimUsability, s.breakdown.usability, 20],
                  [d.dimHealth, s.breakdown.health, 15],
                  [d.dimCommunity, s.breakdown.community, 10],
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
            <Link href={localizedHref(locale, "/about")} className="link-accent mt-3 inline-block text-xs">
              {d.methodLink}
            </Link>
          </div>

          <div className="card p-4 text-xs leading-5 text-neutral-500 dark:text-neutral-400">
            <p>
              {d.correctionA}{" "}
              <Link href={localizedHref(locale, "/about")} className="link-accent">{d.correctionLink}</Link>{d.correctionB}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
