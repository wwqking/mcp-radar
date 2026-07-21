import Link from "next/link";
import {
  CATEGORIES,
  getAllServers,
  getServersByCategory,
  getSiteStats,
  getTopServers,
  getRadarEntries,
  formatNumber,
} from "@/lib/data";
import SearchBar from "@/components/SearchBar";
import ServerCard from "@/components/ServerCard";
import SubscribeInline from "@/components/SubscribeInline";

export default async function HomePage() {
  const [stats, servers, top, radar] = await Promise.all([
    getSiteStats(),
    getAllServers(),
    getTopServers(8),
    getRadarEntries(),
  ]);
  const weeklyNew = radar.added.slice(0, 3);
  const weeklyDead = radar.dead.slice(0, 3);

  // 分类宫格：预先算好每类的 server 数与活跃数（避免在 JSX 里 await）
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
              找到能用的 MCP server ——
              <br className="hidden sm:block" />
              按用途分类，<span className="text-brand-600 dark:text-brand-400">标注哪个还活着</span>。
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base text-neutral-600 dark:text-neutral-400 sm:text-lg">
              收录 {formatNumber(stats.total)} 个 MCP server，每个都标了维护状态：
              <span className="whitespace-nowrap">🟢 活跃</span> /{" "}
              <span className="whitespace-nowrap">🟡 半年没更新</span> /{" "}
              <span className="whitespace-nowrap">⚰️ 已弃坑</span>。
            </p>

            <div className="mx-auto mt-8 max-w-xl">
              <SearchBar servers={servers} size="hero" />
            </div>

            {/* 实时数字带 */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-neutral-500 dark:text-neutral-400">
              <span>收录 <strong className="text-neutral-800 dark:text-neutral-200">{formatNumber(stats.total)}</strong> 个</span>
              <span className="hidden h-1 w-1 rounded-full bg-neutral-300 sm:block" />
              <span>🟢 活跃 <strong className="text-emerald-600 dark:text-emerald-400">{stats.active}</strong></span>
              <span className="hidden h-1 w-1 rounded-full bg-neutral-300 sm:block" />
              <span>🟡 濒危 <strong className="text-amber-600 dark:text-amber-400">{stats.dying}</strong></span>
              <span className="hidden h-1 w-1 rounded-full bg-neutral-300 sm:block" />
              <span>⚰️ 已弃坑 <strong className="text-red-600 dark:text-red-400">{stats.dead}</strong></span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 分类入口宫格 ===== */}
      <section id="categories" className="container-site py-12 sm:py-16">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 sm:text-2xl">按用途找</h2>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">按"能帮我做什么"分，不按技术栈分。</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {CATEGORIES.map((c) => {
            const counts = countBySlug.get(c.slug);
            return (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                className="card group flex flex-col gap-1.5 p-4"
              >
                <span className="text-2xl">{c.icon}</span>
                <span className="text-sm font-semibold text-neutral-800 group-hover:text-brand-700 dark:text-neutral-200 dark:group-hover:text-brand-300">
                  {c.name}
                </span>
                <span className="text-xs text-neutral-400">
                  {counts?.total ?? 0} 个 · 活跃 {counts?.active ?? 0}
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
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 sm:text-2xl">本周动态</h2>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">引擎每周自动扫描，变化一目了然。</p>
          </div>
          <Link href="/radar" className="link-accent text-sm">
            查看完整雷达 →
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="card p-5">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-neutral-800 dark:text-neutral-200">
              🆕 本周新增
            </h3>
            <ul className="space-y-3">
              {weeklyNew.map((e) => (
                <li key={e.server.slug} className="flex items-center justify-between gap-3">
                  <Link
                    href={`/server/${e.server.slug}`}
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
              ⚰️ 本周判定弃坑 / 濒危
            </h3>
            <ul className="space-y-3">
              {weeklyDead.map((e) => (
                <li key={e.server.slug} className="flex items-center justify-between gap-3">
                  <Link
                    href={`/server/${e.server.slug}`}
                    className="mono min-w-0 flex-1 truncate text-sm text-neutral-600 hover:underline dark:text-neutral-300"
                  >
                    {e.server.name}
                  </Link>
                  <span className="shrink-0 text-xs text-red-500">
                    {e.server.lifecycle === "dead" ? "已弃坑" : "濒危"}
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
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 sm:text-2xl">热门 server</h2>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">按 TrustScore 排序，全部活跃维护。</p>
          </div>
          <Link href="/leaderboard" className="link-accent text-sm">
            完整榜单 →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {top.map((s) => (
            <ServerCard key={s.slug} server={s} showTrend />
          ))}
        </div>
      </section>

      {/* ===== 为什么用我们 ===== */}
      <section className="container-site pb-12 sm:pb-16">
        <div className="card overflow-hidden border-brand-200 bg-gradient-to-br from-brand-50 to-white p-6 dark:border-brand-900 dark:from-brand-950/50 dark:to-neutral-900 sm:p-10">
          <div className="max-w-2xl">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 sm:text-2xl">
              别的导航只列工具，我们还告诉你它是不是还有人维护。
            </h2>
            <p className="mt-3 text-sm leading-6 text-neutral-600 dark:text-neutral-400 sm:text-base sm:leading-7">
              每个 server 的健康数据由引擎每日自动计算：最近提交、issue 响应、下载趋势、仓库是否 archived。
              评分方法论完全公开，排名绝不出售。
            </p>
            <Link href="/about" className="link-accent mt-4 inline-block text-sm font-medium">
              看看我们怎么打分 →
            </Link>
          </div>
        </div>
      </section>

      {/* ===== 订阅钩子 ===== */}
      <section className="container-site pb-4">
        <SubscribeInline />
      </section>
    </div>
  );
}
