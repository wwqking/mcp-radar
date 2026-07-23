import type { PickGuide } from "@/lib/pick-guide";
import type { Locale } from "@/lib/i18n/locales";

interface Props {
  guide: PickGuide;
  locale: Locale;
  title: string;
}

/** 选型指南：同类 server「怎么选」的一句总纲 + 「要 X → 选 Y」分流。纯服务端渲染。 */
export default function PickGuideCard({ guide, locale, title }: Props) {
  const t = <T,>(x: { zh: T; en: T }) => (locale === "en" ? x.en : x.zh);

  return (
    <div className="card mb-4 border-brand-200 bg-brand-50/40 p-5 dark:border-brand-900 dark:bg-brand-950/30">
      <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">{title}</h3>
      <p className="mt-1.5 text-sm text-neutral-600 dark:text-neutral-300">{t(guide.intro)}</p>
      <ul className="mt-3 space-y-2">
        {guide.picks.map((p, i) => (
          <li key={i} className="flex flex-col gap-0.5 rounded-lg bg-white px-3 py-2 text-sm dark:bg-neutral-900 sm:flex-row sm:items-baseline sm:gap-2">
            <span className="shrink-0 text-neutral-500 dark:text-neutral-400">{t(p.when)}</span>
            <span className="hidden text-neutral-300 sm:inline">→</span>
            <span className="font-medium text-brand-700 dark:text-brand-300">{t(p.pick)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
