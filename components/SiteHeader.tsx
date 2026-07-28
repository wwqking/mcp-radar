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
    { href: "/remote-mcp-servers", label: dict.nav.remote },
    { href: "/leaderboard", label: dict.nav.leaderboard },
    { href: "/radar", label: dict.nav.radar },
    { href: "/guides", label: dict.nav.guides },
    { href: "/graveyard", label: dict.nav.graveyard },
    { href: "/about", label: dict.nav.about },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200/80 bg-canvas-light/90 backdrop-blur dark:border-neutral-800 dark:bg-canvas-dark/90">
      <div className="container-site flex h-14 items-center gap-3">
        <Link href={t("/")} className="flex shrink-0 items-center gap-2" aria-label="MCP Radar">
          <LogoMark className="h-7 w-7 text-brand-600 dark:text-brand-500" />
          <span className="text-base font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            MCP <span className="text-brand-600 dark:text-brand-400">Radar</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 xl:flex">
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

        <div className="ml-auto flex min-w-0 items-center gap-1.5 sm:gap-2">
          <div className="hidden sm:block">
            <SearchBar
              servers={servers}
              locale={locale}
              placeholderHero={dict.searchBar.placeholderHero}
              placeholderNav={dict.searchBar.placeholderNav}
              size="nav"
            />
          </div>
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

      <div className="container-site pb-2 sm:hidden">
        <SearchBar
          servers={servers}
          locale={locale}
          placeholderHero={dict.searchBar.placeholderHero}
          placeholderNav={dict.searchBar.placeholderNav}
          size="hero"
        />
      </div>

      {/* 移动端导航 */}
      <div className="container-site xl:hidden">
        <nav
          className="scrollbar-hidden -mx-1 flex items-center gap-1 overflow-x-auto px-1 pb-2"
          aria-label={locale === "zh" ? "主导航" : "Main navigation"}
        >
          {NAV.map((n) => (
            <Link
              key={n.label}
              href={t(n.href)}
              className="shrink-0 rounded-lg px-3 py-1.5 text-sm text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
