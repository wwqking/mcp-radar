import type { ServerCapability } from "@/lib/server-capabilities";
import type { Locale } from "@/lib/i18n/locales";

interface Props {
  cap: ServerCapability;
  locale: Locale;
  strings: {
    capabilitiesTitle: string; // "它能帮你做什么"
    whatCanDo: string; // "能力"
    tryTitle: string; // "装好后，试试这样问 AI"
    tryNote: string;
  };
}

/** 详情页「能解决什么问题」卡片：一句能力 + 能力清单 + 示例句。
 *  纯服务端渲染（内容进 SSG HTML，对 SEO/GEO 友好）。 */
export default function CapabilityCard({ cap, locale, strings }: Props) {
  const t = <T,>(x: { zh: T; en: T }) => (locale === "en" ? x.en : x.zh);

  return (
    <section className="card mt-6 border-brand-200 bg-brand-50/40 p-5 dark:border-brand-900 dark:bg-brand-950/30 sm:p-6">
      <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
        {strings.capabilitiesTitle}
      </h2>
      <p className="mt-2 text-sm leading-6 text-neutral-700 dark:text-neutral-300">{t(cap.whatItDoes)}</p>

      {cap.capabilities.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">{strings.whatCanDo}</p>
          <ul className="flex flex-wrap gap-2">
            {cap.capabilities.map((c, i) => (
              <li
                key={i}
                className="rounded-full border border-brand-200 bg-white px-3 py-1 text-xs text-neutral-700 dark:border-brand-900 dark:bg-neutral-900 dark:text-neutral-300"
              >
                {t(c)}
              </li>
            ))}
          </ul>
        </div>
      )}

      {cap.examplePrompts.length > 0 && (
        <div className="mt-5">
          <p className="mb-1 text-sm font-semibold text-neutral-800 dark:text-neutral-200">{strings.tryTitle}</p>
          <p className="mb-3 text-xs text-neutral-400">{strings.tryNote}</p>
          <ul className="space-y-2">
            {cap.examplePrompts.map((p, i) => (
              <li
                key={i}
                className="flex gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300"
              >
                <span className="select-none text-brand-500">›</span>
                <span className="italic">“{t(p)}”</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
