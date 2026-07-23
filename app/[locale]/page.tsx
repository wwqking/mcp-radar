import Link from "next/link";
import {
  CATEGORIES,
  getAllServers,
  getServersByCategory,
  getSiteStats,
  getTopServers,
  getRadarEntries,
  formatNumber,
  categoryName,
} from "@/lib/data";
import SearchBar from "@/components/SearchBar";
import ServerCard from "@/components/ServerCard";
import SubscribeInline from "@/components/SubscribeInline";
import type { Locale } from "@/lib/i18n/locales";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizedHref } from "@/lib/i18n/href";

export default async function HomePage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const dict = getDictionary(locale);
  const h = dict.home;
  const t = (p: string) => localizedHref(locale, p);

  const [stats, servers, top, radar] = await Promise.all([
    getSiteStats(),
    getAllServers(),
    getTopServers(8),
    getRadarEntries(),
  ]);
  const weeklyNew = radar.added.slice(0, 3);
  const weeklyDead = radar.dead.slice(0, 3);

  const categoryCounts = await Promise.all(
    CATEGORIES.map(async (c) => {
      const list = await getServersByCategory(c.slug);
      return {
        slug: c.slug,
        total: list.length,
        active: list.filter((s) => s.lifecycle === "active").length,
      };
    })
  );
  const countBySlug = new Map(categoryCounts.map((c) => [c.slug, c]));

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
              <span className="text-brand-600 dark:text-brand-400">{h.heroTitleHighlight}</span>。
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base text-neutral-600 dark:text-neutral-400 sm:text-lg">
              {h.heroSub.replace("{total}", formatNumber(stats.total))}
            </p>

            <div className="mx-auto mt-8 max-w-xl">
              <SearchBar
                servers={servers}
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
            </div>
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

      {/* ===== 分类入口宫格 ===== */}
      <section id="categories" className="container-site py-12 sm:py-16">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 sm:text-2xl">{h.categoriesTitle}</h2>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{h.categoriesSub}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {CATEGORIES.map((c) => {
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
