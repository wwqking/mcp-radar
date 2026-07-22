import type { Locale } from "@/lib/i18n/locales";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizedHref } from "@/lib/i18n/href";

interface Props {
  locale: Locale;
  variant?: "default" | "compact";
}

/** 内嵌订阅钩子（静态演示：表单暂不提交） */
export default function SubscribeInline({ locale, variant = "default" }: Props) {
  const t = getDictionary(locale).subscribeInline;
  const newsletterHref = localizedHref(locale, "/newsletter");

  if (variant === "compact") {
    return (
      <div className="card flex flex-col items-start gap-3 border-dashed p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-neutral-600 dark:text-neutral-300">{t.compactText}</p>
        <a
          href={newsletterHref}
          className="shrink-0 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          {t.compactCta}
        </a>
      </div>
    );
  }

  return (
    <div className="card border-brand-200 bg-brand-50/50 p-6 dark:border-brand-900 dark:bg-brand-950/40 sm:p-8">
      <div className="mx-auto max-w-xl text-center">
        <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">{t.title}</h3>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{t.desc}</p>
        <form className="mt-4 flex flex-col gap-2 sm:flex-row">
          <input
            type="email"
            required
            placeholder="you@example.com"
            className="flex-1 rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:ring-brand-900"
          />
          <button
            type="submit"
            className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
          >
            {t.cta}
          </button>
        </form>
        <p className="mt-2 text-xs text-neutral-400">{t.note}</p>
      </div>
    </div>
  );
}
