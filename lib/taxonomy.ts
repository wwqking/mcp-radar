import type { MCPServer, TaxonomyTopic } from "./types";

/**
 * 受控主题词表。
 *
 * 主分类回答“AI 能帮我做什么”，保持稳定；topic 承接增长快、边界更细的领域。
 * topic 可以持续扩充，但 slug 一旦发布就不能随意改名，避免链接和搜索索引漂移。
 */
export const TAXONOMY_TOPICS: TaxonomyTopic[] = [
  {
    slug: "mcp-infrastructure",
    name: "MCP 基础设施",
    name_en: "MCP Infrastructure",
    description: "Registry、Gateway、Proxy、Client、SDK 与 MCP server 管理工具。",
    description_en: "Registries, gateways, proxies, clients, SDKs and MCP server management tools.",
    aliases: ["registry", "gateway", "proxy", "client", "sdk", "framework", "MCP 管理"],
  },
  {
    slug: "data-analysis",
    name: "数据分析",
    name_en: "Data Analysis",
    description: "数据处理、商业智能、ETL、报表与分析工作流。",
    description_en: "Data processing, business intelligence, ETL, reporting and analytics workflows.",
    aliases: ["analytics", "business intelligence", "BI", "ETL", "报表", "数据可视化"],
  },
  {
    slug: "visualization",
    name: "图表与可视化",
    name_en: "Charts & Visualization",
    description: "生成图表、流程图、白板、仪表盘与可视化内容。",
    description_en: "Generate charts, diagrams, whiteboards, dashboards and visual content.",
    aliases: ["chart", "diagram", "dashboard", "mermaid", "excalidraw", "画图"],
  },
  {
    slug: "security",
    name: "安全与合规",
    name_en: "Security & Compliance",
    description: "漏洞情报、代码扫描、威胁分析、审计与安全运维。",
    description_en: "Vulnerability intelligence, scanning, threat analysis, auditing and security operations.",
    aliases: ["cybersecurity", "CVE", "vulnerability", "threat", "audit", "安全扫描"],
  },
  {
    slug: "finance",
    name: "金融与市场数据",
    name_en: "Finance & Market Data",
    description: "股票、行情、财务、会计、银行与数字资产数据。",
    description_en: "Stocks, market data, accounting, banking and digital-asset data.",
    aliases: ["stock", "market data", "trading", "accounting", "crypto", "股票", "行情"],
  },
  {
    slug: "design-media",
    name: "设计与媒体",
    name_en: "Design & Media",
    description: "图片、音频、视频、设计素材与创意制作工作流。",
    description_en: "Image, audio, video, design asset and creative-production workflows.",
    aliases: ["image", "video", "audio", "design", "creative", "图片", "音视频"],
  },
  {
    slug: "automation",
    name: "自动化与生产力",
    name_en: "Automation & Productivity",
    description: "任务、工作流、笔记、待办与跨应用自动化。",
    description_en: "Tasks, workflows, notes, to-dos and cross-app automation.",
    aliases: ["workflow", "productivity", "task", "todo", "zapier", "自动化", "生产力"],
  },
  {
    slug: "observability",
    name: "监控与可观测性",
    name_en: "Observability",
    description: "日志、指标、追踪、告警与线上故障诊断。",
    description_en: "Logs, metrics, traces, alerts and production incident diagnosis.",
    aliases: ["monitoring", "logging", "metrics", "tracing", "grafana", "datadog", "监控"],
  },
  {
    slug: "game-development",
    name: "游戏与 3D",
    name_en: "Game Development & 3D",
    description: "游戏引擎、关卡、3D 资产与互动内容制作。",
    description_en: "Game engines, levels, 3D assets and interactive content creation.",
    aliases: ["game", "3D", "godot", "unity", "unreal", "roblox", "游戏开发"],
  },
  {
    slug: "iot-robotics",
    name: "物联网与机器人",
    name_en: "IoT & Robotics",
    description: "智能家居、设备控制、ROS 与机器人工作流。",
    description_en: "Smart-home, device-control, ROS and robotics workflows.",
    aliases: ["IoT", "robot", "ROS", "home assistant", "device", "智能家居"],
  },
  {
    slug: "legal",
    name: "法律与法规",
    name_en: "Legal & Regulatory",
    description: "法律检索、案例、法规与合规研究。",
    description_en: "Legal search, case law, regulation and compliance research.",
    aliases: ["law", "legal", "court", "case law", "regulation", "法律检索"],
  },
  {
    slug: "science-health",
    name: "科研与健康",
    name_en: "Science & Health",
    description: "论文、实验、医疗健康、生物与科研数据。",
    description_en: "Research papers, experiments, healthcare, biology and scientific data.",
    aliases: ["research", "paper", "healthcare", "medical", "biology", "科研", "医疗"],
  },
];

