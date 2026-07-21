import type { Metadata } from "next";
import Link from "next/link";
import { CATEGORIES, getAllServers, getLastUpdated } from "@/lib/data";
import LeaderboardTable from "@/components/LeaderboardTable";
import SubscribeInline from "@/components/SubscribeInline";

export const metadata: Metadata = {
  title: "MCP server 质量榜 —— 按 TrustScore 排名",
  description:
    "MCP server 权威质量榜。评分基于 GitHub 维护活跃度、npm 采用度、官方 registry 状态等五维公开数据，每日更新，排名绝不出售。",
  alternates: { canonical: "/leaderboard" },
};

export default async function LeaderboardPage() {
  const [servers, lastUpdated] = await Promise.all([getAllServers(), getLastUpdated()]);

  return (
    <div className="container-site py-10 sm:py-14">
      <header className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-3xl">
          MCP server 质量榜
        </h1>
        <p className="mt-2 max-w-2xl text-neutral-600 dark:text-neutral-400">
          按 TrustScore 排名，可被反复引用的 MCP 权威榜。点击任意行展开五维分解。
        </p>
      </header>

      {/* 方法论条（不能省：榜单可信度的锚） */}
      <div className="mb-8 flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg border border-brand-200 bg-brand-50 px-4 py-2.5 text-sm text-brand-900 dark:border-brand-900 dark:bg-brand-950/50 dark:text-brand-100">
        <span>
          评分基于 GitHub 活跃度、npm 采用度、官方 registry 状态。数据每日更新（最近 {lastUpdated}）。
        </span>
        <Link href="/about" className="font-medium underline underline-offset-4">
          方法论 →
        </Link>
      </div>

      <div className="mb-8">
        <SubscribeInline variant="compact" />
      </div>

      <LeaderboardTable servers={servers} categories={CATEGORIES} />
    </div>
  );
}
