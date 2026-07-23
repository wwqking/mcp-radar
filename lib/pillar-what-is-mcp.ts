// 支柱页内容层：/what-is-mcp-server 的长文内容（语言无关结构 + 双语文本）。
// 这是站内“主题权威”的中心页：命中 "what is an mcp server" 主题词，把详情页/分类页内链回来。
// 结构与 guides.ts 一致（section: heading + body[]），但支柱页只此一篇，故内容内联在本文件。
//
// 内链策略：sections 里用 [[/en/server/slug|文字]] 这种标记？——不，为保持渲染简单，
// 内链集中放在 relatedServers / relatedCategories，由页面渲染成卡片区，正文保持纯文本可翻译。

import type { Locale } from "./i18n/locales";

export interface PillarSection {
  heading: string;
  body: string[];
}

export interface PillarFaq {
  q: string;
  a: string;
}

interface PillarContent {
  title: string;
  excerpt: string;
  intro: string[];
  sections: PillarSection[];
  faq: PillarFaq[];
}

/** 内链到详情页的高信任 server（slug 语言无关，展示名从数据取，这里只存 slug + 一句话）。 */
export const PILLAR_RELATED_SERVERS: { slug: string; blurb: { zh: string; en: string } }[] = [
  { slug: "upstash-context7-mcp", blurb: { zh: "给 AI 喂最新的库文档", en: "Feed up-to-date library docs to your AI" } },
  { slug: "playwright-mcp", blurb: { zh: "让 AI 驱动真实浏览器做自动化", en: "Let AI drive a real browser for automation" } },
  { slug: "github-github-mcp-server", blurb: { zh: "把 GitHub issue / PR / 代码接给 AI", en: "Connect GitHub issues, PRs and code to your AI" } },
  { slug: "modelcontextprotocol-server-filesystem", blurb: { zh: "让 AI 读写你本地指定目录", en: "Let AI read and write files in an allowed directory" } },
  { slug: "mcp-server-kubernetes", blurb: { zh: "用自然语言查询和操作 K8s 集群", en: "Query and operate K8s clusters in natural language" } },
  { slug: "figma-developer-mcp", blurb: { zh: "把 Figma 设计稿接给 AI 读取", en: "Give your AI read access to Figma design files" } },
];

