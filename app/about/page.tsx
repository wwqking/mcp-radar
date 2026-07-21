import type { Metadata } from "next";
import Link from "next/link";
import { EMAIL_CORRECTIONS } from "@/lib/site";

export const metadata: Metadata = {
  title: "关于 —— 评分方法论全公开",
  description:
    "MCP Radar 的 TrustScore 五维权重、数据源、死亡判定规则、更新频率完全公开，不藏黑箱。纯 remotes 型无法审计等边界也主动说明。",
  alternates: { canonical: "/about" },
};

const WEIGHTS = [
  { dim: "维护活跃度", weight: "30%", signals: "最近提交距今、90 天提交数、issue 平均响应、是否 archived" },
  { dim: "采用度", weight: "25%", signals: "GitHub stars 及趋势（权重高于 npm 下载）、npm 周下载趋势、发版频率" },
  { dim: "可用性", weight: "20%", signals: "是否在官方 registry、server.json 规范、能否解析可运行入口" },
  { dim: "健康度", weight: "15%", signals: "open issue/PR 积压比、license 是否明确" },
  { dim: "社区信号", weight: "10%", signals: "贡献者数、fork 活跃度、awesome-list 收录数" },
];

const DATA_SOURCES = [
  { src: "MCP 官方 registry", fields: "清单、repo url、包名、官方 status、发布/更新时间", note: "不给 stars / 活跃度 / 下载量" },
  { src: "GitHub API", fields: "最近提交、90 天提交数、issue 响应、archived、stars、forks、open issues、license、贡献者", note: "" },
  { src: "npm registry", fields: "周下载量、版本发布时间线", note: "低估 GitHub 直装的 server" },
];

