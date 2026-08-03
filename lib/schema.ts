// schema.org 结构化数据构造器 —— 集中生成 JSON-LD，供各页注入。
// 利于 Google 富结果 + AI 引擎（GEO）理解站点实体与内容。

import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, absoluteUrl } from "./site";
import { LOCALE_HTML_LANG, type Locale } from "./i18n/locales";

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/** 站点组织实体（全站注入一次） */
export function organizationSchema(
  locale: Locale = "en",
  description = SITE_DESCRIPTION,
) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: SITE_NAME,
    url: SITE_URL,
    description,
    inLanguage: LOCALE_HTML_LANG[locale],
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/icon"),
    },
    sameAs: ["https://github.com/wwqking/mcp-radar"],
    knowsAbout: [
      "Model Context Protocol",
      "MCP servers",
      "open-source software maintenance",
      "developer tools",
    ],
  };
}

/** WebSite 实体。站内搜索目前是前端即时搜索，不声明不可落地的 SearchAction。 */
export function webSiteSchema(
  locale: Locale = "en",
  description = SITE_DESCRIPTION,
) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: SITE_NAME,
    url: SITE_URL,
    description,
    inLanguage: LOCALE_HTML_LANG[locale],
    publisher: { "@id": ORGANIZATION_ID },
  };
}

/** FAQ 结构化数据 —— 支柱页/详情页的 FAQ 区，命中 Google 富结果 + 喂 AI 引擎（GEO）。 */
export function faqSchema(items: Array<{ q: string; a: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
}

/** 面包屑（详情页 / 分类页），items 为 [{name, path}] */
export function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}
