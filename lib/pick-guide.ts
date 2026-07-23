// 分类选型指南（人工精写）：同类 server「该选哪个」的一句话建议。
// 按 category slug 关联；详情页在「相似 server」区顶部展示对应分类的选型指引，
// 把「这里还有几个类似的」升级成「同类里怎么选」。
//
// 只写有多个主流竞品、确实需要选型的分类；其余分类无指南时不显示。

export interface PickGuide {
  /** 一句选型总纲 */
  intro: { zh: string; en: string };
  /** 「要 X → 选 Y」的具体分流建议 */
  picks: { when: { zh: string; en: string }; pick: { zh: string; en: string } }[];
}

export const PICK_GUIDES: Record<string, PickGuide> = {
  browser: {
    intro: {
      zh: "浏览器类 server 的核心区别是「本地跑还是云端跑」「要不要处理登录/动态页」。",
      en: "Browser servers differ mainly on local vs. cloud, and whether you need to handle login / dynamic pages.",
    },
    picks: [
      {
        when: { zh: "要操作需要登录、JS 动态渲染的网站", en: "Operate login-gated, JS-rendered sites" },
        pick: { zh: "选 Playwright MCP —— 真实浏览器，交互能力最全", en: "Pick Playwright MCP — a real browser with the fullest interaction" },
      },
      {
        when: { zh: "要批量把静态网站抓成 Markdown / 喂知识库", en: "Bulk-scrape static sites to Markdown / feed a knowledge base" },
        pick: { zh: "选 Firecrawl —— 整站爬取、结构化提取更省心", en: "Pick Firecrawl — easiest for whole-site crawl and extraction" },
      },
      {
        when: { zh: "要规模化、不占本地资源的云端浏览器", en: "Want scaled, cloud-hosted browsers" },
        pick: { zh: "选 Browserbase / Hyperbrowser —— 云端会话", en: "Pick Browserbase / Hyperbrowser — cloud sessions" },
      },
    ],
  },
  search: {
    intro: {
      zh: "搜索类 server 都能给 AI 联网能力，区别在「偏语义检索」还是「偏问答带引用」。",
      en: "Search servers all give web access; they differ between semantic retrieval and cited Q&A.",
    },
    picks: [
      {
        when: { zh: "要语义搜网页并抓正文（做研究/找竞品）", en: "Semantic web search + content (research / competitors)" },
        pick: { zh: "选 Exa —— 语义搜索 + 内容抓取", en: "Pick Exa — semantic search plus retrieval" },
      },
      {
        when: { zh: "要精炼的问答式结果、事实核查", en: "Distilled Q&A-style answers, fact-checking" },
        pick: { zh: "选 Tavily / Perplexity —— 为 AI 优化的问答", en: "Pick Tavily / Perplexity — AI-optimized answers" },
      },
      {
        when: { zh: "在意隐私、要通用网页/新闻搜索", en: "Privacy-focused, general web/news search" },
        pick: { zh: "选 Brave Search", en: "Pick Brave Search" },
      },
    ],
  },
  database: {
    intro: {
      zh: "数据库类先分「关系型 vs 向量库」；向量库都用于 RAG，差别在规模和托管。",
      en: "Database servers split into relational vs. vector; vector stores are all for RAG, differing by scale and hosting.",
    },
    picks: [
      {
        when: { zh: "关系型数据库（查业务数据、跑 SQL）", en: "Relational DB (business data, SQL)" },
        pick: { zh: "选 Supabase / Neon / MongoDB / ClickHouse —— 按你用的库对号入座", en: "Pick Supabase / Neon / MongoDB / ClickHouse — match your DB" },
      },
      {
        when: { zh: "做 RAG、要语义检索记忆", en: "RAG with semantic memory" },
        pick: { zh: "选向量库：Pinecone（规模化托管）/ Qdrant / Chroma（轻量）/ Weaviate", en: "Pick a vector store: Pinecone (scaled) / Qdrant / Chroma (light) / Weaviate" },
      },
    ],
  },
  cloud: {
    intro: {
      zh: "云/运维类基本是「你用哪家云、哪个工具就选哪个官方 server」，按平台对号入座。",
      en: "Cloud/ops servers map to your platform — pick the official server for whatever cloud/tool you use.",
    },
    picks: [
      {
        when: { zh: "监控 / 可观测性", en: "Monitoring / observability" },
        pick: { zh: "Grafana（指标看板）· Dynatrace（根因排障）", en: "Grafana (dashboards) · Dynatrace (root-cause)" },
      },
      {
        when: { zh: "基础设施即代码 / 部署", en: "IaC / deploy" },
        pick: { zh: "Terraform（IaC）· Cloud Run / Netlify / Heroku（部署）", en: "Terraform (IaC) · Cloud Run / Netlify / Heroku (deploy)" },
      },
      {
        when: { zh: "云成本管理（FinOps）", en: "Cloud cost (FinOps)" },
        pick: { zh: "Vantage —— 跨云成本分析", en: "Vantage — multi-cloud cost analysis" },
      },
    ],
  },
};

export function getPickGuide(categorySlug: string | undefined): PickGuide | undefined {
  return categorySlug ? PICK_GUIDES[categorySlug] : undefined;
}
