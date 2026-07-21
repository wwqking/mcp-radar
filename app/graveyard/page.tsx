import type { Metadata } from "next";
import Link from "next/link";
import { getGraveyard, getSiteStats, formatNumber } from "@/lib/data";
import LifecycleBadge from "@/components/LifecycleBadge";
import SubscribeInline from "@/components/SubscribeInline";

export const metadata: Metadata = {
  title: "MCP 墓地 —— 这些 server 已经死了，别再装",
  description:
    "已弃坑和濒危的 MCP server 名单：死亡原因、判定日期、曾经的 stars。装之前先查一下，别给项目埋雷。",
  alternates: { canonical: "/graveyard" },
};

export default async function GraveyardPage() {
  const [dead, stats] = await Promise.all([getGraveyard(), getSiteStats()]);

  return (
    <div className="container-site py-10 sm:py-14">
      <header className="mb-8 max-w-3xl">
        <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-3xl">
          ⚰️ MCP 墓地 —— 这些 server 已经死了，别再装
        </h1>
        <p className="mt-3 text-neutral-600 dark:text-neutral-400">
          已收录 <strong className="text-red-600 dark:text-red-400">{stats.dead + stats.dying}</strong> 个死亡 / 濒危 server。
          它们还在各种「MCP 大全」里被推荐，但仓库早已无人维护。装之前，先查一下。
        </p>
      </header>

      <div className="space-y-3">
        {dead.map((s) => (
          <Link
            key={s.slug}
            href={`/server/${s.slug}`}
            className="card group flex flex-col gap-3 p-5 sm:flex-row sm:items-center"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-lg dark:bg-neutral-800">
              🪦
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="mono text-sm font-semibold text-neutral-700 group-hover:text-brand-700 dark:text-neutral-200 dark:group-hover:text-brand-300">
                  {s.name}
                </span>
                <LifecycleBadge status={s.lifecycle} size="sm" />
                {s.signals.stars > 0 && (
                  <span className="text-xs text-neutral-400">曾有 {formatNumber(s.signals.stars)} ⭐</span>
                )}
              </div>
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                死因：{s.deathReason}
              </p>
            </div>
            {s.deadAt && (
              <div className="shrink-0 text-right text-xs text-neutral-400">
                <p>判定于</p>
                <p className="font-mono">{s.deadAt}</p>
              </div>
            )}
          </Link>
        ))}
      </div>

      {/* 申诉入口 */}
      <div className="mt-10 rounded-xl border border-neutral-200 p-5 text-sm text-neutral-600 dark:border-neutral-700 dark:text-neutral-400">
        <p>
          维护者认为判定有误？我们的人工复核通道始终开放 ——{" "}
          <Link href="/about" className="link-accent font-medium">告诉我们 →</Link>
        </p>
      </div>

      <div className="mt-10">
        <SubscribeInline />
      </div>
    </div>
  );
}
