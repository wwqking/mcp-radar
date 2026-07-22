import Link from "next/link";
import { CATEGORIES, categoryName } from "@/lib/constants";
import { getLastUpdated } from "@/lib/data";
import type { Locale } from "@/lib/i18n/locales";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizedHref } from "@/lib/i18n/href";

export default async function SiteFooter({ locale }: { locale: Locale }) {
  const lastUpdated = await getLastUpdated();
  const dict = getDictionary(locale);
  const t = (p: string) => localizedHref(locale, p);

  return (
    <footer className="mt-16 border-t border-neutral-200/80 py-10 dark:border-neutral-800">
      <div className="container-site">
        <div className="grid gap-8 md:grid-cols-3">
          {/* 分类地图（SEO 内链） */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-neutral-900 dark:text-neutral-100">{dict.footer.categoryMap}</h4>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              {CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={t(`/category/${c.slug}`)}
                    className="text-sm text-neutral-500 hover:text-brand-600 dark:text-neutral-400 dark:hover:text-brand-400"
                  >
                    {c.icon} {categoryName(c, locale)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-neutral-900 dark:text-neutral-100">{dict.footer.aboutSite}</h4>
            <ul className="space-y-1.5 text-sm text-neutral-500 dark:text-neutral-400">
              <li><Link href={t("/about")} className="hover:text-brand-600 dark:hover:text-brand-400">{dict.footer.methodology}</Link></li>
              <li><Link href={t("/leaderboard")} className="hover:text-brand-600 dark:hover:text-brand-400">{dict.footer.qualityBoard}</Link></li>
              <li><Link href={t("/graveyard")} className="hover:text-brand-600 dark:hover:text-brand-400">{dict.footer.graveyard}</Link></li>
              <li><Link href={t("/sponsor")} className="hover:text-brand-600 dark:hover:text-brand-400">{dict.common.sponsor}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-neutral-900 dark:text-neutral-100">{dict.footer.feedTitle}</h4>
            <ul className="space-y-1.5 text-sm text-neutral-500 dark:text-neutral-400">
              <li><Link href={t("/newsletter")} className="hover:text-brand-600 dark:hover:text-brand-400">{dict.footer.newsletterLink}</Link></li>
              <li><a href="/feed.xml" className="hover:text-brand-600 dark:hover:text-brand-400">RSS</a></li>
              <li><a href="/feed.json" className="hover:text-brand-600 dark:hover:text-brand-400">JSON Feed</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-2 border-t border-neutral-200/80 pt-6 text-xs text-neutral-400 dark:border-neutral-800 dark:text-neutral-500 sm:flex-row sm:items-center">
          <p>{dict.footer.copyright}</p>
          <p>{dict.footer.lastUpdated.replace("{date}", lastUpdated)}</p>
        </div>
      </div>
    </footer>
  );
}
