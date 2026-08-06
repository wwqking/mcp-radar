"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LIFECYCLE_META } from "@/lib/constants";
import type { Locale } from "@/lib/i18n/locales";
import { localizedHref } from "@/lib/i18n/href";
import { trackEvent } from "@/lib/analytics";
import { useSearchServers } from "@/components/SearchProvider";

interface Props {
  locale: Locale;
  placeholderHero: string;
  placeholderNav: string;
  size?: "nav" | "hero" | "responsive";
}

/** 全站即时搜索（server 名/用途），导航站第一入口 */
export default function SearchBar({ locale, placeholderHero, placeholderNav, size = "nav" }: Props) {
  const { servers, loading, ensureLoaded } = useSearchServers();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const results = useMemo(() => {
    const kw = q.trim().toLowerCase();
    if (!kw) return [];
    const terms = kw.split(/\s+/).filter(Boolean);
    return servers
      .map((server) => {
        const name = server.name.toLowerCase();
        const tagline = server.tagline.toLowerCase();
        const searchable = `${name} ${tagline} ${server.searchText}`;
        if (!terms.every((term) => searchable.includes(term))) {
          return { server, relevance: 0 };
        }
        let relevance = 0;
        if (name === kw) relevance += 1000;
        else if (name.startsWith(kw)) relevance += 700;
        else if (name.includes(kw)) relevance += 450;
        if (tagline.includes(kw)) relevance += 180;
        if (server.topicLabels.some((label) => label.toLowerCase().includes(kw))) relevance += 140;
        if (server.searchText.includes(kw)) relevance += 100;
        relevance += terms.filter((term) => name.includes(term)).length * 80;
        if (server.lifecycle === "active") relevance += 20;
        relevance += server.trustScore / 10;
        return { server, relevance };
      })
      .filter(({ relevance }) => relevance >= 100)
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 8);
  }, [q, servers]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const go = (slug: string) => {
    trackEvent("Search Result Click", {
      server: slug,
      placement: size,
    });
    setOpen(false);
    setQ("");
    router.push(localizedHref(locale, `/server/${slug}`));
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (results.length === 0) return;
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (results.length === 0) return;
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter" && results[active]) {
      go(results[active].server.slug);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const isHero = size === "hero";
  const isResponsive = size === "responsive";

  return (
    <div
      ref={boxRef}
      className={`relative ${
        isHero
          ? "w-full"
          : isResponsive
            ? "w-full sm:w-40 md:w-52 lg:w-64"
            : "w-40 md:w-52 lg:w-64"
      }`}
    >
      <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-neutral-400">
        <svg className={isHero ? "h-5 w-5" : "h-4 w-4"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
        </svg>
      </div>
      <input
        value={q}
        onChange={(e) => {
          ensureLoaded();
          setQ(e.target.value);
          setOpen(true);
          setActive(0);
        }}
        onFocus={() => {
          ensureLoaded();
          setOpen(true);
        }}
        onKeyDown={onKey}
        placeholder={isHero ? placeholderHero : placeholderNav}
        aria-label={locale === "zh" ? "搜索 MCP server" : "Search MCP servers"}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls="mcp-search-results"
        aria-activedescendant={open && results[active] ? `mcp-search-result-${active}` : undefined}
        className={`w-full rounded-xl border bg-white outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:ring-brand-900 ${
          isHero
            ? "border-neutral-300 py-3 pl-11 pr-4 text-base shadow-sm sm:py-4"
            : "border-neutral-200 py-1.5 pl-9 pr-3 text-sm"
        }`}
      />
      {open && q.trim() && (
        <div
          id="mcp-search-results"
          className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-900"
        >
          {loading ? (
            <div className="px-4 py-4 text-sm text-neutral-600 dark:text-neutral-300" role="status">
              {locale === "zh" ? "正在加载搜索索引…" : "Loading search index…"}
            </div>
          ) : results.length === 0 ? (
            <div className="px-4 py-4 text-sm text-neutral-600 dark:text-neutral-300" role="status">
              <p className="font-medium">
                {locale === "zh" ? "暂时没找到匹配的 server" : "No matching servers yet"}
              </p>
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                {locale === "zh"
                  ? "试试产品名、用途或主题，例如 Stripe、安全扫描、画图。"
                  : "Try a product, use case or topic, such as Stripe, security scan or charts."}
              </p>
            </div>
          ) : (
          <ul role="listbox">
          {results.map(({ server: s }, i) => (
            <li key={s.slug} role="none">
              <button
                id={`mcp-search-result-${i}`}
                role="option"
                aria-selected={i === active}
                onMouseDown={() => go(s.slug)}
                onMouseEnter={() => setActive(i)}
                className={`flex w-full items-center gap-3 px-4 py-2.5 text-left ${
                  i === active ? "bg-brand-50 dark:bg-brand-950" : ""
                }`}
              >
                <span className={`h-2 w-2 shrink-0 rounded-full ${LIFECYCLE_META[s.lifecycle].dotClass}`} />
                <span className="min-w-0 flex-1">
                  <span className="mono block truncate text-sm font-medium text-neutral-800 dark:text-neutral-200">
                    {s.name}
                  </span>
                  <span className="block truncate text-xs text-neutral-500 dark:text-neutral-400">
                    {s.tagline}
                  </span>
                  {s.topicLabels.length > 0 && (
                    <span className="mt-1 block truncate text-[11px] text-brand-600 dark:text-brand-400">
                      {s.topicLabels.join(" · ")}
                    </span>
                  )}
                </span>
                <span className="shrink-0 text-xs text-neutral-400">{s.trustScore}</span>
              </button>
            </li>
          ))}
          </ul>
          )}
        </div>
      )}
    </div>
  );
}
