import type { Lifecycle } from "@/lib/types";
import { LIFECYCLE_META } from "@/lib/constants";

interface Props {
  status: Lifecycle;
  size?: "sm" | "md";
}

/** 生命周期标记：active / dying / dead / unverifiable */
export default function LifecycleBadge({ status, size = "md" }: Props) {
  const meta = LIFECYCLE_META[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${meta.colorClass} ${
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dotClass}`} />
      {meta.label}
    </span>
  );
}
