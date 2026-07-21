interface Props {
  variant?: "default" | "compact";
}

/** 内嵌订阅钩子（静态演示：表单暂不提交） */
export default function SubscribeInline({ variant = "default" }: Props) {
  if (variant === "compact") {
    return (
      <div className="card flex flex-col items-start gap-3 border-dashed p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-neutral-600 dark:text-neutral-300">
          📬 不想每周自己刷？订阅雷达直达邮箱。
        </p>
        <a
          href="/newsletter"
          className="shrink-0 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          免费订阅
        </a>
      </div>
    );
  }

  return (
    <div className="card border-brand-200 bg-brand-50/50 p-6 dark:border-brand-900 dark:bg-brand-950/40 sm:p-8">
      <div className="mx-auto max-w-xl text-center">
        <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
          每周一封，5 分钟看完 MCP 生态发生了什么
        </h3>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
          新增 server、爆火趋势、弃坑预警——引擎自动追踪，人工筛选后发到你邮箱。
        </p>
        <form className="mt-4 flex flex-col gap-2 sm:flex-row">
          <input
            type="email"
            required
            placeholder="you@example.com"
            className="flex-1 rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:ring-brand-900"
          />
          <button
            type="submit"
            className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
          >
            免费订阅
          </button>
        </form>
        <p className="mt-2 text-xs text-neutral-400">每周一封 · 随时退订 · 不卖数据</p>
      </div>
    </div>
  );
}
