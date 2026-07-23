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
