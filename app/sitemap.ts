import type { MetadataRoute } from "next";
import { CATEGORIES, getAllServers } from "@/lib/data";
import { SITE_URL } from "@/lib/site";
import { LOCALES } from "@/lib/i18n/locales";

const BASE = SITE_URL;

// 每个逻辑页面对每种语言各出一条 URL，并用 alternates.languages 声明 hreflang，
// 让搜索引擎知道 /zh/x 与 /en/x 是同一内容的多语言版本。
function entry(path: string, priority: number): MetadataRoute.Sitemap[number][] {
  return LOCALES.map((l) => ({
    url: `${BASE}/${l}${path}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority,
    alternates: {
      languages: Object.fromEntries(LOCALES.map((x) => [x, `${BASE}/${x}${path}`])),
    },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths: Array<[string, number]> = [
    ["", 1],
    ["/leaderboard", 0.7],
    ["/radar", 0.7],
    ["/graveyard", 0.7],
    ["/about", 0.7],
    ["/newsletter", 0.7],
    ["/sponsor", 0.7],
  ];
  const staticPages = staticPaths.flatMap(([p, pr]) => entry(p, pr));

  const categoryPages = CATEGORIES.flatMap((c) => entry(`/category/${c.slug}`, 0.8));

  const allServers = await getAllServers();
  const serverPages = allServers.flatMap((s) => entry(`/server/${s.slug}`, 0.8));

  return [...staticPages, ...categoryPages, ...serverPages];
}
