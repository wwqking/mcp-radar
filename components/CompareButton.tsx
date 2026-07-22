"use client";

import { useEffect, useState } from "react";
import { isInCompare, toggleCompare, subscribeCompare, getCompare, MAX_COMPARE } from "@/lib/compare-store";

interface Props {
  slug: string;
  strings: { add: string; added: string; full: string };
}

/** 详情页「加入对比」开关，状态与浮动对比栏实时同步。 */
export default function CompareButton({ slug, strings }: Props) {
  const [mounted, setMounted] = useState(false);
  const [inList, setInList] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    setMounted(true);
    const sync = () => {
      setInList(isInCompare(slug));
      setCount(getCompare().length);
    };
    sync();
    return subscribeCompare(sync);
  }, [slug]);

  // SSR/首帧：渲染中性占位，避免 hydration 抖动
  if (!mounted) {
    return (
      <button
        type="button"
        className="rounded-lg border border-neutral-200 px-3 py-1.5 text-sm text-neutral-600 dark:border-neutral-700 dark:text-neutral-300"
      >
        + {strings.add}
      </button>
    );
  }

  const full = !inList && count >= MAX_COMPARE;

  return (
    <button
      type="button"
      onClick={() => toggleCompare(slug)}
      disabled={full}
      title={full ? strings.full : undefined}
      className={`rounded-lg border px-3 py-1.5 text-sm transition ${
        inList
          ? "border-brand-500 bg-brand-50 text-brand-700 dark:border-brand-500 dark:bg-brand-950 dark:text-brand-300"
          : "border-neutral-200 text-neutral-600 hover:border-brand-400 hover:text-brand-700 disabled:opacity-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:text-brand-300"
      }`}
    >
      {inList ? strings.added : `+ ${strings.add}`}
    </button>
  );
}
