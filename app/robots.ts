import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

// GEO：明确允许主流 AI 爬虫（内容被 ChatGPT/Claude/Perplexity/Gemini 引用的前提）。
// 我们希望被 AI 引擎抓取和引用——独家健康数据正是它们回答「X mcp server 靠谱吗」时想要的。
const AI_CRAWLERS = [
  "GPTBot", // OpenAI 训练
  "OAI-SearchBot", // ChatGPT 搜索
  "ChatGPT-User", // ChatGPT 浏览
  "ClaudeBot", // Anthropic 训练
  "Claude-Web", // Claude 浏览
  "anthropic-ai",
  "PerplexityBot", // Perplexity
  "Perplexity-User",
  "Google-Extended", // Gemini / AI Overviews
  "Applebot-Extended", // Apple Intelligence
  "CCBot", // Common Crawl（多数模型语料来源）
  "Bytespider",
  "Amazonbot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      // 显式列出 AI 爬虫并全部放行（有些默认策略会拦，明示放行表明我们欢迎被引用）
      ...AI_CRAWLERS.map((ua) => ({ userAgent: ua, allow: "/" })),
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
