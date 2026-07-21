import { getRadarEntries } from "@/lib/data";
import { SITE_URL } from "@/lib/site";

const BASE = SITE_URL;

export const dynamic = "force-static";

/** JSON Feed 1.1：输出本周雷达动态 */
export async function GET() {
  const { trending, added, dead } = await getRadarEntries();
  const items = [...trending, ...added, ...dead];
  const now = new Date().toISOString();

  const feed = {
    version: "https://jsonfeed.org/version/1.1",
    title: "MCP Radar —— 趋势雷达",
    home_page_url: BASE,
    feed_url: `${BASE}/feed.json`,
    description: "每周 MCP 生态动态：新增 server、爆火趋势、弃坑预警。",
    language: "zh-CN",
    items: items.map((e) => ({
      id: `${BASE}/server/${e.server.slug}#${e.kind}`,
      url: `${BASE}/server/${e.server.slug}`,
      title: `${e.server.name} —— ${e.evidence}`,
      content_text: `${e.server.tagline}。${e.evidence}`,
      date_published: now,
      tags: [e.kind],
    })),
  };

  return Response.json(feed);
}
