"use client";

import { useEffect, useState } from "react";
import { getCompare, clearCompare, removeCompare, subscribeCompare } from "@/lib/compare-store";
import { localizedHref } from "@/lib/i18n/href";
import type { Locale } from "@/lib/i18n/locales";

interface Props {
  locale: Locale;
  strings: { trayLabel: string; compareCta: string; clear: string };
}

/** 浮动对比栏：选了 ≥1 个 server 时从底部浮现，链到 /compare?ids=… */
export default function CompareTray({ locale, strings }: Props) {
  const [slugs, setSlugs] = useState<string[]>([]);

  useEffect(() => {
    const sync = () => setSlugs(getCompare());
    sync();
    return subscribeCompare(sync);
  }, []);

  if (slugs.length === 0) return null;

  const href = `${localizedHref(locale, "/compare")}?ids=${encodeURIComponent(slugs.join(","))}`;

  return (
    <div className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
      <div className="flex max-w-full items-center gap-3 rounded-full border border-neutral-200 bg-white/95 px-4 py-2 shadow-lg backdrop-blur dark:border-neutral-700 dark:bg-neutral-900/95">
        <span className="hidden text-xs font-semibold text-neutral-400 sm:inline">{strings.trayLabel}</span>
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {slugs.map((s) => (
            <span
              key={s}
              className="mono flex shrink-0 items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-1 text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
            >
              {s.length > 22 ? s.slice(0, 22) + "…" : s}
              <button
                type="button"
                onClick={() => removeCompare(s)}
                aria-label="remove"
                className="text-neutral-400 hover:text-red-500"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <button
          type="button"
          onClick={() => clearCompare()}
          className="shrink-0 text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
        >
          {strings.clear}
        </button>
        <a
          href={href}
          className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium text-white ${
            slugs.length >= 2 ? "bg-brand-600 hover:bg-brand-700" : "pointer-events-none bg-neutral-300 dark:bg-neutral-700"
          }`}
        >
          {strings.compareCta} ({slugs.length})
        </a>
      </div>
    </div>
  );
}
