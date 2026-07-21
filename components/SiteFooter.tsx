import Link from "next/link";
import { CATEGORIES } from "@/lib/constants";
import { getLastUpdated } from "@/lib/data";

export default async function SiteFooter() {
  const lastUpdated = await getLastUpdated();
  return (
    <footer className="mt-16 border-t border-neutral-200/80 py-10 dark:border-neutral-800">
      <div className="container-site">
        <div className="grid gap-8 md:grid-cols-3">
          {/* 分类地图（SEO 内链） */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-neutral-900 dark:text-neutral-100">分类地图</h4>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              {CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/category/${c.slug}`}
                    className="text-sm text-neutral-500 hover:text-brand-600 dark:text-neutral-400 dark:hover:text-brand-400"
                  >
                    {c.icon} {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-neutral-900 dark:text-neutral-100">关于本站</h4>
            <ul className="space-y-1.5 text-sm text-neutral-500 dark:text-neutral-400">
              <li><Link href="/about" className="hover:text-brand-600 dark:hover:text-brand-400">评分方法论</Link></li>
              <li><Link href="/leaderboard" className="hover:text-brand-600 dark:hover:text-brand-400">质量榜</Link></li>
              <li><Link href="/graveyard" className="hover:text-brand-600 dark:hover:text-brand-400">MCP 墓地</Link></li>
              <li><Link href="/sponsor" className="hover:text-brand-600 dark:hover:text-brand-400">赞助</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-neutral-900 dark:text-neutral-100">订阅与 Feed</h4>
            <ul className="space-y-1.5 text-sm text-neutral-500 dark:text-neutral-400">
              <li><Link href="/newsletter" className="hover:text-brand-600 dark:hover:text-brand-400">📬 每周雷达 Newsletter</Link></li>
              <li><a href="/feed.xml" className="hover:text-brand-600 dark:hover:text-brand-400">RSS</a></li>
              <li><a href="/feed.json" className="hover:text-brand-600 dark:hover:text-brand-400">JSON Feed</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-2 border-t border-neutral-200/80 pt-6 text-xs text-neutral-400 dark:border-neutral-800 dark:text-neutral-500 sm:flex-row sm:items-center">
          <p>© 2026 MCP Radar · 评分只由公开数据决定，排名绝不出售</p>
          <p>数据每日更新，最后更新于 {lastUpdated}</p>
        </div>
      </div>
    </footer>
  );
}