export const FEATURED_TOPIC_SLUGS = [
  "mcp-infrastructure",
  "data-analysis",
  "security",
  "finance",
  "design-media",
  "automation",
  "observability",
  "game-development",
] as const;

interface WeightedRule {
  slug: string;
  strong: RegExp[];
  weak?: RegExp[];
}

const CATEGORY_RULES: WeightedRule[] = [
  {
    slug: "database",
    strong: [
      /\b(postgres(?:ql)?|mysql|mariadb|sqlite|mongo(?:db)?|redis|supabase|clickhouse|duckdb|neo4j|cassandra|dynamodb|bigquery|snowflake)\b/i,
      /\b(databases?|data\s?warehouse|vector\s?(?:db|database)|sql)\b/i,
    ],
    weak: [/\b(query|schema|data store|data source)\b/i],
  },
  {
    slug: "browser",
    strong: [
      /\b(playwright|puppeteer|selenium|firecrawl|browserbase|browser|web\s?scrap(?:e|er|ing)|crawler?|crawl4ai)\b/i,
      /\b(chrome|chromium|webpage|web page|website interaction)\b/i,
    ],
    weak: [/\b(fetch|navigate|page content)\b/i],
  },
  {
    slug: "files",
    strong: [
      /\b(filesystems?|file\s?systems?|pdfs?|docx?|documents?|spreadsheets?|excel|powerpoint|markdown)\b/i,
      /\b(google drive|dropbox|one drive|onedrive|sharepoint|box)\b/i,
    ],
    weak: [/\b(files?|folders?|storage)\b/i],
  },
  {
    slug: "search",
    strong: [
      /\b(search|retrieval|rag|knowledge\s?(?:base|graph)?|brave|exa|tavily|perplexity|elasticsearch|algolia)\b/i,
      /\b(web search|semantic search|documentation lookup|research assistant)\b/i,
    ],
    weak: [/\b(index(?:er|ing)?|find information|lookup)\b/i],
  },
  {
    slug: "dev",
    strong: [
      /\b(github|gitlab|bitbucket|jenkins|sentry|linear|jira|figma|sonarqube|sourcegraph)\b/i,
      /\b(ci\/?cd|pull requests?|code review|code analysis|debugg(?:er|ing)|reverse engineering|developer tools?|software development|ide)\b/i,
      /\b(git repositories?|source code|package manager|api development)\b/i,
    ],
    weak: [/\b(code|coding|repository|repo|developer|issue tracker)\b/i],
  },
  {
    slug: "comms",
    strong: [
      /\b(slack|gmail|outlook|discord|telegram|microsoft teams|google calendar|notion|twilio|intercom)\b/i,
      /\b(email|e-mail|calendars?|instant messaging|team collaboration|video conferenc)\b/i,
    ],
    weak: [/\b(messages?|chat|mail|schedule|meeting)\b/i],
  },
  {
    slug: "cloud",
    strong: [
      /\b(aws|amazon web services|gcp|google cloud|azure|kubernetes|k8s|docker|cloudflare|terraform|vercel|netlify|railway|heroku)\b/i,
      /\b(devops|infrastructure|cloud platform|deployment|observability|grafana|datadog|dynatrace|splunk|prometheus)\b/i,
    ],
    weak: [/\b(deploy|monitoring|logs?|metrics|server operations)\b/i],
  },
  {
    slug: "ai",
    strong: [
      /\b(openai|anthropic|hugging face|ollama|langchain|llamaindex|qdrant|pinecone|weaviate|milvus)\b/i,
      /\b(llms?|language models?|embeddings?|inference|machine learning|computer vision|model serving|agent memory)\b/i,
    ],
    weak: [/\b(models?|agents?|ai tools?)\b/i],
  },
  {
    slug: "commerce",
    strong: [
      /\b(stripe|shopify|paypal|paddle|woocommerce|webflow|wordpress|squarespace|bigcommerce)\b/i,
      /\b(payments?|e-?commerce|checkout|storefront|point of sale|orders?|shopping cart)\b/i,
    ],
    weak: [/\b(invoice|billing|subscriptions?|products?|online store)\b/i],
  },
  {
    slug: "marketing",
    strong: [
      /\b(marketing|seo|advertising|google ads|meta ads|mailchimp|klaviyo|hubspot|dataforseo|google analytics)\b/i,
      /\b(email campaign|ad campaign|keyword research|search console|conversion rate|audience analytics)\b/i,
    ],
    weak: [/\b(ads?|campaigns?|newsletter|crm|conversion|audience|growth)\b/i],
  },
];

