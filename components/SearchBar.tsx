"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { MCPServer } from "@/lib/types";
import { LIFECYCLE_META } from "@/lib/constants";

interface Props {
  servers: MCPServer[];
  size?: "nav" | "hero";
}

/** 全站即时搜索（server 名/用途），导航站第一入口 */
export default function SearchBar({ servers, size = "nav" }: Props) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const results = useMemo(() => {
    const kw = q.trim().toLowerCase();
    if (!kw) return [];
    return servers
      .filter(
        (s) =>
          s.name.toLowerCase().includes(kw) ||
          s.tagline.toLowerCase().includes(kw) ||
          s.description.toLowerCase().includes(kw)
      )
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
    setOpen(false);
    setQ("");
    router.push(`/server/${slug}`);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter" && results[active]) {
      go(results[active].slug);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const isHero = size === "hero";

  return (
    <div ref={boxRef} className={`relative ${isHero ? "w-full" : "w-48 md:w-64"}`}>
      <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-neutral-400">
        <svg className={isHero ? "h-5 w-5" : "h-4 w-4"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
        </svg>
      </div>
      <input
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
          setActive(0);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKey}
        placeholder={isHero ? "搜索 server 名或用途，比如「数据库」「截图」…" : "搜索 server…"}
        className={`w-full rounded-xl border bg-white outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:ring-brand-900 ${
          isHero
            ? "border-neutral-300 py-4 pl-11 pr-4 text-base shadow-sm"
            : "border-neutral-200 py-1.5 pl-9 pr-3 text-sm"
        }`}
      />
      {open && results.length > 0 && (
        <ul className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-900">
          {results.map((s, i) => (
            <li key={s.slug}>
              <button
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
                </span>
                <span className="shrink-0 text-xs text-neutral-400">{s.trustScore}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
