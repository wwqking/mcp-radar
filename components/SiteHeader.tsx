import Link from "next/link";
import { getAllServers } from "@/lib/data";
import SearchBar from "./SearchBar";
import ThemeToggle from "./ThemeToggle";

const NAV = [
  { href: "/#categories", label: "分类" },
  { href: "/leaderboard", label: "榜单" },
  { href: "/radar", label: "雷达" },
  { href: "/graveyard", label: "墓地" },
  { href: "/about", label: "关于" },
];

export default async function SiteHeader() {
  const servers = await getAllServers();
  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200/80 bg-canvas-light/90 backdrop-blur dark:border-neutral-800 dark:bg-canvas-dark/90">
      <div className="container-site flex h-14 items-center gap-4">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
            M
          </span>
          <span className="text-base font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            MCP <span className="text-brand-600 dark:text-brand-400">Radar</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.label}
              href={n.href}
              className="rounded-lg px-3 py-1.5 text-sm text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <SearchBar servers={servers} size="nav" />
          <ThemeToggle />
          <Link
            href="/newsletter"
            className="hidden rounded-lg border border-brand-600 px-3 py-1.5 text-sm font-medium text-brand-700 hover:bg-brand-50 dark:border-brand-500 dark:text-brand-300 dark:hover:bg-brand-950 sm:block"
          >
            订阅
          </Link>
        </div>
      </div>

      {/* 移动端导航 */}
      <nav className="container-site flex items-center gap-1 overflow-x-auto pb-2 md:hidden">
        {NAV.map((n) => (
          <Link
            key={n.label}
            href={n.href}
            className="shrink-0 rounded-lg px-3 py-1 text-sm text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
          >
            {n.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
