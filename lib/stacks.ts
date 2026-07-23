// 组合方案（Stack Recipes）：面向一个具体目标，给出「分几步、每步用哪些 server」的一屏选型。
//
// 与选型指南（pick-guide.ts）的区别：pick-guide 是「同类里怎么选」，stack 是「一件事从头到尾要哪几类、
// 每类挑哪个」。每个 stage 引用真实 server slug，渲染时从数据集取活体状态并链到详情页 —— 死掉的 server
// 会当场显示 ⚰️，方案永远是「按现在还活着的东西」拼的。
//
// 只写确有完整链路、且我们数据集里覆盖到的目标；覆盖不全的方案不上，避免拼一半。

export interface StackStage {
  /** 步骤序号标题 */
  title: { zh: string; en: string };
  /** 这一步在解决什么 */
  desc: { zh: string; en: string };
  /** 推荐的 server slug（按数据集），前排为首选 */
  slugs: string[];
}

export interface Stack {
  slug: string;
  icon: string;
  /** 目标标题，用户视角的一句话 */
  title: { zh: string; en: string };
  /** 副标题，说清这套方案覆盖到哪 */
  subtitle: { zh: string; en: string };
  stages: StackStage[];
}

export const STACKS: Stack[] = [
  {
    slug: "indie-store",
    icon: "🏪",
    title: {
      zh: "我要开一个独立站",
      en: "I want to launch an online store",
    },
    subtitle: {
      zh: "从建站到卖货的一整套 MCP：让 AI 帮你搭店、收款、拉流量、管客户。",
      en: "A full MCP stack from storefront to sales — let AI build the store, take payments, drive traffic and manage customers.",
    },
    stages: [
      {
        title: { zh: "① 建站 / 开店", en: "① Build the store" },
        desc: {
          zh: "选一个店铺/建站底座，管商品、页面和订单。",
          en: "Pick a storefront/site base to manage products, pages and orders.",
        },
        slugs: ["shopify-mcp", "mcp-wordpress-remote", "webflow-mcp-server"],
      },
      {
        title: { zh: "② 收款 / 结算", en: "② Take payments" },
        desc: {
          zh: "接支付网关收钱，做一次性或订阅计费。",
          en: "Wire up a payment gateway for one-off or subscription billing.",
        },
        slugs: ["stripe-mcp", "paypal-mcp", "paddle-paddle-mcp"],
      },
      {
        title: { zh: "③ 营销 / 拉流量", en: "③ Marketing & traffic" },
        desc: {
          zh: "邮件触达、SEO 排名、投放广告 —— 让人找得到、留得住。",
          en: "Email, SEO and ads — get found, get remembered.",
        },
        slugs: ["resend-mcp", "dataforseo-mcp-server", "meta-ads-mcp"],
      },
      {
        title: { zh: "④ 分析 / 客户管理", en: "④ Analytics & CRM" },
        desc: {
          zh: "看流量转化、沉淀客户，把一次买家变回头客。",
          en: "Track conversion and keep customers — turn buyers into regulars.",
        },
        slugs: ["google-analytics-mcp", "mcp-hubspot"],
      },
    ],
  },
];

export function getStackBySlug(slug: string): Stack | undefined {
  return STACKS.find((s) => s.slug === slug);
}
