import type { Lifecycle, MCPServer } from "./types";

/** 客户端即时搜索只需要这些字段，避免把完整健康记录和趋势序列化进每个页面。 */
export interface SearchServer {
  slug: string;
  name: string;
  tagline: string;
  lifecycle: Lifecycle;
  trustScore: number;
}

export function toSearchServers(servers: MCPServer[]): SearchServer[] {
  return servers.map(({ slug, name, tagline, lifecycle, trustScore }) => ({
    slug,
    name,
    tagline,
    lifecycle,
    trustScore,
  }));
}
