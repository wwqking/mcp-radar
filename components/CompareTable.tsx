"use client";

import { useEffect, useState } from "react";
import type { MCPServer } from "@/lib/types";
import { formatNumber, lifecycleLabel, LIFECYCLE_META } from "@/lib/constants";
import { getCompare, removeCompare, subscribeCompare } from "@/lib/compare-store";
import { localizedHref } from "@/lib/i18n/href";
import type { Locale } from "@/lib/i18n/locales";

type CompareStrings = Record<string, string>;

interface Props {
  locale: Locale;
  /** 初始（服务端按 URL 解析出的）server 列表 */
  initial: MCPServer[];
  strings: CompareStrings;
}

/** 对比表：列 = server，行 = 指标。支持就地移除（同步到对比栏）。 */
export default function CompareTable({ locale, initial, strings }: Props) {
  // 允许用户在本页移除某列：以 slug 过滤 initial。
  const [visible, setVisible] = useState<string[]>(initial.map((s) => s.slug));

  useEffect(() => {
    // 和全局对比栏保持一致：别人在别处移除时这里也更新
    const sync = () => {
      const store = getCompare();
      // 只保留 initial 里存在且仍在 store 里的
      setVisible(initial.map((s) => s.slug).filter((slug) => store.includes(slug)));
    };
    // 首帧不强制以 store 覆盖（避免直接分享链接被清空）：仅订阅后续变化
    return subscribeCompare(sync);
  }, [initial]);

  const servers = initial.filter((s) => visible.includes(s.slug));
  if (servers.length === 0) return null;

  const daysAgo = (n: number | null) =>
    n === null ? strings.none : n === 0 ? strings.today : strings.daysAgo.replace("{n}", String(n));

  const rows: Array<{ label: string; render: (s: MCPServer) => React.ReactNode }> = [
    {
      label: strings.trustScore,
      render: (s) => <span className="text-lg font-bold text-neutral-900 dark:text-neutral-50">{s.trustScore}</span>,
    },
    {
      label: strings.lifecycle,
      render: (s) => (
        <span className={`inline-block rounded-full border px-2 py-0.5 text-xs ${LIFECYCLE_META[s.lifecycle].colorClass}`}>
          {LIFECYCLE_META[s.lifecycle].emoji} {lifecycleLabel(s.lifecycle, locale)}
        </span>
      ),
    },
    { label: strings.stars, render: (s) => (s.signals.stars > 0 ? formatNumber(s.signals.stars) : strings.none) },
    {
      label: strings.downloads,
      render: (s) => (s.signals.npmWeeklyDownloads !== null ? formatNumber(s.signals.npmWeeklyDownloads) : strings.none),
    },
    { label: strings.lastCommit, render: (s) => daysAgo(s.signals.lastCommitDaysAgo) },
    { label: strings.license, render: (s) => s.signals.license ?? strings.none },
    { label: strings.maintenance, render: (s) => bar(s.breakdown.maintenance) },
    { label: strings.adoption, render: (s) => bar(s.breakdown.adoption) },
    { label: strings.usability, render: (s) => bar(s.breakdown.usability) },
    { label: strings.health, render: (s) => bar(s.breakdown.health) },
    { label: strings.community, render: (s) => bar(s.breakdown.community) },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr>
            <th className="sticky left-0 z-10 bg-canvas-light p-3 text-left align-bottom dark:bg-canvas-dark" />
            {servers.map((s) => (
              <th key={s.slug} className="min-w-[180px] p-3 align-bottom">
                <div className="flex flex-col gap-2">
                  <a
                    href={localizedHref(locale, `/server/${s.slug}`)}
                    className="mono break-all text-left text-sm font-semibold text-brand-700 hover:underline dark:text-brand-300"
                  >
                    {s.name}
                  </a>
                  <p className="text-left text-xs font-normal text-neutral-500 line-clamp-2 dark:text-neutral-400">
                    {s.tagline}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      removeCompare(s.slug);
                      setVisible((v) => v.filter((x) => x !== s.slug));
                    }}
                    className="self-start text-xs text-neutral-400 hover:text-red-500"
                  >
                    × {strings.remove}
                  </button>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-t border-neutral-100 dark:border-neutral-800">
              <td className="sticky left-0 z-10 bg-canvas-light p-3 text-left text-xs font-medium text-neutral-500 dark:bg-canvas-dark dark:text-neutral-400">
                {row.label}
              </td>
              {servers.map((s) => (
                <td key={s.slug} className="p-3 text-neutral-700 dark:text-neutral-200">
                  {row.render(s)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function bar(v: number) {
  const color = v >= 80 ? "bg-emerald-500" : v >= 60 ? "bg-lime-500" : v >= 40 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${v}%` }} />
      </div>
      <span className="text-xs tabular-nums text-neutral-500">{v}</span>
    </div>
  );
}
