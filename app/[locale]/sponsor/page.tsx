import type { Metadata } from "next";
import { EMAIL_SPONSOR } from "@/lib/site";

export const metadata: Metadata = {
  title: "赞助 —— 排名绝不出售，展示位明码标价",
  description: "MCP Radar 的赞助规则：评分与排名只由公开数据决定，赞助只能获得明确标注的展示位。",
  alternates: { canonical: "/sponsor" },
};

export default function SponsorPage() {
  return (
    <div className="container-site max-w-3xl py-10 sm:py-14">
      {/* 公信力声明（最重要，放最前） */}
      <div className="rounded-xl border-2 border-brand-600 bg-brand-50 p-6 dark:border-brand-500 dark:bg-brand-950/40 sm:p-8">
        <h1 className="text-xl font-extrabold leading-snug text-brand-900 dark:text-brand-100 sm:text-2xl">
          我们的排名与评分只由公开数据决定。
          <br />
          赞助只能获得详情页明确标注的展示位，
          <br />
          永远不影响任何 server 的 TrustScore 或榜单位置。
        </h1>
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">受众</h2>
        <p className="mt-2 leading-7 text-neutral-600 dark:text-neutral-400">
          MCP Radar 的读者是正在为项目选型 MCP server 的开发者与技术负责人——
          正是评估开发工具、云服务与 AI 产品的决策人群。
        </p>
        <p className="mt-2 text-sm text-neutral-400">（订阅数与访问量数据在有量后公开。）</p>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">赞助形式</h2>
        <div className="mt-4 space-y-4">
          {[
            {
              name: "Newsletter 位",
              desc: "周刊内一条明确标注「赞助」的推荐位，触达订阅开发者。",
              price: "询价",
            },
            {
              name: "详情页展示位",
              desc: "同类目详情页侧栏展示位，页面标注「赞助」，不影响该页 server 的任何评分。",
              price: "询价",
            },
            {
              name: "指南冠名",
              desc: "深度选型指南的冠名合作，内容独立性由我方保留。",
              price: "询价",
            },
          ].map((f) => (
            <div key={f.name} className="card flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-neutral-800 dark:text-neutral-200">{f.name}</p>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{f.desc}</p>
              </div>
              <span className="shrink-0 rounded-lg border border-brand-600 px-4 py-1.5 text-sm font-medium text-brand-700 dark:border-brand-500 dark:text-brand-300">
                {f.price}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-xl bg-neutral-100 p-6 dark:bg-neutral-800/50">
        <h2 className="font-bold text-neutral-900 dark:text-neutral-100">联系方式</h2>
        <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
          有意赞助或索取媒体资料，请邮件联系：<span className="mono">{EMAIL_SPONSOR}</span>
        </p>
      </section>
    </div>
  );
}
