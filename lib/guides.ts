// 指南内容层。深度内容静态写在仓库里（SSG），后续可迁移到 CMS。
// 结构与文本分离：本文件放语言无关的结构（slug/tier/icon/日期/时长），
// 可翻译文本（title/excerpt/sections）在 guides.zh.ts / guides.en.ts，按 locale 取，缺英文回退中文。

import type { Locale } from "./i18n/locales";
import { GUIDES_ZH } from "./guides.zh";
import { GUIDES_EN } from "./guides.en";

export interface GuideSection {
  heading: string;
  body: string[];
}

/** 单篇指南的可翻译内容（按 locale 存）。 */
export interface GuideContent {
  title: string;
  excerpt: string;
  sections: GuideSection[];
}

/** 语言无关的结构信息。 */
interface GuideMeta {
  slug: string;
  /** 目前所有指南全文开放；未来如上线真实账号体系再启用 member。 */
  tier: "free" | "member";
  icon: string;
  publishedAt: string;
  modifiedAt: string;
  readingMinutes: number;
  /** best-of 类指南的榜单参数。有这个字段时，页面会在正文里插一张
   *  由 data/servers.json 实时生成的榜单表——榜单不写死在文案里，
   *  因为手写排名会过期，而且没法回答「凭什么是这个顺序」。 */
  ranking?: {
    categories: string[];
    starsFloor: number;
    /** 分类器误判的兜底排除（理由写在 lib/best-of.ts 的注释里）。 */
    exclude?: string[];
    /** 插在第几个 section 之后（0 = 全部正文之前）。 */
    afterSection: number;
  };
}

/** 组装后的指南（结构 + 某语言内容）。 */
export interface Guide extends GuideMeta, GuideContent {
  /** 该 locale 是否有原生翻译（false = 回退到了中文）。 */
  translated: boolean;
}

// 结构注册表：新增指南在这里加一条，再到 guides.zh.ts / guides.en.ts 补内容。
const GUIDE_META: GuideMeta[] = [
  // SEO 承接文（全文免费）：教程词 / 对比词落地，喂搜索流量。
  { slug: "claude-code-mcp-config", tier: "free", icon: "🛠️", publishedAt: "2026-07-23", modifiedAt: "2026-07-28", readingMinutes: 1 },
  { slug: "mcp-proxy-vs-gateway", tier: "free", icon: "🔀", publishedAt: "2026-07-23", modifiedAt: "2026-07-28", readingMinutes: 1 },
  { slug: "choosing-mcp-server", tier: "free", icon: "📋", publishedAt: "2026-07-14", modifiedAt: "2026-07-28", readingMinutes: 2 },
  { slug: "mcp-security-red-lines", tier: "free", icon: "🚨", publishedAt: "2026-07-07", modifiedAt: "2026-07-28", readingMinutes: 3 },
  { slug: "self-host-vs-remote", tier: "free", icon: "⚖️", publishedAt: "2026-06-30", modifiedAt: "2026-07-28", readingMinutes: 2 },
  { slug: "mcp-production-checklist", tier: "free", icon: "🚀", publishedAt: "2026-06-22", modifiedAt: "2026-07-28", readingMinutes: 1 },
  // best-of：榜单由数据生成（见 ranking 字段），正文只写「怎么选」和「怎么读这张表」。
  // 200★ 门槛是实测定的：50★ 时 69 星的新仓库会压过 Stripe 和 Google Analytics。
  {
    slug: "best-mcp-servers-for-business",
    tier: "free", icon: "📈",
    publishedAt: "2026-07-30", modifiedAt: "2026-07-30", readingMinutes: 4,
    ranking: {
      categories: ["marketing", "commerce"],
      starsFloor: 200,
      // 分类器按描述关键词匹配，"unified billing" / "trading" 都撞上了 commerce 规则。
      exclude: ["io-github-mnemox-ai-tradememory-protocol", "io-github-qverisai-mcp"],
      afterSection: 1,
    },
  },
];

function contentFor(slug: string, locale: Locale): { content: GuideContent; translated: boolean } {
  const zh = GUIDES_ZH[slug];
  if (locale === "en") {
    const en = GUIDES_EN[slug];
    if (en) return { content: en, translated: true };
    return { content: zh, translated: false }; // 缺英文 → 回退中文
  }
  return { content: zh, translated: true };
}

function assemble(meta: GuideMeta, locale: Locale): Guide {
  const { content, translated } = contentFor(meta.slug, locale);
  return { ...meta, ...content, translated };
}

export function getAllGuides(locale: Locale): Guide[] {
  return GUIDE_META.map((m) => assemble(m, locale)).sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt),
  );
}

/** slug 列表（generateStaticParams 用，语言无关）。 */
export function getGuideSlugs(): string[] {
  return GUIDE_META.map((m) => m.slug);
}

export function getGuideModifiedAt(slug: string): string | undefined {
  return GUIDE_META.find((m) => m.slug === slug)?.modifiedAt;
}

export function getGuideBySlug(slug: string, locale: Locale): Guide | undefined {
  const meta = GUIDE_META.find((m) => m.slug === slug);
  return meta ? assemble(meta, locale) : undefined;
}
