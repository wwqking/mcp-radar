import type { Locale } from "@/lib/i18n/locales";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizedHref } from "@/lib/i18n/href";
import SubscribeForm, { type SubscribeFormStrings } from "./SubscribeForm";

interface Props {
  locale: Locale;
  variant?: "default" | "compact";
  /** 订阅来源打标，用于区分不同入口的转化 */
  source?: string;
}

/** 把词典拼成客户端表单需要的字符串集合。 */
export function subscribeStrings(locale: Locale): SubscribeFormStrings {
  const dict = getDictionary(locale);
  const inline = dict.subscribeInline;
  const form = dict.subscribeForm;
  return {
    cta: inline.cta,
    submitting: form.submitting,
    success: form.success,
    already: form.already,
    invalidEmail: form.invalidEmail,
    notConfigured: form.notConfigured,
    error: form.error,
  };
}

/** 内嵌订阅钩子（真实提交，见 components/SubscribeForm.tsx） */
export default function SubscribeInline({ locale, variant = "default", source = "inline" }: Props) {
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
        <div className="mt-4">
          <SubscribeForm strings={subscribeStrings(locale)} source={source} />
        </div>
        <p className="mt-2 text-xs text-neutral-400">{t.note}</p>
      </div>
    </div>
  );
}
