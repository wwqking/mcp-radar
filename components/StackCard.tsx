import Link from "next/link";
import type { Stack } from "@/lib/stacks";
import type { MCPServer } from "@/lib/types";
import type { Locale } from "@/lib/i18n/locales";
import { localizedHref } from "@/lib/i18n/href";
import { formatNumber } from "@/lib/constants";
import LifecycleBadge from "./LifecycleBadge";

interface Props {
  stack: Stack;
  locale: Locale;
  /** slug → server，用于取活体状态。缺失的 slug 会被跳过（不渲染死链） */
  serverMap: Map<string, MCPServer>;
  /** 底部「首选」这一行的文案（recommended） */
  recommendedLabel: string;
}

/** 组合方案卡：一个目标 → 分阶段 → 每阶段推荐 server（活体状态 + 详情链接）。纯服务端渲染。 */
export default function StackCard({ stack, locale, serverMap, recommendedLabel }: Props) {
  const t = <T,>(x: { zh: T; en: T }) => (locale === "en" ? x.en : x.zh);

  return (
    <div className="card overflow-hidden border-brand-200 bg-brand-50/40 p-5 dark:border-brand-900 dark:bg-brand-950/30 sm:p-6">
      <div className="flex items-start gap-3">
        <span className="text-3xl leading-none">{stack.icon}</span>
        <div className="min-w-0">
          <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 sm:text-lg">
            {t(stack.title)}
          </h3>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">{t(stack.subtitle)}</p>
        </div>
      </div>

      <ol className="mt-5 grid gap-3 sm:grid-cols-2">
        {stack.stages.map((stage) => {
          const servers = stage.slugs
            .map((slug) => serverMap.get(slug))
            .filter((s): s is MCPServer => Boolean(s));
          if (servers.length === 0) return null;

          return (
            <li
              key={t(stage.title)}
              className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900"
            >
              <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                {t(stage.title)}
              </p>
              <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">{t(stage.desc)}</p>

              <ul className="mt-3 space-y-1.5">
                {servers.map((s, i) => (
                  <li key={s.slug}>
                    <Link
                      href={localizedHref(locale, `/server/${s.slug}`)}
                      className="group flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-neutral-50 dark:hover:bg-neutral-800/60"
                    >
                      <span className="mono min-w-0 flex-1 truncate text-sm text-brand-700 group-hover:underline dark:text-brand-300">
                        {s.name}
                      </span>
                      {i === 0 && (
                        <span className="shrink-0 rounded bg-brand-100 px-1.5 py-0.5 text-[10px] font-medium text-brand-700 dark:bg-brand-900/60 dark:text-brand-300">
                          {recommendedLabel}
                        </span>
                      )}
                      <span className="shrink-0 text-[11px] text-neutral-400">
                        {formatNumber(s.signals.stars)} ⭐
                      </span>
                      <LifecycleBadge status={s.lifecycle} locale={locale} size="sm" />
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
