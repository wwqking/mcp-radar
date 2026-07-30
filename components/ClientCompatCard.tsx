import type { ClientCompat } from "@/lib/types";

interface Props {
  compat: ClientCompat[];
  /** 沙箱实测结果。有就渲染真实工具列表——这是竞品抄不走的部分。 */
  verified?: { verifiedAt: string; startupMs: number | null; tools: string[] };
  strings: {
    compatTitle: string;
    viaStdio: string;
    viaRemote: string;
    derivedNote: string;
    verifiedNote: string;
    toolsTitle: string;
    verifiedOn: string;
  };
}

/** 客户端展示名。key 与 collector/client-compat.ts 的 KNOWN_CLIENTS 一致。 */
const CLIENT_LABEL: Record<string, string> = {
  "claude-desktop": "Claude Desktop",
  "claude-code": "Claude Code",
  cursor: "Cursor",
  vscode: "VS Code",
  windsurf: "Windsurf",
};

/** 「能接哪些客户端」——从 registry manifest 的包类型和 transport 推出来的。
 *
 *  为什么要把 basis 显式写在页面上：derived 是「按声明推的，没人真跑过」，
 *  verified 是「沙箱里装过起过」。这两者的可信度差很远，混在一起展示
 *  等于向用户暗示我们验证过实际没验的东西。标注成本几乎为零，所以没有理由不标。 */
export default function ClientCompatCard({ compat, verified, strings }: Props) {
  if (!compat.length) return null;

  // 全部 derived 时给一句整体说明；一旦有 verified 的就按条标，避免以偏概全。
  const allDerived = compat.every((c) => c.basis === "derived");

  return (
    <section className="card mt-6 p-5">
      <h2 className="mb-3 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
        {strings.compatTitle}
      </h2>

      <ul className="flex flex-wrap gap-2">
        {compat.map((c) => (
          <li
            key={c.client}
            className="flex items-center gap-1.5 rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-700 dark:border-neutral-700 dark:text-neutral-200"
          >
            <span className="font-medium">{CLIENT_LABEL[c.client] ?? c.client}</span>
            <span className="text-neutral-400 dark:text-neutral-500">
              {c.via === "stdio" ? (c.runner ?? strings.viaStdio) : strings.viaRemote}
            </span>
            {c.basis === "verified" && (
              <span
                className="text-emerald-600 dark:text-emerald-400"
                title={strings.verifiedNote}
              >
                ✓
              </span>
            )}
          </li>
        ))}
      </ul>

      {/* 实测到的工具列表。只有真跑起来过才有——这是这张卡最硬的部分。 */}
      {verified?.tools.length ? (
        <div className="mt-4 border-t border-neutral-200 pt-3 dark:border-neutral-800">
          <h3 className="mb-2 text-xs font-semibold text-neutral-700 dark:text-neutral-200">
            {strings.toolsTitle.replace("{n}", String(verified.tools.length))}
          </h3>
          <ul className="flex flex-wrap gap-1.5">
            {verified.tools.map((t) => (
              <li
                key={t}
                className="rounded border border-neutral-200 bg-neutral-50 px-2 py-0.5 font-mono text-[11px] text-neutral-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300"
              >
                {t}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
            {strings.verifiedOn
              .replace("{date}", verified.verifiedAt)
              .replace("{sec}", verified.startupMs ? (verified.startupMs / 1000).toFixed(1) : "—")}
          </p>
        </div>
      ) : null}

      <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400">
        {allDerived ? strings.derivedNote : strings.verifiedNote}
      </p>
    </section>
  );
}
