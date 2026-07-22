// 品牌 logo 标记（雷达图形）。纯 SVG，随字号缩放、可继承颜色。
// currentColor 让它在浅/深色模式下自动跟随文字色；也可传 className 覆盖尺寸。

export default function LogoMark({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      role="img"
      aria-label="MCP Radar"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 圆底 */}
      <circle cx="16" cy="16" r="16" fill="currentColor" />
      {/* 雷达同心圆环 */}
      <circle cx="16" cy="16" r="11.5" stroke="white" strokeOpacity="0.35" strokeWidth="1.4" />
      <circle cx="16" cy="16" r="7" stroke="white" strokeOpacity="0.5" strokeWidth="1.4" />
      {/* 十字准线 */}
      <path d="M16 4.5V27.5M4.5 16H27.5" stroke="white" strokeOpacity="0.3" strokeWidth="1.2" />
      {/* 扫描扇区 */}
      <path d="M16 16 L16 4.5 A11.5 11.5 0 0 1 26.4 11.2 Z" fill="white" fillOpacity="0.22" />
      {/* 扫描线 */}
      <path d="M16 16 L26.4 11.2" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
      {/* 目标点（blip） */}
      <circle cx="21.5" cy="9.5" r="2" fill="white" />
    </svg>
  );
}
