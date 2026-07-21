interface Props {
  icon: string;
  label: string;
  value: React.ReactNode;
  hint?: string;
  tone?: "default" | "good" | "warn" | "bad";
}

const toneClass = {
  default: "text-neutral-800 dark:text-neutral-200",
  good: "text-emerald-600 dark:text-emerald-400",
  warn: "text-amber-600 dark:text-amber-400",
  bad: "text-red-600 dark:text-red-400",
};

/** 单条健康信号 */
export default function SignalRow({ icon, label, value, hint, tone = "default" }: Props) {
  return (
    <div className="flex items-start gap-3 py-2.5">
      <span className="mt-0.5 text-base leading-none">{icon}</span>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-sm text-neutral-500 dark:text-neutral-400">{label}</span>
          <span className={`text-sm font-medium ${toneClass[tone]}`}>{value}</span>
        </div>
        {hint && <p className="mt-0.5 text-xs text-neutral-400 dark:text-neutral-500">{hint}</p>}
      </div>
    </div>
  );
}