const ZH: PillarContent = {
  title: "什么是 MCP Server？一份写给开发者的完整指南",
  excerpt:
    "MCP（Model Context Protocol，模型上下文协议）Server 是让 Claude、Cursor、VS Code 等 AI 客户端安全接入外部工具和数据的标准化桥梁。本指南讲清它是什么、怎么工作、如何选和如何接入。",
  intro: [
    "如果你用过 Claude Desktop、Cursor 或 VS Code 里的 AI，一定遇到过一个瓶颈：AI 很聪明，但它看不到你的数据库、读不了你的文件、也调不了你公司的 API。MCP Server 就是用来打破这个瓶颈的。",
    "MCP（Model Context Protocol）是 Anthropic 在 2024 年底提出并开源的开放协议。它定义了一套标准接口，让任何 AI 客户端都能用同一种方式接入外部能力——数据库、文件系统、GitHub、浏览器、企业系统。一个「MCP Server」就是按这套协议实现的、对外暴露某种能力的小程序。",
    "打个比方：如果说 AI 模型是电脑，MCP 就是 USB-C 接口。以前每个工具都要为每个 AI 客户端单独做集成（N×M 的噩梦）；有了 MCP，工具只要实现一次协议，就能被所有支持 MCP 的客户端调用。",
  ],
  sections: [
    {
      heading: "MCP Server 到底是什么",
      body: [
        "MCP Server 是一个独立运行的进程，它按 Model Context Protocol 的规范，向 AI 客户端（称为 MCP Host / Client）暴露三类东西：Tools（可被 AI 调用的动作，比如“查询数据库”“创建 GitHub issue”）、Resources（可被读取的数据，比如文件内容、数据库表结构）、Prompts（预置的提示词模板）。",
        "AI 客户端在对话过程中，如果判断需要外部能力，就会通过 MCP 协议调用对应 Server 的 Tool，拿到结果再继续推理。整个过程对用户是透明的——你只管用自然语言说需求，AI 自己决定调用哪个工具。",
        "关键点：MCP Server 自己不含 AI，它只是能力的提供方。智能在客户端那侧的大模型里，MCP Server 负责把“外部世界”安全、结构化地接进来。",
      ],
    },
    {
      heading: "MCP 是怎么工作的：Host、Client、Server、Transport",
      body: [
        "一次完整的 MCP 调用涉及四个角色。Host 是承载 AI 的应用（Claude Desktop、Cursor、VS Code）；Client 是 Host 内部管理与某个 Server 连接的模块；Server 就是提供能力的程序；Transport 是两者通信的通道。",
        "Transport 目前主流两种：stdio（标准输入输出，用于本地 Server，客户端把 Server 当子进程启动，最常见）和 HTTP/SSE（用于远程 Server，Server 部署在别处，通过网络连接）。本地跑的 filesystem、postgres 这类多用 stdio；托管的 SaaS 型 MCP 服务多用远程 HTTP。",
        "调用流程：客户端启动时连接 Server → Server 声明自己有哪些 Tools/Resources → 对话中模型决定调用某个 Tool → 客户端把调用请求发给 Server → Server 执行并返回结构化结果 → 模型基于结果继续。",
      ],
    },
    {
      heading: "为什么 MCP 重要：从 N×M 到 N+M",
      body: [
        "在 MCP 之前，把一个工具接进 AI 是一次性、私有的工程活。你想让 Cursor 读你的 Postgres，得为 Cursor 写一个专门的集成；想让 Claude 也能读，再写一个。M 个工具 × N 个客户端 = N×M 个集成，谁都维护不过来。",
        "MCP 把它变成 N+M：工具实现一次 MCP Server，就能被所有 MCP 客户端复用；客户端实现一次 MCP Client，就能接入所有 MCP Server。这就是它在 2025 年迅速被 Anthropic、OpenAI、以及大量开发工具采纳的根本原因。",
        "对开发者的直接好处：你不用再为“怎么让 AI 用上我的系统”重复造轮子。找到（或自己写）一个 MCP Server，配置几行 JSON，AI 就能用了。",
      ],
    },
    {
      heading: "如何选一个靠谱的 MCP Server",
      body: [
        "MCP 生态爆发很快，但质量参差不齐——有的仓库半年没更新，有的没有 license，有的装了根本跑不起来。选之前建议看几个信号：维护活跃度（最近有没有提交、issue 有没有人回）、采用度（GitHub stars、npm 下载量）、可用性（有没有官方 registry 收录、能不能一行命令跑起来）、健康度（open issues 堆积情况、有没有 license）。",
        "这正是 MCP Radar 做的事：我们对每个 Server 抓取这些信号，算出一个 TrustScore，并给出“能不能用、值不值得接”的一句话判断，帮你在几百个同类里快速筛掉坑。",
        "一个实用建议：优先选进了官方 registry、且最近 30 天有提交的 Server；接入企业生产环境前，务必看它要不要 API Key、要什么运行时、有没有安全红线。",
      ],
    },
    {
      heading: "如何接入一个 MCP Server（以 Claude 为例）",
      body: [
        "以本地 stdio 型 Server 为例，接入通常就是往客户端的配置文件里加一段 JSON，声明用什么命令启动这个 Server。比如给 Claude Desktop 加一个 filesystem Server，就是在配置里写明 command（如 npx）、args（包名和允许访问的目录）。",
        "配置好后重启客户端，它会自动把 Server 当子进程拉起、握手、读取能力清单。之后你就能直接对 AI 说“帮我把 Downloads 里的截图按日期归类”，它会调用 filesystem Server 完成。",
        "远程 HTTP 型 Server 则是填一个 URL + 认证信息。不同客户端（Claude、Cursor、VS Code）配置文件位置和字段略有差异，但思路一致：告诉客户端“这个 Server 在哪、怎么连”。每个 Server 的详情页会给出对应的接入命令。",
      ],
    },
    {
      heading: "常见类型：你能用 MCP Server 做什么",
      body: [
        "数据类：Postgres、SQLite 等让 AI 直接查你的数据库；文件类：filesystem 让 AI 读写本地文件。",
        "开发类：GitHub 接 issue/PR/代码，Playwright 驱动浏览器做端到端测试和抓取，Context7 给 AI 喂最新的库文档避免它用过时 API。",
        "企业类：ServiceNow、Linear、Figma 等把你日常用的 SaaS 接给 AI，让它替你查工单、建任务、读设计稿。下面的精选 Server 可以直接点进去看接入方式。",
      ],
    },
  ],
  faq: [
    {
      q: "MCP Server 和普通 API 有什么区别？",
      a: "普通 API 是给程序调用的，每个 AI 客户端要单独写适配。MCP Server 按统一协议暴露能力，任何支持 MCP 的 AI 客户端都能用同一种方式调用，不用为每个客户端重复集成。",
    },
    {
      q: "MCP Server 需要联网吗？",
      a: "看类型。本地 stdio 型 Server（如 filesystem）在你机器上作为子进程运行，不一定联网；远程 HTTP 型 Server 部署在别处，需要通过网络连接。",
    },
    {
      q: "用 MCP Server 安全吗？",
      a: "MCP 本身提供了权限边界（比如 filesystem 只能访问你明确允许的目录）。但 Server 是第三方代码，接入前务必确认它的来源、要不要 API Key、有没有安全红线。生产环境建议只用可审计、活跃维护的 Server。",
    },
    {
      q: "MCP Server 要花钱吗？",
      a: "绝大多数开源 MCP Server 免费。费用可能来自它背后调用的服务（比如某个付费 API）或托管型 SaaS 的订阅，Server 协议本身不收费。",
    },
    {
      q: "哪些 AI 客户端支持 MCP？",
      a: "Claude Desktop、Claude Code、Cursor、VS Code（含 GitHub Copilot）等主流开发向 AI 客户端都已支持，生态还在快速扩大。",
    },
  ],
};

