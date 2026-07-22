import Link from "next/link";
import type { Locale } from "@/lib/i18n/locales";
import { localizedHref } from "@/lib/i18n/href";

interface Props {
  title: string;
  locale: Locale;
}

/** 会员墙：挡住剩余内容，引导订阅会员 */
export default function Paywall({ title, locale }: Props) {
  const en = locale === "en";
  return (
    <div className="relative mt-2">
      {/* 渐隐遮罩 */}
      <div className="pointer-events-none absolute -top-24 left-0 h-24 w-full bg-gradient-to-b from-transparent to-canvas-light dark:to-canvas-dark" />
      <div className="card border-brand-300 p-8 text-center dark:border-brand-800">
        <p className="text-3xl">🔒</p>
        <h3 className="mt-3 text-lg font-bold text-neutral-900 dark:text-neutral-100">
          {en ? `The full “${title}” is for members` : `《${title}》的完整内容对订阅会员开放`}
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-500 dark:text-neutral-400">
          {en
            ? "Members unlock all in-depth guides (including due-diligence checklist templates, observability schemas and other downloadable assets), plus the weekly radar newsletter."
            : "会员可解锁全部深度指南（含尽调清单模板、可观测性 schema 等可下载资产），同时包含每周雷达周刊。"}
        </p>
        <Link
          href={localizedHref(locale, "/newsletter")}
          className="mt-5 inline-block rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
        >
          {en ? "Become a member →" : "成为会员 →"}
        </Link>
        <p className="mt-3 text-xs text-neutral-400">
          {en ? "Already subscribed? Sign in to see the full text." : "已订阅？登录后立即显示全文。"}
        </p>
      </div>
    </div>
  );
}
