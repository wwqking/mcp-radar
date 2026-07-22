"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LOCALES, LOCALE_LABELS, type Locale } from "@/lib/i18n/locales";
import { localizedHref } from "@/lib/i18n/href";

/** 语言切换：在当前路径上替换 locale 前缀，保留用户所在页面。 */
export default function LocaleSwitcher({ current }: { current: Locale }) {
  const pathname = usePathname() || `/${current}`;

  function pick(locale: Locale) {
    // 记住选择，middleware 下次凭 cookie 判定默认语言
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; samesite=lax`;
  }

  return (
    <div className="flex items-center rounded-lg border border-neutral-200 p-0.5 text-xs dark:border-neutral-700">
      {LOCALES.map((l) => {
        const active = l === current;
        return (
          <Link
            key={l}
            href={localizedHref(l, pathname)}
            onClick={() => pick(l)}
            hrefLang={l}
            aria-current={active ? "true" : undefined}
            className={
              active
                ? "rounded-md bg-brand-600 px-2 py-1 font-medium text-white"
                : "rounded-md px-2 py-1 text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-100"
            }
          >
            {LOCALE_LABELS[l]}
          </Link>
        );
      })}
    </div>
  );
}
