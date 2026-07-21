import { getRadarEntries } from "@/lib/data";
import { SITE_URL } from "@/lib/site";

const BASE = SITE_URL;

export const dynamic = "force-static";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** RSS 2.0 feed：输出本周雷达动态 */
export async function GET() {
  const { trending, added, dead } = await getRadarEntries();
  const items = [...trending, ...added, ...dead];
  const now = new Date().toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>MCP Radar —— 趋势雷达</title>
    <link>${BASE}/radar</link>
    <description>每周 MCP 生态动态：新增 server、爆火趋势、弃坑预警。</description>
    <language>zh-CN</language>
    <lastBuildDate>${now}</lastBuildDate>
${items
  .map(
    (e) => `    <item>
      <title>${escapeXml(`${e.server.name} —— ${e.evidence}`)}</title>
      <link>${BASE}/server/${e.server.slug}</link>
      <guid>${BASE}/server/${e.server.slug}#${e.kind}</guid>
      <description>${escapeXml(`${e.server.tagline}。${e.evidence}`)}</description>
      <pubDate>${now}</pubDate>
    </item>`
  )
  .join("\n")}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
