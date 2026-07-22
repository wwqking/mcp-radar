// Apple 触摸图标（180×180），用 next/og 生成，和 favicon / header logo 同款雷达图形。
// Next.js 自动输出为 <link rel="apple-touch-icon">。

import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const BRAND = "#0d6b50"; // 对齐 tailwind.config 的 brand.600

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: BRAND,
        }}
      >
        <svg width="120" height="120" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="11.5" stroke="white" strokeOpacity="0.35" strokeWidth="1.4" />
          <circle cx="16" cy="16" r="7" stroke="white" strokeOpacity="0.5" strokeWidth="1.4" />
          <path d="M16 4.5V27.5M4.5 16H27.5" stroke="white" strokeOpacity="0.3" strokeWidth="1.2" />
          <path d="M16 16 L16 4.5 A11.5 11.5 0 0 1 26.4 11.2 Z" fill="white" fillOpacity="0.22" />
          <path d="M16 16 L26.4 11.2" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="21.5" cy="9.5" r="2" fill="white" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
