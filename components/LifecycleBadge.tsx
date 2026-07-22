import type { Lifecycle } from "@/lib/types";
import { LIFECYCLE_META, lifecycleLabel } from "@/lib/constants";
import type { Locale } from "@/lib/i18n/locales";

interface Props {
  status: Lifecycle;
  locale: Locale;
  size?: "sm" | "md";
}

/** 生命周期标记：active / dying / dead / unverifiable */
export default function LifecycleBadge({ status, locale, size = "md" }: Props) {
  const meta = LIFECYCLE_META[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${meta.colorClass} ${
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dotClass}`} />
      {lifecycleLabel(status, locale)}
    </span>
  );
}
