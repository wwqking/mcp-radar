// SEO 落地页配置：/servers/{tool}-mcp-server 干净 URL，精准命中 "{tool} mcp server" 主关键词。
//
// 为什么和现有 /server/{registry-id} 并存而不替换：
//   - 旧页 /server/{id} 是「数据详情页」——健康信号、TrustScore、五维卡，URL 是 registry id。
//   - 新页 /servers/{tool}-mcp-server 是「SEO 落地页」——干净 URL + 教程长文 + What/Install/FAQ，
//     canonical 指向自己（内容实质不同，不判重复），并链到旧详情页看深度数据。
//
// 只为「数据里确有对应 server + 值得推」的白名单工具建页。查不到 server 的工具不建，避免空壳页。
//
// 每条 = SEO slug（URL 段，不含 "-mcp-server" 后缀，由路由拼）+ 目标 server slug + 双语文案。
// 能力/示例复用 lib/server-capabilities.ts（按 serverSlug 查），这里只补 SEO 专属的 intro/why/faq。

import type { Locale } from "./i18n/locales";

export interface SeoLandingFaq {
  q: string;
  a: string;
}

interface SeoLandingText {
  /** H1 与 <title> 里用的工具展示名，如 "Postgres"、"GitHub"。 */
  toolName: string;
  /** 关键词前置的一句话简介（meta description 主体）。 */
  tagline: string;
  /** 顶部介绍长文（2-3 段）。 */
  intro: string[];
  /** 「为什么用它 / 适合谁」段。 */
  whyUse: string[];
  faq: SeoLandingFaq[];
}

export interface SeoLanding {
  /** URL 段：/servers/{toolSlug}-mcp-server。 */
  toolSlug: string;
  /** 对应 data/servers.json 里的真实 server slug。 */
  serverSlug: string;
  zh: SeoLandingText;
  en: SeoLandingText;
}

