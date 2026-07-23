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
};

/** 按 slug 取能力数据；无则返回 undefined（详情页据此决定是否渲染能力卡）。 */
export function getServerCapability(slug: string): ServerCapability | undefined {
  return SERVER_CAPABILITIES[slug];
}
