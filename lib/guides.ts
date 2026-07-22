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
  /** free = 全文免费；member = 前 30% 免费 + Paywall */
  tier: "free" | "member";
  icon: string;
  publishedAt: string;
  readingMinutes: number;
}

/** 组装后的指南（结构 + 某语言内容）。 */
export interface Guide extends GuideMeta, GuideContent {
  /** 该 locale 是否有原生翻译（false = 回退到了中文）。 */
  translated: boolean;
}

// 结构注册表：新增指南在这里加一条，再到 guides.zh.ts / guides.en.ts 补内容。
const GUIDE_META: GuideMeta[] = [
  { slug: "choosing-mcp-server", tier: "member", icon: "📋", publishedAt: "2026-07-14", readingMinutes: 12 },
  { slug: "mcp-security-red-lines", tier: "free", icon: "🚨", publishedAt: "2026-07-07", readingMinutes: 8 },
  { slug: "self-host-vs-remote", tier: "free", icon: "⚖️", publishedAt: "2026-06-30", readingMinutes: 6 },
  { slug: "mcp-production-checklist", tier: "member", icon: "🚀", publishedAt: "2026-06-22", readingMinutes: 10 },
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

export function getGuideBySlug(slug: string, locale: Locale): Guide | undefined {
  const meta = GUIDE_META.find((m) => m.slug === slug);
  return meta ? assemble(meta, locale) : undefined;
}

/** 会员文免费可见的段落数（约前 30%） */
export function freeSectionCount(guide: Guide): number {
  if (guide.tier === "free") return guide.sections.length;
  return Math.max(1, Math.ceil(guide.sections.length * 0.3));
}