const TOPIC_RULES: WeightedRule[] = [
  {
    slug: "mcp-infrastructure",
    strong: [
      /\b(mcp[- ]?(?:registry|gateway|proxy|router|client|manager|marketplace|framework|sdk|inspector|orchestrat(?:or|ion)|toolbox))\b/i,
      /\b(fastmcp|mcp-use|metamcp|mcpjungle|model context protocol (?:client|sdk|framework))\b/i,
    ],
  },
  {
    slug: "data-analysis",
    strong: [
      /\b(data analys(?:is|t|ytics)|business intelligence|power\s?bi|tableau|looker|data pipeline|etl|reporting|semantic model)\b/i,
      /\b(pandas|polars|dataframe|statistical analysis)\b/i,
    ],
  },
  {
    slug: "visualization",
    strong: [/\b(visuali[sz]ation|charts?|diagrams?|mermaid|excalidraw|whiteboard|dashboard|graph generation)\b/i],
  },
  {
    slug: "security",
    strong: [
      /\b(cybersecurity|security (?:scan|audit|finding|intelligence)|vulnerabilit(?:y|ies)|cve|cisa kev|mitre|burp|penetration test|threat intelligence|malware|secrets? scan)\b/i,
    ],
  },
  {
    slug: "finance",
    strong: [
      /\b(financial|finance|stocks?|stock market|market data|trading|brokerage|accounting|banking|xero|quickbooks|cryptocurrenc(?:y|ies)|blockchain|defi)\b/i,
      /\bcrypto[- ]?(?:price|market|trading|wallet|exchange|asset|token)s?\b/i,
    ],
  },
  {
    slug: "design-media",
    strong: [
      /\b(image|video|audio|music|speech|voice|youtube|design|creative|photos?|illustration|elevenlabs|adobe|canva|blender)\b/i,
    ],
  },
  {
    slug: "automation",
    strong: [
      /\b(automation|workflows?|productivity|task management|to-?do|zapier|make\.com|n8n|obsidian|asana|todoist|servicenow)\b/i,
    ],
  },
  {
    slug: "observability",
    strong: [
      /\b(observability|monitoring|logging|metrics|tracing|alerts?|grafana|datadog|dynatrace|splunk|prometheus|opentelemetry)\b/i,
    ],
  },
  {
    slug: "game-development",
    strong: [/\b(game development|game engine|godot|unity|unreal engine|roblox|cocos|3d assets?|level editor)\b/i],
  },
  {
    slug: "iot-robotics",
    strong: [/\b(internet of things|iot|robotics?|ros\b|home assistant|smart home|device control)\b/i],
  },
  {
    slug: "legal",
    strong: [/\b(legal|law|court|case law|regulation|legislation|judicial|compliance research)\b/i],
  },
  {
    slug: "science-health",
    strong: [
      /\b(scientific|research papers?|academic|healthcare|medical|medicine|clinical|biology|bioinformatics|chemistry|laboratory)\b/i,
    ],
  },
];

function scoreRule(text: string, rule: WeightedRule): number {
  const strong = rule.strong.reduce((score, pattern) => score + (pattern.test(text) ? 3 : 0), 0);
  const weak = (rule.weak ?? []).reduce((score, pattern) => score + (pattern.test(text) ? 1 : 0), 0);
  return strong + weak;
}

