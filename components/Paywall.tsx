import Link from "next/link";

interface Props {
  title: string;
}

/** 会员墙：挡住剩余内容，引导订阅会员 */
export default function Paywall({ title }: Props) {
  return (
    <div className="relative mt-2">
      {/* 渐隐遮罩 */}
      <div className="pointer-events-none absolute -top-24 left-0 h-24 w-full bg-gradient-to-b from-transparent to-canvas-light dark:to-canvas-dark" />
      <div className="card border-brand-300 p-8 text-center dark:border-brand-800">
        <p className="text-3xl">🔒</p>
        <h3 className="mt-3 text-lg font-bold text-neutral-900 dark:text-neutral-100">
          《{title}》的完整内容对订阅会员开放
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-500 dark:text-neutral-400">
          会员可解锁全部深度指南（含尽调清单模板、可观测性 schema 等可下载资产），
          同时包含每周雷达周刊。
        </p>
        <Link
          href="/newsletter"
          className="mt-5 inline-block rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
        >
          成为会员 →
        </Link>
        <p className="mt-3 text-xs text-neutral-400">已订阅？登录后立即显示全文。</p>
      </div>
    </div>
  );
}
