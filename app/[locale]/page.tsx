import Link from "next/link";
import {
  PUBLIC_CATEGORIES,
  getAllServers,
  getSiteStats,
  getTopServers,
  getRadarEntries,
  getLastUpdated,
  formatNumber,
  categoryName,
} from "@/lib/data";
import SearchBar from "@/components/SearchBar";
import ServerCard from "@/components/ServerCard";
import StackCard from "@/components/StackCard";
import SubscribeInline from "@/components/SubscribeInline";
import { STACKS } from "@/lib/stacks";
import type { Locale } from "@/lib/i18n/locales";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizedHref } from "@/lib/i18n/href";
import {
  FEATURED_TOPIC_SLUGS,
  TAXONOMY_TOPICS,
  taxonomyForServer,
  topicName,
} from "@/lib/taxonomy";

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const h = dict.home;
  const t = (p: string) => localizedHref(locale, p);

  const [stats, servers, top, radar, lastUpdated] = await Promise.all([
    getSiteStats(),
    getAllServers(),
    getTopServers(8),
    getRadarEntries(),
    getLastUpdated(),
  ]);
  const weeklyNew = radar.added.slice(0, 3);
  const weeklyDead = radar.dead.slice(0, 3);
  const runnableCount = servers.filter((server) => server.signals.hasRunnableEntry).length;
  const remoteCount = servers.filter((server) => (server.remoteEndpoints?.length ?? 0) > 0).length;
  const installVerifiedCount = servers.filter((server) => Boolean(server.installVerified)).length;

  // 组合方案用：slug → server 映射（取活体状态 + 链接）
  const serverMap = new Map(servers.map((s) => [s.slug, s]));

  const categoryCounts = PUBLIC_CATEGORIES.map((category) => {
    const list = servers.filter((server) => server.categories.includes(category.slug));
    return {
      slug: category.slug,
      total: list.length,
      active: list.filter((server) => server.lifecycle === "active").length,
    };
  });
  const countBySlug = new Map(categoryCounts.map((c) => [c.slug, c]));
  const featuredTopicSet = new Set<string>(FEATURED_TOPIC_SLUGS);
  const featuredTopics = TAXONOMY_TOPICS.filter((topic) => featuredTopicSet.has(topic.slug))
    .map((topic) => ({
      topic,
      count: servers.filter((server) => taxonomyForServer(server).topics.includes(topic.slug)).length,
    }))
    .filter(({ count }) => count > 0)
    .sort((a, b) => b.count - a.count);

  return (
    <div>
      {/* ===== Hero ===== */}
      <section className="border-b border-neutral-200/80 bg-gradient-to-b from-brand-50/60 to-transparent dark:border-neutral-800 dark:from-brand-950/30">
        <div className="container-site py-14 sm:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
              {h.heroTitleA}
              <br className="hidden sm:block" />
              {h.heroTitleB}
              <span className="text-brand-600 dark:text-brand-400">{h.heroTitleHighlight}</span>
              {locale === "zh" ? "。" : "."}
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base text-neutral-600 dark:text-neutral-400 sm:text-lg">
              {h.heroSub.replace("{total}", formatNumber(stats.total))}
            </p>

            <div className="mx-auto mt-8 max-w-xl">
              <SearchBar
                locale={locale}
                placeholderHero={dict.searchBar.placeholderHero}
                placeholderNav={dict.searchBar.placeholderNav}
                size="hero"
              />
            </div>

            {/* 实时数字带 */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-neutral-500 dark:text-neutral-400">
              <span>{h.statTotal.replace("{n}", formatNumber(stats.total))}</span>
              <span className="hidden h-1 w-1 rounded-full bg-neutral-300 sm:block" />
              <span>🟢 {dict.common.active} <strong className="text-emerald-600 dark:text-emerald-400">{stats.active}</strong></span>
              <span className="hidden h-1 w-1 rounded-full bg-neutral-300 sm:block" />
              <span>🟡 {dict.common.dying} <strong className="text-amber-600 dark:text-amber-400">{stats.dying}</strong></span>
              <span className="hidden h-1 w-1 rounded-full bg-neutral-300 sm:block" />
              <span>⚰️ {dict.common.dead} <strong className="text-red-600 dark:text-red-400">{stats.dead}</strong></span>
              {stats.unverifiable > 0 && (
                <>
                  <span className="hidden h-1 w-1 rounded-full bg-neutral-300 sm:block" />
                  <span>⚪ {dict.common.unverifiable} <strong className="text-neutral-600 dark:text-neutral-300">{stats.unverifiable}</strong></span>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===== 目录证据口径：同一份数据、同一个时间戳 ===== */}
      <section className="container-site pt-8 sm:pt-10" aria-label={locale === "zh" ? "目录证据" : "Directory evidence"}>
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900 sm:p-6">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                {locale === "zh" ? "这份目录测量了什么" : "What this directory measures"}
              </h2>
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                {locale === "zh"
                  ? "所有数字在同一次渲染中计算；数量是证据口径，不是安全或兼容性认证。"
                  : "All counts are computed in the same render. They are evidence scopes, not security or compatibility certification."}
              </p>
            </div>
            <p className="text-xs text-neutral-400">{locale === "zh" ? "数据日期" : "Data date"}: {lastUpdated}</p>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {[
              [locale === "zh" ? "收录" : "Indexed", stats.total, locale === "zh" ? "目录记录" : "catalog records"],
              [locale === "zh" ? "有可运行入口" : "Runnable entry", runnableCount, locale === "zh" ? "可解析命令或端点" : "resolvable command or endpoint"],
              [locale === "zh" ? "远程" : "Remote", remoteCount, locale === "zh" ? "声明托管端点" : "declared hosted endpoint"],
              [locale === "zh" ? "活跃" : "Active", stats.active, locale === "zh" ? "维护生命周期" : "maintenance lifecycle"],
              [locale === "zh" ? "安装实测" : "Install verified", installVerifiedCount, locale === "zh" ? "启动并列出工具" : "started and listed tools"],
            ].map(([label, value, note]) => (
              <div key={String(label)} className="rounded-xl bg-neutral-50 p-3 dark:bg-neutral-950">
                <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">{label}</p>
                <p className="mt-1 text-xl font-extrabold text-neutral-900 dark:text-neutral-100">{value}</p>
                <p className="mt-1 text-[11px] leading-4 text-neutral-400">{note}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {[
              ["/remote-mcp-servers", locale === "zh" ? "远程目录" : "Remote directory"],
              ["/leaderboard", locale === "zh" ? "排行榜" : "Leaderboard"],
              ["/mcp-server-health-report", locale === "zh" ? "健康报告" : "Health report"],
              ["/guides", locale === "zh" ? "指南" : "Guides"],
              ["/about", locale === "zh" ? "TrustScore 方法" : "TrustScore method"],
              ["/editorial-policy", locale === "zh" ? "编辑政策" : "Editorial policy"],
            ].map(([href, label]) => (
              <Link key={href} href={t(href)} className="rounded-full border border-neutral-200 px-3 py-1.5 text-sm text-neutral-600 hover:border-brand-400 hover:text-brand-700 dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-brand-700 dark:hover:text-brand-300">
                {label} →
              </Link>
            ))}
            <a href="/dataset.json" className="rounded-full border border-neutral-200 px-3 py-1.5 text-sm text-neutral-600 hover:border-brand-400 hover:text-brand-700 dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-brand-700 dark:hover:text-brand-300">
              {locale === "zh" ? "公开数据集" : "Public dataset"} →
            </a>
          </div>
        </div>
      </section>

      {/* ===== 需求入口「我想让 AI……」（面向普通人，链到分类页） ===== */}
      <section className="container-site pt-12 sm:pt-16">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 sm:text-2xl">{h.intentTitle}</h2>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{h.intentSub}</p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {h.intents.map((it) => {
            const counts = countBySlug.get(it.cat);
            return (
              <Link
                key={it.cat}
                href={t(`/category/${it.cat}`)}
                className="card group flex items-center gap-3 p-4 hover:border-brand-400 dark:hover:border-brand-600"
              >
                <span className="text-2xl">{it.icon}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-neutral-800 group-hover:text-brand-700 dark:text-neutral-200 dark:group-hover:text-brand-300">
                    {it.label}
                  </span>
                  {counts && (
                    <span className="text-xs text-neutral-400">
                      {h.categoryCount
                        .replace("{total}", String(counts.total))
                        .replace("{active}", String(counts.active))}
                    </span>
                  )}
                </span>
                <span className="shrink-0 text-neutral-300 group-hover:text-brand-500 dark:text-neutral-600">→</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ===== 组合方案「我要做一件事，配哪几个 server」 ===== */}
      <section className="container-site pt-12 sm:pt-16">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 sm:text-2xl">{h.stackTitle}</h2>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{h.stackSub}</p>
        </div>
        <div className="grid gap-4">
          {STACKS.map((stack) => (
            <StackCard
              key={stack.slug}
              stack={stack}
              locale={locale}
              serverMap={serverMap}
              recommendedLabel={dict.common.recommended}
            />
          ))}
        </div>
      </section>

      {/* ===== 分类入口宫格 ===== */}
      <section id="categories" className="container-site py-12 sm:py-16">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 sm:text-2xl">{h.categoriesTitle}</h2>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{h.categoriesSub}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {PUBLIC_CATEGORIES.map((c) => {
            const counts = countBySlug.get(c.slug);
            return (
              <Link
                key={c.slug}
                href={t(`/category/${c.slug}`)}
                className="card group flex flex-col gap-1.5 p-4"
              >
                <span className="text-2xl">{c.icon}</span>
                <span className="text-sm font-semibold text-neutral-800 group-hover:text-brand-700 dark:text-neutral-200 dark:group-hover:text-brand-300">
                  {categoryName(c, locale)}
                </span>
                <span className="text-xs text-neutral-400">
                  {h.categoryCount
                    .replace("{total}", String(counts?.total ?? 0))
                    .replace("{active}", String(counts?.active ?? 0))}
                </span>
              </Link>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400">{h.categoriesOverlapNote}</p>

        {featuredTopics.length > 0 && (
          <div className="mt-8 border-t border-neutral-200 pt-6 dark:border-neutral-800">
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">{h.topicsTitle}</h3>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{h.topicsSub}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {featuredTopics.map(({ topic, count }) => (
                <Link
                  key={topic.slug}
                  href={t(`/topic/${topic.slug}`)}
                  className="inline-flex min-h-11 items-center rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:border-brand-400 hover:text-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-300 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-brand-700 dark:hover:text-brand-300"
                >
                  {topicName(topic, locale)}
                  <span className="ml-1.5 text-xs font-normal text-neutral-400">{count}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ===== 本周动态 ===== */}
      <section className="container-site pb-12 sm:pb-16">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 sm:text-2xl">{h.weeklyTitle}</h2>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{h.weeklySub}</p>
          </div>
          <Link href={t("/radar")} className="link-accent text-sm">
            {h.weeklyViewRadar}
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="card p-5">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-neutral-800 dark:text-neutral-200">
              {h.weeklyNew}
            </h3>
            <ul className="space-y-3">
              {weeklyNew.map((e) => (
                <li key={e.server.slug} className="flex items-center justify-between gap-3">
                  <Link
                    href={t(`/server/${e.server.slug}`)}
                    className="mono min-w-0 flex-1 truncate text-sm text-brand-700 hover:underline dark:text-brand-300"
                  >
                    {e.server.name}
                  </Link>
                  <span className="shrink-0 text-xs text-neutral-400">+{formatNumber(e.server.signals.stars)} ⭐</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="card p-5">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-neutral-800 dark:text-neutral-200">
              {h.weeklyDead}
            </h3>
            <ul className="space-y-3">
              {weeklyDead.map((e) => (
                <li key={e.server.slug} className="flex items-center justify-between gap-3">
                  <Link
                    href={t(`/server/${e.server.slug}`)}
                    className="mono min-w-0 flex-1 truncate text-sm text-neutral-600 hover:underline dark:text-neutral-300"
                  >
                    {e.server.name}
                  </Link>
                  <span className="shrink-0 text-xs text-red-500">
                    {e.server.lifecycle === "dead" ? dict.common.dead : dict.common.dying}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ===== 热门 server ===== */}
      <section className="container-site pb-12 sm:pb-16">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 sm:text-2xl">{h.hotTitle}</h2>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{h.hotSub}</p>
          </div>
          <Link href={t("/leaderboard")} className="link-accent text-sm">
            {h.hotViewAll}
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {top.map((s) => (
            <ServerCard key={s.slug} server={s} locale={locale} showTrend />
          ))}
        </div>
      </section>

      {/* ===== 为什么用我们 ===== */}
      <section className="container-site pb-12 sm:pb-16">
        <div className="card overflow-hidden border-brand-200 bg-gradient-to-br from-brand-50 to-white p-6 dark:border-brand-900 dark:from-brand-950/50 dark:to-neutral-900 sm:p-10">
          <div className="max-w-2xl">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 sm:text-2xl">
              {h.whyTitle}
            </h2>
            <p className="mt-3 text-sm leading-6 text-neutral-600 dark:text-neutral-400 sm:text-base sm:leading-7">
              {h.whyBody}
            </p>
            <Link href={t("/about")} className="link-accent mt-4 inline-block text-sm font-medium">
              {h.whyLink}
            </Link>
          </div>
        </div>
      </section>

      {/* ===== 订阅钩子 ===== */}
      <section className="container-site pb-4">
        <SubscribeInline locale={locale} />
      </section>
    </div>
  );
}
