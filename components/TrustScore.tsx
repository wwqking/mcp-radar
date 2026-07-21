interface Props {
  value: number; // 0-100
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

/** TrustScore 环形指示器（0-100，分色） */
export default function TrustScore({ value, size = "md", showLabel = false }: Props) {
  const dims = { sm: 32, md: 44, lg: 88 }[size];
  const stroke = size === "lg" ? 7 : size === "md" ? 4.5 : 3.5;
  const r = (dims - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - value / 100);

  const color =
    value >= 80
      ? "stroke-emerald-500"
      : value >= 60
        ? "stroke-lime-500"
        : value >= 40
          ? "stroke-amber-500"
          : "stroke-red-500";

  const textColor =
    value >= 80
      ? "text-emerald-600 dark:text-emerald-400"
      : value >= 60
        ? "text-lime-600 dark:text-lime-400"
        : value >= 40
          ? "text-amber-600 dark:text-amber-400"
          : "text-red-600 dark:text-red-400";

  return (
    <div className="flex items-center gap-2" title={`TrustScore: ${value}/100`}>
      <div className="relative" style={{ width: dims, height: dims }}>
        <svg width={dims} height={dims} className="-rotate-90">
          <circle
            cx={dims / 2}
            cy={dims / 2}
            r={r}
            fill="none"
            strokeWidth={stroke}
            className="stroke-neutral-200 dark:stroke-neutral-700"
          />
          <circle
            cx={dims / 2}
            cy={dims / 2}
            r={r}
            fill="none"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
            className={color}
          />
        </svg>
        <span
          className={`absolute inset-0 flex items-center justify-center font-semibold ${textColor} ${
            size === "lg" ? "text-xl" : size === "md" ? "text-xs" : "text-[10px]"
          }`}
        >
          {value}
        </span>
      </div>
      {showLabel && (
        <span className="text-xs text-neutral-500 dark:text-neutral-400">TrustScore</span>
      )}
    </div>
  );
}