export interface TaxonomyClassification {
  categories: string[];
  primaryCategory: string;
  topics: string[];
  categoryConfidence: number;
  needsCategoryReview: boolean;
}

/** 对有限词表做确定性分类；不生成新 slug，结果可复现、可测试、可人工复核。 */
export function classifyTaxonomy(name: string, description: string, tagline = ""): TaxonomyClassification {
  // Registry 的 canonical name 常以 `io.github.owner/` 开头。这个命名空间不是能力信号；
  // 不剥掉会让几乎所有 Registry 项目仅因字符串里含 github 就被误判为开发工具。
  const semanticName = name.replace(/^io\.github\.[^/]+\//i, "");
  const text = `${semanticName} ${tagline} ${description}`;
  const categoryScores = CATEGORY_RULES
    .map((rule) => ({ slug: rule.slug, score: scoreRule(text, rule) }))
    .filter(({ score }) => score >= 2)
    .sort((a, b) => b.score - a.score);
  const topics = TOPIC_RULES
    .filter((rule) => scoreRule(text, rule) >= 3)
    .map((rule) => rule.slug);

  if (categoryScores.length === 0) {
    return {
      categories: ["misc"],
      primaryCategory: "misc",
      topics,
      categoryConfidence: topics.length > 0 ? 0.55 : 0.35,
      needsCategoryReview: true,
    };
  }

  const best = categoryScores[0];
  const runnerUp = categoryScores[1];
  const margin = best.score - (runnerUp?.score ?? 0);
  const confidence = Math.min(
    0.98,
    0.52 + best.score * 0.07 + Math.min(0.12, margin * 0.04) + (categoryScores.length === 1 ? 0.06 : 0),
  );

  return {
    categories: categoryScores.map(({ slug }) => slug),
    primaryCategory: best.slug,
    topics,
    categoryConfidence: Number(confidence.toFixed(2)),
    needsCategoryReview: confidence < 0.68,
  };
}

/**
 * 用新版规则重算，同时保留旧快照已有的公开分类作为召回兜底。
 * 旧分类可能不够准，但在人工复核完成前不能让项目突然从原分类页消失。
 */
export function classifyServerTaxonomy(server: MCPServer): TaxonomyClassification {
  const derived = classifyTaxonomy(server.name, server.description, server.tagline);
  const storedCategories = server.categories.filter((category) => category !== "misc");
  const derivedCategories = derived.categories.filter((category) => category !== "misc");
  const categories = Array.from(new Set([...derivedCategories, ...storedCategories]));

  return {
    ...derived,
    categories: categories.length > 0 ? categories : ["misc"],
    primaryCategory:
      derived.primaryCategory !== "misc"
        ? derived.primaryCategory
        : storedCategories[0] ?? "misc",
    categoryConfidence:
      derived.primaryCategory === "misc" && storedCategories.length > 0
        ? Math.max(0.45, derived.categoryConfidence)
        : derived.categoryConfidence,
    // 新规则无法独立确认时仍进审核队列，不能因为旧标签兜底就假装高置信度。
    needsCategoryReview: derived.needsCategoryReview,
  };
}

/** 兼容尚未重跑采集的旧快照和 mock 数据。 */
export function taxonomyForServer(server: MCPServer): TaxonomyClassification {
  if (
    server.primaryCategory &&
    server.topics &&
    typeof server.categoryConfidence === "number" &&
    typeof server.needsCategoryReview === "boolean"
  ) {
    return {
      categories: server.categories,
      primaryCategory: server.primaryCategory,
      topics: server.topics,
      categoryConfidence: server.categoryConfidence,
      needsCategoryReview: server.needsCategoryReview,
    };
  }
  return classifyServerTaxonomy(server);
}

export function getTopicBySlug(slug: string): TaxonomyTopic | undefined {
  return TAXONOMY_TOPICS.find((topic) => topic.slug === slug);
}

export function topicName(topic: TaxonomyTopic, locale: string): string {
  return locale === "en" ? topic.name_en : topic.name;
}

export function topicDescription(topic: TaxonomyTopic, locale: string): string {
  return locale === "en" ? topic.description_en : topic.description;
}
