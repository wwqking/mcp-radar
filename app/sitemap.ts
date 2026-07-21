import type { MetadataRoute } from "next";
import { CATEGORIES, getAllServers } from "@/lib/data";
import { SITE_URL } from "@/lib/site";

const BASE = SITE_URL;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = ["", "/leaderboard", "/radar", "/graveyard", "/about", "/newsletter", "/sponsor"].map(
    (p) => ({
      url: `${BASE}${p}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: p === "" ? 1 : 0.7,
    })
  );

  const categoryPages = CATEGORIES.map((c) => ({
    url: `${BASE}/category/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  const allServers = await getAllServers();
  const serverPages = allServers.map((s) => ({
    url: `${BASE}/server/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...categoryPages, ...serverPages];
}
