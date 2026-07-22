"use client";

import { useState } from "react";
import type { RadarBuckets } from "@/lib/provider";
import ServerCard from "@/components/ServerCard";
import SubscribeInline from "@/components/SubscribeInline";
import SourceMethodNote from "@/components/SourceMethodNote";

const PERIODS = ["本周", "上周", "历史"] as const;

interface Props {
  entries: RadarBuckets;
  lastUpdated: string;
}

/** 雷达页交互层：时间切换 + 分享按钮。数据由服务端父组件 fetch 后传入。 */
export default function RadarView({ entries, lastUpdated }: Props) {
  const [period, setPeriod] = useState<(typeof PERIODS)[number]>("本周");
  const { trending, added, dead } = entries;

  const sections = [
    {
      key: "trending",
      title: "🔥 爆火",
      desc: "stars / 下载周环比涨幅榜",
      entries: trending,
    },
    {
      key: "new",
      title: "🆕 新增",
      desc: "本周首次进 registry 的 server",
      entries: added,
    },
    {
      key: "dead",
      title: "⚰️ 死亡 / 濒危",
      desc: "新判定 dead / dying，附判定依据",
      entries: dead,
    },
  ];

  return (
    <div className="container-site py-10 sm:py-14">
      <header className="mb-8">
        <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-3xl">
          趋势雷达
        </h1>
        <p className="mt-2 max-w-2xl text-neutral-600 dark:text-neutral-400">
          本周 MCP 生态发生了什么。每个变化都有可解释的依据——涨了多少、为什么判死，全都写明。
        </p>
        <SourceMethodNote className="mt-3" sources={["引擎每周 diff 扫描"]} updatedAt={lastUpdated} />
      </header>

      {/* 时间切换 */}
      <div className="mb-8 flex rounded-lg border border-neutral-200 p-0.5 dark:border-neutral-700 w-fit">
        {PERIODS.map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`rounded-md px-4 py-1.5 text-sm ${
              period === p
                ? "bg-brand-600 text-white"
                : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {period !== "本周" && (
        <p className="mb-8 rounded-lg bg-neutral-100 px-4 py-2.5 text-sm text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
          {period === "上周" ? "上周" : "历史"}数据为演示占位 —— 接引擎周报 diff 后展示真实历史。
        </p>
      )}

      <div className="space-y-12">
        {sections.map((sec, idx) => (
          <section key={sec.key}>
            <div className="mb-4">
              <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">{sec.title}</h2>
              <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">{sec.desc}</p>
            </div>
            {sec.entries.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {sec.entries.map((e) => (
                  <div key={e.server.slug} className="relative">
                    <ServerCard server={e.server} evidence={e.evidence} />
                    {/* 分享按钮 */}
                    <button
                      title="分享（生成带数字的分享图）"
                      onClick={() => {
                        const text = `${e.server.name} — ${e.evidence} | MCP Radar`;
                        navigator.clipboard?.writeText(text).catch(() => {});
                      }}
                      className="absolute right-3 top-3 rounded-md bg-white/80 p-1.5 text-neutral-400 opacity-0 shadow-sm transition-opacity hover:text-brand-600 [div:hover>&]:opacity-100 dark:bg-neutral-900/80"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="rounded-lg border border-dashed border-neutral-200 py-8 text-center text-sm text-neutral-400 dark:border-neutral-700">
                本周暂无{sec.title.slice(2)}变化。
              </p>
            )}

            {/* 列表中部订阅钩子 */}
            {idx === 0 && (
              <div className="mt-8">
                <SubscribeInline variant="compact" />
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
