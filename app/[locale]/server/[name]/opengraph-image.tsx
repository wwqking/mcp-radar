// 每个 server 详情页的专属 OG 分享图（1200×630），代码生成。
// 覆盖全站默认 OG（app/[locale]/opengraph-image.tsx），带 server 名 + TrustScore + 生命周期。
// 与详情页同为 SSG：generateStaticParams 让每个 server 各出一张静态图。

import { ImageResponse } from "next/og";
import { getAllServers, getServerBySlug } from "@/lib/data";
import { lifecycleLabel, LIFECYCLE_META } from "@/lib/constants";
import { isLocale } from "@/lib/i18n/locales";
import type { Lifecycle } from "@/lib/types";

export const runtime = "nodejs";
export const alt = "MCP Radar server profile";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BRAND = "#0d6b50";
const CANVAS = "#f4f5f2";

// 生命周期主色（用十六进制，next/og 不吃 tailwind class）
const LIFECYCLE_COLOR: Record<Lifecycle, string> = {
  active: "#059669",
  dying: "#d97706",
  dead: "#dc2626",
  unverifiable: "#737373",
};

// TrustScore 环形色：跟详情页进度条同档
function scoreColor(v: number): string {
  if (v >= 80) return "#059669";
  if (v >= 60) return "#65a30d";
  if (v >= 40) return "#d97706";
  return "#dc2626";
}

export async function generateStaticParams() {
  const servers = await getAllServers();
  return servers.map((s) => ({ name: s.slug }));
}

export default async function ServerOgImage({
  params,
}: {
  params: { name: string; locale: string };
}) {
  const locale = isLocale(params.locale) ? params.locale : "en";
  const s = await getServerBySlug(params.name);

  // 兜底：数据缺失时退回品牌图，绝不抛错让整站构建挂掉。
  if (!s) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: CANVAS,
            fontSize: 64,
            fontWeight: 800,
            color: BRAND,
            fontFamily: "sans-serif",
          }}
        >
          MCP Radar
        </div>
      ),
      { ...size },
    );
  }

  const life = LIFECYCLE_META[s.lifecycle];
  const lifeColor = LIFECYCLE_COLOR[s.lifecycle];
  const score = s.trustScore;
  const ring = scoreColor(score);

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
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* 顶部品牌行 */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "14px",
              background: BRAND,
              color: "white",
              fontSize: "32px",
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            M
          </div>
          <div style={{ display: "flex", fontSize: "30px", fontWeight: 800, color: "#111" }}>
            <span>MCP&nbsp;</span>
            <span style={{ color: BRAND }}>Radar</span>
          </div>
        </div>

        {/* 中部：server 名 + 生命周期徽标 */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              fontSize: "26px",
              fontWeight: 700,
              color: lifeColor,
            }}
          >
            <span>{life.emoji}</span>
            <span>{lifecycleLabel(s.lifecycle, locale)}</span>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: s.name.length > 34 ? "52px" : "66px",
              fontWeight: 800,
              color: "#111",
              lineHeight: 1.1,
              // 名字太长时截断，避免溢出画布
              overflow: "hidden",
            }}
          >
            {s.name}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "30px",
              color: "#555",
              lineHeight: 1.3,
              maxWidth: "760px",
            }}
          >
            {s.tagline.length > 90 ? s.tagline.slice(0, 90) + "…" : s.tagline}
          </div>
        </div>

        {/* 底部：TrustScore 大数字 + 关键信号 */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "128px",
                height: "128px",
                borderRadius: "64px",
                border: `10px solid ${ring}`,
                color: "#111",
              }}
            >
              <span style={{ fontSize: "52px", fontWeight: 800 }}>{score}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={{ fontSize: "22px", fontWeight: 700, color: "#333" }}>TrustScore</span>
              <span style={{ fontSize: "20px", color: "#777" }}>/ 100</span>
            </div>
          </div>

          <div style={{ display: "flex", gap: "36px", fontSize: "26px", color: "#444" }}>
            {s.signals.stars > 0 && (
              <div style={{ display: "flex", gap: "8px" }}>
                <span>⭐</span>
                <span style={{ fontWeight: 700 }}>{formatStars(s.signals.stars)}</span>
              </div>
            )}
            {s.signals.npmWeeklyDownloads !== null && s.signals.npmWeeklyDownloads > 0 && (
              <div style={{ display: "flex", gap: "8px" }}>
                <span>📦</span>
                <span style={{ fontWeight: 700 }}>{formatStars(s.signals.npmWeeklyDownloads)}/wk</span>
              </div>
            )}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}

function formatStars(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  return String(n);
}
