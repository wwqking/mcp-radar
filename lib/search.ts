import type { Lifecycle, MCPServer } from "./types";
import { CATEGORIES } from "./constants";
import { TAXONOMY_TOPICS, taxonomyForServer } from "./taxonomy";

/** 客户端即时搜索只需要这些字段，避免把完整健康记录和趋势序列化进每个页面。 */
export interface SearchServer {
  slug: string;
  name: string;
  tagline: string;
  /** 合并描述、分类、主题、别名、包和工具名后的轻量检索文本。 */
  searchText: string;
  topicLabels: string[];
  lifecycle: Lifecycle;
  trustScore: number;
}

export function toSearchServers(servers: MCPServer[]): SearchServer[] {
  const categoryBySlug = new Map(CATEGORIES.map((category) => [category.slug, category]));
  const topicBySlug = new Map(TAXONOMY_TOPICS.map((topic) => [topic.slug, topic]));

  return servers.map((server) => {
    const taxonomy = taxonomyForServer(server);
    const categoryTerms = taxonomy.categories.flatMap((slug) => {
      const category = categoryBySlug.get(slug);
      return category
        ? [category.name, category.name_en ?? "", category.tagline, category.tagline_en ?? ""]
        : [];
    });
    const topics = taxonomy.topics
      .map((slug) => topicBySlug.get(slug))
      .filter((topic): topic is NonNullable<typeof topic> => Boolean(topic));
    const packageTerms = (server.packages ?? []).map((pkg) => pkg.identifier);
    const clientTerms = (server.clientCompat ?? []).map((client) => client.client);
    const toolTerms = server.installVerified?.tools ?? [];

    return {
      slug: server.slug,
      name: server.name,
      tagline: server.tagline,
      searchText: [
        server.description.slice(0, 500),
        ...categoryTerms,
        ...topics.flatMap((topic) => [topic.name, topic.name_en, ...topic.aliases]),
        ...packageTerms,
        ...clientTerms,
        ...toolTerms,
      ]
        .join(" ")
        .toLowerCase(),
      topicLabels: topics.slice(0, 2).map((topic) => topic.name),
      lifecycle: server.lifecycle,
      trustScore: server.trustScore,
    };
  });
}
