import type { Metadata } from "next";
import SubscribeInline from "@/components/SubscribeInline";

export const metadata: Metadata = {
  title: "订阅 —— 每周 5 分钟看完 MCP 生态",
  description: "每周一封：新增 server、爆火趋势、弃坑预警。引擎自动追踪，人工筛选后直达邮箱。",
  alternates: { canonical: "/newsletter" },
};

export default function NewsletterPage() {
  return (
    <div className="container-site max-w-3xl py-10 sm:py-16">
      <div className="text-center">
        <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-4xl">
          每周一封，5 分钟看完
          <br />
          MCP 生态发生了什么。
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-neutral-600 dark:text-neutral-400">
          新增 server、爆火趋势、弃坑预警 —— 引擎每周自动扫描全生态，人工筛选后发到你邮箱。
        </p>
      </div>

      {/* 样例展示 */}
      <div className="card mt-10 p-6 sm:p-8">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-neutral-400">过往周刊样例</p>
        <div className="space-y-4 rounded-lg border border-neutral-100 bg-neutral-50/50 p-5 dark:border-neutral-800 dark:bg-neutral-800/30">
          <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">MCP Radar Weekly #42</p>
          <div className="space-y-3 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
            <p>🔥 <strong>本周爆火</strong>：figma-developer-mcp 单周 +260 ⭐，设计转代码场景持续升温</p>
            <p>🆕 <strong>值得关注的新面孔</strong>：Linear 官方 server 上线，Issue 管理体验一流</p>
            <p>⚰️ <strong>弃坑预警</strong>：docker-mcp-toolkit 仓库 archived，曾有 2.1k ⭐，请迁移替代方案</p>
            <p>📊 <strong>数据一隅</strong>：本周全生态新增 23 个 server，弃坑率 11%（与上月持平）</p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <SubscribeInline />
      </div>

      {/* 免费 / 会员 两档 */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="card flex flex-col p-6">
          <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">免费周刊</p>
          <p className="mt-1 text-3xl font-extrabold text-neutral-900 dark:text-neutral-50">¥0</p>
          <ul className="mt-4 flex-1 space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
            <li>✓ 每周雷达周刊（新增 / 爆火 / 弃坑预警）</li>
            <li>✓ 全部免费指南</li>
            <li>✓ RSS / JSON Feed</li>
          </ul>
          <form className="mt-5">
            <input
              type="email"
              required
              placeholder="you@example.com"
              className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-500 dark:border-neutral-700 dark:bg-neutral-900"
            />
            <button className="mt-2 w-full rounded-lg border border-brand-600 py-2.5 text-sm font-medium text-brand-700 hover:bg-brand-50 dark:border-brand-500 dark:text-brand-300 dark:hover:bg-brand-950">
              免费订阅
            </button>
          </form>
        </div>

        <div className="card relative flex flex-col border-2 border-brand-600 p-6 dark:border-brand-500">
          <span className="absolute -top-3 left-4 rounded-full bg-brand-600 px-2.5 py-0.5 text-xs font-semibold text-white">
            推荐
          </span>
          <p className="text-sm font-semibold text-brand-700 dark:text-brand-300">会员</p>
          <p className="mt-1 text-3xl font-extrabold text-neutral-900 dark:text-neutral-50">
            ¥29<span className="text-base font-normal text-neutral-400"> / 月</span>
          </p>
          <ul className="mt-4 flex-1 space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
            <li>✓ 免费档全部内容</li>
            <li>✓ 全部深度指南（尽调清单 / 生产检查单）</li>
            <li>✓ 可下载模板与 schema 资产</li>
            <li>✓ 新指南第一时间推送</li>
          </ul>
          <button className="mt-5 w-full rounded-lg bg-brand-600 py-2.5 text-sm font-medium text-white hover:bg-brand-700">
            成为会员 →
          </button>
          <p className="mt-2 text-center text-xs text-neutral-400">随时取消 · 支付接入后开放</p>
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-10 space-y-4">
        {[
          ["多久一封？", "每周一封，周一发出。不刷屏，不多发。"],
          ["怎么退订？", "每封邮件底部一键退订，立即生效。"],
          ["数据会卖吗？", "不会。邮箱只用于发送周刊，永不出售或共享。"],
        ].map(([q, a]) => (
          <div key={q} className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-700">
            <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">{q}</p>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
