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
  { name: "@hyperbrowser/mcp", repoUrl: "https://github.com/hyperbrowserai/mcp", npmPackage: null },

  // 开发 / 代码
  { name: "@github/github-mcp-server", repoUrl: "https://github.com/github/github-mcp-server", npmPackage: null },
  { name: "sentry-mcp", repoUrl: "https://github.com/getsentry/sentry-mcp", npmPackage: "@sentry/mcp-server" },
  { name: "figma-developer-mcp", repoUrl: "https://github.com/GLips/Figma-Context-MCP", npmPackage: "figma-developer-mcp" },
  { name: "mcp-server-kubernetes", repoUrl: "https://github.com/Flux159/mcp-server-kubernetes", npmPackage: "mcp-server-kubernetes" },
  { name: "@21st-dev/magic", repoUrl: "https://github.com/21st-dev/magic-mcp", npmPackage: "@21st-dev/magic" },

  // 数据库 / 数据
  { name: "@supabase/mcp-server-supabase", repoUrl: "https://github.com/supabase-community/supabase-mcp", npmPackage: "@supabase/mcp-server-supabase" },
  { name: "@redis/mcp-redis", repoUrl: "https://github.com/redis/mcp-redis", npmPackage: null },
  { name: "mcp-server-qdrant", repoUrl: "https://github.com/qdrant/mcp-server-qdrant", npmPackage: null },
  { name: "mongodb-mcp-server", repoUrl: "https://github.com/mongodb-js/mongodb-mcp-server", npmPackage: "mongodb-mcp-server" },
  { name: "@clickhouse/mcp-clickhouse", repoUrl: "https://github.com/ClickHouse/mcp-clickhouse", npmPackage: null },
  { name: "@elastic/mcp-server-elasticsearch", repoUrl: "https://github.com/elastic/mcp-server-elasticsearch", npmPackage: "@elastic/mcp-server-elasticsearch" },
  { name: "chroma-mcp", repoUrl: "https://github.com/chroma-core/chroma-mcp", npmPackage: null },
  { name: "mcp-server-neon", repoUrl: "https://github.com/neondatabase/mcp-server-neon", npmPackage: null },
  { name: "@pinecone-database/mcp", repoUrl: "https://github.com/pinecone-io/pinecone-mcp", npmPackage: "@pinecone-database/mcp" },
  { name: "mcp-neo4j", repoUrl: "https://github.com/neo4j-contrib/mcp-neo4j", npmPackage: null },
  { name: "prisma-mcp", repoUrl: "https://github.com/prisma/mcp", npmPackage: null },
  { name: "mcp-server-motherduck", repoUrl: "https://github.com/motherduckdb/mcp-server-motherduck", npmPackage: null },
  { name: "mcp-server-weaviate", repoUrl: "https://github.com/weaviate/mcp-server-weaviate", npmPackage: null },
  { name: "mcp-confluent", repoUrl: "https://github.com/confluentinc/mcp-confluent", npmPackage: null },

  // 搜索 / 知识
  { name: "exa-mcp-server", repoUrl: "https://github.com/exa-labs/exa-mcp-server", npmPackage: "exa-mcp-server" },
  { name: "tavily-mcp", repoUrl: "https://github.com/tavily-ai/tavily-mcp", npmPackage: "tavily-mcp" },
  { name: "@brave/brave-search-mcp-server", repoUrl: "https://github.com/brave/brave-search-mcp-server", npmPackage: "@brave/brave-search-mcp-server" },
  { name: "jina-mcp", repoUrl: "https://github.com/jina-ai/MCP", npmPackage: null },
  { name: "hf-mcp-server", repoUrl: "https://github.com/huggingface/hf-mcp-server", npmPackage: null },

  // 通讯 / 协作
  { name: "@notionhq/notion-mcp-server", repoUrl: "https://github.com/makenotion/notion-mcp-server", npmPackage: "@notionhq/notion-mcp-server" },
  { name: "@linear/mcp", repoUrl: "https://github.com/linear/linear-mcp", npmPackage: null },
  { name: "@elevenlabs/elevenlabs-mcp", repoUrl: "https://github.com/elevenlabs/elevenlabs-mcp", npmPackage: null },
  { name: "atlassian-mcp-server", repoUrl: "https://github.com/atlassian/atlassian-mcp-server", npmPackage: null },
  { name: "slack-mcp-server", repoUrl: "https://github.com/korotovsky/slack-mcp-server", npmPackage: null },
  { name: "airtable-mcp-server", repoUrl: "https://github.com/domdomegg/airtable-mcp-server", npmPackage: "airtable-mcp-server" },

  // 支付 / 商业
  { name: "@stripe/mcp", repoUrl: "https://github.com/stripe/agent-toolkit", npmPackage: "@stripe/mcp" },
  { name: "apify-mcp-server", repoUrl: "https://github.com/apify/apify-mcp-server", npmPackage: "@apify/actors-mcp-server" },
  { name: "zapier-mcp", repoUrl: "https://github.com/zapier/zapier-mcp", npmPackage: null },
  { name: "@paypal/mcp", repoUrl: "https://github.com/paypal/agent-toolkit", npmPackage: "@paypal/mcp" },
  { name: "square-mcp-server", repoUrl: "https://github.com/square/square-mcp-server", npmPackage: null },
  { name: "twilio-mcp", repoUrl: "https://github.com/twilio-labs/mcp", npmPackage: null },
  { name: "@paddle/paddle-mcp", repoUrl: "https://github.com/PaddleHQ/paddle-mcp-server", npmPackage: "@paddle/paddle-mcp" },

  // 建站 / 电商（独立站从 0 到卖货：店铺 / 商品 / 订单 / 建站）
  { name: "shopify-mcp", repoUrl: "https://github.com/GeLi2001/shopify-mcp", npmPackage: "shopify-mcp" },
  { name: "mcp-wordpress-remote", repoUrl: "https://github.com/Automattic/mcp-wordpress-remote", npmPackage: null },
  { name: "webflow-mcp-server", repoUrl: "https://github.com/webflow/mcp-server", npmPackage: "webflow-mcp-server" },

  // 营销 / 增长（邮件 / SEO / 广告 / CRM）
  { name: "resend-mcp", repoUrl: "https://github.com/resend/resend-mcp", npmPackage: "resend-mcp" },
  { name: "dataforseo-mcp-server", repoUrl: "https://github.com/dataforseo/mcp-server-typescript", npmPackage: "dataforseo-mcp-server" },
  { name: "google-analytics-mcp", repoUrl: "https://github.com/googleanalytics/google-analytics-mcp", npmPackage: null },
  { name: "meta-ads-mcp", repoUrl: "https://github.com/pipeboard-co/meta-ads-mcp", npmPackage: "meta-ads-mcp" },
  { name: "mcp-hubspot", repoUrl: "https://github.com/baryhuang/mcp-hubspot", npmPackage: null },

  // 云 / DevOps
  { name: "@cloudflare/mcp-server-cloudflare", repoUrl: "https://github.com/cloudflare/mcp-server-cloudflare", npmPackage: null },
  { name: "aws-mcp-server", repoUrl: "https://github.com/awslabs/mcp", npmPackage: null },
  { name: "mcp-grafana", repoUrl: "https://github.com/grafana/mcp-grafana", npmPackage: null },
  { name: "@heroku/mcp-server", repoUrl: "https://github.com/heroku/heroku-mcp-server", npmPackage: "@heroku/mcp-server" },
  { name: "mcp-toolbox", repoUrl: "https://github.com/googleapis/mcp-toolbox", npmPackage: null },
  { name: "terraform-mcp-server", repoUrl: "https://github.com/hashicorp/terraform-mcp-server", npmPackage: null },
  { name: "cloud-run-mcp", repoUrl: "https://github.com/GoogleCloudPlatform/cloud-run-mcp", npmPackage: null },
  { name: "netlify-mcp", repoUrl: "https://github.com/netlify/netlify-mcp", npmPackage: null },
  { name: "snowflake-mcp", repoUrl: "https://github.com/Snowflake-Labs/mcp", npmPackage: null },
  { name: "dynatrace-mcp", repoUrl: "https://github.com/dynatrace-oss/dynatrace-mcp", npmPackage: null },
  { name: "microsoft-mcp", repoUrl: "https://github.com/microsoft/mcp", npmPackage: null },
  { name: "vantage-mcp-server", repoUrl: "https://github.com/vantage-sh/vantage-mcp-server", npmPackage: null },

  // AI / 模型
  { name: "@upstash/context7-mcp", repoUrl: "https://github.com/upstash/context7", npmPackage: "@upstash/context7-mcp" },
  { name: "perplexity-mcp", repoUrl: "https://github.com/perplexityai/modelcontextprotocol", npmPackage: null },

  // ===== 补量批次 A（据第二轮 mcp-server 关键词研究，逐个 GitHub API 核实存在+非归档+确为该工具的 MCP server）=====
  // 数据 / 分析
  { name: "dbt-mcp", repoUrl: "https://github.com/dbt-labs/dbt-mcp", npmPackage: null },
  { name: "mcp-server-chart", repoUrl: "https://github.com/antvis/mcp-server-chart", npmPackage: null },
  { name: "mcp-server-mysql", repoUrl: "https://github.com/benborla/mcp-server-mysql", npmPackage: null },
  { name: "arxiv-mcp-server", repoUrl: "https://github.com/blazickjp/arxiv-mcp-server", npmPackage: null },

  // 企业 / SaaS 工具
  { name: "servicenow-mcp", repoUrl: "https://github.com/echelon-ai-labs/servicenow-mcp", npmPackage: null },
  { name: "xero-mcp-server", repoUrl: "https://github.com/XeroAPI/xero-mcp-server", npmPackage: null },
  { name: "pagerduty-mcp-server", repoUrl: "https://github.com/PagerDuty/pagerduty-mcp-server", npmPackage: null },
  { name: "quickbooks-online-mcp-server", repoUrl: "https://github.com/intuit/quickbooks-online-mcp-server", npmPackage: null },
  { name: "mcp-server-asana", repoUrl: "https://github.com/roychri/mcp-server-asana", npmPackage: null },
  { name: "mcp-atlassian", repoUrl: "https://github.com/sooperset/mcp-atlassian", npmPackage: null },

  // 开发 / DevOps / 代码
  { name: "n8n-mcp", repoUrl: "https://github.com/czlonkowski/n8n-mcp", npmPackage: null },
  { name: "shadcn-ui-mcp-server", repoUrl: "https://github.com/Jpisnice/shadcn-ui-mcp-server", npmPackage: null },
  { name: "postgres-mcp", repoUrl: "https://github.com/crystaldba/postgres-mcp", npmPackage: null },
  { name: "unity-mcp", repoUrl: "https://github.com/CoplayDev/unity-mcp", npmPackage: null },
  { name: "django-mcp-server", repoUrl: "https://github.com/gts360/django-mcp-server", npmPackage: null },
  { name: "mcp-selenium", repoUrl: "https://github.com/angiejones/mcp-selenium", npmPackage: null },
  { name: "firebase-mcp", repoUrl: "https://github.com/gannonh/firebase-mcp", npmPackage: null },
  { name: "gitlab-mcp", repoUrl: "https://github.com/zereight/gitlab-mcp", npmPackage: null },
  { name: "mcp-jenkins", repoUrl: "https://github.com/lanbaoshen/mcp-jenkins", npmPackage: null },
  { name: "vercel-mcp", repoUrl: "https://github.com/vercel/next-devtools-mcp", npmPackage: null },

  // 金融 / 消费类
  { name: "spotify-mcp", repoUrl: "https://github.com/varunneal/spotify-mcp", npmPackage: null },
  { name: "mcp-server-airbnb", repoUrl: "https://github.com/openbnb-org/mcp-server-airbnb", npmPackage: null },
  { name: "mcp-server-youtube-transcript", repoUrl: "https://github.com/kimtaeyoon83/mcp-server-youtube-transcript", npmPackage: null },
  { name: "weather-mcp-server", repoUrl: "https://github.com/ezh0v/weather-mcp-server", npmPackage: null },

  // ===== 补量批次 B（第三轮竞品采词研究，research/mcpradars/seo-r3/collect-whitelist-final.csv）=====
  // 三道门槛逐个过：① GitHub 搜索命中的仓库名要与工具名对得上（实测 32% 是误命中，
  // 高星如 LibreChat 会被 chatgpt/azure/langchain 三个词同时错配）② ★≥20 且未归档
  // ③ 人工确认确为该工具的 MCP server（又剔掉 8 个，如 huggingface/mcp-course 是课程不是 server）。
  // npmPackage 只在「npm 元数据的 repository 指回同一个仓库」时才填 —— 27 个同名包里 17 个
  // 指向别人的重实现（npm `fastmcp` 是 punkpeye 的 TS 版，不是 PrefectHQ 的 Python 版），
  // 填错会让 TrustScore 用别人的下载数计算。核不准一律 null，靠 GitHub 信号打分。
  // 浏览器 / 自动化
  { name: "chrome-devtools-mcp", repoUrl: "https://github.com/ChromeDevTools/chrome-devtools-mcp", npmPackage: "chrome-devtools-mcp" }, // 12160/mo ★47598
  { name: "puppeteer-mcp-server", repoUrl: "https://github.com/merajmehrabi/puppeteer-mcp-server", npmPackage: "puppeteer-mcp-server" }, // 1500/mo ★478
  { name: "playwriter", repoUrl: "https://github.com/remorses/playwriter", npmPackage: "playwriter" }, // 1600/mo ★3718

  // 设计 / 创作 / 3D
  { name: "blender-mcp", repoUrl: "https://github.com/ahujasid/blender-mcp", npmPackage: null }, // 3390/mo ★24826
  { name: "excalidraw-mcp", repoUrl: "https://github.com/excalidraw/excalidraw-mcp", npmPackage: null }, // 1050/mo ★5008
  { name: "drawio-mcp-server", repoUrl: "https://github.com/lgazo/drawio-mcp-server", npmPackage: "drawio-mcp-server" }, // 650/mo ★1357
  { name: "robloxstudio-mcp", repoUrl: "https://github.com/boshyxd/robloxstudio-mcp", npmPackage: "robloxstudio-mcp" }, // 1900/mo ★483
  { name: "godot-mcp", repoUrl: "https://github.com/Coding-Solo/godot-mcp", npmPackage: null }, // 800/mo ★4899

  // 开发 / DevOps
  { name: "azure-devops-mcp", repoUrl: "https://github.com/microsoft/azure-devops-mcp", npmPackage: null }, // 1440/mo ★1909
  { name: "postman-mcp-server", repoUrl: "https://github.com/postmanlabs/postman-mcp-server", npmPackage: null }, // 1290/mo ★287
  { name: "railway-mcp-server", repoUrl: "https://github.com/railwayapp/railway-mcp-server", npmPackage: null }, // 760/mo ★194
  { name: "XcodeBuildMCP", repoUrl: "https://github.com/getsentry/XcodeBuildMCP", npmPackage: "xcodebuildmcp" }, // 1340/mo ★6144
  { name: "dart-mcp-server", repoUrl: "https://github.com/its-dart/dart-mcp-server", npmPackage: "dart-mcp-server" }, // 880/mo ★128
  { name: "deepwiki-mcp", repoUrl: "https://github.com/regenrek/deepwiki-mcp", npmPackage: null }, // 770/mo ★1374
  { name: "ida-pro-mcp", repoUrl: "https://github.com/mrexodia/ida-pro-mcp", npmPackage: null }, // 710/mo ★10766

  // 可观测 / 安全
  { name: "mcp-server-datadog", repoUrl: "https://github.com/winor30/mcp-server-datadog", npmPackage: "@winor30/mcp-server-datadog" }, // 2950/mo ★143
  { name: "splunk-mcp", repoUrl: "https://github.com/livehybrid/splunk-mcp", npmPackage: null }, // 1290/mo ★107

  // 协作 / 生产力
  // ⚠️ linkedin 这条是补的：库里原本匹配到的 ai-com-mcp-linkedin 实际仓库是
  // la-rebelion/hapimcp（★8，通用 API 网关，不是 LinkedIn 的 server）。建落地页前核实出来的。
  { name: "linkedin-mcp-server", repoUrl: "https://github.com/stickerdaniel/linkedin-mcp-server", npmPackage: null }, // 1150/mo ★2901
  { name: "todoist-mcp", repoUrl: "https://github.com/Doist/todoist-mcp", npmPackage: null }, // 850/mo ★529
  { name: "zendesk-mcp-server", repoUrl: "https://github.com/reminia/zendesk-mcp-server", npmPackage: null }, // 850/mo ★110
  { name: "clickup-mcp-server", repoUrl: "https://github.com/taazkareem/clickup-mcp-server", npmPackage: null }, // 1320/mo ★49
  { name: "mcp-apple-notes", repoUrl: "https://github.com/RafalWilinski/mcp-apple-notes", npmPackage: null }, // 2900/mo ★407
  { name: "granola-mcp-server", repoUrl: "https://github.com/proofsh/granola-mcp-server", npmPackage: null }, // 710/mo ★93
  { name: "ha-mcp", repoUrl: "https://github.com/homeassistant-ai/ha-mcp", npmPackage: null }, // 740/mo ★4118

  // 数据 / 金融
  { name: "ontobricks", repoUrl: "https://github.com/databrickslabs/ontobricks", npmPackage: null }, // 1250/mo ★199
  { name: "kite-mcp-server", repoUrl: "https://github.com/zerodha/kite-mcp-server", npmPackage: null }, // 790/mo ★288

  // Agent 框架 / 工具链
  { name: "serena", repoUrl: "https://github.com/oraios/serena", npmPackage: null }, // 2720/mo ★26897
  { name: "fastmcp", repoUrl: "https://github.com/PrefectHQ/fastmcp", npmPackage: null }, // 1680/mo ★26842
  { name: "fastapi_mcp", repoUrl: "https://github.com/tadata-org/fastapi_mcp", npmPackage: null }, // 1610/mo ★11951
  { name: "mcp-use", repoUrl: "https://github.com/mcp-use/mcp-use", npmPackage: "mcp-use" }, // 1040/mo ★10357
  { name: "mcp-ui", repoUrl: "https://github.com/MCP-UI-Org/mcp-ui", npmPackage: null }, // 1300/mo ★5036
  { name: "mcp-feedback-enhanced", repoUrl: "https://github.com/Minidoracat/mcp-feedback-enhanced", npmPackage: null }, // 1300/mo ★3788
  { name: "mcp-handler", repoUrl: "https://github.com/vercel/mcp-handler", npmPackage: "mcp-handler" }, // 720/mo ★628
  { name: "open-mcp-client", repoUrl: "https://github.com/CopilotKit/open-mcp-client", npmPackage: null }, // 2400/mo ★1646
  { name: "Windows-MCP", repoUrl: "https://github.com/CursorTouch/Windows-MCP", npmPackage: null }, // 1300/mo ★6500

  // x402 / 支付 / 加密数据
  { name: "@agentservices/client", repoUrl: "https://github.com/vbkotecha/agentservices-api", npmPackage: "@agentservices/client" },
];
