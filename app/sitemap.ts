import type { MetadataRoute } from "next";
import { CATEGORIES, getAllServers, getLastUpdated } from "@/lib/data";
import { SITE_URL } from "@/lib/site";
import { LOCALES } from "@/lib/i18n/locales";
import { getSeoLandingSlugs } from "@/lib/seo-landing";
import { getGuideModifiedAt, getGuideSlugs } from "@/lib/guides";

const BASE = SITE_URL;

// 每个逻辑页面对每种语言各出一条 URL，并用 alternates.languages 声明 hreflang，
// 让搜索引擎知道 /zh/x 与 /en/x 是同一内容的多语言版本。
function entry(
  path: string,
  priority: number,
  lastModified: string,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "weekly",
): MetadataRoute.Sitemap[number][] {
  return LOCALES.map((l) => ({
    url: `${BASE}/${l}${path}`,
    lastModified,
    changeFrequency,
    priority,
    alternates: {
      languages: {
        ...Object.fromEntries(LOCALES.map((x) => [x, `${BASE}/${x}${path}`])),
        "x-default": `${BASE}/en${path}`,
      },
    },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const datasetUpdatedAt = await getLastUpdated();
  const contentUpdatedAt = "2026-07-28";
  const staticPaths: Array<[string, number, MetadataRoute.Sitemap[number]["changeFrequency"]]> = [
    ["", 1, "daily"],
    ["/what-is-mcp-server", 0.9, "monthly"],
    ["/remote-mcp-servers", 0.9, "daily"],
    ["/guides", 0.7, "weekly"],
    ["/leaderboard", 0.7, "daily"],
    ["/radar", 0.7, "daily"],
    ["/graveyard", 0.7, "daily"],
    ["/about", 0.7, "monthly"],
    ["/newsletter", 0.7, "weekly"],
    ["/sponsor", 0.7, "monthly"],
    ["/editorial-policy", 0.4, "yearly"],
    ["/privacy", 0.3, "yearly"],
    ["/terms", 0.3, "yearly"],
  ];
  const staticPages = staticPaths.flatMap(([p, pr, frequency]) =>
    entry(
      p,
      pr,
      ["/about", "/what-is-mcp-server", "/newsletter", "/sponsor", "/editorial-policy", "/privacy", "/terms"].includes(p)
        ? contentUpdatedAt
        : datasetUpdatedAt,
      frequency,
    ),
  );

  const categoryPages = CATEGORIES.flatMap((c) =>
    entry(`/category/${c.slug}`, 0.8, datasetUpdatedAt, "daily"),
  );

  const allServers = await getAllServers();
  const serverPages = allServers.flatMap((s) =>
    entry(`/server/${s.slug}`, 0.8, s.signals.dataUpdatedAt || datasetUpdatedAt, "daily"),
  );

  // SEO 落地页 /servers/{tool}-mcp-server —— 精准命中主关键词，优先级略高于普通详情页
  const seoLandingPages = getSeoLandingSlugs().flatMap((t) =>
    entry(`/servers/${t}-mcp-server`, 0.9, contentUpdatedAt, "monthly"),
  );

  // 指南 / SEO 文章
  const guidePages = getGuideSlugs().flatMap((slug) =>
    entry(`/guides/${slug}`, 0.7, getGuideModifiedAt(slug) ?? contentUpdatedAt, "monthly"),
  );

  return [...staticPages, ...categoryPages, ...serverPages, ...seoLandingPages, ...guidePages];
}
