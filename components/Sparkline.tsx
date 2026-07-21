interface Props {
  data: number[];
  width?: number;
  height?: number;
  /** 涨 green / 跌 red（开发者直觉：增长=绿）或品牌绿；默认按趋势自动 */
  tone?: "auto" | "brand";
}

/** 极简 sparkline（SVG 折线） */
export default function Sparkline({ data, width = 120, height = 32, tone = "auto" }: Props) {
  if (!data || data.length < 2) {
    return <span className="text-xs text-neutral-400">无数据</span>;
  }
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pad = 2;
  const points = data
    .map((v, i) => {
      const x = pad + (i / (data.length - 1)) * (width - pad * 2);
      const y = pad + (1 - (v - min) / range) * (height - pad * 2);
      return `${x},${y}`;
    })
    .join(" ");

  const rising = data[data.length - 1] >= data[0];
  const stroke =
    tone === "brand" ? "#0d6b50" : rising ? "#059669" : "#dc2626"; // 涨绿跌红（开发者直觉）

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline points={points} fill="none" stroke={stroke} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}
