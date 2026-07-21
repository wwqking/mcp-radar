// 客户端安全的常量与纯函数（无 Node 依赖、无数据源导入）。
// 客户端组件（"use client"）应从这里 import，避免把服务端采集代码拖进浏览器 bundle。

import type { Category, Lifecycle } from "./types";

export const CATEGORIES: Category[] = [
  { slug: "database", name: "数据库 / 数据", tagline: "让 AI 连接你的数据库", icon: "🗄️", description: "连接 PostgreSQL、MySQL、SQLite、Redis 等数据库与数据平台的 MCP server，让 AI 直接查询、分析你的数据。" },
  { slug: "browser", name: "浏览器 / 网页", tagline: "让 AI 操作浏览器、抓取网页", icon: "🌐", description: "网页抓取、浏览器自动化、页面交互类 MCP server。" },
  { slug: "files", name: "文件 / 文档", tagline: "读写本地文件与文档", icon: "📁", description: "文件系统、PDF、办公文档读写类 MCP server。" },
  { slug: "search", name: "搜索 / 知识", tagline: "联网搜索与知识检索", icon: "🔍", description: "搜索引擎、知识库、RAG 检索类 MCP server。" },
  { slug: "dev", name: "开发 / 代码", tagline: "代码托管、CI 与研发工具", icon: "🛠️", description: "GitHub、GitLab、CI/CD、代码分析等研发协作类 MCP server。" },
  { slug: "comms", name: "通讯 / 协作", tagline: "消息、邮件与团队协作", icon: "💬", description: "Slack、邮件、日历、IM 类 MCP server。" },
  { slug: "cloud", name: "云 / DevOps", tagline: "云平台与基础设施操作", icon: "☁️", description: "AWS、Kubernetes、监控告警等基础设施类 MCP server。" },
  { slug: "ai", name: "AI / 模型", tagline: "模型调用与 AI 能力扩展", icon: "🤖", description: "接入各类模型服务、向量数据库、AI 工具的 MCP server。" },
  { slug: "commerce", name: "支付 / 商业", tagline: "支付、电商与商业数据", icon: "💳", description: "Stripe、支付、电商与商业数据类 MCP server。" },
  { slug: "misc", name: "其他", tagline: "尚未归类的 MCP server", icon: "📦", description: "其他暂未明确分类的 MCP server。" },
];

export function formatNumber(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  return n.toLocaleString();
}

export function formatDate(iso: string): string {
  return iso;
}

export const LIFECYCLE_META: Record<Lifecycle, { label: string; emoji: string; colorClass: string; dotClass: string }> = {
  active: { label: "活跃", emoji: "🟢", colorClass: "text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-300 dark:bg-emerald-950 dark:border-emerald-800", dotClass: "bg-emerald-500" },
  dying: { label: "半年未更新", emoji: "🟡", colorClass: "text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-300 dark:bg-amber-950 dark:border-amber-800", dotClass: "bg-amber-500" },
  dead: { label: "已弃坑", emoji: "⚰️", colorClass: "text-red-700 bg-red-50 border-red-200 dark:text-red-300 dark:bg-red-950 dark:border-red-800", dotClass: "bg-red-500" },
  unverifiable: { label: "无法审计", emoji: "⚪", colorClass: "text-neutral-600 bg-neutral-100 border-neutral-300 dark:text-neutral-400 dark:bg-neutral-800 dark:border-neutral-700", dotClass: "bg-neutral-400" },
};
