// 白名单 server 的「能解决什么问题」人工精写数据（按 slug 关联）。
//
// 为什么单独一个文件：采集器每天覆盖 data/servers.json，这里的能力/示例句是人工内容，
// 必须独立存放、不被采集覆盖。详情页按 server.slug 查这里，有则渲染「能力卡」。
//
// 数据边界：只精写白名单里的知名 server（质量优先）。查不到的 server 不渲染能力卡，
// 详情页照常显示健康指标 —— 优雅降级，不留空壳。
//
// 字段：
//   whatItDoes    一句「用它你可以…」——不是 tagline，是具体解决的问题。
//   capabilities  它提供的核心能力/工具（用户能让 AI 做的具体动作）。
//   examplePrompts 装好后可以直接对 AI 说的话（1-3 条，越具体越好）。
//
// 每个字段都双语（zh / en），缺 en 时详情页回退 zh。

export interface ServerCapability {
  whatItDoes: { zh: string; en: string };
  capabilities: { zh: string; en: string }[];
  examplePrompts: { zh: string; en: string }[];
}

export const SERVER_CAPABILITIES: Record<string, ServerCapability> = {
  // ===== 文件 / 文档 =====
  "modelcontextprotocol-server-filesystem": {
    whatItDoes: {
      zh: "让 AI 直接读写你本地指定目录里的文件——不用你复制粘贴，AI 能自己打开、修改、整理文件。",
      en: "Lets your AI read and write files in a directory you allow — no copy-paste; it opens, edits, and organizes files itself.",
    },
    capabilities: [
      { zh: "读取文件内容", en: "Read file contents" },
      { zh: "写入 / 修改文件", en: "Write / edit files" },
      { zh: "列出目录、搜索文件", en: "List directories and search files" },
      { zh: "移动 / 重命名文件", en: "Move / rename files" },
    ],
    examplePrompts: [
      { zh: "把 ~/Downloads 里的截图按日期归类到子文件夹", en: "Sort the screenshots in ~/Downloads into date-based subfolders" },
      { zh: "读一下这个项目的 README，总结它是干嘛的", en: "Read this project's README and summarize what it does" },
    ],
  },

  // ===== 浏览器 / 网页 =====
  "playwright-mcp": {
    whatItDoes: {
      zh: "让 AI 真正操作一个浏览器——点按钮、填表单、截图、抓取渲染后的页面，能处理需要登录或 JS 动态加载的网站。",
      en: "Lets your AI actually drive a real browser — click, fill forms, screenshot, and scrape JS-rendered pages, including sites behind login.",
    },
    capabilities: [
      { zh: "打开网页、点击 / 输入 / 提交", en: "Open pages, click / type / submit" },
      { zh: "截图、读取渲染后的页面内容", en: "Screenshot and read rendered page content" },
      { zh: "处理动态加载（JS 渲染）的网站", en: "Handle JS-rendered dynamic sites" },
      { zh: "多步骤浏览器自动化", en: "Multi-step browser automation" },
    ],
    examplePrompts: [
      { zh: "打开这个商品页，把价格和库存状态告诉我", en: "Open this product page and tell me the price and stock status" },
      { zh: "帮我在这个网站上填完注册表单并截图确认", en: "Fill out the signup form on this site and screenshot the confirmation" },
    ],
  },
  "firecrawl-mcp-server": {
    whatItDoes: {
      zh: "让 AI 把整个网站或某个页面抓成干净的 Markdown——适合批量爬静态内容、做资料收集和知识库喂料。",
      en: "Lets your AI crawl a whole site or page into clean Markdown — great for bulk-scraping static content and feeding knowledge bases.",
    },
    capabilities: [
      { zh: "抓取单页为干净 Markdown", en: "Scrape a single page to clean Markdown" },
      { zh: "爬取整站 / 批量页面", en: "Crawl an entire site / many pages" },
      { zh: "结构化提取页面数据", en: "Structured extraction from pages" },
    ],
    examplePrompts: [
      { zh: "把这个文档站的所有页面抓下来，整理成一份 Markdown", en: "Crawl this docs site and compile everything into one Markdown file" },
      { zh: "从这个博客抓最近 10 篇文章的标题和摘要", en: "Scrape the titles and summaries of the latest 10 posts from this blog" },
    ],
  },

  // ===== 数据库 / 数据 =====
  "supabase-mcp-server-supabase": {
    whatItDoes: {
      zh: "让 AI 直接连你的 Supabase 项目——查数据、跑 SQL、看表结构，甚至管理数据库，不用你切到后台。",
      en: "Connects your AI straight to your Supabase project — query data, run SQL, inspect schemas, even manage the DB, without leaving the chat.",
    },
    capabilities: [
      { zh: "查询表数据、跑 SQL", en: "Query tables and run SQL" },
      { zh: "查看表结构 / schema", en: "Inspect table structure / schema" },
      { zh: "管理项目与数据库", en: "Manage projects and databases" },
    ],
    examplePrompts: [
      { zh: "看看 users 表最近注册的 10 个用户", en: "Show me the 10 most recently registered users in the users table" },
      { zh: "这个月订单总额是多少？按天给我拆开", en: "What's this month's total order revenue? Break it down by day" },
    ],
  },
  "mongodb-mcp-server": {
    whatItDoes: {
      zh: "让 AI 连接你的 MongoDB——查集合、聚合分析、看文档结构，用自然语言代替手写查询语句。",
      en: "Connects your AI to MongoDB — query collections, run aggregations, inspect document shapes, in plain language instead of query syntax.",
    },
    capabilities: [
      { zh: "查询集合、按条件过滤", en: "Query collections with filters" },
      { zh: "聚合分析（aggregation）", en: "Run aggregations" },
      { zh: "查看集合结构与索引", en: "Inspect collection structure and indexes" },
    ],
    examplePrompts: [
      { zh: "统计 orders 集合里每个国家的订单数", en: "Count orders per country in the orders collection" },
      { zh: "找出最近 7 天没登录过的活跃用户", en: "Find active users who haven't logged in for the last 7 days" },
    ],
  },

  // ===== 开发 / 代码 =====
  "github-github-mcp-server": {
    whatItDoes: {
      zh: "让 AI 直接操作你的 GitHub——读代码、开 issue、看 PR、查提交历史，把「去 GitHub 上找一下」这类活交给 AI。",
      en: "Lets your AI work with your GitHub — read code, open issues, review PRs, check commit history, so 'go look it up on GitHub' becomes automatic.",
    },
    capabilities: [
      { zh: "读取仓库文件与代码", en: "Read repo files and code" },
      { zh: "创建 / 评论 issue 和 PR", en: "Create / comment on issues and PRs" },
      { zh: "查提交历史、搜索代码", en: "Check commit history, search code" },
    ],
    examplePrompts: [
      { zh: "看看这个仓库最近有哪些没合并的 PR，各是干嘛的", en: "List the open PRs on this repo and what each one does" },
      { zh: "根据这个 bug 描述，在 issue 里帮我起个草稿", en: "Draft a GitHub issue from this bug description" },
    ],
  },
  "figma-developer-mcp": {
    whatItDoes: {
      zh: "让 AI 读取你的 Figma 设计稿——拿到布局、颜色、间距、组件信息，把设计直接变成代码。",
      en: "Lets your AI read your Figma designs — pull layout, colors, spacing, and component data to turn designs straight into code.",
    },
    capabilities: [
      { zh: "读取 Figma 文件的布局与样式", en: "Read layout and styles from Figma files" },
      { zh: "提取颜色 / 间距 / 字体等 design token", en: "Extract design tokens (color / spacing / type)" },
      { zh: "把设计节点转成前端代码", en: "Turn design nodes into frontend code" },
    ],
    examplePrompts: [
      { zh: "把这个 Figma 组件转成一个 React + Tailwind 组件", en: "Convert this Figma component into a React + Tailwind component" },
      { zh: "从这个设计稿提取所有用到的颜色，做成一份色板", en: "Extract every color used in this design into a palette" },
    ],
  },
  "sentry-mcp": {
    whatItDoes: {
      zh: "让 AI 连你的 Sentry——查线上报错、看堆栈、定位是哪次发布引入的 bug，直接在对话里排查故障。",
      en: "Connects your AI to Sentry — pull production errors, read stack traces, and pinpoint which release introduced a bug, right in chat.",
    },
    capabilities: [
      { zh: "查询错误与 issue", en: "Query errors and issues" },
      { zh: "读取堆栈信息与发生频次", en: "Read stack traces and frequency" },
      { zh: "定位相关的发布 / commit", en: "Correlate with releases / commits" },
    ],
    examplePrompts: [
      { zh: "过去 24 小时最高频的 3 个报错是什么？", en: "What are the top 3 most frequent errors in the last 24 hours?" },
      { zh: "这个报错是从哪次发布开始出现的？", en: "Which release did this error start appearing in?" },
    ],
  },

  // ===== 搜索 / 知识 =====
  "exa-mcp-server": {
    whatItDoes: {
      zh: "给 AI 一个真正的联网搜索能力——语义搜索网页、抓取内容，让回答基于最新的、可溯源的资料而非记忆。",
      en: "Gives your AI real web search — semantic search plus content retrieval, so answers come from fresh, sourced material, not memory.",
    },
    capabilities: [
      { zh: "语义网页搜索", en: "Semantic web search" },
      { zh: "抓取搜索结果的正文内容", en: "Fetch full content of results" },
      { zh: "找相似网页 / 竞品", en: "Find similar pages / competitors" },
    ],
    examplePrompts: [
      { zh: "搜一下 2025 年 MCP 生态有哪些新趋势，给我带来源", en: "Search for 2025 MCP ecosystem trends and cite sources" },
      { zh: "找几个和这个产品定位类似的竞品网站", en: "Find a few competitor sites positioned like this product" },
    ],
  },
  "tavily-mcp": {
    whatItDoes: {
      zh: "给 AI 加一个为 AI 优化的搜索引擎——联网查资料、返回精炼答案，适合做研究和事实核查。",
      en: "Adds an AI-optimized search engine to your AI — web research with concise answers, ideal for research and fact-checking.",
    },
    capabilities: [
      { zh: "联网搜索并返回精炼结果", en: "Web search with distilled results" },
      { zh: "抓取指定网页内容", en: "Extract content from given URLs" },
    ],
    examplePrompts: [
      { zh: "帮我查一下这家公司最新的融资情况", en: "Look up this company's latest funding round" },
      { zh: "核实这个说法对不对，给我依据", en: "Fact-check this claim and give me the evidence" },
    ],
  },

  // ===== 通讯 / 协作 =====
  "notionhq-notion-mcp-server": {
    whatItDoes: {
      zh: "让 AI 直接读写你的 Notion——查页面、建笔记、更新数据库，把「记到 Notion 里」这件事交给 AI。",
      en: "Lets your AI read and write your Notion — query pages, create notes, update databases, so 'save it to Notion' just happens.",
    },
    capabilities: [
      { zh: "搜索 / 读取 Notion 页面", en: "Search / read Notion pages" },
      { zh: "创建页面、写入内容", en: "Create pages and write content" },
      { zh: "更新 Notion 数据库", en: "Update Notion databases" },
    ],
    examplePrompts: [
      { zh: "把这次会议的要点整理成一页 Notion 笔记", en: "Turn these meeting notes into a Notion page" },
      { zh: "在我的任务数据库里加一条：明天要交方案", en: "Add a task to my Notion database: submit proposal tomorrow" },
    ],
  },
  "linear-mcp": {
    whatItDoes: {
      zh: "让 AI 操作你的 Linear——建 issue、看进度、更新任务状态，用对话管理研发任务。",
      en: "Lets your AI drive Linear — create issues, check progress, update statuses, managing eng work through chat.",
    },
    capabilities: [
      { zh: "创建 / 更新 issue", en: "Create / update issues" },
      { zh: "查询任务与进度", en: "Query tasks and progress" },
      { zh: "分配负责人、改状态", en: "Assign owners, change status" },
    ],
    examplePrompts: [
      { zh: "把这个 bug 建成一个 Linear issue，标为高优先级", en: "File this bug as a high-priority Linear issue" },
      { zh: "这个 sprint 还有哪些没做完的任务？", en: "What's still open in this sprint?" },
    ],
  },

  // ===== 支付 / 商业 =====
  "stripe-mcp": {
    whatItDoes: {
      zh: "让 AI 连你的 Stripe——查支付、看客户、拉账单数据，用自然语言问你的收入和交易情况。",
      en: "Connects your AI to Stripe — look up payments, customers, and billing data, asking about revenue and transactions in plain language.",
    },
    capabilities: [
      { zh: "查询支付 / 订阅 / 客户", en: "Query payments / subscriptions / customers" },
      { zh: "创建支付链接、开发票", en: "Create payment links, invoices" },
      { zh: "拉取收入与账单数据", en: "Pull revenue and billing data" },
    ],
    examplePrompts: [
      { zh: "这个月的订阅收入是多少？和上月比呢？", en: "What's this month's subscription revenue vs. last month?" },
      { zh: "给这个客户生成一个 99 美元的支付链接", en: "Create a $99 payment link for this customer" },
    ],
  },

  // ===== 云 / DevOps =====
  "cloudflare-mcp-server-cloudflare": {
    whatItDoes: {
      zh: "让 AI 操作你的 Cloudflare——管 DNS、看流量分析、部署 Workers，用对话干运维的活。",
      en: "Lets your AI operate Cloudflare — manage DNS, view analytics, deploy Workers, doing ops work through chat.",
    },
    capabilities: [
      { zh: "管理 DNS 记录", en: "Manage DNS records" },
      { zh: "查看流量 / 安全分析", en: "View traffic / security analytics" },
      { zh: "部署与管理 Workers", en: "Deploy and manage Workers" },
    ],
    examplePrompts: [
      { zh: "给 mydomain.com 加一条指向这个 IP 的 A 记录", en: "Add an A record for mydomain.com pointing to this IP" },
      { zh: "过去一周有没有异常的流量峰值？", en: "Any abnormal traffic spikes in the past week?" },
    ],
  },

  // ===== AI / 模型 =====
  "upstash-context7-mcp": {
    whatItDoes: {
      zh: "给 AI 喂最新的、准确的代码库文档——写代码时不再用过时的 API，直接拉取库的最新官方文档。",
      en: "Feeds your AI up-to-date, accurate library docs — no more outdated APIs; it pulls the latest official docs while coding.",
    },
    capabilities: [
      { zh: "按库名拉取最新官方文档", en: "Pull latest official docs by library" },
      { zh: "获取特定版本的 API 用法", en: "Get version-specific API usage" },
    ],
    examplePrompts: [
      { zh: "用 Next.js 15 最新的写法帮我配一个 middleware", en: "Set up a middleware using the latest Next.js 15 API" },
      { zh: "查一下这个库现在推荐的初始化方式", en: "Look up this library's currently recommended setup" },
    ],
  },

  // ===== 官方参考实现（modelcontextprotocol/servers） =====
  "modelcontextprotocol-server-memory": {
    whatItDoes: {
      zh: "给 AI 一个持久的「记忆库」——把对话里重要的信息存成知识图谱，下次对话还能记得。",
      en: "Gives your AI a persistent memory — stores key facts as a knowledge graph so it remembers across conversations.",
    },
    capabilities: [
      { zh: "存储实体与关系", en: "Store entities and relations" },
      { zh: "检索记住的信息", en: "Retrieve remembered facts" },
      { zh: "更新 / 删除记忆", en: "Update / delete memories" },
    ],
    examplePrompts: [
      { zh: "记住我在做一个叫 MCP Radar 的项目，技术栈是 Next.js", en: "Remember I'm building MCP Radar with a Next.js stack" },
      { zh: "我之前跟你说过的偏好还记得吗？", en: "Do you remember the preferences I told you earlier?" },
    ],
  },
  "modelcontextprotocol-server-fetch": {
    whatItDoes: {
      zh: "让 AI 抓取任意网页并转成适合阅读的内容——最轻量的「让 AI 看网页」方案。",
      en: "Lets your AI fetch any web page and convert it into readable content — the lightest way to let AI read the web.",
    },
    capabilities: [
      { zh: "抓取 URL 内容", en: "Fetch URL content" },
      { zh: "转为 Markdown / 纯文本", en: "Convert to Markdown / plain text" },
    ],
    examplePrompts: [
      { zh: "读一下这篇文章，帮我总结三个要点", en: "Read this article and summarize three key points" },
      { zh: "把这个页面的正文提取成纯文本", en: "Extract the main text of this page as plain text" },
    ],
  },
  "modelcontextprotocol-server-sequential-thinking": {
    whatItDoes: {
      zh: "让 AI 把复杂问题拆成一步步的推理链——适合需要多步分析、反复修正的难题。",
      en: "Lets your AI break complex problems into step-by-step reasoning — for tough tasks that need multi-step analysis and revision.",
    },
    capabilities: [
      { zh: "分步推理与规划", en: "Step-by-step reasoning and planning" },
      { zh: "中途修正思路", en: "Revise thinking mid-way" },
    ],
    examplePrompts: [
      { zh: "一步步分析这个系统该怎么设计", en: "Reason step by step about how to design this system" },
      { zh: "把这个决策拆成几步，逐个权衡", en: "Break this decision into steps and weigh each one" },
    ],
  },
  "modelcontextprotocol-server-everything": {
    whatItDoes: {
      zh: "MCP 协议的「样样都有」测试 server——集中演示 tools/resources/prompts 各种能力，给开发者练手和调试用。",
      en: "The MCP 'everything' reference server — demonstrates tools, resources, and prompts in one place, for developers to test and learn against.",
    },
    capabilities: [
      { zh: "演示各类 MCP 工具", en: "Demonstrate all MCP tool types" },
      { zh: "测试客户端接入", en: "Test client integrations" },
    ],
    examplePrompts: [
      { zh: "列出这个 server 支持的所有工具", en: "List every tool this server supports" },
    ],
  },

  // ===== 浏览器 / 网页 =====
  "browserbase-mcp-server-browserbase": {
    whatItDoes: {
      zh: "让 AI 在云端浏览器里跑自动化——不占本地资源，适合规模化的网页操作和抓取。",
      en: "Runs browser automation for your AI in the cloud — no local resources, ideal for scaled web tasks and scraping.",
    },
    capabilities: [
      { zh: "云端浏览器会话", en: "Cloud browser sessions" },
      { zh: "网页导航、交互、截图", en: "Navigate, interact, screenshot" },
    ],
    examplePrompts: [
      { zh: "在云端浏览器打开这个页面并截图", en: "Open this page in a cloud browser and screenshot it" },
    ],
  },
  "hyperbrowser-mcp": {
    whatItDoes: {
      zh: "给 AI 一个专为智能体设计的云浏览器——抓取、自动化、结构化提取网页数据。",
      en: "An agent-native cloud browser for your AI — scrape, automate, and extract structured web data.",
    },
    capabilities: [
      { zh: "网页抓取与爬取", en: "Web scraping and crawling" },
      { zh: "结构化数据提取", en: "Structured data extraction" },
    ],
    examplePrompts: [
      { zh: "从这个电商页抓出所有商品的名称和价格", en: "Extract every product name and price from this shop page" },
    ],
  },

  // ===== 开发 / 代码 =====
  "mcp-server-kubernetes": {
    whatItDoes: {
      zh: "让 AI 操作你的 Kubernetes 集群——查 pod、看日志、部署应用，用对话干集群运维。",
      en: "Lets your AI operate your Kubernetes cluster — inspect pods, read logs, deploy apps, doing cluster ops through chat.",
    },
    capabilities: [
      { zh: "查看 pod / deployment 状态", en: "Inspect pods / deployments" },
      { zh: "读取容器日志", en: "Read container logs" },
      { zh: "应用 / 更新资源", en: "Apply / update resources" },
    ],
    examplePrompts: [
      { zh: "哪些 pod 正在 CrashLoopBackOff？看下日志", en: "Which pods are in CrashLoopBackOff? Show me the logs" },
      { zh: "把这个 deployment 扩到 3 个副本", en: "Scale this deployment to 3 replicas" },
    ],
  },
  "21st-dev-magic": {
    whatItDoes: {
      zh: "让 AI 直接生成漂亮的 UI 组件——描述你想要的界面，它给出可用的 React 组件代码。",
      en: "Lets your AI generate polished UI components — describe the interface you want and get usable React component code.",
    },
    capabilities: [
      { zh: "按描述生成 UI 组件", en: "Generate UI components from a description" },
      { zh: "参考现成组件库", en: "Draw on ready-made component libraries" },
    ],
    examplePrompts: [
      { zh: "帮我做一个带搜索框的定价卡片组件", en: "Build me a pricing card component with a search box" },
    ],
  },

  // ===== 数据库 / 数据 =====
  "redis-mcp-redis": {
    whatItDoes: {
      zh: "让 AI 直接操作你的 Redis——查键值、看缓存、管理数据结构，用自然语言调试缓存层。",
      en: "Lets your AI work with Redis — read keys, inspect caches, manage data structures, debugging your cache layer in plain language.",
    },
    capabilities: [
      { zh: "读写键值", en: "Read / write keys" },
      { zh: "操作列表 / 哈希 / 集合", en: "Work with lists / hashes / sets" },
    ],
    examplePrompts: [
      { zh: "看看 session:* 这些 key 现在有多少个", en: "How many session:* keys are there right now?" },
    ],
  },
  "mcp-server-qdrant": {
    whatItDoes: {
      zh: "让 AI 连你的 Qdrant 向量库——做语义检索、管理向量集合，给 RAG 应用当记忆后端。",
      en: "Connects your AI to Qdrant — semantic search and vector collection management, a memory backend for RAG apps.",
    },
    capabilities: [
      { zh: "语义相似度检索", en: "Semantic similarity search" },
      { zh: "存储 / 查询向量", en: "Store / query vectors" },
    ],
    examplePrompts: [
      { zh: "在知识库里找和「退款政策」最相关的几段", en: "Find the passages most relevant to 'refund policy' in the knowledge base" },
    ],
  },
  "clickhouse-mcp-clickhouse": {
    whatItDoes: {
      zh: "让 AI 连你的 ClickHouse——跑分析查询、看大规模数据统计，用自然语言做数据分析。",
      en: "Connects your AI to ClickHouse — run analytical queries over large-scale data in plain language.",
    },
    capabilities: [
      { zh: "跑 SQL 分析查询", en: "Run analytical SQL" },
      { zh: "查看表结构与数据量", en: "Inspect schemas and data volume" },
    ],
    examplePrompts: [
      { zh: "按天统计过去 30 天的事件量趋势", en: "Show the daily event-count trend for the last 30 days" },
    ],
  },
  "elastic-mcp-server-elasticsearch": {
    whatItDoes: {
      zh: "让 AI 连你的 Elasticsearch——全文检索、聚合分析、查日志，用对话操作搜索引擎。",
      en: "Connects your AI to Elasticsearch — full-text search, aggregations, and log queries through chat.",
    },
    capabilities: [
      { zh: "全文搜索", en: "Full-text search" },
      { zh: "聚合与统计", en: "Aggregations and stats" },
    ],
    examplePrompts: [
      { zh: "在日志索引里找最近的 500 错误", en: "Find recent 500 errors in the logs index" },
    ],
  },
  "chroma-mcp": {
    whatItDoes: {
      zh: "让 AI 连你的 Chroma 向量库——存文档、做语义检索，最轻量的 RAG 记忆后端。",
      en: "Connects your AI to Chroma — store documents and run semantic search, a lightweight RAG memory backend.",
    },
    capabilities: [
      { zh: "存储文档并向量化", en: "Store and embed documents" },
      { zh: "语义检索", en: "Semantic retrieval" },
    ],
    examplePrompts: [
      { zh: "把这批文档存进去，之后能语义搜索", en: "Store these docs so I can semantically search them later" },
    ],
  },
  "mcp-server-neon": {
    whatItDoes: {
      zh: "让 AI 操作你的 Neon（Serverless Postgres）——建库、跑 SQL、管分支，用对话管理数据库。",
      en: "Lets your AI operate Neon (serverless Postgres) — create databases, run SQL, manage branches, through chat.",
    },
    capabilities: [
      { zh: "创建 / 管理数据库", en: "Create / manage databases" },
      { zh: "跑 SQL、查数据", en: "Run SQL, query data" },
      { zh: "管理数据库分支", en: "Manage database branches" },
    ],
    examplePrompts: [
      { zh: "给我建一个测试用的数据库分支", en: "Create a database branch for testing" },
    ],
  },
  "pinecone-database-mcp": {
    whatItDoes: {
      zh: "让 AI 连你的 Pinecone 向量库——大规模语义检索、管理索引，给生产级 RAG 当后端。",
      en: "Connects your AI to Pinecone — large-scale semantic search and index management, a production RAG backend.",
    },
    capabilities: [
      { zh: "向量检索", en: "Vector search" },
      { zh: "管理索引与命名空间", en: "Manage indexes and namespaces" },
    ],
    examplePrompts: [
      { zh: "在这个索引里查和用户问题最相关的 5 条", en: "Query the top 5 matches for the user's question in this index" },
    ],
  },
  "mcp-neo4j": {
    whatItDoes: {
      zh: "让 AI 操作你的 Neo4j 图数据库——用 Cypher 查关系、探索图谱，用自然语言问「谁和谁有关系」。",
      en: "Lets your AI work with Neo4j — query relationships with Cypher and explore graphs, asking 'who's connected to whom' in plain language.",
    },
    capabilities: [
      { zh: "跑 Cypher 查询", en: "Run Cypher queries" },
      { zh: "探索节点与关系", en: "Explore nodes and relationships" },
    ],
    examplePrompts: [
      { zh: "找出和这个用户有两跳以内关系的所有人", en: "Find everyone within two hops of this user" },
    ],
  },
  "prisma-mcp": {
    whatItDoes: {
      zh: "让 AI 帮你管 Prisma——建模、跑 migration、管理数据库 schema，用对话搞定 ORM 层。",
      en: "Lets your AI manage Prisma — model data, run migrations, and manage your DB schema, handling the ORM layer through chat.",
    },
    capabilities: [
      { zh: "管理 schema 与模型", en: "Manage schema and models" },
      { zh: "生成 / 应用 migration", en: "Generate / apply migrations" },
    ],
    examplePrompts: [
      { zh: "给 User 模型加一个 avatar 字段并生成 migration", en: "Add an avatar field to the User model and generate a migration" },
    ],
  },
  "mcp-server-motherduck": {
    whatItDoes: {
      zh: "让 AI 连 MotherDuck / DuckDB——跑分析查询、处理本地和云端数据，用对话做数据分析。",
      en: "Connects your AI to MotherDuck / DuckDB — run analytical queries over local and cloud data through chat.",
    },
    capabilities: [
      { zh: "跑 SQL 分析", en: "Run analytical SQL" },
      { zh: "查询 DuckDB / MotherDuck 数据", en: "Query DuckDB / MotherDuck data" },
    ],
    examplePrompts: [
      { zh: "分析这个 CSV，按类别统计总额", en: "Analyze this CSV and total by category" },
    ],
  },
  "mcp-server-weaviate": {
    whatItDoes: {
      zh: "让 AI 连你的 Weaviate 向量库——语义检索、混合搜索，给 RAG 应用当知识后端。",
      en: "Connects your AI to Weaviate — semantic and hybrid search, a knowledge backend for RAG apps.",
    },
    capabilities: [
      { zh: "语义 / 混合检索", en: "Semantic / hybrid search" },
      { zh: "管理数据对象", en: "Manage data objects" },
    ],
    examplePrompts: [
      { zh: "找和这个问题语义最接近的知识条目", en: "Find the knowledge entries closest to this question" },
    ],
  },
  "mcp-confluent": {
    whatItDoes: {
      zh: "让 AI 操作你的 Confluent / Kafka——查 topic、看消息流、管理连接器，用对话运维流数据平台。",
      en: "Lets your AI operate Confluent / Kafka — inspect topics, view streams, manage connectors, through chat.",
    },
    capabilities: [
      { zh: "查看 topic 与消息", en: "Inspect topics and messages" },
      { zh: "管理连接器 / 集群", en: "Manage connectors / clusters" },
    ],
    examplePrompts: [
      { zh: "列出所有 topic，哪个消息积压最多？", en: "List all topics — which has the biggest backlog?" },
    ],
  },

  // ===== 搜索 / 知识 =====
  "brave-brave-search-mcp-server": {
    whatItDoes: {
      zh: "给 AI 一个注重隐私的联网搜索——用 Brave Search 查网页、新闻、图片，回答基于实时结果。",
      en: "Gives your AI privacy-focused web search — query web, news, and images via Brave Search for real-time answers.",
    },
    capabilities: [
      { zh: "网页 / 新闻搜索", en: "Web / news search" },
      { zh: "本地商家搜索", en: "Local business search" },
    ],
    examplePrompts: [
      { zh: "搜一下这个话题最近一周的新闻", en: "Search for news on this topic from the past week" },
    ],
  },
  "jina-mcp": {
    whatItDoes: {
      zh: "给 AI 一套网页读取和搜索工具（Jina Reader/Search）——把网页转成干净内容、联网搜资料。",
      en: "Gives your AI web-reading and search tools (Jina Reader/Search) — turn pages into clean content and search the web.",
    },
    capabilities: [
      { zh: "网页转干净内容", en: "Turn pages into clean content" },
      { zh: "联网搜索", en: "Web search" },
    ],
    examplePrompts: [
      { zh: "把这个链接读成干净的正文", en: "Read this link into clean article text" },
    ],
  },
  "hf-mcp-server": {
    whatItDoes: {
      zh: "让 AI 连 Hugging Face——搜模型和数据集、查论文、调用推理，用对话探索 AI 生态。",
      en: "Connects your AI to Hugging Face — search models and datasets, look up papers, run inference, exploring the AI ecosystem through chat.",
    },
    capabilities: [
      { zh: "搜索模型 / 数据集", en: "Search models / datasets" },
      { zh: "查询论文与信息", en: "Look up papers and info" },
    ],
    examplePrompts: [
      { zh: "找几个适合中文情感分类的开源模型", en: "Find open-source models good for Chinese sentiment classification" },
    ],
  },
  "elevenlabs-elevenlabs-mcp": {
    whatItDoes: {
      zh: "让 AI 用 ElevenLabs 生成语音——文字转语音、克隆音色、做音频，用对话生成配音。",
      en: "Lets your AI generate speech with ElevenLabs — text-to-speech, voice cloning, and audio, producing voiceovers through chat.",
    },
    capabilities: [
      { zh: "文字转语音", en: "Text to speech" },
      { zh: "音色克隆 / 选择", en: "Voice cloning / selection" },
    ],
    examplePrompts: [
      { zh: "把这段文案生成一段自然的中文配音", en: "Turn this script into a natural voiceover" },
    ],
  },

  // ===== 通讯 / 协作 =====
  "atlassian-mcp-server": {
    whatItDoes: {
      zh: "让 AI 操作你的 Jira / Confluence——查工单、建 issue、读写文档，用对话管理项目和知识库。",
      en: "Lets your AI operate Jira / Confluence — query tickets, create issues, read/write docs, managing projects and wikis through chat.",
    },
    capabilities: [
      { zh: "查询 / 创建 Jira 工单", en: "Query / create Jira issues" },
      { zh: "读写 Confluence 页面", en: "Read / write Confluence pages" },
    ],
    examplePrompts: [
      { zh: "把这个 bug 建成 Jira 工单，分配给我", en: "File this bug as a Jira ticket assigned to me" },
      { zh: "这个 sprint 里还有哪些没关闭的工单？", en: "Which tickets are still open in this sprint?" },
    ],
  },
  "slack-mcp-server": {
    whatItDoes: {
      zh: "让 AI 操作你的 Slack——读频道消息、发消息、查历史，用对话处理团队沟通。",
      en: "Lets your AI work with Slack — read channels, send messages, search history, handling team comms through chat.",
    },
    capabilities: [
      { zh: "读取频道消息", en: "Read channel messages" },
      { zh: "发送消息", en: "Send messages" },
      { zh: "搜索历史记录", en: "Search history" },
    ],
    examplePrompts: [
      { zh: "总结一下 #general 频道今天的重要讨论", en: "Summarize today's key discussion in #general" },
    ],
  },
  "airtable-mcp-server": {
    whatItDoes: {
      zh: "让 AI 操作你的 Airtable——查记录、加数据、更新表格，用对话管理你的数据库表。",
      en: "Lets your AI work with Airtable — query records, add data, update tables, managing your bases through chat.",
    },
    capabilities: [
      { zh: "查询 / 过滤记录", en: "Query / filter records" },
      { zh: "创建 / 更新记录", en: "Create / update records" },
    ],
    examplePrompts: [
      { zh: "在客户表里加一条：新客户 Acme，状态待跟进", en: "Add a record to the customers table: Acme, status follow-up" },
    ],
  },
  "apify-mcp-server": {
    whatItDoes: {
      zh: "让 AI 调用 Apify 上的上千个爬虫/自动化工具——抓电商、社媒、地图等各种网站数据。",
      en: "Lets your AI run thousands of Apify scrapers/automations — pull data from e-commerce, social, maps, and more.",
    },
    capabilities: [
      { zh: "调用 Apify Actors（爬虫）", en: "Run Apify Actors (scrapers)" },
      { zh: "抓取结构化网站数据", en: "Scrape structured site data" },
    ],
    examplePrompts: [
      { zh: "用爬虫抓这个 Instagram 账号最近的帖子数据", en: "Scrape recent posts data from this Instagram account" },
    ],
  },

  // ===== 支付 / 商业 =====
  "zapier-mcp": {
    whatItDoes: {
      zh: "让 AI 触发 Zapier 上的 7000+ 应用自动化——发邮件、建日程、更新表格，一句话跨应用干活。",
      en: "Lets your AI trigger 7,000+ app automations via Zapier — send email, create events, update sheets, across apps in one sentence.",
    },
    capabilities: [
      { zh: "触发跨应用自动化", en: "Trigger cross-app automations" },
      { zh: "连接你已有的 Zaps", en: "Connect to your existing Zaps" },
    ],
    examplePrompts: [
      { zh: "把这条信息通过 Zapier 发到我的邮箱和 Slack", en: "Send this via Zapier to my email and Slack" },
    ],
  },
  "paypal-mcp": {
    whatItDoes: {
      zh: "让 AI 连你的 PayPal——查交易、开发票、管理订单，用对话处理收款业务。",
      en: "Connects your AI to PayPal — check transactions, create invoices, manage orders, handling payments through chat.",
    },
    capabilities: [
      { zh: "查询交易与订单", en: "Query transactions and orders" },
      { zh: "创建发票 / 收款", en: "Create invoices / collect payments" },
    ],
    examplePrompts: [
      { zh: "给这个客户开一张 200 美元的发票", en: "Create a $200 invoice for this customer" },
    ],
  },
  "square-mcp-server": {
    whatItDoes: {
      zh: "让 AI 连你的 Square——查销售、管库存、看客户，用对话运营你的门店和收款。",
      en: "Connects your AI to Square — check sales, manage inventory, view customers, running your store and payments through chat.",
    },
    capabilities: [
      { zh: "查询销售与支付", en: "Query sales and payments" },
      { zh: "管理商品库存", en: "Manage inventory" },
    ],
    examplePrompts: [
      { zh: "今天的销售额是多少？哪个商品卖得最好？", en: "What's today's revenue? Which item sold best?" },
    ],
  },
  "twilio-mcp": {
    whatItDoes: {
      zh: "让 AI 用 Twilio 发短信 / 打电话——发验证码、群发通知、查通信记录，用对话操作通信能力。",
      en: "Lets your AI send SMS / make calls via Twilio — codes, notifications, and message logs, through chat.",
    },
    capabilities: [
      { zh: "发送短信", en: "Send SMS" },
      { zh: "查询通信记录", en: "Query message logs" },
    ],
    examplePrompts: [
      { zh: "给这个号码发一条订单已发货的短信", en: "Text this number that their order has shipped" },
    ],
  },

  // ===== 云 / DevOps =====
  "aws-mcp-server": {
    whatItDoes: {
      zh: "让 AI 操作你的 AWS——查资源、看账单、管理服务，用对话干云运维（覆盖多个 AWS 官方 MCP）。",
      en: "Lets your AI operate AWS — inspect resources, check bills, manage services, doing cloud ops through chat (spans AWS's official MCP suite).",
    },
    capabilities: [
      { zh: "查询 AWS 资源与状态", en: "Query AWS resources and status" },
      { zh: "查看成本与账单", en: "View cost and billing" },
    ],
    examplePrompts: [
      { zh: "这个月 AWS 花了多少？哪个服务最贵？", en: "How much did AWS cost this month? Which service is most expensive?" },
    ],
  },
  "mcp-grafana": {
    whatItDoes: {
      zh: "让 AI 连你的 Grafana——查仪表盘、看指标、读告警，用对话排查监控数据。",
      en: "Connects your AI to Grafana — query dashboards, read metrics and alerts, investigating monitoring data through chat.",
    },
    capabilities: [
      { zh: "查询仪表盘与指标", en: "Query dashboards and metrics" },
      { zh: "读取告警状态", en: "Read alert status" },
    ],
    examplePrompts: [
      { zh: "过去一小时有没有触发的告警？", en: "Any alerts fired in the last hour?" },
    ],
  },
  "heroku-mcp-server": {
    whatItDoes: {
      zh: "让 AI 操作你的 Heroku——管应用、看日志、跑命令，用对话部署和运维。",
      en: "Lets your AI operate Heroku — manage apps, read logs, run commands, deploying and operating through chat.",
    },
    capabilities: [
      { zh: "管理应用与 dyno", en: "Manage apps and dynos" },
      { zh: "查看日志、跑命令", en: "View logs, run commands" },
    ],
    examplePrompts: [
      { zh: "看看这个应用最近的报错日志", en: "Show recent error logs for this app" },
    ],
  },
  "mcp-toolbox": {
    whatItDoes: {
      zh: "Google 官方的数据库 MCP 工具箱——一套接口连 Postgres/MySQL/AlloyDB 等多种数据库，让 AI 安全查数据。",
      en: "Google's official database MCP toolbox — one interface to Postgres/MySQL/AlloyDB and more, letting AI query data safely.",
    },
    capabilities: [
      { zh: "连接多种数据库", en: "Connect to many databases" },
      { zh: "安全地跑参数化查询", en: "Run safe parameterized queries" },
    ],
    examplePrompts: [
      { zh: "从生产库里查这个月的活跃用户数", en: "Query this month's active users from the production DB" },
    ],
  },
  "terraform-mcp-server": {
    whatItDoes: {
      zh: "让 AI 操作 Terraform——查 provider 文档、看资源配置、辅助写 IaC，用对话搞基础设施即代码。",
      en: "Lets your AI work with Terraform — look up provider docs, inspect resources, and help write IaC through chat.",
    },
    capabilities: [
      { zh: "查询 provider / 资源文档", en: "Query provider / resource docs" },
      { zh: "辅助编写 Terraform 配置", en: "Assist writing Terraform config" },
    ],
    examplePrompts: [
      { zh: "帮我写一段创建 S3 桶的 Terraform 配置", en: "Write Terraform to create an S3 bucket" },
    ],
  },
  "cloud-run-mcp": {
    whatItDoes: {
      zh: "让 AI 部署应用到 Google Cloud Run——一句话把代码或容器部署上线，用对话干 serverless 部署。",
      en: "Lets your AI deploy apps to Google Cloud Run — ship code or containers in one sentence, serverless deploy through chat.",
    },
    capabilities: [
      { zh: "部署服务到 Cloud Run", en: "Deploy services to Cloud Run" },
      { zh: "查看服务状态与日志", en: "View service status and logs" },
    ],
    examplePrompts: [
      { zh: "把这个目录的应用部署到 Cloud Run", en: "Deploy the app in this directory to Cloud Run" },
    ],
  },
  "netlify-mcp": {
    whatItDoes: {
      zh: "让 AI 操作你的 Netlify——部署站点、管域名、看构建日志，用对话干前端部署和运维。",
      en: "Lets your AI operate Netlify — deploy sites, manage domains, read build logs, doing frontend deploy/ops through chat.",
    },
    capabilities: [
      { zh: "部署 / 管理站点", en: "Deploy / manage sites" },
      { zh: "查看构建日志", en: "View build logs" },
    ],
    examplePrompts: [
      { zh: "这个站点最近一次部署失败了吗？看下日志", en: "Did the latest deploy fail? Show me the logs" },
    ],
  },
  "snowflake-mcp": {
    whatItDoes: {
      zh: "让 AI 连你的 Snowflake——跑分析查询、查数据仓库，用自然语言做企业级数据分析。",
      en: "Connects your AI to Snowflake — run analytical queries over your data warehouse in plain language.",
    },
    capabilities: [
      { zh: "跑 SQL 分析查询", en: "Run analytical SQL" },
      { zh: "查看仓库数据与结构", en: "Inspect warehouse data and schema" },
    ],
    examplePrompts: [
      { zh: "按地区统计上季度的营收", en: "Break down last quarter's revenue by region" },
    ],
  },
  "dynatrace-mcp": {
    whatItDoes: {
      zh: "让 AI 连你的 Dynatrace——查性能问题、看可观测性数据、定位故障根因，用对话排障。",
      en: "Connects your AI to Dynatrace — investigate performance issues, read observability data, and find root causes through chat.",
    },
    capabilities: [
      { zh: "查询问题与告警", en: "Query problems and alerts" },
      { zh: "读取可观测性数据", en: "Read observability data" },
    ],
    examplePrompts: [
      { zh: "现在有哪些影响用户的性能问题？", en: "What performance problems are affecting users right now?" },
    ],
  },
  "microsoft-mcp": {
    whatItDoes: {
      zh: "微软官方的 MCP 集合——覆盖 Azure、Dev Box、Playwright 等多个官方 server，让 AI 操作微软生态的服务。",
      en: "Microsoft's official MCP collection — spans Azure, Dev Box, Playwright and more, letting AI operate Microsoft services.",
    },
    capabilities: [
      { zh: "操作 Azure 等微软服务", en: "Operate Azure and other Microsoft services" },
      { zh: "查询资源与文档", en: "Query resources and docs" },
    ],
    examplePrompts: [
      { zh: "列出我这个 Azure 订阅下所有资源组", en: "List all resource groups in my Azure subscription" },
    ],
  },
  "vantage-mcp-server": {
    whatItDoes: {
      zh: "让 AI 连 Vantage——查跨云成本、分析账单、找省钱点，用对话管云支出（FinOps）。",
      en: "Connects your AI to Vantage — query multi-cloud costs, analyze bills, find savings, doing cloud FinOps through chat.",
    },
    capabilities: [
      { zh: "查询跨云成本", en: "Query multi-cloud costs" },
      { zh: "分析账单与趋势", en: "Analyze bills and trends" },
    ],
    examplePrompts: [
      { zh: "这个月哪块云支出涨得最快？", en: "Which cloud spend grew fastest this month?" },
    ],
  },

  // ===== AI / 模型 =====
  "perplexity-mcp": {
    whatItDoes: {
      zh: "给 AI 接上 Perplexity 的联网问答——实时搜索并给出带引用的答案，适合研究和事实核查。",
      en: "Plugs Perplexity's web-grounded Q&A into your AI — real-time search with cited answers, for research and fact-checking.",
    },
    capabilities: [
      { zh: "联网实时问答", en: "Real-time web Q&A" },
      { zh: "返回带引用的结果", en: "Return cited results" },
    ],
    examplePrompts: [
      { zh: "查一下这个技术最新的最佳实践，带来源", en: "Look up the latest best practices for this tech, with sources" },
    ],
  },
};

/** 按 slug 取能力数据；无则返回 undefined（详情页据此决定是否渲染能力卡）。 */
export function getServerCapability(slug: string): ServerCapability | undefined {
  return SERVER_CAPABILITIES[slug];
}