export const SEO_LANDINGS: SeoLanding[] = [
  {
    toolSlug: "postgres",
    serverSlug: "ai-waystation-postgres",
    zh: {
      toolName: "Postgres",
      tagline: "Postgres MCP Server：把 PostgreSQL 数据库接给 Claude、Cursor、VS Code，用自然语言查数据、看表结构。附安装与配置指南。",
      intro: [
        "Postgres MCP Server 让 AI 直接连上你的 PostgreSQL 数据库——不用你写 SQL，直接对 AI 说「上个月成交额前十的客户是谁」，它自己查表、跑查询、返回结果。",
        "对开发者来说，这省掉了「打开数据库客户端 → 想 SQL → 复制结果回 AI」的来回。装好之后，数据库就成了 AI 上下文的一部分。",
      ],
      whyUse: [
        "适合：想让 AI 帮忙做数据探查、生成报表、调试线上数据问题的开发者和数据分析师。",
        "接入前注意：数据库连接串包含敏感凭据，建议先用只读账号连生产库；本页下方能看到这个 server 的维护活跃度和健康信号，再决定要不要接生产。",
      ],
      faq: [
        { q: "Postgres MCP Server 会改我的数据吗？", a: "取决于你给它的数据库账号权限。想安全起见，接生产库时用只读账号，AI 就只能查、不能改。" },
        { q: "支持哪些 AI 客户端？", a: "Claude Desktop、Claude Code、Cursor、VS Code 等支持 MCP 的客户端都能接，配置方式见下方安装区。" },
      ],
    },
    en: {
      toolName: "Postgres",
      tagline: "Postgres MCP Server: connect your PostgreSQL database to Claude, Cursor & VS Code and query data in natural language. Installation and configuration guide included.",
      intro: [
        "The Postgres MCP Server lets your AI connect directly to your PostgreSQL database — instead of writing SQL, you just tell the AI \"who were the top 10 customers by revenue last month\" and it queries the tables and returns the result.",
        "For developers, this removes the back-and-forth of opening a DB client, writing SQL, and pasting results back into the AI. Once installed, your database becomes part of the AI's context.",
      ],
      whyUse: [
        "Good for: developers and data analysts who want the AI to help explore data, generate reports, or debug production data issues.",
        "Before connecting: your connection string holds sensitive credentials — use a read-only account for production databases. The maintenance and health signals for this server are shown below so you can judge whether it's production-ready.",
      ],
      faq: [
        { q: "Will the Postgres MCP Server modify my data?", a: "It depends on the permissions of the database account you give it. To stay safe, use a read-only account for production so the AI can only query, not change data." },
        { q: "Which AI clients are supported?", a: "Claude Desktop, Claude Code, Cursor, and VS Code all work with MCP. See the installation section below for the config." },
      ],
    },
  },
  {
    toolSlug: "context7",
    serverSlug: "upstash-context7-mcp",
    zh: {
      toolName: "Context7",
      tagline: "Context7 MCP Server：给 Claude、Cursor 喂最新的库文档，避免 AI 用过时或幻觉出来的 API。附安装配置。",
      intro: [
        "Context7 MCP Server 解决一个很具体的痛点：AI 写代码时常用过时的 API，或者干脆编一个不存在的方法。Context7 在 AI 回答前，实时拉取你用的那个库的最新官方文档喂给它。",
        "用法很简单——在提示词里加一句「use context7」，AI 就会先查最新文档再写代码。对天天和快速迭代的库（Next.js、各种 SDK）打交道的人特别有用。",
      ],
      whyUse: [
        "适合：用 Cursor / Claude Code 写代码、经常被 AI 的过时 API 坑到的开发者。",
        "它是本站 TrustScore 最高的 server 之一，维护活跃、采用度高——下方有它的完整健康数据。",
      ],
      faq: [
        { q: "Context7 支持哪些编程库？", a: "覆盖大量主流开源库和框架的官方文档，持续更新。具体某个库是否支持，可在其官网或文档查。" },
        { q: "要付费吗？", a: "MCP server 本身开源免费，接入即用。" },
      ],
    },
    en: {
      toolName: "Context7",
      tagline: "Context7 MCP Server: feed up-to-date library docs to Claude & Cursor so your AI stops using outdated or hallucinated APIs. Setup guide included.",
      intro: [
        "The Context7 MCP Server solves a very specific pain: AI often writes code with outdated APIs, or invents methods that don't exist. Context7 pulls the latest official docs for the library you're using and feeds them to the AI before it answers.",
        "Usage is simple — add \"use context7\" to your prompt, and the AI checks the latest docs before writing code. It's especially useful for fast-moving libraries (Next.js, various SDKs).",
      ],
      whyUse: [
        "Good for: developers writing code in Cursor / Claude Code who keep getting burned by outdated APIs.",
        "It's one of the highest-TrustScore servers on this site — actively maintained and widely adopted. Full health data is shown below.",
      ],
      faq: [
        { q: "Which libraries does Context7 support?", a: "It covers official docs for a large set of popular open-source libraries and frameworks, continuously updated. Check a specific library's site to confirm support." },
        { q: "Does it cost money?", a: "The MCP server itself is open-source and free to use." },
      ],
    },
  },
  {
    toolSlug: "github",
    serverSlug: "github-github-mcp-server",
    zh: {
      toolName: "GitHub",
      tagline: "GitHub MCP Server（官方）：把 issue、PR、代码、Actions 接给 AI，让它替你查仓库、建 issue、评审 PR。附安装配置。",
      intro: [
        "GitHub 官方 MCP Server 把你的 GitHub 工作流接进 AI：查 issue、看 PR、读代码、触发 Actions，都能用自然语言让 AI 代劳。",
        "比如「看看这个仓库最近有哪些没人回的 issue，帮我起草回复」——AI 会调用这个 server 拉数据、按你的意思处理。",
      ],
      whyUse: [
        "适合：想用 AI 管理仓库、加速代码评审和 issue 处理的团队与个人开发者。",
        "这是 GitHub 官方出的 server，可靠性和维护有保障，下方是它在本站的实测健康数据。",
      ],
      faq: [
        { q: "需要 GitHub token 吗？", a: "需要。它通过你的 personal access token 访问仓库，权限范围由 token 决定，建议按最小权限原则配置。" },
        { q: "能操作私有仓库吗？", a: "能，只要你的 token 有对应私有仓库的权限。" },
      ],
    },
    en: {
      toolName: "GitHub",
      tagline: "GitHub MCP Server (official): connect issues, PRs, code, and Actions to your AI so it can search repos, open issues, and review PRs. Setup guide included.",
      intro: [
        "GitHub's official MCP Server wires your GitHub workflow into the AI: query issues, view PRs, read code, and trigger Actions — all by telling the AI what you want in natural language.",
        "For example, \"find the recent issues in this repo that nobody has answered and draft a reply\" — the AI calls this server to pull the data and acts on your instruction.",
      ],
      whyUse: [
        "Good for: teams and individual developers who want AI to manage repos and speed up code review and issue triage.",
        "This is GitHub's official server, so reliability and maintenance are backed by GitHub. Its measured health data on this site is shown below.",
      ],
      faq: [
        { q: "Does it need a GitHub token?", a: "Yes. It accesses repos through your personal access token; the scope is defined by the token, so configure it with least privilege." },
        { q: "Can it work with private repos?", a: "Yes, as long as your token has access to those private repos." },
      ],
    },
  },
  {
    toolSlug: "filesystem",
    serverSlug: "modelcontextprotocol-server-filesystem",
    zh: {
      toolName: "Filesystem",
      tagline: "Filesystem MCP Server（官方）：让 AI 读写你本地指定目录里的文件——归类、总结、批量改，都不用你复制粘贴。附安装配置。",
      intro: [
        "Filesystem MCP Server 让 AI 直接操作你本地某个你允许的目录：读文件、写文件、列目录、搜索、重命名。你不用再复制粘贴文件内容给 AI。",
        "比如「把 Downloads 里的截图按日期归到子文件夹」，AI 会调用这个 server 自己完成整理。这是 MCP 官方出的参考实现之一。",
      ],
      whyUse: [
        "适合：想让 AI 帮忙整理文件、批量处理文档、读本地项目的所有人。",
        "安全边界清晰：它只能访问你在配置里明确允许的目录，碰不到其他地方。下方有它的健康与维护数据。",
      ],
      faq: [
        { q: "AI 能访问我整个硬盘吗？", a: "不能。你在配置里指定哪些目录，它就只能访问那些目录，其余一概碰不到。" },
        { q: "会不会误删文件？", a: "它有写和删的能力，所以要给它明确指令。重要目录建议先备份，或只给它只读用途的目录。" },
      ],
    },
    en: {
      toolName: "Filesystem",
      tagline: "Filesystem MCP Server (official): let your AI read and write files in a directory you allow — organize, summarize, and batch-edit without copy-paste. Setup guide included.",
      intro: [
        "The Filesystem MCP Server lets the AI operate directly on a local directory you allow: read files, write files, list directories, search, and rename. No more pasting file contents into the AI.",
        "For example, \"sort the screenshots in Downloads into date-based subfolders\" — the AI calls this server and does the organizing itself. It's one of MCP's official reference implementations.",
      ],
      whyUse: [
        "Good for: anyone who wants the AI to organize files, batch-process documents, or read a local project.",
        "Clear security boundary: it can only access the directories you explicitly allow in the config — nothing else. Its health and maintenance data is shown below.",
      ],
      faq: [
        { q: "Can the AI access my whole drive?", a: "No. It can only access the directories you specify in the config — everything else is off limits." },
        { q: "Could it delete files by mistake?", a: "It has write and delete capabilities, so give it clear instructions. Back up important directories first, or point it at read-only directories." },
      ],
    },
  },
  {
    toolSlug: "figma",
    serverSlug: "figma-developer-mcp",
    zh: {
      toolName: "Figma",
      tagline: "Figma MCP Server：把 Figma 设计稿接给 AI 读取布局与样式，让它照着设计生成前端代码。附安装配置。",
      intro: [
        "Figma MCP Server 把你的 Figma 设计稿接给 AI：它能读取画板的布局、间距、颜色、字体，然后照着生成对应的前端代码。",
        "对做 design-to-code 的人特别有用——不用手动量像素、抄颜色，AI 直接从设计源数据里取。",
      ],
      whyUse: [
        "适合：前端开发者、做设计还原的团队，想把 Figma 稿快速转成代码。",
        "维护活跃、采用度高，下方有完整健康数据可参考。",
      ],
      faq: [
        { q: "需要 Figma 的什么权限？", a: "需要一个 Figma access token 来读取文件，按最小权限配置即可。" },
        { q: "能生成哪种框架的代码？", a: "它提供的是设计的结构化数据，具体生成 React/Vue/Tailwind 哪种由你的 AI 客户端和提示词决定。" },
      ],
    },
    en: {
      toolName: "Figma",
      tagline: "Figma MCP Server: give your AI read access to Figma layout and styles so it can generate front-end code from your designs. Setup guide included.",
      intro: [
        "The Figma MCP Server connects your Figma designs to the AI: it can read a frame's layout, spacing, colors, and fonts, then generate matching front-end code.",
        "It's especially useful for design-to-code work — no manually measuring pixels or copying color values; the AI pulls straight from the design source data.",
      ],
      whyUse: [
        "Good for: front-end developers and teams doing pixel-accurate design implementation who want to turn Figma frames into code quickly.",
        "Actively maintained and widely adopted; full health data is shown below.",
      ],
      faq: [
        { q: "What Figma permissions does it need?", a: "It needs a Figma access token to read files — configure it with least privilege." },
        { q: "Which framework's code can it generate?", a: "It provides structured design data; whether the output is React/Vue/Tailwind depends on your AI client and prompt." },
      ],
    },
  },
  {
    toolSlug: "playwright",
    serverSlug: "playwright-mcp",
    zh: {
      toolName: "Playwright",
      tagline: "Playwright MCP Server（微软官方）：让 AI 驱动真实浏览器做端到端测试、网页抓取和自动化操作。附安装配置。",
      intro: [
        "Playwright MCP Server 让 AI 控制一个真实浏览器：打开网页、点按钮、填表单、截图、抓内容。你用自然语言描述要做的事，它自己驱动浏览器完成。",
        "比如「打开这个页面，登录后把订单列表导出来」，AI 会通过 Playwright 一步步操作。这是微软官方出的 server。",
      ],
      whyUse: [
        "适合：要做端到端测试、网页自动化、数据抓取的开发者和 QA。",
        "微软官方维护，TrustScore 很高，下方是完整健康数据。",
      ],
      faq: [
        { q: "它跑的是真浏览器还是无头？", a: "两种都支持，可配置。做自动化常用无头，调试时可开有头看过程。" },
        { q: "能绕过登录墙吗？", a: "它像人一样操作浏览器，能走正常登录流程；但请遵守目标网站的条款，别用于违规抓取。" },
      ],
    },
    en: {
      toolName: "Playwright",
      tagline: "Playwright MCP Server (official, Microsoft): let your AI drive a real browser for end-to-end testing, web scraping, and automation. Setup guide included.",
      intro: [
        "The Playwright MCP Server lets the AI control a real browser: open pages, click buttons, fill forms, take screenshots, and extract content. You describe the task in natural language and it drives the browser to do it.",
        "For example, \"open this page, log in, and export the order list\" — the AI works through it step by step via Playwright. This is Microsoft's official server.",
      ],
      whyUse: [
        "Good for: developers and QA doing end-to-end testing, web automation, or data scraping.",
        "Maintained by Microsoft with a very high TrustScore; full health data is shown below.",
      ],
      faq: [
        { q: "Does it run a real browser or headless?", a: "Both are supported and configurable. Headless is common for automation; run headed when you want to watch what's happening while debugging." },
        { q: "Can it get past login walls?", a: "It operates a browser like a human, so it can go through normal login flows — but respect the target site's terms and don't use it for abusive scraping." },
      ],
    },
  },
  {
    toolSlug: "linear",
    serverSlug: "linear-mcp",
    zh: {
      toolName: "Linear",
      tagline: "Linear MCP Server（官方）：把 Linear 的 issue、项目、周期接给 AI，让它替你建任务、查进度、更新状态。附安装配置。",
      intro: [
        "Linear MCP Server 把你的 Linear 工作区接进 AI：查 issue、建任务、更新状态、看项目进度，都能用自然语言让 AI 代做。",
        "比如「把这几条会议纪要拆成 Linear issue 分给对应的人」，AI 会调用这个 server 批量创建。",
      ],
      whyUse: [
        "适合：用 Linear 管理研发的团队，想用 AI 减少手动录 issue、跟进度的负担。",
        "Linear 官方出品，下方有它在本站的健康与维护数据。",
      ],
      faq: [
        { q: "需要什么权限？", a: "需要 Linear 的 API key 来读写你的工作区，按需配置权限范围。" },
        { q: "能自动分配负责人吗？", a: "能，只要你在提示里说清分给谁，AI 会带上 assignee 创建 issue。" },
      ],
    },
    en: {
      toolName: "Linear",
      tagline: "Linear MCP Server (official): connect Linear issues, projects, and cycles to your AI so it can create tasks, check progress, and update status. Setup guide included.",
      intro: [
        "The Linear MCP Server wires your Linear workspace into the AI: query issues, create tasks, update status, and check project progress — all in natural language.",
        "For example, \"break these meeting notes into Linear issues and assign them to the right people\" — the AI calls this server to create them in bulk.",
      ],
      whyUse: [
        "Good for: teams running engineering on Linear who want AI to cut the manual work of filing issues and tracking progress.",
        "Built by Linear officially; its health and maintenance data on this site is shown below.",
      ],
      faq: [
        { q: "What permissions does it need?", a: "It needs a Linear API key to read and write your workspace — configure the scope as needed." },
        { q: "Can it auto-assign owners?", a: "Yes — if you say who to assign in your prompt, the AI creates the issue with that assignee." },
      ],
    },
  },

  // ===== Wave 1（第二轮 mcp-server 关键词研究，库里有真 server 且质量核对通过）=====
  {
    toolSlug: "firecrawl",
    serverSlug: "firecrawl-mcp-server",
    zh: {
      toolName: "Firecrawl",
      tagline: "Firecrawl MCP Server（官方）：给 Claude、Cursor 加上强力网页抓取和搜索能力，把任意网页转成干净的 Markdown 喂给 AI。附安装配置。",
      intro: [
        "Firecrawl MCP Server 让 AI 能抓取整个网站、把网页转成干净的 Markdown、还能做网页搜索——不用你手动复制粘贴页面内容。",
        "比如「抓一下这个竞品官网的定价页，整理成对比表」，AI 会通过 Firecrawl 抓取、解析、返回结构化结果。这是 Firecrawl 官方出的 server。",
      ],
      whyUse: [
        "适合：做竞品调研、内容聚合、给 AI 喂实时网页数据的开发者和运营。",
        "官方维护、star 数高、TrustScore 靠前，下方有它的完整健康数据。",
      ],
      faq: [
        { q: "Firecrawl 能抓需要登录的页面吗？", a: "它主要抓公开可访问的页面；带认证的场景要看具体配置，且请遵守目标网站条款。" },
        { q: "要付费吗？", a: "server 开源，但它调用的 Firecrawl 抓取服务可能有配额/付费额度，看你的使用量。" },
      ],
    },
    en: {
      toolName: "Firecrawl",
      tagline: "Firecrawl MCP Server (official): add powerful web scraping and search to Claude & Cursor, turning any page into clean Markdown for your AI. Setup guide included.",
      intro: [
        "The Firecrawl MCP Server lets your AI crawl entire sites, convert pages to clean Markdown, and run web searches — no manual copy-paste of page content.",
        "For example, \"scrape this competitor's pricing page and turn it into a comparison table\" — the AI uses Firecrawl to fetch, parse, and return structured results. This is Firecrawl's official server.",
      ],
      whyUse: [
        "Good for: developers and operators doing competitive research, content aggregation, or feeding real-time web data to the AI.",
        "Officially maintained, high star count, top-tier TrustScore — full health data is shown below.",
      ],
      faq: [
        { q: "Can Firecrawl scrape pages behind a login?", a: "It mainly scrapes publicly accessible pages; authenticated cases depend on configuration, and you should respect the target site's terms." },
        { q: "Does it cost money?", a: "The server is open-source, but the Firecrawl scraping service it calls may have quota/paid tiers depending on your usage." },
      ],
    },
  },
  {
    toolSlug: "airtable",
    serverSlug: "airtable-mcp-server",
    zh: {
      toolName: "Airtable",
      tagline: "Airtable MCP Server：把 Airtable 的表格和记录接给 AI，让它查数据、建记录、改字段。附安装配置。",
      intro: [
        "Airtable MCP Server 让 AI 直接读写你的 Airtable base——查记录、建行、改字段，都用自然语言说就行。",
        "比如「把这几条客户反馈录进 Airtable 的 CRM 表，标好优先级」，AI 会调用这个 server 批量写入。",
      ],
      whyUse: [
        "适合：用 Airtable 当轻量数据库/CRM 的团队，想用 AI 减少手动录入和查询。",
        "维护活跃，下方有它在本站的健康与维护数据。",
      ],
      faq: [
        { q: "需要什么权限？", a: "需要一个 Airtable personal access token，按你要访问的 base 配好权限范围。" },
        { q: "会误改我的数据吗？", a: "它有写权限，所以给明确指令；重要 base 建议先用一个测试 base 演练。" },
      ],
    },
    en: {
      toolName: "Airtable",
      tagline: "Airtable MCP Server: connect your Airtable tables and records to your AI so it can query data, create records, and update fields. Setup guide included.",
      intro: [
        "The Airtable MCP Server lets your AI read and write your Airtable base directly — query records, create rows, update fields — all in natural language.",
        "For example, \"log these customer feedback notes into my Airtable CRM table and set priorities\" — the AI uses this server to write them in bulk.",
      ],
      whyUse: [
        "Good for: teams using Airtable as a lightweight database/CRM who want AI to cut manual data entry and lookups.",
        "Actively maintained; its health and maintenance data on this site is shown below.",
      ],
      faq: [
        { q: "What permissions does it need?", a: "An Airtable personal access token, scoped to the bases you want it to access." },
        { q: "Could it change my data by mistake?", a: "It has write access, so give clear instructions; rehearse with a test base before pointing it at important data." },
      ],
    },
  },
  {
    toolSlug: "shopify",
    serverSlug: "shopify-mcp",
    zh: {
      toolName: "Shopify",
      tagline: "Shopify MCP Server：把 Shopify 店铺的商品、订单、客户数据接给 Claude、Cursor，用自然语言查店铺、管商品。附安装配置。",
      intro: [
        "Shopify MCP Server 让 AI 连上你的 Shopify 店铺 API——查订单、看商品、拉客户数据，都能用自然语言让 AI 代做。",
        "比如「这周卖得最好的 5 个商品是什么，各卖了多少」，AI 会通过这个 server 查店铺数据并汇总。",
      ],
      whyUse: [
        "适合：跑 Shopify 独立站的店主和运营，想用 AI 快速查数据、做商品/订单管理。",
        "下方有这个 server 的维护活跃度和健康信号，接生产店铺前先看一眼。",
      ],
      faq: [
        { q: "需要什么权限？", a: "需要 Shopify 的 API 访问凭据，按最小权限配置——只读查询就给只读权限。" },
        { q: "支持哪些客户端？", a: "Claude、Cursor 等支持 MCP 的客户端都能接，配置见下方安装区。" },
      ],
    },
    en: {
      toolName: "Shopify",
      tagline: "Shopify MCP Server: connect your Shopify store's products, orders, and customer data to Claude & Cursor and manage your shop in natural language. Setup guide included.",
      intro: [
        "The Shopify MCP Server connects your AI to your Shopify store API — query orders, view products, pull customer data — all by telling the AI what you want.",
        "For example, \"what were my 5 best-selling products this week and how many did each sell\" — the AI uses this server to query store data and summarize.",
      ],
      whyUse: [
        "Good for: Shopify store owners and operators who want AI to quickly query data and manage products/orders.",
        "This server's maintenance and health signals are shown below — check them before connecting a production store.",
      ],
      faq: [
        { q: "What permissions does it need?", a: "Shopify API access credentials, scoped with least privilege — give read-only access for read-only queries." },
        { q: "Which clients are supported?", a: "Claude, Cursor, and other MCP-capable clients. See the installation section below." },
      ],
    },
  },
  {
    toolSlug: "sentry",
    serverSlug: "sentry-mcp",
    zh: {
      toolName: "Sentry",
      tagline: "Sentry MCP Server（官方）：把 Sentry 的错误、issue、性能数据接给 AI，让它帮你查 bug、分析报错。附安装配置。",
      intro: [
        "Sentry MCP Server 让 AI 直接连上你的 Sentry——查最近的报错、看某个 issue 的堆栈、分析错误趋势，都能用自然语言问。",
        "比如「过去 24 小时新增了哪些报错，哪个影响用户最多」，AI 会通过这个 server 拉 Sentry 数据并给你归因。",
      ],
      whyUse: [
        "适合：想用 AI 加速排查线上错误、做故障归因的开发者和 SRE。",
        "Sentry 官方出品，可靠性有保障，下方是它在本站的实测健康数据。",
      ],
      faq: [
        { q: "需要什么权限？", a: "需要 Sentry 的 auth token，按你要访问的项目配好范围。" },
        { q: "能自动修 bug 吗？", a: "它负责把错误上下文接给 AI，改代码要结合你的代码库和判断，别盲目照搬。" },
      ],
    },
    en: {
      toolName: "Sentry",
      tagline: "Sentry MCP Server (official): connect your Sentry errors, issues, and performance data to your AI so it can help debug and triage. Setup guide included.",
      intro: [
        "The Sentry MCP Server connects your AI to Sentry — query recent errors, inspect an issue's stack trace, analyze error trends — all in natural language.",
        "For example, \"what new errors appeared in the last 24 hours and which affects the most users\" — the AI uses this server to pull Sentry data and attribute the cause.",
      ],
      whyUse: [
        "Good for: developers and SREs who want AI to speed up production-error investigation and root-cause analysis.",
        "Built by Sentry officially, so reliability is backed; its measured health data on this site is shown below.",
      ],
      faq: [
        { q: "What permissions does it need?", a: "A Sentry auth token, scoped to the projects you want it to access." },
        { q: "Can it fix bugs automatically?", a: "It brings error context to the AI; code fixes still need your codebase and judgment — don't apply blindly." },
      ],
    },
  },
  {
    toolSlug: "tavily",
    serverSlug: "tavily-mcp",
    zh: {
      toolName: "Tavily",
      tagline: "Tavily MCP Server：给 AI 加上实时网页搜索、内容提取和爬取能力，专为 AI 场景优化。附安装配置。",
      intro: [
        "Tavily MCP Server 给 AI 接上实时网页搜索——它专为 AI 场景做了优化，返回的是干净、可直接用的结果，而不是一堆原始 HTML。",
        "比如「查一下这个技术的最新进展，给我三条权威来源」，AI 会通过 Tavily 搜索、提取、汇总。",
      ],
      whyUse: [
        "适合：要给 AI 补实时联网能力、做研究和事实核查的开发者。",
        "生产可用、star 数高，下方有完整健康数据。",
      ],
      faq: [
        { q: "和普通搜索引擎有什么区别？", a: "Tavily 面向 AI 优化，返回结构化、去噪的结果，省去 AI 自己解析网页的麻烦。" },
        { q: "要 API key 吗？", a: "需要 Tavily 的 API key，按用量可能有配额。" },
      ],
    },
    en: {
      toolName: "Tavily",
      tagline: "Tavily MCP Server: add real-time web search, content extraction, and crawling to your AI, optimized for AI use cases. Setup guide included.",
      intro: [
        "The Tavily MCP Server gives your AI real-time web search — optimized for AI, returning clean, ready-to-use results instead of raw HTML.",
        "For example, \"find the latest developments on this technology and give me three authoritative sources\" — the AI uses Tavily to search, extract, and summarize.",
      ],
      whyUse: [
        "Good for: developers adding real-time web access to the AI for research and fact-checking.",
        "Production-ready with a high star count; full health data is shown below.",
      ],
      faq: [
        { q: "How is it different from a normal search engine?", a: "Tavily is AI-optimized, returning structured, de-noised results so the AI doesn't have to parse web pages itself." },
        { q: "Does it need an API key?", a: "Yes, a Tavily API key; there may be usage quotas depending on your plan." },
      ],
    },
  },
  {
    toolSlug: "exa",
    serverSlug: "exa-mcp-server",
    zh: {
      toolName: "Exa",
      tagline: "Exa MCP Server（官方）：给 AI 加上语义网页搜索和爬取能力，用「意思」而不是关键词找网页。附安装配置。",
      intro: [
        "Exa MCP Server 让 AI 用语义搜索找网页——你描述想找什么样的内容，它按含义匹配，而不是死抠关键词。",
        "比如「找几篇讲 MCP 在企业落地踩坑的文章」，AI 会通过 Exa 按语义搜索、爬取、返回结果。这是 Exa 官方出的 server。",
      ],
      whyUse: [
        "适合：做深度研究、找相似内容、要高质量网页来源的开发者。",
        "官方维护、TrustScore 高，下方有完整健康数据。",
      ],
      faq: [
        { q: "Exa 和关键词搜索有什么不同？", a: "Exa 是语义/神经搜索，按内容含义匹配，更适合「找像这样的东西」而非精确词。" },
        { q: "要 API key 吗？", a: "需要 Exa 的 API key，按用量可能有配额。" },
      ],
    },
    en: {
      toolName: "Exa",
      tagline: "Exa MCP Server (official): add semantic web search and crawling to your AI — find pages by meaning, not keywords. Setup guide included.",
      intro: [
        "The Exa MCP Server lets your AI search the web semantically — describe the kind of content you want and it matches by meaning rather than exact keywords.",
        "For example, \"find articles about the pitfalls of adopting MCP in the enterprise\" — the AI uses Exa to search semantically, crawl, and return results. This is Exa's official server.",
      ],
      whyUse: [
        "Good for: developers doing deep research, finding similar content, or needing high-quality web sources.",
        "Officially maintained with a high TrustScore; full health data is shown below.",
      ],
      faq: [
        { q: "How is Exa different from keyword search?", a: "Exa is semantic/neural search, matching by meaning — better for \"find things like this\" than exact terms." },
        { q: "Does it need an API key?", a: "Yes, an Exa API key; there may be usage quotas." },
      ],
    },
  },
  {
    toolSlug: "perplexity",
    serverSlug: "perplexity-mcp",
    zh: {
      toolName: "Perplexity",
      tagline: "Perplexity MCP Server（官方）：把 Perplexity 的联网问答能力接给 Claude、Cursor，让 AI 用带引用的实时答案。附安装配置。",
      intro: [
        "Perplexity MCP Server 让你的 AI 调用 Perplexity 的联网问答——拿到的是带来源引用的实时答案，而不是模型闭门造车。",
        "比如「查一下某个库最新版本有什么破坏性变更」，AI 会通过 Perplexity 联网查、带引用返回。这是 Perplexity 官方 server。",
      ],
      whyUse: [
        "适合：想给 AI 补实时、可溯源信息的开发者。",
        "官方实现、star 数高，下方有完整健康数据。",
      ],
      faq: [
        { q: "答案可信吗？", a: "Perplexity 返回带来源引用的答案，你可以点开原始出处核实。" },
        { q: "要 API key 吗？", a: "需要 Perplexity API key，按用量计费。" },
      ],
    },
    en: {
      toolName: "Perplexity",
      tagline: "Perplexity MCP Server (official): bring Perplexity's web-connected Q&A to Claude & Cursor for real-time, cited answers. Setup guide included.",
      intro: [
        "The Perplexity MCP Server lets your AI call Perplexity's web-connected Q&A — you get real-time answers with source citations, not the model guessing on its own.",
        "For example, \"check what breaking changes the latest version of this library has\" — the AI uses Perplexity to look it up online and return with citations. This is Perplexity's official server.",
      ],
      whyUse: [
        "Good for: developers adding real-time, traceable information to the AI.",
        "Official implementation with a high star count; full health data is shown below.",
      ],
      faq: [
        { q: "Are the answers trustworthy?", a: "Perplexity returns answers with source citations you can click through to verify." },
        { q: "Does it need an API key?", a: "Yes, a Perplexity API key, billed by usage." },
      ],
    },
  },
  {
    toolSlug: "qdrant",
    serverSlug: "mcp-server-qdrant",
    zh: {
      toolName: "Qdrant",
      tagline: "Qdrant MCP Server（官方）：把 Qdrant 向量数据库接给 AI，做语义记忆和相似检索。附安装配置。",
      intro: [
        "Qdrant MCP Server 让 AI 用 Qdrant 向量库做「记忆」和语义检索——存进去的内容能按语义相似度被找回，而不是精确匹配。",
        "比如「把这些技术笔记存进去，之后按意思帮我找相关的」，AI 会通过这个 server 写入向量、按语义召回。这是 Qdrant 官方 server。",
      ],
      whyUse: [
        "适合：做 RAG、给 AI 建长期记忆、需要语义检索的开发者。",
        "Qdrant 官方出品，下方有它的健康与维护数据。",
      ],
      faq: [
        { q: "需要自己跑 Qdrant 吗？", a: "需要一个可访问的 Qdrant 实例（自托管或云），server 连它做读写。" },
        { q: "和普通数据库有什么区别？", a: "它按向量相似度检索，适合「找语义相近的内容」，不是精确 SQL 查询。" },
      ],
    },
    en: {
      toolName: "Qdrant",
      tagline: "Qdrant MCP Server (official): connect the Qdrant vector database to your AI for semantic memory and similarity search. Setup guide included.",
      intro: [
        "The Qdrant MCP Server lets your AI use a Qdrant vector store for \"memory\" and semantic retrieval — stored content is recalled by semantic similarity, not exact match.",
        "For example, \"store these technical notes and later find related ones by meaning\" — the AI uses this server to write vectors and recall semantically. This is Qdrant's official server.",
      ],
      whyUse: [
        "Good for: developers building RAG, giving the AI long-term memory, or needing semantic search.",
        "Built by Qdrant officially; its health and maintenance data is shown below.",
      ],
      faq: [
        { q: "Do I need to run Qdrant myself?", a: "You need an accessible Qdrant instance (self-hosted or cloud) for the server to read/write." },
        { q: "How is it different from a normal database?", a: "It retrieves by vector similarity — good for \"find semantically similar content,\" not exact SQL queries." },
      ],
    },
  },
  {
    toolSlug: "twilio",
    serverSlug: "twilio-mcp",
    zh: {
      toolName: "Twilio",
      tagline: "Twilio MCP Server（官方）：把 Twilio 的短信、语音等 API 接给 AI，让它替你发消息、查通信记录。附安装配置。",
      intro: [
        "Twilio MCP Server 把 Twilio 的通信 API 接给 AI——发短信、查通话/消息记录，都能用自然语言让 AI 代做。",
        "这是 Twilio 官方的 monorepo，把 Twilio 的 API 通过 OpenAPI 自动暴露成 MCP 工具。",
      ],
      whyUse: [
        "适合：在产品里用 Twilio 做通知/验证码，想用 AI 辅助查记录、发消息的开发者。",
        "Twilio 官方出品，下方有它在本站的健康数据。",
      ],
      faq: [
        { q: "发消息会产生费用吗？", a: "会，短信/语音走的是你的 Twilio 账户，按 Twilio 计费。给它权限时注意。" },
        { q: "需要什么凭据？", a: "需要 Twilio 的 account SID 和 auth token，按最小权限配置。" },
      ],
    },
    en: {
      toolName: "Twilio",
      tagline: "Twilio MCP Server (official): connect Twilio's SMS, voice, and other APIs to your AI so it can send messages and query comms records. Setup guide included.",
      intro: [
        "The Twilio MCP Server connects Twilio's communication APIs to your AI — send SMS, query call/message records — all by telling the AI what you want.",
        "This is Twilio's official monorepo, which auto-exposes Twilio's API as MCP tools via OpenAPI.",
      ],
      whyUse: [
        "Good for: developers using Twilio for notifications/OTP in their product who want AI to help query records and send messages.",
        "Built by Twilio officially; its health data on this site is shown below.",
      ],
      faq: [
        { q: "Does sending messages cost money?", a: "Yes — SMS/voice runs through your Twilio account and is billed by Twilio. Be mindful when granting access." },
        { q: "What credentials does it need?", a: "A Twilio account SID and auth token, configured with least privilege." },
      ],
    },
  },
  {
    toolSlug: "fetch",
    serverSlug: "modelcontextprotocol-server-fetch",
    zh: {
      toolName: "Fetch",
      tagline: "Fetch MCP Server（官方）：让 AI 抓取网页并转成适合阅读的内容，是 MCP 官方参考实现之一。附安装配置。",
      intro: [
        "Fetch MCP Server 让 AI 抓取一个 URL 并把网页内容转成干净、适合模型阅读的文本——这是 MCP 官方出的参考实现，轻量、可靠。",
        "比如「读一下这篇文档，总结要点」，AI 会通过 Fetch 抓取页面、提取正文、再总结。",
      ],
      whyUse: [
        "适合：想给 AI 一个简单可靠的「读网页」能力、不需要复杂爬取的场景。",
        "MCP 官方维护，下方有完整健康数据。",
      ],
      faq: [
        { q: "它和 Firecrawl 有什么区别？", a: "Fetch 更轻，抓单页转文本；Firecrawl 功能更强（整站爬取、搜索）。简单读页用 Fetch 足够。" },
        { q: "能抓需要登录的页面吗？", a: "主要抓公开页面；复杂认证场景建议用更专门的爬取 server。" },
      ],
    },
    en: {
      toolName: "Fetch",
      tagline: "Fetch MCP Server (official): let your AI fetch a web page and convert it into readable content — one of MCP's official reference implementations. Setup guide included.",
      intro: [
        "The Fetch MCP Server lets your AI fetch a URL and convert the page into clean, model-readable text — an official MCP reference implementation: lightweight and reliable.",
        "For example, \"read this doc and summarize the key points\" — the AI uses Fetch to grab the page, extract the main text, and summarize.",
      ],
      whyUse: [
        "Good for: giving the AI a simple, reliable \"read a web page\" capability without complex crawling.",
        "Maintained by MCP officially; full health data is shown below.",
      ],
      faq: [
        { q: "How is it different from Firecrawl?", a: "Fetch is lighter — grabs a single page as text; Firecrawl does more (full-site crawl, search). For simple page reads, Fetch is enough." },
        { q: "Can it fetch pages behind a login?", a: "It mainly fetches public pages; for complex auth, use a more specialized scraping server." },
      ],
    },
  },
  {
    toolSlug: "memory",
    serverSlug: "modelcontextprotocol-server-memory",
    zh: {
      toolName: "Memory",
      tagline: "Memory MCP Server（官方）：给 AI 一个跨对话的知识图谱记忆，让它记住你说过的事。是 MCP 官方参考实现之一。附安装配置。",
      intro: [
        "Memory MCP Server 给 AI 一个基于知识图谱的持久记忆——你告诉它的事实、偏好、关系，它能存下来、之后跨对话调用。",
        "比如你说「我在做一个叫 mcpradars 的目录站」，之后新对话里 AI 还能记得这个背景。这是 MCP 官方参考实现。",
      ],
      whyUse: [
        "适合：想让 AI 记住长期上下文、不用每次重复交代背景的人。",
        "MCP 官方维护，下方有完整健康数据。",
      ],
      faq: [
        { q: "记忆存在哪？", a: "存在你本地（server 运行的地方），不是发到某个云端第三方。" },
        { q: "怎么让它忘掉某件事？", a: "你可以直接让 AI 删除某条记忆，它会更新知识图谱。" },
      ],
    },
    en: {
      toolName: "Memory",
      tagline: "Memory MCP Server (official): give your AI a knowledge-graph memory across conversations so it remembers what you told it. One of MCP's official reference implementations. Setup guide included.",
      intro: [
        "The Memory MCP Server gives your AI a persistent, knowledge-graph-based memory — facts, preferences, and relationships you tell it are stored and recalled across conversations.",
        "For example, once you say \"I'm building a directory site called mcpradars,\" the AI can remember that context in a new conversation later. This is an official MCP reference implementation.",
      ],
      whyUse: [
        "Good for: anyone who wants the AI to remember long-term context instead of re-explaining background each time.",
        "Maintained by MCP officially; full health data is shown below.",
      ],
      faq: [
        { q: "Where is the memory stored?", a: "Locally, where the server runs — not sent to a third-party cloud." },
        { q: "How do I make it forget something?", a: "Just ask the AI to delete a specific memory and it updates the knowledge graph." },
      ],
    },
  },
  {
    toolSlug: "anki",
    serverSlug: "ai-ankimcp-anki-mcp-server",
    zh: {
      toolName: "Anki",
      tagline: "Anki MCP Server：把 Anki 记忆卡片接给 AI，让它帮你建卡、管理牌组、做自适应复习。附安装配置。",
      intro: [
        "Anki MCP Server 让 AI 直接操作你的 Anki——建卡片、管理牌组、加媒体、做自适应复习，都通过 AnkiConnect 完成。",
        "比如「把这段笔记做成 10 张记忆卡，放进『英语』牌组」，AI 会调用这个 server 批量建卡。",
      ],
      whyUse: [
        "适合：用 Anki 背单词/记知识的学习者，想让 AI 帮忙把学习材料自动变成卡片。",
        "维护活跃、TrustScore 靠前，下方有完整健康数据。",
      ],
      faq: [
        { q: "需要装什么？", a: "需要在 Anki 里装 AnkiConnect 插件，server 通过它读写你的卡片。" },
        { q: "能自动安排复习吗？", a: "它支持自适应复习相关操作，具体排程仍由 Anki 的算法决定。" },
      ],
    },
    en: {
      toolName: "Anki",
      tagline: "Anki MCP Server: connect your Anki flashcards to your AI so it can create cards, manage decks, and run adaptive review. Setup guide included.",
      intro: [
        "The Anki MCP Server lets your AI operate your Anki directly — create cards, manage decks, add media, and run adaptive review — all via AnkiConnect.",
        "For example, \"turn this note into 10 flashcards and put them in my 'English' deck\" — the AI uses this server to create the cards in bulk.",
      ],
      whyUse: [
        "Good for: learners using Anki for vocabulary/knowledge who want AI to auto-turn study material into cards.",
        "Actively maintained with a solid TrustScore; full health data is shown below.",
      ],
      faq: [
        { q: "What do I need to install?", a: "The AnkiConnect add-on in Anki, which the server uses to read/write your cards." },
        { q: "Can it schedule reviews automatically?", a: "It supports adaptive-review operations, though scheduling is still governed by Anki's algorithm." },
      ],
    },
  },
];

export function getSeoLandingSlugs(): string[] {
  return SEO_LANDINGS.map((l) => l.toolSlug);
}

export function getSeoLanding(toolSlug: string): SeoLanding | undefined {
  return SEO_LANDINGS.find((l) => l.toolSlug === toolSlug);
}

/** 反查：某个 server slug 是否有对应的 SEO 落地页（详情页用来反向内链）。 */
export function getSeoLandingByServer(serverSlug: string): SeoLanding | undefined {
  return SEO_LANDINGS.find((l) => l.serverSlug === serverSlug);
}

export function seoLandingText(l: SeoLanding, locale: Locale): SeoLandingText {
  return locale === "en" ? l.en : l.zh;
}
