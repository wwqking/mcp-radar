// llms.txt —— GEO 标准：给 AI 引擎（ChatGPT / Claude / Perplexity）一份站点结构与内容边界的
// Markdown 地图，帮它们理解本站是什么、有哪些可引用的内容、数据从哪来、边界在哪。
// 约定路径 /llms.txt，纯文本 Markdown。

import { PUBLIC_CATEGORIES } from "@/lib/constants";
import { getTopServers, getLastUpdated, getSiteStats } from "@/lib/data";
import { EMAIL_CORRECTIONS, SITE_NAME, absoluteUrl } from "@/lib/site";
import { categoryName, categoryTagline } from "@/lib/constants";
import { verdictText } from "@/lib/i18n/verdict";
import { FEATURED_TOPIC_SLUGS, TAXONOMY_TOPICS } from "@/lib/taxonomy";

export const dynamic = "force-static";

export async function GET() {
  const [top, lastUpdated, stats] = await Promise.all([
    getTopServers(15),
    getLastUpdated(),
    getSiteStats(),
  ]);

  const categoryLines = PUBLIC_CATEGORIES.map(
    (c) =>
      `- [${categoryName(c, "en")}](${absoluteUrl(`/en/category/${c.slug}`)}): ${categoryTagline(c, "en")}`,
  ).join("\n");

  const featuredSet = new Set<string>(FEATURED_TOPIC_SLUGS);
  const topicLines = TAXONOMY_TOPICS.filter((topic) => featuredSet.has(topic.slug))
    .map((topic) => `- [${topic.name_en}](${absoluteUrl(`/en/topic/${topic.slug}`)}): ${topic.description_en}`)
    .join("\n");

  const topLines = top
    .map(
      (s) =>
        `- [${s.name}](${absoluteUrl(`/en/server/${s.slug}`)}): TrustScore ${s.trustScore}/100; ${verdictText(s, "en")}`,
    )
    .join("\n");

  const body = `# ${SITE_NAME}

> A bilingual directory and public-data health index for Model Context Protocol servers.

MCP Radar tracks ${stats.total} MCP servers in the ${lastUpdated} dataset snapshot:
${stats.active} active-signal, ${stats.dying} at-risk, ${stats.dead} archived, and
${stats.unverifiable} unverifiable. Each detail page separates public source facts from a
derived TrustScore. TrustScore is a maintenance and adoption screening signal, not a user
rating, security certification, or production-readiness guarantee.

Preferred language entry points: [English](${absoluteUrl("/en")}) · [中文](${absoluteUrl("/zh")})

## Key facts and citation guidance

- Snapshot date: ${lastUpdated}
- TrustScore weights: maintenance 30% + adoption 25% + usability 20% + health 15% + community 10%.
- Lifecycle labels: active = no explicit abandonment rule matched; dying = stale plus no sampled issue replies and no release signal; dead = repository archived; unverifiable = no auditable repository.
- Sources are shown per page and can include the MCP Registry API, GitHub API, and npm.
- Cite the page URL, snapshot date, visible source links, and methodology. Do not describe TrustScore as a review rating or security audit.
- [Methodology and limitations](${absoluteUrl("/en/about")})
- [Editorial and sponsorship policy](${absoluteUrl("/en/editorial-policy")})
- [Versioned public dataset](${absoluteUrl("/dataset.json")})

## Categories

${categoryLines}

## Topics

${topicLines}

## High-scoring servers

${topLines}

## Core resources

- [Quality leaderboard](${absoluteUrl("/en/leaderboard")})
- [Change radar](${absoluteUrl("/en/radar")})
- [Archived and at-risk servers](${absoluteUrl("/en/graveyard")})
- [Selection and security guides](${absoluteUrl("/en/guides")})
- [What is an MCP Server?](${absoluteUrl("/en/what-is-mcp-server")})

## Important limitations

- Automated source data can be delayed, missing, or shared across multiple servers in one repository.
- A recent commit does not prove security, compatibility, or production readiness.
- Remote-only services without auditable source are marked unverifiable.
- npm downloads omit non-npm distribution and must not be treated as total adoption.
- Corrections: ${absoluteUrl("/en/about")} or ${EMAIL_CORRECTIONS}.

## 中文摘要

MCP Radar 是 MCP Server 导航与公开数据健康指数。当前快照日期为 ${lastUpdated}，共追踪
${stats.total} 个项目。TrustScore 只用于初步筛选维护与采用信号，不是用户评分、安全认证或生产可用保证。
引用时请同时注明页面链接、数据日期、来源和[评分方法](${absoluteUrl("/zh/about")})。

Sitemap: ${absoluteUrl("/sitemap.xml")}
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