const EN: PillarContent = {
  title: "What Is an MCP Server? A Complete Guide for Developers",
  excerpt:
    "An MCP (Model Context Protocol) Server is the standardized bridge that lets AI clients like Claude, Cursor, and VS Code securely connect to external tools and data. This guide explains what it is, how it works, how to choose one, and how to set it up.",
  intro: [
    "If you've used the AI inside Claude Desktop, Cursor, or VS Code, you've hit a wall: the AI is smart, but it can't see your database, can't read your files, and can't call your company's APIs. MCP Servers exist to break through that wall.",
    "MCP (Model Context Protocol) is an open protocol Anthropic introduced and open-sourced in late 2024. It defines a standard interface so any AI client can connect to external capabilities — databases, file systems, GitHub, browsers, enterprise systems — in one consistent way. An \"MCP Server\" is a small program that implements this protocol to expose one such capability.",
    "An analogy: if the AI model is a computer, MCP is the USB-C port. Before MCP, every tool had to build a separate integration for every AI client (an N×M nightmare). With MCP, a tool implements the protocol once and any MCP-capable client can call it.",
  ],
  sections: [
    {
      heading: "What exactly is an MCP Server",
      body: [
        "An MCP Server is a standalone process that, following the Model Context Protocol spec, exposes three things to AI clients (called MCP Hosts / Clients): Tools (actions the AI can invoke, like \"query the database\" or \"create a GitHub issue\"), Resources (data that can be read, like file contents or a database schema), and Prompts (predefined prompt templates).",
        "During a conversation, when the AI client decides it needs an external capability, it calls the relevant Server's Tool over the MCP protocol, gets the result, and continues reasoning. The whole process is transparent to the user — you just describe what you want in natural language, and the AI decides which tool to call.",
        "Key point: an MCP Server contains no AI of its own. It is purely a capability provider. The intelligence lives in the large model on the client side; the MCP Server's job is to bring the \"outside world\" in, safely and in a structured form.",
      ],
    },
    {
      heading: "How MCP works: Host, Client, Server, Transport",
      body: [
        "A complete MCP call involves four roles. The Host is the app that carries the AI (Claude Desktop, Cursor, VS Code); the Client is the module inside the Host that manages the connection to a given Server; the Server is the program providing the capability; and the Transport is the channel they communicate over.",
        "Two transports dominate today: stdio (standard input/output, for local Servers, where the client launches the Server as a child process — the most common case) and HTTP/SSE (for remote Servers deployed elsewhere and reached over the network). Local Servers like filesystem or postgres usually use stdio; hosted SaaS-style MCP services usually use remote HTTP.",
        "The call flow: on startup the client connects to the Server → the Server declares which Tools/Resources it offers → mid-conversation the model decides to call a Tool → the client sends the call to the Server → the Server executes and returns a structured result → the model continues based on that result.",
      ],
    },
    {
      heading: "Why MCP matters: from N×M to N+M",
      body: [
        "Before MCP, wiring a tool into an AI was a one-off, private engineering effort. Want Cursor to read your Postgres? Write a dedicated integration for Cursor. Want Claude to read it too? Write another. M tools × N clients = N×M integrations that nobody can maintain.",
        "MCP turns that into N+M: implement an MCP Server once and every MCP client can reuse it; implement an MCP Client once and it can connect to every MCP Server. That's the fundamental reason it was rapidly adopted through 2025 by Anthropic, OpenAI, and a wave of developer tools.",
        "The direct benefit for developers: you no longer reinvent the wheel for \"how do I let the AI use my system.\" Find (or write) an MCP Server, add a few lines of JSON config, and the AI can use it.",
      ],
    },
    {
      heading: "How to choose a reliable MCP Server",
      body: [
        "The MCP ecosystem is exploding, but quality varies wildly — some repos haven't been updated in six months, some have no license, and some simply won't run once installed. Before you pick one, check a few signals: maintenance activity (recent commits, whether issues get answered), adoption (GitHub stars, npm downloads), usability (whether it's in an official registry, whether it runs with a single command), and health (backlog of open issues, presence of a license).",
        "This is exactly what MCP Radar does: we scrape these signals for every Server, compute a TrustScore, and give a one-line verdict on whether it's usable and worth connecting — so you can quickly rule out the traps among hundreds of similar options.",
        "A practical rule: prefer Servers that are in an official registry and have had commits in the last 30 days. Before wiring one into a production environment, always check whether it needs an API key, what runtime it requires, and whether it crosses any security red lines.",
      ],
    },
    {
      heading: "How to set up an MCP Server (using Claude as an example)",
      body: [
        "For a local stdio Server, setup is usually just adding a JSON block to the client's config file that declares the command used to launch the Server. For example, adding a filesystem Server to Claude Desktop means specifying the command (e.g. npx), the args (the package name and the directory it's allowed to access).",
        "After configuring and restarting the client, it will automatically launch the Server as a child process, perform the handshake, and read the capability list. From then on you can simply tell the AI \"sort the screenshots in my Downloads by date\" and it will call the filesystem Server to do it.",
        "A remote HTTP Server instead takes a URL plus authentication. Different clients (Claude, Cursor, VS Code) have slightly different config file locations and fields, but the idea is the same: tell the client where the Server is and how to connect. Each Server's detail page gives you the exact setup command.",
      ],
    },
    {
      heading: "Common types: what you can do with an MCP Server",
      body: [
        "Data: Postgres, SQLite and similar let the AI query your database directly; files: filesystem lets the AI read and write local files.",
        "Development: GitHub connects issues/PRs/code, Playwright drives a browser for end-to-end testing and scraping, and Context7 feeds the AI up-to-date library docs so it stops using outdated APIs.",
        "Enterprise: ServiceNow, Linear, Figma and others connect the SaaS you use daily to the AI, so it can look up tickets, create tasks, and read design files for you. The featured Servers below link straight to their setup instructions.",
      ],
    },
  ],
  faq: [
    {
      q: "What's the difference between an MCP Server and a regular API?",
      a: "A regular API is meant to be called by programs, and each AI client needs its own adapter. An MCP Server exposes capabilities through a unified protocol, so any MCP-capable AI client can call it the same way — no per-client integration required.",
    },
    {
      q: "Does an MCP Server need an internet connection?",
      a: "It depends on the type. A local stdio Server (like filesystem) runs as a child process on your machine and may not need the internet; a remote HTTP Server is deployed elsewhere and requires a network connection.",
    },
    {
      q: "Are MCP Servers safe to use?",
      a: "MCP itself provides permission boundaries (for example, filesystem can only access directories you explicitly allow). But a Server is third-party code, so before connecting one, verify its source, whether it needs an API key, and whether it has any security red lines. For production, use only auditable, actively maintained Servers.",
    },
    {
      q: "Do MCP Servers cost money?",
      a: "The vast majority of open-source MCP Servers are free. Costs may come from the services they call behind the scenes (like a paid API) or from a hosted SaaS subscription — the Server protocol itself is free.",
    },
    {
      q: "Which AI clients support MCP?",
      a: "Claude Desktop, Claude Code, Cursor, and VS Code (including GitHub Copilot) all support MCP, and the ecosystem is expanding quickly.",
    },
  ],
};

const CONTENT: Record<Locale, PillarContent> = { zh: ZH, en: EN };

export function getPillarContent(locale: Locale): PillarContent {
  return CONTENT[locale] ?? CONTENT.en;
}
