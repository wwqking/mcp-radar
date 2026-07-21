// 知名 MCP server 白名单 —— 直采种子。
//
// 为什么需要：实测官方 registry 里几乎没有这些高星「官方」server 的独立条目
// （modelcontextprotocol/servers、github/github-mcp-server 等未以标准条目进 registry）。
// 要采到它们，只能内置 repo 清单直接富化 GitHub，不依赖 registry 收录。
//
// 这份清单是「保底优质数据」；registry 补量负责铺长尾（SEO 基数）。

export interface CuratedSeed {
  /** 展示名（registry 风格全名或包名） */
  name: string;
  repoUrl: string;
  npmPackage: string | null;
}

export const CURATED_SEEDS: CuratedSeed[] = [
  // 官方参考实现（modelcontextprotocol/servers 单仓多 server，repo 相同、名字区分）
  { name: "@modelcontextprotocol/server-filesystem", repoUrl: "https://github.com/modelcontextprotocol/servers", npmPackage: "@modelcontextprotocol/server-filesystem" },
  { name: "@modelcontextprotocol/server-memory", repoUrl: "https://github.com/modelcontextprotocol/servers", npmPackage: "@modelcontextprotocol/server-memory" },
  { name: "@modelcontextprotocol/server-fetch", repoUrl: "https://github.com/modelcontextprotocol/servers", npmPackage: "@modelcontextprotocol/server-fetch" },
  { name: "@modelcontextprotocol/server-sequential-thinking", repoUrl: "https://github.com/modelcontextprotocol/servers", npmPackage: "@modelcontextprotocol/server-sequential-thinking" },
  { name: "@modelcontextprotocol/server-everything", repoUrl: "https://github.com/modelcontextprotocol/servers", npmPackage: "@modelcontextprotocol/server-everything" },

  // 浏览器 / 网页
  { name: "@playwright/mcp", repoUrl: "https://github.com/microsoft/playwright-mcp", npmPackage: "@playwright/mcp" },
  { name: "firecrawl-mcp-server", repoUrl: "https://github.com/mendableai/firecrawl-mcp-server", npmPackage: "firecrawl-mcp" },
  { name: "@browserbase/mcp-server-browserbase", repoUrl: "https://github.com/browserbase/mcp-server-browserbase", npmPackage: null },

  // 开发 / 代码
  { name: "@github/github-mcp-server", repoUrl: "https://github.com/github/github-mcp-server", npmPackage: null },
  { name: "sentry-mcp", repoUrl: "https://github.com/getsentry/sentry-mcp", npmPackage: "@sentry/mcp-server" },
  { name: "figma-developer-mcp", repoUrl: "https://github.com/GLips/Figma-Context-MCP", npmPackage: "figma-developer-mcp" },
  { name: "mcp-server-kubernetes", repoUrl: "https://github.com/Flux159/mcp-server-kubernetes", npmPackage: "mcp-server-kubernetes" },

  // 数据库 / 数据
  { name: "@supabase/mcp-server-supabase", repoUrl: "https://github.com/supabase-community/supabase-mcp", npmPackage: "@supabase/mcp-server-supabase" },
  { name: "@redis/mcp-redis", repoUrl: "https://github.com/redis/mcp-redis", npmPackage: null },
  { name: "mcp-server-qdrant", repoUrl: "https://github.com/qdrant/mcp-server-qdrant", npmPackage: null },
  { name: "mongodb-mcp-server", repoUrl: "https://github.com/mongodb-js/mongodb-mcp-server", npmPackage: "mongodb-mcp-server" },
  { name: "@clickhouse/mcp-clickhouse", repoUrl: "https://github.com/ClickHouse/mcp-clickhouse", npmPackage: null },

  // 搜索 / 知识
  { name: "exa-mcp-server", repoUrl: "https://github.com/exa-labs/exa-mcp-server", npmPackage: "exa-mcp-server" },
  { name: "tavily-mcp", repoUrl: "https://github.com/tavily-ai/tavily-mcp", npmPackage: "tavily-mcp" },
  { name: "@brave/brave-search-mcp-server", repoUrl: "https://github.com/brave/brave-search-mcp-server", npmPackage: "@brave/brave-search-mcp-server" },

  // 通讯 / 协作
  { name: "@notionhq/notion-mcp-server", repoUrl: "https://github.com/makenotion/notion-mcp-server", npmPackage: "@notionhq/notion-mcp-server" },
  { name: "@linear/mcp", repoUrl: "https://github.com/linear/linear-mcp", npmPackage: null },

  // 支付 / 商业
  { name: "@stripe/mcp", repoUrl: "https://github.com/stripe/agent-toolkit", npmPackage: "@stripe/mcp" },

  // 云 / DevOps
  { name: "@cloudflare/mcp-server-cloudflare", repoUrl: "https://github.com/cloudflare/mcp-server-cloudflare", npmPackage: null },
  { name: "aws-mcp-server", repoUrl: "https://github.com/awslabs/mcp", npmPackage: null },

  // AI / 模型
  { name: "@upstash/context7-mcp", repoUrl: "https://github.com/upstash/context7", npmPackage: "@upstash/context7-mcp" },
];
