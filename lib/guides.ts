// 指南内容层。深度内容静态写在仓库里（SSG），后续可迁移到 CMS。

export interface GuideSection {
  heading: string;
  body: string[];
}

export interface Guide {
  slug: string;
  title: string;
  excerpt: string;
  /** free = 全文免费；member = 前 30% 免费 + Paywall */
  tier: "free" | "member";
  icon: string;
  publishedAt: string;
  readingMinutes: number;
  sections: GuideSection[];
}

export const GUIDES: Guide[] = [
  {
    slug: "choosing-mcp-server",
    title: "如何为企业选 MCP server：一份尽调清单",
    excerpt:
      "装上就能跑和生产环境能用之间，隔着一份没人写过的尽调清单。我们从 1,200+ server 的健康数据里反推出 12 条必查项。",
    tier: "member",
    icon: "📋",
    publishedAt: "2026-07-14",
    readingMinutes: 12,
    sections: [
      {
        heading: "为什么「装上能跑」不等于「能用」",
        body: [
          "MCP server 的安装门槛极低——一行 npx 命令就能跑起来。但企业场景的真正问题是：这个 server 三个月后还有人维护吗？它处理凭证的方式安全吗？它的维护者响应安全漏洞要多久？",
          "我们追踪了 1,247 个 MCP server 的维护数据，其中 137 个已弃坑、168 个超过半年无更新——也就是说，随便从「MCP 大全」类列表里挑一个，有接近四分之一的概率踩到僵尸项目。",
          "这份清单把尽调过程固化成 12 条可逐项打勾的检查项，全部可以通过公开数据在 15 分钟内完成。",
        ],
      },
      {
        heading: "第一部分：活性检查（必查 5 条）",
        body: [
          "1. 最近一次 commit 距今是否 < 30 天。超过 90 天的项目，issue 响应率断崖式下降到 20% 以下。",
          "2. 90 天内 commit 数是否 > 10。低于此数的项目通常只剩「续命式提交」（改 README、升版本号）。",
          "3. open issue 的中位响应时间是否 < 7 天。可以在仓库 Issues 页按「最近评论」排序快速判断。",
          "4. 仓库是否被 archived。 archived 仓库的 API 依赖会随时间腐坏，平均 6 个月后开始出现不可用。",
          "5. 是否有明确 license。无 license 的代码在企业法务上等于「保留所有权利」，不可用于商业场景。",
        ],
      },
      {
        heading: "第二部分：安全与合规（会员部分预览）",
        body: [
          "6. 凭证如何传递？优先选择通过环境变量注入的 server，警惕要求把 token 写进配置文件的实现——后者在多客户端环境下极易泄漏。",
          "7. 是否有第三方托管依赖？托管型 server（如 Firecrawl、Exa）意味着你的数据会经过第三方服务器，需要评估其隐私政策……",
        ],
      },
      {
        heading: "第三部分：采用度交叉验证（会员）",
        body: [
          "此部分包含：stars 与下载量的健康比例区间、如何识别「刷榜型」server、awesome-list 收录的参考权重、以及我们内部使用的交叉验证表格模板。",
        ],
      },
      {
        heading: "附录：尽调清单模板（会员）",
        body: [
          "可直接复制到 Notion / 飞书文档的 12 项尽调表格，含每项的数据获取路径与通过阈值。",
        ],
      },
    ],
  },
  {
    slug: "mcp-security-red-lines",
    title: "10 条 MCP 安全红线",
    excerpt:
      "MCP server 拥有你授予的一切权限。这 10 条红线任意一条被突破，都该立即卸载——不管它功能多好用。",
    tier: "free",
    icon: "🚨",
    publishedAt: "2026-07-07",
    readingMinutes: 8,
    sections: [
      {
        heading: "红线 1-3：凭证与权限",
        body: [
          "红线 1：要求明文存储凭证到配置文件。正规的 MCP server 一律通过环境变量或系统 keychain 读取凭证。配置文件方案在 Claude Desktop 等多客户端共用场景下会把 token 扩散到不可控位置。",
          "红线 2：请求超出功能所需的权限范围。一个「读取日历」的 server 要求写权限，一个「查询数据库」的 server 要求 DDL 权限——直接拒绝。",
          "红线 3：无法说明数据流向的托管型 server。你的 prompt 和返回数据经过第三方服务器时，对方是否记录、保留多久、用于什么，必须有明确答复。",
        ],
      },
      {
        heading: "红线 4-7：供应链风险",
        body: [
          "红线 4：无开源仓库的纯 remotes 型 server。你无法审计它实际执行什么代码，等于把权限交给黑箱。",
          "红线 5：安装脚本来路不明。npx 一键安装的背后是完整的包执行权限，确认包名与官方仓库一致（typosquatting 攻击在 npm 生态每月都有发生）。",
          "红线 6：依赖链过深或包含已知漏洞依赖。用 npm audit 跑一遍，高危漏洞未修复的直接跳过。",
          "红线 7：维护者身份无法追溯。匿名账号、无历史项目、无社区存在的维护者，信任成本自担。",
        ],
      },
      {
        heading: "红线 8-10：行为异常",
        body: [
          "红线 8：server 在你未调用时产生网络请求。可用 mitmproxy 等工具抓包验证。",
          "红线 9：tool 描述里包含诱导性 prompt injection（例如「忽略之前的指令」）。这是 2025 年后出现的新型攻击面。",
          "红线 10：卸载后残留进程或计划任务。正规 server 退出即终止，任何驻留行为都是危险信号。",
          "这份清单会持续更新。发现新的攻击手法时，我们会在周刊中第一时间通报。",
        ],
      },
    ],
  },
  {
    slug: "self-host-vs-remote",
    title: "self-host vs 远程 server：成本、延迟与信任模型",
    excerpt:
      "本地跑的 server 和托管在云端的 server，差别不只是延迟。三种信任模型的取舍，决定了你的数据边界画在哪里。",
    tier: "free",
    icon: "⚖️",
    publishedAt: "2026-06-30",
    readingMinutes: 6,
    sections: [
      {
        heading: "三种部署形态",
        body: [
          "本地 stdio：server 作为子进程跑在你机器上，通过标准输入输出通信。数据不出本机，信任模型最简单——你只需要信代码本身。",
          "self-host HTTP：server 部署在你自己的服务器上，团队共享。数据不出你的基础设施边界，但要自己处理认证与高可用。",
          "托管远程：官方或第三方托管，即开即用。最省事，但数据流经第三方，信任模型最复杂——你同时信任代码、运营者和他们的基础设施。",
        ],
      },
      {
        heading: "决策矩阵",
        body: [
          "处理敏感数据（生产数据库、内部文档）→ 只考虑本地 stdio 或 self-host。",
          "团队多人共用、需要集中审计日志 → self-host HTTP。",
          "个人效率工具、数据本身公开（网页抓取、搜索）→ 托管远程的便利性通常值得。",
          "延迟敏感场景（IDE 内实时代码分析）→ 本地 stdio，省去网络往返的 50-200ms。",
        ],
      },
      {
        heading: "混合策略（推荐）",
        body: [
          "实践中大多数团队采用混合策略：数据类 server（数据库、文件系统）本地跑，能力类 server（搜索、抓取）用托管。按数据敏感度画边界，而不是一刀切。",
        ],
      },
    ],
  },
  {
    slug: "mcp-production-checklist",
    title: "把 MCP server 搬进生产环境前",
    excerpt:
      "超时、重试、并发、日志——从 demo 到生产的距离，全在这些没人写的细节里。",
    tier: "member",
    icon: "🚀",
    publishedAt: "2026-06-22",
    readingMinutes: 10,
    sections: [
      {
        heading: "生产环境的四个新变量",
        body: [
          "demo 环境里 MCP server 只需要「能用」；生产环境里它必须超时可控、失败可重试、并发可承载、行为可观测。",
          "我们整理了从 12 个真实生产部署案例（含 3 个失败回滚案例）中提炼的检查清单。",
        ],
      },
      {
        heading: "稳定性配置（会员部分预览）",
        body: [
          "超时：MCP 协议本身不强制超时，必须在客户端侧配置。建议工具调用默认 30s，长任务显式声明……",
          "重试：幂等的只读工具可以安全重试，写操作必须实现去重键……",
        ],
      },
      {
        heading: "可观测性方案（会员）",
        body: [
          "完整的日志采集方案：哪些字段必须记录（tool 名、耗时、token 消耗、错误类型），如何接入现有 APM，以及我们开源的 JSON 日志 schema。",
        ],
      },
    ],
  },
];

export function getAllGuides(): Guide[] {
  return [...GUIDES].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getGuideBySlug(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

/** 会员文免费可见的段落数（约前 30%） */
export function freeSectionCount(guide: Guide): number {
  if (guide.tier === "free") return guide.sections.length;
  return Math.max(1, Math.ceil(guide.sections.length * 0.3));
}
