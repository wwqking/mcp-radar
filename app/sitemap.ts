import type { MetadataRoute } from "next";
import { PUBLIC_CATEGORIES, getAllServers, getLastUpdated } from "@/lib/data";
import { SITE_URL } from "@/lib/site";
import { LOCALES } from "@/lib/i18n/locales";
import { getGuideModifiedAt, getGuideSlugs } from "@/lib/guides";
import { TAXONOMY_TOPICS } from "@/lib/taxonomy";
import { isServerIndexable } from "@/lib/seo-indexability";

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

function englishServerEntry(
  path: string,
  lastModified: string,
): MetadataRoute.Sitemap[number] {
  const url = `${BASE}/en${path}`;
  return {
    url,
    lastModified,
    changeFrequency: "daily",
    priority: 0.8,
    alternates: {
      languages: {
        en: url,
        "x-default": url,
      },
    },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const datasetUpdatedAt = await getLastUpdated();
  const contentUpdatedAt = "2026-07-28";
  const staticPaths: Array<[string, number, MetadataRoute.Sitemap[number]["changeFrequency"]]> = [
    ["", 1, "daily"],
    ["/what-is-mcp-server", 0.9, "monthly"],
    ["/mcp-server-health-report", 0.9, "daily"],
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

  const categoryPages = PUBLIC_CATEGORIES.flatMap((c) =>
    entry(`/category/${c.slug}`, 0.8, datasetUpdatedAt, "daily"),
  );

  const topicPages = TAXONOMY_TOPICS.flatMap((topic) =>
    entry(`/topic/${topic.slug}`, 0.7, datasetUpdatedAt, "daily"),
  );

  const allServers = await getAllServers();
  const serverPages = allServers
    .filter(isServerIndexable)
    .map((s) =>
      englishServerEntry(
        `/server/${s.slug}`,
        s.signals.dataUpdatedAt || datasetUpdatedAt,
      ),
    );

  // 指南 / SEO 文章
  const guidePages = getGuideSlugs().flatMap((slug) =>
    entry(`/guides/${slug}`, 0.7, getGuideModifiedAt(slug) ?? contentUpdatedAt, "monthly"),
  );

  return [...staticPages, ...categoryPages, ...topicPages, ...serverPages, ...guidePages];
}
