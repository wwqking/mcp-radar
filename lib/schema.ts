// schema.org 结构化数据构造器 —— 集中生成 JSON-LD，供各页注入。
// 利于 Google 富结果 + AI 引擎（GEO）理解站点实体与内容。

import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, absoluteUrl } from "./site";

/** 站点组织实体（全站注入一次） */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    logo: absoluteUrl("/opengraph-image"),
  };
}

/** WebSite + 站内搜索动作（让 Google 展示站点搜索框） */
export function webSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: "zh-CN",
    potentialAction: {
      "@type": "SearchAction",
      // 站内搜索是即时前端搜索，这里指向首页并带 query 参数占位（GEO/SEO 惯例）
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
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
