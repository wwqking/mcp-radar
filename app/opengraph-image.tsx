// 全站默认 OG 分享图（1200×630），用 next/og 代码生成，无需二进制资源。
// Next.js 自动把它用作所有页面的 og:image / twitter:image 默认值
//（各页可在 metadata 里覆盖，本轮先统一用这张品牌图）。

import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "MCP Radar —— 找到能用的 MCP server，标注哪个还活着";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// 品牌墨绿（对齐 tailwind.config 的 brand.600）
const BRAND = "#0d6b50";
const CANVAS = "#f4f5f2";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: CANVAS,
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* 顶部 logo 行 */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "18px",
              background: BRAND,
              color: "white",
              fontSize: "42px",
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            M
          </div>
          <div style={{ display: "flex", fontSize: "40px", fontWeight: 800, color: "#111" }}>
            <span>MCP&nbsp;</span>
            <span style={{ color: BRAND }}>Radar</span>
          </div>
        </div>

        {/* 主标语 */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ fontSize: "68px", fontWeight: 800, color: "#111", lineHeight: 1.15 }}>
            找到能用的 MCP server
          </div>
          <div style={{ display: "flex", fontSize: "44px", color: "#444", lineHeight: 1.2 }}>
            <span>按用途分类，</span>
            <span style={{ color: BRAND, fontWeight: 700 }}>标注哪个还活着</span>
          </div>
        </div>

        {/* 底部状态图例 */}
        <div style={{ display: "flex", gap: "40px", fontSize: "30px", color: "#555" }}>
          <div style={{ display: "flex" }}>🟢 活跃</div>
          <div style={{ display: "flex" }}>🟡 半年没更新</div>
          <div style={{ display: "flex" }}>⚰️ 已弃坑</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
