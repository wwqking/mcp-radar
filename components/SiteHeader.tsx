import Link from "next/link";
import { getAllServers } from "@/lib/data";
import SearchBar from "./SearchBar";
import ThemeToggle from "./ThemeToggle";
import LogoMark from "./Logo";
import LocaleSwitcher from "./LocaleSwitcher";
import type { Locale } from "@/lib/i18n/locales";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizedHref } from "@/lib/i18n/href";

export default async function SiteHeader({ locale }: { locale: Locale }) {
  const servers = await getAllServers();
  const dict = getDictionary(locale);
  const t = (p: string) => localizedHref(locale, p);

  const NAV = [
    { href: "/#categories", label: dict.nav.categories },
    { href: "/leaderboard", label: dict.nav.leaderboard },
    { href: "/radar", label: dict.nav.radar },
    { href: "/graveyard", label: dict.nav.graveyard },
    { href: "/about", label: dict.nav.about },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200/80 bg-canvas-light/90 backdrop-blur dark:border-neutral-800 dark:bg-canvas-dark/90">
      <div className="container-site flex h-14 items-center gap-4">
        <Link href={t("/")} className="flex shrink-0 items-center gap-2">
          <LogoMark className="h-7 w-7 text-brand-600 dark:text-brand-500" />
          <span className="text-base font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            MCP <span className="text-brand-600 dark:text-brand-400">Radar</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.label}
              href={t(n.href)}
              className="rounded-lg px-3 py-1.5 text-sm text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <SearchBar
            servers={servers}
            locale={locale}
            placeholderHero={dict.searchBar.placeholderHero}
            placeholderNav={dict.searchBar.placeholderNav}
            size="nav"
          />
          <LocaleSwitcher current={locale} />
          <ThemeToggle />
          <Link
            href={t("/newsletter")}
            className="hidden rounded-lg border border-brand-600 px-3 py-1.5 text-sm font-medium text-brand-700 hover:bg-brand-50 dark:border-brand-500 dark:text-brand-300 dark:hover:bg-brand-950 sm:block"
          >
            {dict.common.subscribe}
          </Link>
        </div>
      </div>

      {/* 移动端导航 */}
      <nav className="container-site flex items-center gap-1 overflow-x-auto pb-2 md:hidden">
        {NAV.map((n) => (
          <Link
            key={n.label}
            href={t(n.href)}
            className="shrink-0 rounded-lg px-3 py-1 text-sm text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
          >
            {n.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
