// 自动分类 —— registry 无分类字段，用 name + description 关键词规则打标（设计文档 §3）。
// 按「能帮我做什么」分，可多分类。命不中归 misc。

const RULES: Array<{ cat: string; kw: RegExp }> = [
  { cat: "database", kw: /\b(postgres|mysql|mariadb|sqlite|mongo|redis|database|db|sql|supabase|clickhouse|duckdb|neo4j|vector\s?db)\b/i },
  { cat: "browser", kw: /\b(browser|playwright|puppeteer|chrome|scrape|scraping|crawl|fetch|web\s?page|firecrawl|selenium)\b/i },
  { cat: "files", kw: /\b(filesystem|file\s?system|pdf|docx?|document|excel|spreadsheet|markdown|file)\b/i },
  { cat: "search", kw: /\b(search|retrieval|rag|knowledge|index|brave|exa|tavily|perplexity|elastic)\b/i },
  { cat: "dev", kw: /\b(github|gitlab|git\b|ci\/cd|jenkins|code|repository|repo|sentry|linear|jira|issue|pull\s?request|figma)\b/i },
  { cat: "comms", kw: /\b(slack|email|gmail|calendar|discord|telegram|teams|notion|message|chat|mail)\b/i },
  { cat: "cloud", kw: /\b(aws|gcp|azure|kubernetes|k8s|docker|cloudflare|terraform|devops|deploy|infra|monitoring)\b/i },
  { cat: "ai", kw: /\b(openai|anthropic|llm|model|embedding|qdrant|pinecone|weaviate|memory|agent|inference|ml)\b/i },
  { cat: "commerce", kw: /\b(stripe|payment|shopify|paypal|paddle|invoice|billing|ecommerce|commerce|checkout|subscription|woocommerce|webflow|wordpress|storefront|store)\b/i },
  { cat: "marketing", kw: /\b(marketing|seo|ads?|advertis|analytics|campaign|newsletter|resend|mailchimp|klaviyo|hubspot|crm|dataforseo|meta[-\s]?ads|google[-\s]?analytics|conversion|audience)\b/i },
];

/** 返回命中的分类 slug 数组；无命中返回 ["misc"] */
export function classify(name: string, description: string): string[] {
  const text = `${name} ${description}`;
  const hits: string[] = [];
  for (const { cat, kw } of RULES) {
    if (kw.test(text)) hits.push(cat);
  }
  return hits.length > 0 ? hits : ["misc"];
}
