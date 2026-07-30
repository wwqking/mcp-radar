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
    // 2026-07-26 换过：原本指向 ai-waystation-postgres（★58, trust 43, dying），
    // 换成采用度和维护都远好的 crystaldba/postgres-mcp（★3116, trust 56, active）。
    // 落地页只该指向该工具的主流实现，这是第一轮就定下的规则。
    serverSlug: "postgres-mcp",
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
        "Before connecting: your connection string holds sensitive credentials — use a read-only account for production databases. Review the maintenance signals below, then test compatibility and security in your own environment.",
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

  // ===== 第三轮关键词研究 W1（research/mcpradars/seo-r3/content-map-validated.csv）=====
  // 25 个工具，全部满足硬约束：data/servers.json 里有真实 server + TrustScore ≥ 50。
  // 建页前逐个人工核对过 serverSlug 是不是该工具的主流实现——过程中改掉两个：
  //   · google（14,440/mo，主词 `google drive mcp`）→ 库里根本没有 Google Drive 的 server，
  //     拿 Google Analytics 的去接 Drive 的词是挂羊头卖狗肉，改建 google-analytics
  //   · linkedin → 原匹配的 ai-com-mcp-linkedin 实际是 la-rebelion/hapimcp(★8) 通用网关，
  //     不是 LinkedIn 的 server，已把真的那个补进 curated.ts 再建
  // SERP 实测：厂商自有域名垄断主词的（unity/grafana/cloudflare/stripe/aws/atlassian/
  // microsoft/supabase/slack/notion/vercel）仍然建页——长尾和内链价值在，但别指望主词。

  {
    toolSlug: "n8n",
    serverSlug: "n8n-mcp",
    zh: {
      toolName: "n8n",
      tagline: "n8n MCP Server：让 Claude、Cursor 直接读写你的 n8n 工作流——用自然语言搭自动化，不用在画布上拖节点。附安装配置。",
      intro: [
        "n8n MCP Server 把 n8n 的 500 多个节点和工作流 API 暴露给 AI。你可以直接说「做一个工作流：每天早上把 Stripe 昨日新订单汇总发到 Slack」，AI 自己查节点参数、拼出 JSON、创建工作流。",
        "它真正省掉的是查文档的时间——n8n 每个节点的参数结构都不一样，手搭复杂工作流要来回翻文档。这个 server 内置了节点定义，AI 拿得到准确的参数 schema，不用猜。",
      ],
      whyUse: [
        "适合：已经在用 n8n、但嫌在画布上拖节点慢的人；也适合让 AI 帮你调试跑挂了的工作流。",
        "接入前注意：它能创建和修改工作流，等于给了 AI 改你自动化流程的权限。建议先连测试实例，别一上来就接生产。",
      ],
      faq: [
        { q: "需要 n8n 云版还是自托管都行？", a: "都行。它通过 n8n 的 API 通信，云版和自托管实例都能连，你需要提供实例地址和 API key。" },
        { q: "AI 能直接运行工作流吗？", a: "能触发执行，也能读执行历史来排查失败。正因为如此，权限要给得保守些。" },
      ],
    },
    en: {
      toolName: "n8n",
      tagline: "n8n MCP Server: let Claude and Cursor read and write your n8n workflows — build automations in natural language instead of dragging nodes. Setup guide included.",
      intro: [
        "The n8n MCP Server exposes n8n's 500+ nodes and workflow API to your AI. You can say \"build a workflow that summarises yesterday's new Stripe orders into Slack every morning\" and the AI looks up the node parameters, assembles the JSON, and creates the workflow.",
        "What it really saves is documentation time — every n8n node has a different parameter shape, so building anything complex by hand means constant doc lookups. This server ships the node definitions, so the AI gets an accurate parameter schema instead of guessing.",
      ],
      whyUse: [
        "Good for: people already running n8n who find canvas-dragging slow, and for having the AI debug workflows that failed.",
        "Before connecting: it can create and modify workflows, which means giving the AI write access to your automation. Point it at a test instance first rather than production.",
      ],
      faq: [
        { q: "Does it need n8n Cloud, or does self-hosted work?", a: "Either. It talks to n8n's API, so both cloud and self-hosted instances work — you supply the instance URL and an API key." },
        { q: "Can the AI actually run workflows?", a: "Yes, it can trigger executions and read execution history to diagnose failures. That's exactly why permissions should stay conservative." },
      ],
    },
  },

  {
    toolSlug: "aws",
    serverSlug: "aws-mcp-server",
    zh: {
      toolName: "AWS",
      tagline: "AWS MCP Servers：AWS 官方出的一组 MCP server，让 Claude、Cursor 直接查 AWS 文档、成本、CDK 和各类云资源。附安装配置。",
      intro: [
        "AWS 官方在一个仓库里维护了一整组 MCP server，不是单一的一个：有查官方文档的、算成本的、生成 CDK 代码的、操作各类具体服务的。你按需装其中几个，而不是全都装上。",
        "最实用的两个通常是文档 server 和成本 server——前者让 AI 回答 AWS 问题时不再瞎编服务限制，后者能直接问「这个月哪个服务花得最多」。",
      ],
      whyUse: [
        "适合：在 AWS 上做架构和运维的人，尤其是被 AI 编造的服务限制坑过的。",
        "接入前注意：涉及真实资源操作的那几个 server 需要 AWS 凭据。建议用最小权限的 IAM 角色，只读场景就只给只读策略。",
      ],
      faq: [
        { q: "是一个 server 还是很多个？", a: "很多个，在同一个仓库里。按你要解决的问题装对应的那个，不必全装。" },
        { q: "会产生 AWS 费用吗？", a: "server 本身免费，但它调用的 AWS API 部分是计费的（比如 Cost Explorer 查询）。" },
      ],
    },
    en: {
      toolName: "AWS",
      tagline: "AWS MCP Servers: AWS's own collection of MCP servers, letting Claude and Cursor query AWS docs, costs, CDK, and cloud resources directly. Setup guide included.",
      intro: [
        "AWS maintains a whole set of MCP servers in one repo — not a single server. There's one for official docs, one for costs, one for generating CDK code, and several for specific services. You install the ones you need rather than all of them.",
        "The two most useful are usually the docs server and the cost server: the first stops your AI from inventing service limits when answering AWS questions, the second lets you just ask \"what did we spend the most on this month?\"",
      ],
      whyUse: [
        "Good for: people doing architecture and ops on AWS, especially anyone who's been burned by an AI hallucinating service quotas.",
        "Before connecting: the servers that touch real resources need AWS credentials. Use a least-privilege IAM role — read-only policies for read-only use cases.",
      ],
      faq: [
        { q: "Is it one server or many?", a: "Many, in a single repo. Install the one that matches the problem you're solving; you don't need all of them." },
        { q: "Does it cost anything on AWS?", a: "The servers are free, but the AWS APIs they call may bill — Cost Explorer queries, for instance." },
      ],
    },
  },

  {
    toolSlug: "atlassian",
    serverSlug: "atlassian-mcp-server",
    zh: {
      toolName: "Atlassian",
      tagline: "Atlassian MCP Server：官方出品，让 Claude、Cursor 直接读写 Jira issue 和 Confluence 页面。附安装与配置指南。",
      intro: [
        "Atlassian 官方的 MCP server，一个 server 同时覆盖 Jira 和 Confluence。装好之后可以直接说「把这个 sprint 里所有还没分配的 bug 列出来」或者「按这次会议纪要建一个 Confluence 页面」。",
        "对写 issue 这件事帮助最明显——AI 能读到项目里已有的字段结构和标签体系，建出来的 issue 格式跟团队现有的一致，而不是一个空标题加一句话。",
      ],
      whyUse: [
        "适合：每天要在 Jira 和 Confluence 之间来回倒信息的人，尤其是团队 lead 和 PM。",
        "接入前注意：这是官方实现，认证走 Atlassian 的 OAuth。社区还有一个 sooperset/mcp-atlassian 采用度更高、支持自托管 Server/Data Center 版本，如果你不是云版可以看那个。",
      ],
      faq: [
        { q: "支持自托管的 Jira Server / Data Center 吗？", a: "官方这个主要面向 Atlassian Cloud。自托管版本可以看社区的 mcp-atlassian 实现。" },
        { q: "AI 会直接改我的 issue 吗？", a: "取决于你授权的 scope。只想让它查，就在 OAuth 授权时只给读权限。" },
      ],
    },
    en: {
      toolName: "Atlassian",
      tagline: "Atlassian MCP Server: the official server letting Claude and Cursor read and write Jira issues and Confluence pages. Installation and configuration guide included.",
      intro: [
        "Atlassian's own MCP server covers both Jira and Confluence in a single server. Once installed you can just say \"list every unassigned bug in this sprint\" or \"create a Confluence page from these meeting notes\".",
        "It helps most with writing issues — the AI can see your project's existing field structure and label scheme, so the issues it creates match your team's conventions instead of being a bare title and one sentence.",
      ],
      whyUse: [
        "Good for: anyone shuttling information between Jira and Confluence all day, especially team leads and PMs.",
        "Before connecting: this is the official implementation and authenticates through Atlassian OAuth. The community's sooperset/mcp-atlassian has wider adoption and supports self-hosted Server/Data Center — worth a look if you're not on Cloud.",
      ],
      faq: [
        { q: "Does it support self-hosted Jira Server / Data Center?", a: "The official server targets Atlassian Cloud. For self-hosted, look at the community mcp-atlassian implementation." },
        { q: "Will the AI edit my issues directly?", a: "It depends on the scopes you grant. If you only want lookups, grant read-only scopes during OAuth." },
      ],
    },
  },

  {
    toolSlug: "microsoft",
    serverSlug: "microsoft-mcp",
    zh: {
      toolName: "Microsoft",
      tagline: "Microsoft MCP Servers：微软官方维护的一组 MCP server，覆盖 Azure、Dev Box、Fabric、Learn 文档等。附安装配置。",
      intro: [
        "跟 AWS 那个类似，微软也是在一个仓库里维护一整组 server，而不是单一入口。里面包括 Azure 资源操作、Microsoft Learn 文档检索、Dev Box、Fabric 数据平台等。",
        "如果你只想选一个开始，Microsoft Learn 那个文档 server 门槛最低也最安全——纯查询，不碰你的云资源，能让 AI 回答 Azure 问题时引用真实文档而不是编。",
      ],
      whyUse: [
        "适合：在 Azure / Microsoft 365 技术栈上工作的开发者和运维。",
        "接入前注意：碰真实资源的那些需要 Azure 凭据，建议先用只读的服务主体。文档类的不需要凭据，可以先从那个试。",
      ],
      faq: [
        { q: "和 Azure MCP 是一回事吗？", a: "Azure 相关的 server 就在这个仓库里，是其中一部分。这个仓库是微软各产品线 MCP server 的汇总入口。" },
        { q: "需要 Microsoft 365 订阅吗？", a: "看你用哪个。文档检索不需要，涉及 Azure 或 M365 资源的需要对应订阅和凭据。" },
      ],
    },
    en: {
      toolName: "Microsoft",
      tagline: "Microsoft MCP Servers: Microsoft's own collection of MCP servers spanning Azure, Dev Box, Fabric, and Learn documentation. Setup guide included.",
      intro: [
        "Like the AWS one, Microsoft maintains a whole set of servers in a single repo rather than one entry point — Azure resource operations, Microsoft Learn doc search, Dev Box, the Fabric data platform, and more.",
        "If you want just one to start with, the Microsoft Learn docs server is the lowest-risk: pure lookup, no access to your cloud resources, and it makes the AI cite real documentation instead of inventing Azure behaviour.",
      ],
      whyUse: [
        "Good for: developers and ops working in the Azure / Microsoft 365 stack.",
        "Before connecting: the servers that touch real resources need Azure credentials — start with a read-only service principal. The docs servers need no credentials at all, so try those first.",
      ],
      faq: [
        { q: "Is this the same thing as Azure MCP?", a: "The Azure servers live inside this repo as part of the collection. The repo is Microsoft's umbrella entry point for MCP servers across its product lines." },
        { q: "Do I need a Microsoft 365 subscription?", a: "Depends which server. Doc search doesn't need one; anything touching Azure or M365 resources needs the matching subscription and credentials." },
      ],
    },
  },

  {
    toolSlug: "supabase",
    serverSlug: "supabase-mcp-server-supabase",
    zh: {
      toolName: "Supabase",
      tagline: "Supabase MCP Server：让 Claude、Cursor 直接连你的 Supabase 项目——查表、跑 SQL、看日志、管迁移。附安装配置。",
      intro: [
        "Supabase MCP Server 把整个 Supabase 项目接进 AI：数据库表结构、SQL 查询、Edge Functions、日志、迁移都能操作。写业务代码时不用再切到 Dashboard 去确认某个表长什么样。",
        "最省事的场景是排查线上问题——直接问「users 表最近一小时有多少条插入失败」，AI 自己查日志和表，不用你手动翻 Dashboard。",
      ],
      whyUse: [
        "适合：用 Supabase 做后端、天天在 Cursor 或 Claude Code 里写代码的人。",
        "接入前注意：官方文档明确建议**不要连生产项目**，用只读模式和开发分支。它能跑 SQL，意味着写错提示词就可能改到数据。",
      ],
      faq: [
        { q: "能限制成只读吗？", a: "能，server 支持只读模式。接非开发环境时强烈建议开。" },
        { q: "支持 Supabase 的哪些功能？", a: "数据库、Edge Functions、日志、迁移、项目管理等；具体能力集随版本更新，以仓库 README 为准。" },
      ],
    },
    en: {
      toolName: "Supabase",
      tagline: "Supabase MCP Server: connect Claude and Cursor straight to your Supabase project — inspect tables, run SQL, read logs, manage migrations. Setup guide included.",
      intro: [
        "The Supabase MCP Server wires a whole Supabase project into your AI: table schemas, SQL queries, Edge Functions, logs, and migrations. You stop switching to the Dashboard just to check what a table looks like.",
        "It shines during incident triage — ask \"how many inserts into users failed in the last hour?\" and the AI checks the logs and tables itself instead of you clicking through the Dashboard.",
      ],
      whyUse: [
        "Good for: people running Supabase as their backend who live in Cursor or Claude Code.",
        "Before connecting: the official docs explicitly recommend **not** pointing it at production — use read-only mode and a development branch. It can run SQL, so a badly worded prompt can mutate data.",
      ],
      faq: [
        { q: "Can I restrict it to read-only?", a: "Yes, the server supports a read-only mode. Strongly recommended for anything that isn't a dev environment." },
        { q: "Which Supabase features does it cover?", a: "Database, Edge Functions, logs, migrations, and project management. The exact capability set moves with releases — check the repo README." },
      ],
    },
  },

  {
    toolSlug: "slack",
    serverSlug: "slack-mcp-server",
    zh: {
      toolName: "Slack",
      tagline: "Slack MCP Server：让 Claude 读写 Slack 消息、搜历史、发到频道——支持不装 Slack App 的 stealth 模式。附安装配置。",
      intro: [
        "这个 Slack MCP Server 的特别之处是支持两种接入方式：一种是常规的 Bot Token，另一种是用你自己的会话凭据（俗称 stealth 模式），后者不需要管理员批准安装 App——这在很多公司是决定性的，因为申请装 App 的流程可能要等好几周。",
        "常见用法是「把 #incident 频道过去两小时的讨论总结成时间线」，或者让 AI 在写完东西后直接发到指定频道。",
      ],
      whyUse: [
        "适合：想让 AI 读 Slack 上下文，但公司不让随便装 App 的人。",
        "接入前注意：stealth 模式用的是你的个人会话凭据，等于 AI 以你的身份读消息。别在共享机器上配，也要清楚这可能违反公司的 IT 政策——先确认再用。",
      ],
      faq: [
        { q: "一定要管理员批准吗？", a: "Bot Token 模式要，stealth 模式不用。但后者是以你个人身份操作，用之前先确认符合公司政策。" },
        { q: "能发消息还是只能读？", a: "都能。只想让它读的话，配置里可以限制成只读。" },
      ],
    },
    en: {
      toolName: "Slack",
      tagline: "Slack MCP Server: let Claude read and write Slack messages, search history, and post to channels — including a stealth mode that needs no Slack App install. Setup guide included.",
      intro: [
        "What sets this Slack MCP Server apart is that it supports two auth paths: a conventional Bot Token, or your own session credentials (\"stealth\" mode) which requires no admin approval to install an App. At many companies that's decisive, since App approval can take weeks.",
        "A typical use is \"summarise the last two hours of #incident into a timeline\", or having the AI post something it just drafted straight to a channel.",
      ],
      whyUse: [
        "Good for: people who want the AI to see Slack context but work somewhere App installs aren't casually approved.",
        "Before connecting: stealth mode uses your personal session credentials, so the AI reads messages as you. Don't configure it on a shared machine, and be aware it may conflict with your company's IT policy — check first.",
      ],
      faq: [
        { q: "Do I need admin approval?", a: "For Bot Token mode, yes. Stealth mode doesn't need it — but it acts as you personally, so confirm it fits your company policy first." },
        { q: "Can it post, or only read?", a: "Both. If you only want reads, the configuration can restrict it to read-only." },
      ],
    },
  },

  {
    toolSlug: "notion",
    serverSlug: "notionhq-notion-mcp-server",
    zh: {
      toolName: "Notion",
      tagline: "Notion MCP Server：Notion 官方出品，让 Claude、Cursor 直接读写你的 Notion 页面和数据库。附安装与配置指南。",
      intro: [
        "Notion 官方维护的 MCP server。装好之后 AI 能搜索你的工作区、读页面内容、往数据库里加条目。常见用法是「把这次会议纪要整理进项目库，字段按现有格式填好」。",
        "比手动复制粘贴强的地方在于它认得你数据库的字段结构——AI 加条目时会正确填 select、日期、关联这些字段，而不是全塞进一个文本块。",
      ],
      whyUse: [
        "适合：用 Notion 当知识库或项目管理的人，尤其是有结构化数据库的场景。",
        "接入前注意：Notion 的集成是按页面授权的——你要在 Notion 里显式把页面分享给这个集成，它才能看到。这其实是好事，等于天然的权限边界。",
      ],
      faq: [
        { q: "它能看到我整个工作区吗？", a: "不能。只能看到你显式分享给这个集成的页面和数据库，没分享的它搜不到。" },
        { q: "免费版 Notion 能用吗？", a: "能。集成功能在免费版就有，创建 integration token 即可。" },
      ],
    },
    en: {
      toolName: "Notion",
      tagline: "Notion MCP Server: the official server letting Claude and Cursor read and write your Notion pages and databases. Installation and configuration guide included.",
      intro: [
        "Notion's own MCP server. Once installed, the AI can search your workspace, read page content, and add rows to databases. A typical use is \"file these meeting notes into the project database, filling the fields the way the existing rows do\".",
        "It beats copy-paste because it understands your database schema — the AI fills select, date, and relation properties correctly instead of dumping everything into one text block.",
      ],
      whyUse: [
        "Good for: people using Notion as a knowledge base or project tracker, especially with structured databases.",
        "Before connecting: Notion integrations are authorised per page — you explicitly share pages with the integration before it can see them. That's actually a feature: it gives you a natural permission boundary.",
      ],
      faq: [
        { q: "Can it see my whole workspace?", a: "No. Only the pages and databases you've explicitly shared with the integration; anything unshared is invisible to it." },
        { q: "Does it work on free Notion?", a: "Yes. Integrations are available on the free plan — just create an integration token." },
      ],
    },
  },

  {
    toolSlug: "sequential-thinking",
    serverSlug: "modelcontextprotocol-server-sequential-thinking",
    zh: {
      toolName: "Sequential Thinking",
      tagline: "Sequential Thinking MCP Server：MCP 官方参考实现，让 AI 把复杂问题拆成可回溯、可修正的思考步骤。附安装配置。",
      intro: [
        "这个 server 不连任何外部系统，它改变的是 AI 思考的方式：把一个复杂问题显式拆成一步一步，而且允许中途推翻前面的结论、分支出新思路、再收束回来。",
        "适合的场景是那种一上来想不清楚的问题——比如做架构选型、排查一个原因不明的 bug。相比让 AI 直接给答案，它会先摊开思路，你能看到每一步，也更容易发现它哪里走偏了。",
      ],
      whyUse: [
        "适合：需要 AI 做多步推理而不是一问一答的场景；也适合你想看清 AI 推理过程的时候。",
        "它是 MCP 官方参考实现之一，跟 filesystem、memory 出自同一个仓库，维护稳定。",
      ],
      faq: [
        { q: "它需要联网或 API key 吗？", a: "都不需要。它纯粹是个思考结构化工具，不访问任何外部服务。" },
        { q: "跟直接让 AI「一步步想」有什么区别？", a: "它把步骤变成结构化数据，AI 可以显式修订、分支、回溯前面的步骤，而不只是在文本里线性往下写。" },
      ],
    },
    en: {
      toolName: "Sequential Thinking",
      tagline: "Sequential Thinking MCP Server: an official MCP reference implementation that makes AI break complex problems into revisable, branchable reasoning steps. Setup guide included.",
      intro: [
        "This server connects to nothing external — what it changes is how the AI thinks: it breaks a hard problem into explicit steps, and crucially lets the model revise an earlier conclusion, branch into an alternative line, and converge again.",
        "It suits problems you can't see the shape of upfront — an architecture decision, or a bug with no obvious cause. Instead of jumping to an answer, the AI lays out its reasoning, so you can see each step and catch where it went wrong.",
      ],
      whyUse: [
        "Good for: tasks needing multi-step reasoning rather than a single question and answer, and for when you want the reasoning itself visible.",
        "It's one of the official MCP reference implementations, from the same repo as filesystem and memory, and is stably maintained.",
      ],
      faq: [
        { q: "Does it need network access or an API key?", a: "Neither. It's purely a reasoning-structuring tool and calls no external service." },
        { q: "How is this different from just asking the AI to think step by step?", a: "It turns the steps into structured data the model can explicitly revise, branch, and backtrack — rather than writing linearly in prose." },
      ],
    },
  },

  {
    toolSlug: "gitlab",
    serverSlug: "gitlab-mcp",
    zh: {
      toolName: "GitLab",
      tagline: "GitLab MCP Server：让 Claude、Cursor 直接操作 GitLab 的 MR、issue、CI 流水线和仓库文件。附安装与配置指南。",
      intro: [
        "GitLab MCP Server 覆盖了日常在 GitLab 上做的大部分事：读写 issue 和 merge request、看 CI 流水线状态和日志、浏览仓库文件、发评论。",
        "最实用的是排查 CI 失败——直接问「最近这条流水线为什么挂了」，AI 自己拉日志定位到失败的 job 和报错行，不用你点进 GitLab 一层层翻。",
      ],
      whyUse: [
        "适合：团队用 GitLab 而不是 GitHub 的开发者——GitHub 那边生态成熟，GitLab 这边选择少，这个是采用度最高的社区实现之一。",
        "接入前注意：需要 GitLab Personal Access Token。scope 按需给，只读场景 read_api 就够，别直接给 api 全权限。",
      ],
      faq: [
        { q: "支持自托管的 GitLab 吗？", a: "支持。配置里指定你的实例地址即可，gitlab.com 和自托管都能连。" },
        { q: "能自动创建 MR 吗？", a: "能创建 MR、写描述、加评论。给 token 权限时想清楚要不要开写权限。" },
      ],
    },
    en: {
      toolName: "GitLab",
      tagline: "GitLab MCP Server: let Claude and Cursor work with GitLab merge requests, issues, CI pipelines, and repository files. Installation and configuration guide included.",
      intro: [
        "The GitLab MCP Server covers most of what you do in GitLab day to day: reading and writing issues and merge requests, checking CI pipeline status and logs, browsing repo files, and posting comments.",
        "It's most useful for CI triage — ask \"why did the last pipeline fail?\" and the AI pulls the logs and pinpoints the failing job and error line, instead of you clicking down through the GitLab UI.",
      ],
      whyUse: [
        "Good for: teams on GitLab rather than GitHub — the GitHub ecosystem is crowded, GitLab's is thin, and this is one of the most-adopted community implementations.",
        "Before connecting: you'll need a GitLab Personal Access Token. Scope it to what you need — read_api is enough for read-only use; don't hand over full api scope by default.",
      ],
      faq: [
        { q: "Does it work with self-hosted GitLab?", a: "Yes. Point the config at your instance URL — both gitlab.com and self-hosted work." },
        { q: "Can it create merge requests?", a: "It can create MRs, write descriptions, and add comments. Decide whether you want write scope when you issue the token." },
      ],
    },
  },

  {
    toolSlug: "shadcn",
    serverSlug: "shadcn-ui-mcp-server",
    zh: {
      toolName: "shadcn/ui",
      tagline: "shadcn/ui MCP Server：让 AI 拿到 shadcn/ui 组件的真实源码和用法，生成的代码不再是编出来的 API。附安装配置。",
      intro: [
        "shadcn/ui 的特点是组件源码直接复制进你的项目，而不是装成依赖。这也带来一个问题：AI 不知道你项目里那个版本的组件长什么样，经常编出不存在的 prop。",
        "这个 server 把 shadcn/ui 组件的真实源码、demo 和依赖关系喂给 AI。你说「做一个带筛选的数据表格」，它拿到的是真实的 Table 和 Select 组件定义，写出来的代码能直接跑。",
      ],
      whyUse: [
        "适合：用 shadcn/ui 搭前端、被 AI 编造 prop 坑过的开发者。",
        "接入前注意：它会调 GitHub API 拉组件源码，不配 token 的话会碰到 60 次/小时的限流，建议配一个只读 token。",
      ],
      faq: [
        { q: "支持 shadcn/ui 的 v4 吗？", a: "支持不同版本的组件源码拉取，具体覆盖以仓库 README 为准。" },
        { q: "跟直接看官网文档有什么区别？", a: "它给的是源码级信息（真实 prop、内部实现、依赖的其他组件），比文档示例更完整，而且 AI 能直接消费。" },
      ],
    },
    en: {
      toolName: "shadcn/ui",
      tagline: "shadcn/ui MCP Server: give your AI the real component source and usage for shadcn/ui, so it stops inventing props. Setup guide included.",
      intro: [
        "shadcn/ui works by copying component source into your project rather than installing a dependency. That creates a problem: the AI doesn't know what your copy of a component looks like, so it routinely invents props that don't exist.",
        "This server feeds the AI the actual shadcn/ui component source, demos, and dependency graph. Ask for \"a data table with filtering\" and it works from the real Table and Select definitions, so the generated code actually runs.",
      ],
      whyUse: [
        "Good for: frontend developers on shadcn/ui who've been burned by hallucinated props.",
        "Before connecting: it calls the GitHub API to fetch component source, so without a token you'll hit the 60-requests/hour limit. Configure a read-only token.",
      ],
      faq: [
        { q: "Does it support shadcn/ui v4?", a: "It fetches component source across versions; check the repo README for exact coverage." },
        { q: "How is this better than reading the docs?", a: "It provides source-level detail — real props, internal implementation, which other components are used — which is more complete than doc examples and directly consumable by the AI." },
      ],
    },
  },

  {
    toolSlug: "unity",
    serverSlug: "unity-mcp",
    zh: {
      toolName: "Unity",
      tagline: "Unity MCP Server：让 Claude、Cursor 直接操作 Unity 编辑器——建物体、改组件、读控制台报错。附安装与配置指南。",
      intro: [
        "Unity MCP Server 在编辑器里装一个桥接包，让 AI 能直接操作场景：创建 GameObject、改 Transform 和组件参数、写 C# 脚本进项目、读 Console 的报错。",
        "最省时间的是调错——把控制台报错直接丢给 AI，它能读到完整堆栈和相关脚本，改完还能触发重新编译看有没有修好，不用你在编辑器和 IDE 之间来回切。",
      ],
      whyUse: [
        "适合：Unity 开发者，尤其是独立开发和做原型的——AI 帮你搭场景骨架比手动拖快很多。",
        "接入前注意：它能直接改你的项目文件和场景。**先把工程提交进版本控制再用**，AI 改错了能回滚。",
      ],
      faq: [
        { q: "支持哪些 Unity 版本？", a: "需要在编辑器里装配套的桥接包，支持的版本范围见仓库 README。" },
        { q: "它能运行游戏吗？", a: "能进入 Play 模式并读运行时日志，这也是它排查运行时问题的方式。" },
      ],
    },
    en: {
      toolName: "Unity",
      tagline: "Unity MCP Server: let Claude and Cursor drive the Unity Editor — create objects, edit components, read console errors. Installation and configuration guide included.",
      intro: [
        "The Unity MCP Server installs a bridge package inside the Editor so the AI can act on your scene directly: create GameObjects, edit Transforms and component values, write C# scripts into the project, and read Console errors.",
        "The biggest time-saver is debugging — hand it a console error and it can see the full stack trace and the relevant scripts, then trigger a recompile to check the fix. No more bouncing between the Editor and your IDE.",
      ],
      whyUse: [
        "Good for: Unity developers, especially solo devs and prototypers — having the AI rough out a scene beats dragging things by hand.",
        "Before connecting: it can modify your project files and scenes directly. **Commit your project to version control first** so you can roll back if the AI gets it wrong.",
      ],
      faq: [
        { q: "Which Unity versions are supported?", a: "You install a companion bridge package in the Editor; see the repo README for the supported version range." },
        { q: "Can it run the game?", a: "It can enter Play mode and read runtime logs — that's how it diagnoses runtime issues." },
      ],
    },
  },

  {
    toolSlug: "snowflake",
    serverSlug: "snowflake-mcp",
    zh: {
      toolName: "Snowflake",
      tagline: "Snowflake MCP Server：Snowflake Labs 官方出品，让 AI 用自然语言查数仓、看表结构、跑 Cortex 分析。附安装配置。",
      intro: [
        "Snowflake Labs 官方维护的 MCP server，把数仓接进 AI：查表结构、跑 SQL、调用 Cortex 的 AI 分析能力。对不写 SQL 的业务侧同事，这是直接问数据的入口。",
        "跟自己搭个查询接口比，它的优势是 AI 能先看 schema 再写 SQL——不用你在提示词里贴表结构，它自己查。",
      ],
      whyUse: [
        "适合：用 Snowflake 做数仓的数据团队，以及想让业务同事自助查数的场景。",
        "接入前注意：Snowflake 按查询计费，AI 写的 SQL 可能扫全表。建议配一个带 query timeout 和资源监控的专用角色，别用管理员账号连。",
      ],
      faq: [
        { q: "会不会跑出天价查询？", a: "有这个风险。用专用角色 + resource monitor + 语句超时来兜底，这是接 Snowflake 的标准做法。" },
        { q: "支持 Cortex 吗？", a: "支持，官方 server 包含 Cortex 相关能力，具体见仓库 README。" },
      ],
    },
    en: {
      toolName: "Snowflake",
      tagline: "Snowflake MCP Server: Snowflake Labs' official server letting AI query your warehouse in natural language, inspect schemas, and run Cortex analytics. Setup guide included.",
      intro: [
        "Snowflake Labs maintains this MCP server, wiring the warehouse into your AI: inspect table schemas, run SQL, and call Cortex's AI analytics. For colleagues who don't write SQL, it becomes a direct way to ask the data a question.",
        "Compared with rolling your own query endpoint, the advantage is that the AI reads the schema before writing SQL — you don't paste table definitions into the prompt, it looks them up.",
      ],
      whyUse: [
        "Good for: data teams on Snowflake, and for letting business colleagues self-serve.",
        "Before connecting: Snowflake bills per query, and AI-written SQL can scan whole tables. Use a dedicated role with a statement timeout and a resource monitor — don't connect as an admin.",
      ],
      faq: [
        { q: "Could it run up a huge bill?", a: "It's a real risk. A dedicated role plus a resource monitor and statement timeout is the standard guardrail here." },
        { q: "Does it support Cortex?", a: "Yes, the official server includes Cortex capabilities — see the repo README for specifics." },
      ],
    },
  },

  {
    toolSlug: "cloudflare",
    serverSlug: "cloudflare-mcp-server-cloudflare",
    zh: {
      toolName: "Cloudflare",
      tagline: "Cloudflare MCP Server：官方出品，让 AI 管 Workers、KV、R2、D1 和 DNS，还能读 Analytics。附安装与配置指南。",
      intro: [
        "Cloudflare 官方维护的一组 MCP server，按产品线拆开：Workers、KV、R2、D1、DNS、Analytics、Radar 各有各的。你按用到的产品装对应那个。",
        "它们大多是远程托管的（Cloudflare 自己跑），走 OAuth 授权，不用在本机装包——这在本站的 Remote MCP Servers 分类里也能看到。",
      ],
      whyUse: [
        "适合：在 Cloudflare 上跑 Workers 或用其边缘产品的开发者。",
        "接入前注意：OAuth 授权时按需勾 scope。DNS 和 Workers 的写权限影响面很大，只查数据的话别给。",
      ],
      faq: [
        { q: "要在本地装东西吗？", a: "多数不用。Cloudflare 的 server 大多是托管的远程 server，客户端里填地址走 OAuth 即可。" },
        { q: "免费账号能用吗？", a: "能。你能用哪些 server 取决于账号开通了哪些产品。" },
      ],
    },
    en: {
      toolName: "Cloudflare",
      tagline: "Cloudflare MCP Server: the official servers for managing Workers, KV, R2, D1, and DNS, plus reading Analytics. Installation and configuration guide included.",
      intro: [
        "Cloudflare maintains a set of MCP servers split by product line — Workers, KV, R2, D1, DNS, Analytics, Radar. You install the one matching the product you actually use.",
        "Most of them are remotely hosted by Cloudflare and authenticate via OAuth, so there's nothing to install locally — you'll also find them in this site's Remote MCP Servers listing.",
      ],
      whyUse: [
        "Good for: developers running Workers or using Cloudflare's edge products.",
        "Before connecting: pick OAuth scopes deliberately. Write access to DNS and Workers has a wide blast radius — don't grant it if you're only reading data.",
      ],
      faq: [
        { q: "Do I need to install anything locally?", a: "Usually not. Most Cloudflare servers are hosted remotely — you add the URL in your client and authorise via OAuth." },
        { q: "Does it work on a free account?", a: "Yes. Which servers are useful depends on which products your account has enabled." },
      ],
    },
  },

  {
    toolSlug: "vercel",
    serverSlug: "vercel-mcp",
    zh: {
      toolName: "Vercel",
      tagline: "Vercel MCP Server：Next.js 官方 devtools server，让 AI 读到你本地开发服务器的真实运行时错误和构建信息。附安装配置。",
      intro: [
        "这是 Vercel 官方的 Next.js devtools MCP server。它接的是你本地跑着的 Next.js 开发服务器，把真实的运行时错误、构建告警、路由信息喂给 AI。",
        "解决的痛点很具体：以前你得手动把浏览器控制台的报错复制给 AI，现在它自己能读到，包括服务端渲染时的错误——那些在浏览器里根本看不到。",
      ],
      whyUse: [
        "适合：写 Next.js 的开发者，尤其是在调 SSR、路由和构建问题的时候。",
        "注意它不是「管理 Vercel 部署」的 server——它面向本地开发调试。要操作部署和项目设置的话得看 Vercel 的其他集成。",
      ],
      faq: [
        { q: "它能帮我部署吗？", a: "不能。这个 server 面向本地 Next.js 开发调试，不是部署管理工具。" },
        { q: "需要 Vercel 账号吗？", a: "不需要。它只连你本地的 Next.js dev server。" },
      ],
    },
    en: {
      toolName: "Vercel",
      tagline: "Vercel MCP Server: the official Next.js devtools server, giving your AI real runtime errors and build info from your local dev server. Setup guide included.",
      intro: [
        "This is Vercel's official Next.js devtools MCP server. It attaches to your running local Next.js dev server and feeds real runtime errors, build warnings, and route information to the AI.",
        "The pain it removes is concrete: you used to copy browser console errors into the chat by hand. Now the AI reads them itself — including server-side rendering errors that never reach the browser at all.",
      ],
      whyUse: [
        "Good for: Next.js developers, especially when debugging SSR, routing, and build problems.",
        "Note this is not a \"manage my Vercel deployments\" server — it targets local development. For deployments and project settings you'll want Vercel's other integrations.",
      ],
      faq: [
        { q: "Can it deploy for me?", a: "No. This server is for local Next.js development and debugging, not deployment management." },
        { q: "Do I need a Vercel account?", a: "No. It only connects to your local Next.js dev server." },
      ],
    },
  },

  {
    toolSlug: "brave-search",
    serverSlug: "brave-brave-search-mcp-server",
    zh: {
      toolName: "Brave Search",
      tagline: "Brave Search MCP Server：Brave 官方出品，给 AI 加联网搜索能力——网页、新闻、图片、本地商户都能搜。附安装配置。",
      intro: [
        "Brave 官方的搜索 MCP server，用的是 Brave 自己的独立索引（不是转包 Google 或 Bing 的结果）。支持网页、新闻、图片、视频和本地商户等多种搜索类型。",
        "相比其他搜索 server，它的卖点是隐私——Brave 不做用户画像、不记录搜索历史。如果你在意「AI 帮我搜的东西会不会被拿去建档」，这一点有实际意义。",
      ],
      whyUse: [
        "适合：需要给 AI 加联网能力，同时在意搜索隐私的人。",
        "接入前注意：需要 Brave Search API key。有免费额度（每月一定次数），超了要付费，重度使用前先看下定价。",
      ],
      faq: [
        { q: "免费吗？", a: "有免费额度，超出按量计费。个人日常使用通常够用。" },
        { q: "跟 Tavily、Exa 这些有什么区别？", a: "Brave 是通用搜索引擎的索引，偏「像人一样搜网页」；Tavily 和 Exa 更偏为 AI 检索优化的结果结构。本站三个都收录了，可以对比健康数据。" },
      ],
    },
    en: {
      toolName: "Brave Search",
      tagline: "Brave Search MCP Server: Brave's official server adding web search to your AI — web, news, images, and local business results. Setup guide included.",
      intro: [
        "Brave's official search MCP server, backed by Brave's own independent index rather than reselling Google or Bing results. It supports web, news, image, video, and local business search.",
        "Its distinguishing feature versus other search servers is privacy — Brave doesn't profile users or log search history. If you care whether the things your AI searches for get filed against you, that matters.",
      ],
      whyUse: [
        "Good for: anyone adding web access to an AI who also cares about search privacy.",
        "Before connecting: you need a Brave Search API key. There's a free monthly quota, with paid usage beyond it — check pricing before heavy use.",
      ],
      faq: [
        { q: "Is it free?", a: "There's a free quota, then metered pricing. It's usually enough for individual day-to-day use." },
        { q: "How does it compare to Tavily or Exa?", a: "Brave is a general search engine index — closer to \"search the web like a person\". Tavily and Exa shape results specifically for AI retrieval. All three are listed on this site if you want to compare their health data." },
      ],
    },
  },

  {
    toolSlug: "grafana",
    serverSlug: "mcp-grafana",
    zh: {
      toolName: "Grafana",
      tagline: "Grafana MCP Server：Grafana 官方出品，让 AI 查仪表盘、跑 Prometheus/Loki 查询、看告警。附安装与配置指南。",
      intro: [
        "Grafana 官方维护的 MCP server。AI 能搜你的仪表盘、直接跑 PromQL 和 LogQL 查询、读当前告警状态和 incident。",
        "排障时最有用——出事的时候直接问「过去半小时哪个服务的错误率涨了」，AI 自己写 PromQL 去查，不用你回忆语法。对不常写 PromQL 的人这个价值很大。",
      ],
      whyUse: [
        "适合：用 Grafana 做可观测性的 SRE 和后端，尤其是 on-call 的时候。",
        "接入前注意：用 Grafana 的 service account token，给 Viewer 角色就够查询了。别给 Admin——AI 没必要有改仪表盘的权限。",
      ],
      faq: [
        { q: "支持 Grafana Cloud 和自托管吗？", a: "都支持。配置里填你的实例地址和 service account token。" },
        { q: "能查哪些数据源？", a: "通过 Grafana 代理查询，所以 Grafana 里配了的数据源基本都能查，Prometheus 和 Loki 是最常用的两个。" },
      ],
    },
    en: {
      toolName: "Grafana",
      tagline: "Grafana MCP Server: Grafana's official server letting AI search dashboards, run Prometheus/Loki queries, and check alerts. Installation and configuration guide included.",
      intro: [
        "Grafana's officially maintained MCP server. The AI can search your dashboards, run PromQL and LogQL queries directly, and read current alert and incident state.",
        "It earns its keep during incidents — ask \"which service's error rate climbed in the last 30 minutes?\" and the AI writes the PromQL itself. That's a big deal if you don't write PromQL often enough to remember the syntax.",
      ],
      whyUse: [
        "Good for: SREs and backend engineers using Grafana for observability, especially while on call.",
        "Before connecting: use a Grafana service account token with the Viewer role — that's enough for queries. Don't grant Admin; the AI has no reason to edit dashboards.",
      ],
      faq: [
        { q: "Does it support Grafana Cloud and self-hosted?", a: "Both. Configure your instance URL and a service account token." },
        { q: "Which data sources can it query?", a: "It queries through Grafana, so essentially any data source configured there — Prometheus and Loki being the two most common." },
      ],
    },
  },

  {
    toolSlug: "stripe",
    serverSlug: "stripe-mcp",
    zh: {
      toolName: "Stripe",
      tagline: "Stripe MCP Server：Stripe 官方 Agent Toolkit，让 AI 查客户、订阅、支付记录，也能建产品和支付链接。附安装配置。",
      intro: [
        "Stripe 官方 Agent Toolkit 里的 MCP server。AI 能查客户、订阅、发票、支付记录，也能创建产品、定价和 Payment Link。",
        "查询类的场景最实用——「这个邮箱的客户订阅状态是什么、上次扣款成功了吗」，以前要开 Stripe Dashboard 搜半天，现在直接问。做支持和运营的人省时间最明显。",
      ],
      whyUse: [
        "适合：用 Stripe 收款的团队，尤其是常要查客户账单状态的支持和运营岗。",
        "**接入前务必注意：这是钱。** 用受限 API key（restricted key），只勾你真需要的权限；先在测试模式（test mode）跑通再考虑生产。AI 有创建支付相关对象的能力，权限一定要收紧。",
      ],
      faq: [
        { q: "AI 能直接扣款吗？", a: "取决于你给的 key 权限。强烈建议用只读的 restricted key，除非你明确需要写操作。" },
        { q: "能先在测试环境试吗？", a: "能，用 Stripe 的 test mode key 即可，行为一致但不涉及真钱。上生产前先这么跑。" },
      ],
    },
    en: {
      toolName: "Stripe",
      tagline: "Stripe MCP Server: Stripe's official Agent Toolkit, letting AI look up customers, subscriptions, and payments, and create products and payment links. Setup guide included.",
      intro: [
        "The MCP server from Stripe's official Agent Toolkit. The AI can query customers, subscriptions, invoices, and payments, and create products, prices, and Payment Links.",
        "The lookup use cases are the practical ones — \"what's this email's subscription status, and did the last charge go through?\" used to mean digging through the Stripe Dashboard. Support and ops roles save the most time.",
      ],
      whyUse: [
        "Good for: teams billing through Stripe, especially support and ops staff who constantly check customer billing state.",
        "**Before connecting, seriously: this is money.** Use a restricted API key with only the permissions you need, and get it working in test mode before considering production. The AI can create payment objects, so keep scopes tight.",
      ],
      faq: [
        { q: "Can the AI charge customers?", a: "It depends on the key you give it. Strongly prefer a read-only restricted key unless you explicitly need writes." },
        { q: "Can I try it safely first?", a: "Yes — use a Stripe test mode key. Behaviour is the same but no real money moves. Do this before going anywhere near production." },
      ],
    },
  },

  {
    toolSlug: "dbt",
    serverSlug: "dbt-mcp",
    zh: {
      toolName: "dbt",
      tagline: "dbt MCP Server：dbt Labs 官方出品，让 AI 读你的 dbt 项目结构、跑模型、查血缘和语义层指标。附安装配置。",
      intro: [
        "dbt Labs 官方的 MCP server。AI 能读项目里的模型定义、跑 dbt 命令、查上下游血缘，还能通过语义层查已定义好的业务指标。",
        "血缘查询是最实用的一块——「改这个 staging 模型会影响哪些下游报表」，以前要在 dbt docs 里点半天，现在直接问。改动前评估影响面快很多。",
      ],
      whyUse: [
        "适合：用 dbt 做数据转换的分析工程师，尤其是项目模型数量上来之后。",
        "接入前注意：它能执行 dbt 命令（run、test 等）。指向开发环境 target，别让 AI 直接在生产 schema 上跑。",
      ],
      faq: [
        { q: "dbt Core 和 dbt Cloud 都支持吗？", a: "都支持，配置方式不同。语义层相关能力需要 dbt Cloud。" },
        { q: "AI 会改我的模型文件吗？", a: "读取是默认能力；是否让它写取决于你怎么配。改模型前建议先提交进 git。" },
      ],
    },
    en: {
      toolName: "dbt",
      tagline: "dbt MCP Server: dbt Labs' official server letting AI read your dbt project, run models, and query lineage and semantic-layer metrics. Setup guide included.",
      intro: [
        "dbt Labs' official MCP server. The AI can read model definitions in your project, run dbt commands, trace upstream and downstream lineage, and query defined business metrics through the semantic layer.",
        "Lineage is the standout — \"which downstream reports break if I change this staging model?\" used to mean clicking around dbt docs. Assessing blast radius before a change gets much faster.",
      ],
      whyUse: [
        "Good for: analytics engineers working in dbt, particularly once the project has grown past a manageable number of models.",
        "Before connecting: it can execute dbt commands like run and test. Point it at a development target — don't let the AI run against production schemas.",
      ],
      faq: [
        { q: "Does it work with both dbt Core and dbt Cloud?", a: "Both, with different configuration. Semantic layer features require dbt Cloud." },
        { q: "Will the AI edit my model files?", a: "Reading is the default; whether it writes depends on your configuration. Commit to git before letting it change models." },
      ],
    },
  },

  {
    toolSlug: "wordpress",
    serverSlug: "mcp-wordpress-remote",
    zh: {
      toolName: "WordPress",
      tagline: "WordPress MCP Server：Automattic 官方出品，让 AI 读写你的 WordPress 站点内容——发文、改页面、管评论。附安装配置。",
      intro: [
        "Automattic（WordPress.com 母公司）官方维护的远程 MCP server。AI 能读写文章和页面、管理媒体库和评论、查站点统计。",
        "内容运营场景最直接——「把这篇草稿按站点现有的分类和标签体系发布」，AI 能读到你站上已有的分类，不会自己造一堆新标签出来。",
      ],
      whyUse: [
        "适合：自己运营 WordPress 站点、想让 AI 帮忙处理内容的人。",
        "接入前注意：它能发布和修改已上线的内容。建议先让 AI 只建草稿，人工确认后再发——尤其是有真实读者的站。",
      ],
      faq: [
        { q: "WordPress.com 和自托管的 WordPress.org 都支持吗？", a: "支持 WordPress.com，自托管站点需要装 Jetpack 连接。具体见仓库 README。" },
        { q: "能只让它建草稿不发布吗？", a: "可以，通过提示词约束加上用户角色权限来控制——给一个只能写草稿的账号是最稳的做法。" },
      ],
    },
    en: {
      toolName: "WordPress",
      tagline: "WordPress MCP Server: Automattic's official server letting AI read and write your WordPress content — publish posts, edit pages, manage comments. Setup guide included.",
      intro: [
        "The official remote MCP server from Automattic, the company behind WordPress.com. The AI can read and write posts and pages, manage the media library and comments, and check site stats.",
        "Content operations benefit most directly — \"publish this draft using the site's existing categories and tags\" works because the AI can read the taxonomy you already have instead of inventing a pile of new tags.",
      ],
      whyUse: [
        "Good for: people running their own WordPress site who want AI help with content.",
        "Before connecting: it can publish and modify live content. Have the AI create drafts only, and publish after human review — especially on a site with real readers.",
      ],
      faq: [
        { q: "Does it support both WordPress.com and self-hosted WordPress.org?", a: "WordPress.com is supported; self-hosted sites connect via Jetpack. See the repo README for details." },
        { q: "Can I restrict it to drafts?", a: "Yes — combine prompt constraints with user role permissions. Giving it an account that can only write drafts is the robust way." },
      ],
    },
  },

  {
    toolSlug: "mysql",
    serverSlug: "mcp-server-mysql",
    zh: {
      toolName: "MySQL",
      tagline: "MySQL MCP Server：让 Claude、Cursor 直接连 MySQL 查数据、看表结构——支持只读模式。附安装与配置指南。",
      intro: [
        "MySQL MCP Server 让 AI 直接连你的 MySQL 数据库：查表结构、跑 SELECT、分析数据。不用你先导出 CSV 再贴给 AI。",
        "日常最常用的是「这张表结构什么样、有哪些索引」和临时的数据探查。写业务代码时不用切到数据库客户端去确认字段名。",
      ],
      whyUse: [
        "适合：后端和数据分析，尤其是常要临时查数但懒得开客户端的人。",
        "接入前注意：**用只读账号连生产库**。这个 server 支持只读模式，务必开——AI 写错一条 SQL 的代价在生产库上是不可逆的。",
      ],
      faq: [
        { q: "能限制只读吗？", a: "能。server 有只读配置，另外数据库层面也给个只读账号，两层保险。" },
        { q: "跟 PostgreSQL 那个 server 有什么区别？", a: "协议和方言不同，功能定位一样。本站两个都收录了，用哪个取决于你的数据库。" },
      ],
    },
    en: {
      toolName: "MySQL",
      tagline: "MySQL MCP Server: connect Claude and Cursor straight to MySQL to query data and inspect schemas — read-only mode supported. Installation and configuration guide included.",
      intro: [
        "The MySQL MCP Server lets your AI connect directly to a MySQL database: inspect schemas, run SELECTs, and analyse data — no exporting to CSV and pasting it into the chat.",
        "The everyday uses are \"what does this table look like and what indexes does it have?\" and ad-hoc data exploration. You stop switching to a DB client just to confirm a column name while writing code.",
      ],
      whyUse: [
        "Good for: backend engineers and analysts who query often but don't want to open a client every time.",
        "Before connecting: **use a read-only account for production**. This server supports read-only mode — turn it on. A wrong SQL statement against production isn't reversible.",
      ],
      faq: [
        { q: "Can I lock it to read-only?", a: "Yes. The server has a read-only setting, and you should also use a read-only database account — two layers." },
        { q: "How does it differ from the PostgreSQL server?", a: "Different protocol and dialect, same purpose. Both are listed on this site; pick whichever matches your database." },
      ],
    },
  },

  {
    toolSlug: "hubspot",
    serverSlug: "mcp-hubspot",
    zh: {
      toolName: "HubSpot",
      tagline: "HubSpot MCP Server：让 AI 查 HubSpot 里的联系人、公司、交易记录，也能建和更新 CRM 数据。附安装配置。",
      intro: [
        "HubSpot MCP Server 把 CRM 接进 AI：查联系人和公司、看交易管道状态、读互动历史，也能创建和更新记录。",
        "销售场景最实用——开会前问一句「这家公司我们之前聊到哪了」，AI 把过往邮件、通话记录、交易阶段汇总出来，不用你在 HubSpot 里翻时间线。",
      ],
      whyUse: [
        "适合：用 HubSpot 做 CRM 的销售和市场团队。",
        "接入前注意：CRM 里是客户个人信息，属于敏感数据。用私有 App 的 token 并按最小权限勾 scope，也确认一下这么用符合你们的数据合规要求。",
      ],
      faq: [
        { q: "免费版 HubSpot 能用吗？", a: "能，私有 App 和 API 在免费 CRM 就有，但部分对象和字段受套餐限制。" },
        { q: "会把客户数据发给 AI 厂商吗？", a: "会——AI 要处理这些内容就必然经过模型。接之前想清楚这一点，敏感字段可以在 scope 层面就不给。" },
      ],
    },
    en: {
      toolName: "HubSpot",
      tagline: "HubSpot MCP Server: let AI query HubSpot contacts, companies, and deals, and create or update CRM records. Setup guide included.",
      intro: [
        "The HubSpot MCP Server wires your CRM into the AI: look up contacts and companies, check deal pipeline status, read engagement history, and create or update records.",
        "Sales gets the most from it — before a call, ask \"where did we leave things with this company?\" and the AI pulls together past emails, call notes, and deal stage instead of you scrolling the HubSpot timeline.",
      ],
      whyUse: [
        "Good for: sales and marketing teams running HubSpot as their CRM.",
        "Before connecting: CRM records are personal data about your customers. Use a private App token scoped to the minimum you need, and confirm this usage fits your data-compliance obligations.",
      ],
      faq: [
        { q: "Does it work on free HubSpot?", a: "Yes — private Apps and the API are available on the free CRM, though some objects and fields are tier-gated." },
        { q: "Does customer data go to the AI vendor?", a: "Yes — the model has to see the content to work with it. Decide that consciously, and simply don't grant scopes for the most sensitive fields." },
      ],
    },
  },

  {
    toolSlug: "mongodb",
    serverSlug: "mongodb-mcp-server",
    zh: {
      toolName: "MongoDB",
      tagline: "MongoDB MCP Server：官方出品，让 AI 直接查 MongoDB 和 Atlas——查文档、看集合结构、管集群。附安装配置。",
      intro: [
        "MongoDB 官方维护的 MCP server，同时覆盖数据库操作和 Atlas 云平台管理：查询文档、分析集合结构、查看索引，以及管理 Atlas 上的集群和用户。",
        "对 MongoDB 特别有用的一点是 schema 探查——文档数据库没有固定表结构，「这个集合里的文档到底有哪些字段」经常要靠采样才知道，AI 直接帮你摸清楚。",
      ],
      whyUse: [
        "适合：用 MongoDB 或 Atlas 的开发者，尤其是接手别人的库、要先搞清楚数据长什么样的时候。",
        "接入前注意：支持只读模式，接生产库时开上。Atlas 管理能力涉及集群操作，那部分权限更要收紧。",
      ],
      faq: [
        { q: "自建 MongoDB 和 Atlas 都支持吗？", a: "都支持。连自建实例用连接串，Atlas 管理能力需要 Atlas 的 API key。" },
        { q: "能限制成只读吗？", a: "能，server 提供只读配置，生产环境建议开启。" },
      ],
    },
    en: {
      toolName: "MongoDB",
      tagline: "MongoDB MCP Server: the official server letting AI query MongoDB and Atlas — inspect documents, explore collection shape, manage clusters. Setup guide included.",
      intro: [
        "MongoDB's officially maintained MCP server covers both database operations and Atlas cloud management: querying documents, analysing collection structure, inspecting indexes, and administering Atlas clusters and users.",
        "Schema exploration is especially valuable here — document databases have no fixed schema, so \"what fields do documents in this collection actually have?\" normally means sampling by hand. The AI just works it out.",
      ],
      whyUse: [
        "Good for: developers on MongoDB or Atlas, particularly when inheriting someone else's database and needing to understand its shape first.",
        "Before connecting: read-only mode is supported — enable it for production. Atlas management touches cluster operations, so scope those permissions even more tightly.",
      ],
      faq: [
        { q: "Does it support self-hosted MongoDB as well as Atlas?", a: "Both. Self-hosted uses a connection string; Atlas management needs an Atlas API key." },
        { q: "Can it be locked to read-only?", a: "Yes, the server offers a read-only configuration — recommended for production." },
      ],
    },
  },

  {
    toolSlug: "linkedin",
    serverSlug: "linkedin-mcp-server",
    zh: {
      toolName: "LinkedIn",
      tagline: "LinkedIn MCP Server：让 AI 抓取和分析 LinkedIn 上的个人档案、公司页和职位信息。附安装与配置指南。",
      intro: [
        "开源的 LinkedIn MCP server，让 AI 能读取个人档案、公司页面和职位信息，用于候选人调研、竞品团队分析这类场景。",
        "典型用法是招聘前的批量调研——给一组候选人链接，让 AI 汇总他们的经历共性；或者看一家公司最近在招什么岗位，反推业务重点。",
      ],
      whyUse: [
        "适合：做招聘、销售线索调研、竞品分析的人。",
        "**接入前务必注意：** 它是通过你的登录会话抓取的，LinkedIn 的用户协议对自动化抓取有明确限制，频繁使用有账号被限制的风险。另外抓到的是真实个人信息，怎么存怎么用要符合当地隐私法规。",
      ],
      faq: [
        { q: "会导致账号被封吗？", a: "有风险。LinkedIn 对自动化访问有检测和限制，建议低频使用，别拿主力账号跑批量任务。" },
        { q: "用的是 LinkedIn 官方 API 吗？", a: "不是。官方 API 对这类数据的开放很有限，这个 server 走的是登录会话抓取——这也是上面那些注意事项的由来。" },
      ],
    },
    en: {
      toolName: "LinkedIn",
      tagline: "LinkedIn MCP Server: let AI fetch and analyse LinkedIn profiles, company pages, and job listings. Installation and configuration guide included.",
      intro: [
        "An open-source LinkedIn MCP server that lets your AI read profiles, company pages, and job postings — useful for candidate research and competitor team analysis.",
        "A typical use is bulk research before hiring: hand it a set of candidate links and have the AI summarise what their backgrounds have in common. Or look at what roles a company is hiring for to infer where they're investing.",
      ],
      whyUse: [
        "Good for: recruiters, sales prospecting, and competitive analysis.",
        "**Read this before connecting:** it scrapes using your logged-in session. LinkedIn's terms restrict automated scraping, and heavy use risks account limitation. It also returns real personal data, so how you store and use it must satisfy your local privacy laws.",
      ],
      faq: [
        { q: "Could my account get banned?", a: "It's a real risk. LinkedIn detects and limits automated access — keep usage light and don't run bulk jobs from your main account." },
        { q: "Does it use LinkedIn's official API?", a: "No. The official API exposes very little of this data, so this server works through your logged-in session — which is exactly why the cautions above apply." },
      ],
    },
  },

  {
    toolSlug: "servicenow",
    serverSlug: "servicenow-mcp",
    zh: {
      toolName: "ServiceNow",
      tagline: "ServiceNow MCP Server：让 AI 直接操作 ServiceNow 的工单、变更、知识库和 CMDB。附安装与配置指南。",
      intro: [
        "ServiceNow MCP Server 把 ITSM 平台接进 AI：查和建 incident、处理变更请求、搜知识库文章、查 CMDB 里的配置项。",
        "服务台场景最直接——「过去 24 小时有哪些 P1 还没关闭、分别卡在谁那里」，以前要在 ServiceNow 里配过滤器和视图，现在一句话问出来。",
      ],
      whyUse: [
        "适合：在 ServiceNow 上跑 ITSM 流程的服务台和运维团队。",
        "接入前注意：用专用的集成账号，按角色收紧权限。ServiceNow 里的变更和 CMDB 数据影响面大，只读场景就别给写权限。",
      ],
      faq: [
        { q: "需要哪个版本的 ServiceNow？", a: "通过 REST API 通信，主流版本都能连。具体配置见仓库 README。" },
        { q: "能自动关工单吗？", a: "技术上能，但建议保留人工确认环节——工单状态变更通常有流程和审计要求。" },
      ],
    },
    en: {
      toolName: "ServiceNow",
      tagline: "ServiceNow MCP Server: let AI work with ServiceNow incidents, changes, knowledge articles, and the CMDB. Installation and configuration guide included.",
      intro: [
        "The ServiceNow MCP Server wires the ITSM platform into your AI: query and create incidents, handle change requests, search knowledge articles, and look up configuration items in the CMDB.",
        "Service desk work benefits most directly — \"which P1s from the last 24 hours are still open, and who is each one waiting on?\" used to mean building filters and views in ServiceNow. Now it's one question.",
      ],
      whyUse: [
        "Good for: service desk and ops teams running ITSM processes on ServiceNow.",
        "Before connecting: use a dedicated integration account with tightly scoped roles. Change records and CMDB data have wide blast radius — don't grant write access for read-only use cases.",
      ],
      faq: [
        { q: "Which ServiceNow version do I need?", a: "It talks over the REST API, so mainstream versions work. See the repo README for configuration specifics." },
        { q: "Can it close tickets automatically?", a: "Technically yes, but keep a human confirmation step — ticket state changes usually carry process and audit requirements." },
      ],
    },
  },

  {
    toolSlug: "google-analytics",
    serverSlug: "google-analytics-mcp",
    zh: {
      toolName: "Google Analytics",
      tagline: "Google Analytics MCP Server：Google 官方出品，让 AI 用自然语言查 GA4 数据——不用记维度和指标名。附安装配置。",
      intro: [
        "Google 官方维护的 GA4 MCP server。直接问「上个月哪个渠道带来的转化最多」，AI 自己去 GA4 拉数据，不用你在报表界面里配维度和指标。",
        "GA4 的报表界面一直是个门槛——维度和指标名又多又绕，想要的组合常常得自定义探索。用自然语言问出来省掉的就是这一层。",
      ],
      whyUse: [
        "适合：要看 GA4 数据但不想跟报表界面较劲的人，做内容和增长的尤其合适。",
        "接入前注意：需要 Google Cloud 服务账号并在 GA4 里授予该账号读权限。只给 Viewer 就够了。",
      ],
      faq: [
        { q: "支持 Universal Analytics 吗？", a: "不支持，只支持 GA4。UA 已经停止服务了。" },
        { q: "能改 GA 配置吗？", a: "它面向数据查询。给服务账号 Viewer 权限就只能读，这也是推荐的用法。" },
      ],
    },
    en: {
      toolName: "Google Analytics",
      tagline: "Google Analytics MCP Server: Google's official server letting AI query GA4 in natural language — no memorising dimension and metric names. Setup guide included.",
      intro: [
        "Google's officially maintained GA4 MCP server. Ask \"which channel drove the most conversions last month?\" and the AI pulls the data from GA4 itself, instead of you assembling dimensions and metrics in the reporting UI.",
        "The GA4 interface has always been a barrier — the dimension and metric names are numerous and unintuitive, and the combination you want usually needs a custom exploration. Asking in plain language removes that layer.",
      ],
      whyUse: [
        "Good for: anyone who needs GA4 numbers but doesn't want to fight the reporting UI — content and growth roles especially.",
        "Before connecting: you'll need a Google Cloud service account, granted read access on the GA4 property. Viewer is sufficient.",
      ],
      faq: [
        { q: "Does it support Universal Analytics?", a: "No, GA4 only. UA has been sunset." },
        { q: "Can it change my GA configuration?", a: "It's built for querying data. Granting the service account Viewer keeps it read-only, which is the recommended setup." },
      ],
    },
  },
  // 高采用度实体落地页（W1-1 首批）。只挑：库里已有、有可安装包、非误挂借星、
  // 且是可辨识的知名工具。ai-netcafe / worldmonitor 那类误挂条目不建。
  {
    toolSlug: "chrome-devtools",
    serverSlug: "chrome-devtools-mcp",
    zh: {
      toolName: "Chrome DevTools",
      tagline: "Chrome DevTools MCP Server：让 AI 编码助手直接开一个真实 Chrome，查 DOM、看网络请求、读控制台报错——不用你截图粘贴。附安装配置。",
      intro: [
        "Chrome DevTools MCP Server 把浏览器的开发者工具接给 AI。你在调一个前端 bug 时，不用再把控制台报错、网络面板截图手动喂给 AI——它自己开一个 Chrome，去读页面真实的 DOM、网络请求和 console 输出。",
        "对做 Web 开发的人来说，这省掉的是「复现问题 → 截图 → 描述给 AI」这段来回。AI 直接看到浏览器里发生了什么，定位问题的上下文更完整。",
      ],
      whyUse: [
        "适合：让 AI 帮忙调前端问题、分析页面性能、复现浏览器里那些「只有在真实环境才出现」的 bug 的开发者。",
        "接入前注意：它会启动一个真实浏览器进程，比纯 API 类 server 吃资源。本页下方能看到它的维护活跃度和 TrustScore，以及我们推导出的客户端兼容性。",
      ],
      faq: [
        { q: "它需要我本地装 Chrome 吗？", a: "需要一个可被它驱动的 Chrome/Chromium。具体版本要求以官方 README 为准。" },
        { q: "支持哪些 AI 客户端？", a: "本地 stdio 型，Claude Desktop、Claude Code、Cursor、VS Code 等支持 MCP 的客户端都能接。下方兼容性区块有详情。" },
      ],
    },
    en: {
      toolName: "Chrome DevTools",
      tagline: "Chrome DevTools MCP Server: lets AI coding agents drive a real Chrome — inspect the DOM, read network requests and console errors — without you screenshotting and pasting. Setup guide included.",
      intro: [
        "The Chrome DevTools MCP Server hands the browser's developer tools to your AI. When you're debugging a frontend issue, you no longer paste console errors and network-panel screenshots by hand — the AI opens a Chrome and reads the page's real DOM, network requests and console output itself.",
        "For web developers this removes the reproduce-screenshot-describe loop. The AI sees what actually happened in the browser, so it has fuller context for finding the problem.",
      ],
      whyUse: [
        "Good for: developers who want the AI to help debug frontend issues, analyze page performance, or reproduce browser-only bugs that only appear in a real environment.",
        "Before connecting: it launches a real browser process, so it is heavier than a pure API server. The maintenance signals, TrustScore and derived client compatibility are all below.",
      ],
      faq: [
        { q: "Does it need Chrome installed locally?", a: "It needs a Chrome/Chromium it can drive. Check the official README for exact version requirements." },
        { q: "Which AI clients are supported?", a: "It's a local stdio server, so Claude Desktop, Claude Code, Cursor and VS Code all work. See the compatibility section below." },
      ],
    },
  },
  {
    toolSlug: "mcp-use",
    serverSlug: "mcp-use",
    zh: {
      toolName: "mcp-use",
      tagline: "mcp-use：一个全栈 MCP 框架，用来开发跑在 ChatGPT / Claude 上的 MCP 应用，也能自己搭 server。附安装说明。",
      intro: [
        "mcp-use 不是某个具体功能的 server，而是一个开发框架——帮你构建能接进 ChatGPT、Claude 的 MCP 应用，也能用它自己搭一个 MCP server。定位更接近「MCP 开发脚手架」。",
        "如果你想做的不是「用一个现成 server」而是「自己写一个」，或者想把 MCP 能力嵌进自己的应用里，这类框架省掉的是从零对接协议的活。",
      ],
      whyUse: [
        "适合：要自己开发 MCP server 或 MCP 应用的开发者，而不是只想接一个现成工具的使用者。",
        "接入前注意：它是框架不是即插即用的工具 server，用它需要写代码。下方的维护信号对框架类项目尤其重要——框架停更的迁移成本比单个 server 高得多。",
      ],
      faq: [
        { q: "它和直接用官方 SDK 有什么区别？", a: "它在协议之上提供了更高层的抽象，目标是少写样板。是否值得取决于你的项目复杂度，具体能力以官方文档为准。" },
        { q: "能用来接现成的 server 吗？", a: "它主要面向开发，如果你只是想用一个现成 server，直接看那个 server 自己的接入说明更直接。" },
      ],
    },
    en: {
      toolName: "mcp-use",
      tagline: "mcp-use: a fullstack MCP framework for building MCP apps that run on ChatGPT / Claude, and for building servers of your own. Setup notes included.",
      intro: [
        "mcp-use is not a server for one specific function — it's a development framework for building MCP apps that plug into ChatGPT and Claude, and for building an MCP server of your own. Think of it as MCP scaffolding rather than a finished tool.",
        "If what you want is to write a server rather than use an existing one, or to embed MCP capabilities into your own app, a framework like this saves you from wiring up the protocol from scratch.",
      ],
      whyUse: [
        "Good for: developers building an MCP server or MCP app, rather than users who just want to connect a finished tool.",
        "Before connecting: it's a framework, not a plug-and-play tool server — using it means writing code. The maintenance signals below matter more than usual for a framework: migrating off an abandoned framework costs far more than swapping one server.",
      ],
      faq: [
        { q: "How is it different from using the official SDK directly?", a: "It offers a higher-level abstraction over the protocol, aiming to cut boilerplate. Whether it's worth it depends on your project's complexity; see the official docs for specifics." },
        { q: "Can I use it to connect existing servers?", a: "It's aimed at development. If you just want to use a finished server, that server's own setup instructions are more direct." },
      ],
    },
  },
  {
    toolSlug: "xcodebuild",
    serverSlug: "xcodebuildmcp",
    zh: {
      toolName: "XcodeBuild",
      tagline: "XcodeBuildMCP：让 AI 编码助手直接调 Xcode 构建、跑测试、管理模拟器——iOS/macOS 开发的 MCP server。附安装配置。",
      intro: [
        "XcodeBuildMCP 把 Xcode 的命令行能力接给 AI：构建项目、跑测试、启动和管理模拟器、读构建错误。在做 iOS/macOS 开发时，AI 可以自己触发一次构建、看失败原因，而不是等你把 Xcode 的报错复制出来。",
        "对 Apple 平台开发者来说，这把「改代码 → 切到 Xcode 构建 → 复制错误回 AI」的循环收进了对话里。",
      ],
      whyUse: [
        "适合：用 AI 辅助 iOS/macOS 开发、希望 AI 能自己跑构建和测试来验证改动的开发者。",
        "接入前注意：需要装了 Xcode 的 macOS 环境。这是本地 stdio 型 server，凭据面很小——它操作的是本地 Xcode，不碰远程服务。",
      ],
      faq: [
        { q: "它能替我改代码吗？", a: "它提供的是构建、测试、模拟器管理这类能力。改代码由 AI 通过别的工具（如文件系统 server）做，它负责验证。" },
        { q: "需要 Xcode 吗？", a: "需要。它本质是把 xcodebuild 等命令行工具封装成 MCP 工具，没有 Xcode 就没有底层命令可调。" },
      ],
    },
    en: {
      toolName: "XcodeBuild",
      tagline: "XcodeBuildMCP: lets AI coding agents run Xcode builds, tests and simulators directly — an MCP server for iOS/macOS development. Setup guide included.",
      intro: [
        "XcodeBuildMCP hands Xcode's command-line capabilities to your AI: build projects, run tests, launch and manage simulators, read build errors. During iOS/macOS development the AI can trigger a build and see why it failed, instead of waiting for you to copy the error out of Xcode.",
        "For Apple-platform developers this folds the edit-switch-to-Xcode-copy-error loop into the conversation.",
      ],
      whyUse: [
        "Good for: developers using AI to assist iOS/macOS work who want the AI to run builds and tests itself to verify changes.",
        "Before connecting: needs a macOS environment with Xcode installed. It's a local stdio server with a small credential surface — it drives your local Xcode and does not touch remote services.",
      ],
      faq: [
        { q: "Can it edit my code?", a: "It provides build, test and simulator capabilities. Editing is done by the AI through other tools (like a filesystem server); this one verifies." },
        { q: "Does it require Xcode?", a: "Yes. It essentially wraps xcodebuild and related command-line tools as MCP tools, so without Xcode there are no underlying commands to call." },
      ],
    },
  },
  {
    toolSlug: "21st-dev-magic",
    serverSlug: "21st-dev-magic",
    zh: {
      toolName: "21st.dev Magic",
      tagline: "21st.dev Magic MCP：在 Cursor / Claude Code / Windsurf 里搜索并生成 React/UI 组件——像 v0 但直接在你的编辑器里。附安装配置。",
      intro: [
        "21st.dev Magic 把一个上万量级的 React/UI 组件库接给 AI 编码助手。你在写界面时，可以让 AI 直接搜出合适的组件并生成代码，定位类似 v0，但发生在你的 Cursor / Claude Code / Windsurf 里，不用切到另一个产品。",
        "对做前端的人来说，省掉的是「去组件站找 → 复制 → 改适配」这段，AI 直接把组件落到你正在写的文件里。",
      ],
      whyUse: [
        "适合：用 AI 辅助前端开发、经常要拼 UI 组件、希望不离开编辑器的开发者。",
        "接入前注意：它连的是 21st.dev 的组件服务，需要对应的 API key。本页下方有维护信号和客户端兼容性；这类 server 有外部服务依赖，注意 key 的权限范围。",
      ],
      faq: [
        { q: "生成的组件是它自己画的吗？", a: "它从一个组件库里搜索匹配项并生成接入代码，不是凭空画像素。库的质量决定了结果质量。" },
        { q: "支持哪些编辑器？", a: "主打 Cursor、Claude Code、Windsurf 等支持 MCP 的编辑器。下方兼容性区块有详情。" },
      ],
    },
    en: {
      toolName: "21st.dev Magic",
      tagline: "21st.dev Magic MCP: search and generate React/UI components inside Cursor / Claude Code / Windsurf — like v0, but in your editor. Setup guide included.",
      intro: [
        "21st.dev Magic hands a library of 10,000+ React/UI components to your AI coding agent. While building an interface you can have the AI search for a fitting component and generate the code — similar to v0, but happening inside your Cursor / Claude Code / Windsurf rather than in a separate product.",
        "For frontend work this removes the find-on-a-component-site, copy, adapt loop — the AI drops the component straight into the file you're writing.",
      ],
      whyUse: [
        "Good for: developers using AI for frontend work who assemble UI components often and want to stay in their editor.",
        "Before connecting: it talks to 21st.dev's component service and needs an API key. Maintenance signals and client compatibility are below; this server has an external-service dependency, so mind the key's scope.",
      ],
      faq: [
        { q: "Does it draw the components itself?", a: "It searches a component library for matches and generates the integration code — it doesn't paint pixels from scratch. The library's quality sets the ceiling on results." },
        { q: "Which editors are supported?", a: "It targets Cursor, Claude Code and Windsurf and other MCP-capable editors. See the compatibility section below." },
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
