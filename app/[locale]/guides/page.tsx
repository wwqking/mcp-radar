import type { Metadata } from "next";
import Link from "next/link";
import { getAllGuides } from "@/lib/guides";

export const metadata: Metadata = {
  title: "指南 —— MCP 选型与落地的深度内容",
  description: "MCP server 尽调清单、安全红线、self-host 决策、生产环境清单。免费指南建立认知，会员指南提供模板与清单。",
  alternates: { canonical: "/guides" },
};

export default function GuidesPage() {
  const guides = getAllGuides();

  return (
    <div className="container-site max-w-4xl py-10 sm:py-14">
      <header className="mb-8">
        <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-3xl">
          指南
        </h1>
        <p className="mt-2 max-w-2xl text-neutral-600 dark:text-neutral-400">
          不是教程搬运，是从全站健康数据里反推出来的判断。免费指南建立认知，会员指南给你可直接用的清单与模板。
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {guides.map((g) => (
          <Link key={g.slug} href={`/guides/${g.slug}`} className="card group flex flex-col gap-3 p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <span className="text-2xl">{g.icon}</span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  g.tier === "member"
                    ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                    : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                }`}
              >
                {g.tier === "member" ? "会员" : "免费"}
              </span>
            </div>
            <h2 className="text-base font-bold leading-snug text-neutral-900 group-hover:text-brand-700 dark:text-neutral-100 dark:group-hover:text-brand-300">
              {g.title}
            </h2>
            <p className="flex-1 text-sm leading-6 text-neutral-500 dark:text-neutral-400">{g.excerpt}</p>
            <p className="text-xs text-neutral-400">
              {g.publishedAt} · 约 {g.readingMinutes} 分钟
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
