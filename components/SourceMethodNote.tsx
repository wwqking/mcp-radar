import type { Locale } from "@/lib/i18n/locales";
import { getDictionary } from "@/lib/i18n/dictionaries";

interface Props {
  locale: Locale;
  sources: string[];
  updatedAt?: string;
  className?: string;
}

/** "数据来自 X，更新于 Y" 透明标注 */
export default function SourceMethodNote({ locale, sources, updatedAt, className = "" }: Props) {
  const t = getDictionary(locale).sourceNote;
  return (
    <p className={`text-xs text-neutral-400 dark:text-neutral-500 ${className}`}>
      {t.sources}{sources.join(" · ")}
      {updatedAt ? t.updatedAt.replace("{date}", updatedAt) : ""}
    </p>
  );
}
