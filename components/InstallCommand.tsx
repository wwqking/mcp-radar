"use client";

import { useState } from "react";
import type { InstallCommand } from "@/lib/install";

interface Props {
  commands: InstallCommand[];
  title: string;
  note: string;
  copyLabel: string;
  copiedLabel: string;
}

/** 安装命令卡片：多形态 tab 切换 + 一键复制。 */
export default function InstallCommandCard({ commands, title, note, copyLabel, copiedLabel }: Props) {
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);

  const current = commands[active] ?? commands[0];

  async function copy() {
    try {
      await navigator.clipboard.writeText(current.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // 复制失败（无剪贴板权限）：静默，用户仍可手动选中
    }
  }

  return (
    <section className="card mt-6 p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{title}</h2>
        <div className="flex gap-1">
          {commands.map((c, i) => (
            <button
              key={c.label}
              type="button"
              onClick={() => {
                setActive(i);
                setCopied(false);
              }}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                i === active
                  ? "bg-brand-600 text-white"
                  : "text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="group relative">
        <pre className="mono overflow-x-auto rounded-lg bg-neutral-900 p-4 pr-20 text-xs leading-6 text-neutral-100 dark:bg-neutral-950">
          <code>{current.code}</code>
        </pre>
        <button
          type="button"
          onClick={copy}
          className="absolute right-2 top-2 rounded-md border border-neutral-600 bg-neutral-800 px-2.5 py-1 text-xs font-medium text-neutral-200 hover:bg-neutral-700"
        >
          {copied ? copiedLabel : copyLabel}
        </button>
      </div>

      <p className="mt-2 text-xs text-neutral-400">{note}</p>
    </section>
  );
}
