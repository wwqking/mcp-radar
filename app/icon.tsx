// 站点 favicon（32×32），用 next/og 代码生成，和 header 里的雷达 logo 保持一致。
// Next.js 自动把它输出为 <link rel="icon">。

import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

const BRAND = "#0d6b50"; // 对齐 tailwind.config 的 brand.600

export default function Icon() {
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
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="11.5" stroke="white" strokeOpacity="0.35" strokeWidth="1.6" />
          <circle cx="16" cy="16" r="7" stroke="white" strokeOpacity="0.5" strokeWidth="1.6" />
          <path d="M16 16 L16 4.5 A11.5 11.5 0 0 1 26.4 11.2 Z" fill="white" fillOpacity="0.22" />
          <path d="M16 16 L26.4 11.2" stroke="white" strokeWidth="2" strokeLinecap="round" />
          <circle cx="21.5" cy="9.5" r="2.4" fill="white" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