export default function AboutPage() {
  return (
    <div className="container-site max-w-3xl py-10 sm:py-14">
      <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-3xl">
        凭什么信这个榜？
      </h1>
      <p className="mt-3 leading-7 text-neutral-600 dark:text-neutral-400">
        因为评分规则、数据来源、判定逻辑全部写在这一页，且每个 server 页都标注了数据来源与抓取时间。
        不藏黑箱——你可以拿着同样的公开数据复核任何一个分数。
      </p>

      {/* 1. 主理人 */}
      <section className="mt-12">
        <h2 className="flex items-center gap-2 text-lg font-bold text-neutral-900 dark:text-neutral-100">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-sm dark:bg-brand-900">👤</span>
          主理人
        </h2>
        <div className="mt-3 rounded-xl border border-neutral-200 p-5 dark:border-neutral-700">
          <p className="leading-7 text-neutral-600 dark:text-neutral-400">
            MCP Radar 由一个长期追踪 AI 工具生态的独立开发者维护。做这个站的原因很简单：
            现有的 MCP 导航只告诉你"有这个工具"，没人告诉你"它是不是还活着"——
            装了一个弃坑的 server，调试半天才发现问题不在自己。这个判断完全可以自动化，于是我们做了，并且完全公开。
          </p>
          <p className="mt-3 text-sm text-neutral-400">
            —— MCP Radar 主理人 <span className="text-neutral-300 dark:text-neutral-600">（品牌署名位，后续可换真名）</span>
          </p>
        </div>
      </section>

      {/* 2. 评分方法论 */}
      <section className="mt-12">
        <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">评分方法论（完全公开）</h2>
        <p className="mt-2 leading-7 text-neutral-600 dark:text-neutral-400">
          TrustScore 满分 100，由五个维度加权得出，全部信号来自公开 API：
        </p>
        <div className="card mt-4 overflow-x-auto p-0">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-left text-xs text-neutral-400 dark:border-neutral-800">
                <th className="px-4 py-3 font-medium">维度</th>
                <th className="px-4 py-3 font-medium">权重</th>
                <th className="px-4 py-3 font-medium">信号字段</th>
              </tr>
            </thead>
            <tbody>
              {WEIGHTS.map((w) => (
                <tr key={w.dim} className="border-b border-neutral-100 last:border-0 dark:border-neutral-800/60">
                  <td className="px-4 py-3 font-medium text-neutral-800 dark:text-neutral-200">{w.dim}</td>
                  <td className="px-4 py-3 font-mono text-brand-600 dark:text-brand-400">{w.weight}</td>
                  <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400">{w.signals}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="mt-8 font-semibold text-neutral-900 dark:text-neutral-100">生命周期判定规则</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {[
            ["🟢", "active", "正常维护"],
            ["🟡", "dying", "最近提交 > 180 天 且 无 issue 响应 且 无新 release"],
            ["⚰️", "dead", "仓库 archived == true"],
            ["⚪", "unverifiable", "纯 remotes 型（无开源仓库/无包），无法审计"],
          ].map(([emoji, name, rule]) => (
            <div key={name} className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-700">
              <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                {emoji} <span className="mono">{name}</span>
              </p>
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{rule}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-sm text-neutral-400">
          「有仓库可审计」作为可用性加分项——纯远程服务无法验证其行为，本身就是风险信号。
        </p>
      </section>

      {/* 3. 数据来源与限制 */}
      <section className="mt-12">
        <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">数据来源与限制</h2>
        <div className="card mt-4 overflow-x-auto p-0">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-left text-xs text-neutral-400 dark:border-neutral-800">
                <th className="px-4 py-3 font-medium">来源</th>
                <th className="px-4 py-3 font-medium">提供字段</th>
                <th className="px-4 py-3 font-medium">已知局限</th>
              </tr>
            </thead>
            <tbody>
              {DATA_SOURCES.map((d) => (
                <tr key={d.src} className="border-b border-neutral-100 last:border-0 dark:border-neutral-800/60">
                  <td className="px-4 py-3 font-medium text-neutral-800 dark:text-neutral-200">{d.src}</td>
                  <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400">{d.fields}</td>
                  <td className="px-4 py-3 text-amber-600 dark:text-amber-400">{d.note || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-neutral-400">更新频率：健康数据每日增量扫描，每周全量 diff（雷达页数据来源）。</p>
        <div className="mt-4 rounded-lg bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800 dark:bg-amber-950/50 dark:text-amber-200">
          <strong>我们主动认边界：</strong>纯 remotes 型 server 拿不到仓库信号，一律标 unverifiable；
          npm 下载量会低估走 GitHub 直装的 server，所以 stars 权重更高；
          抓取有延迟，个别刚恢复维护的项目可能仍被短暂标为 dying——这正是我们开放更正通道的原因。
        </div>
      </section>

      {/* 4. 利益披露 */}
      <section className="mt-12">
        <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">利益披露</h2>
        <p className="mt-2 leading-7 text-neutral-600 dark:text-neutral-400">
          本站接受详情页赞助展示位（页面明确标注「赞助」），但
          <strong className="text-neutral-900 dark:text-neutral-100">排名、评分、分类绝不接受任何形式的竞价</strong>。
          赞助只能买到展示位，买不到分数。一旦接受排名竞价，独家数据的可信度就会崩塌——那是这个站的地基，不卖。
        </p>
        <Link href="/sponsor" className="link-accent mt-2 inline-block text-sm font-medium">
          查看赞助规则 →
        </Link>
      </section>

      {/* 5. 更正与申诉通道 */}
      <section className="mt-12 rounded-xl border border-neutral-200 p-6 dark:border-neutral-700">
        <h2 className="font-bold text-neutral-900 dark:text-neutral-100">数据更正 / 死亡判定申诉</h2>
        <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
          维护者认为某个 server 的评分或判定有误（例如已恢复维护、仓库迁移）？
          提供仓库地址与说明，我们人工复核后 48 小时内更新：
          <span className="mono"> {EMAIL_CORRECTIONS}</span>
        </p>
      </section>
    </div>
  );
}
