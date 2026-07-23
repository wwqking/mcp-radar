import type { ReadmeFacts } from "@/lib/types";

interface Props {
  facts: ReadmeFacts;
  strings: {
    factsTitle: string;
    needsApiKey: string;
    noApiKey: string;
    runtimeNeeds: string;
    configTitle: string;
  };
}

/** 从 README 规则提取的「接入前先知道」：是否需 key + 运行环境 + 真实配置片段。
 *  对所有有 repo/README 的 server 都渲染（白名单 + 长尾），纯服务端渲染利于 SEO。 */
export default function ReadmeFactsCard({ facts, strings }: Props) {
  const hasAnything = facts.needsApiKey || facts.runtimes.length > 0 || facts.configSnippet;
  if (!hasAnything) return null;

  return (
    <section className="card mt-6 p-5">
      <h2 className="mb-3 text-sm font-semibold text-neutral-900 dark:text-neutral-100">{strings.factsTitle}</h2>

      <div className="flex flex-wrap gap-2">
        <span
          className={`rounded-full border px-3 py-1 text-xs ${
            facts.needsApiKey
              ? "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-200"
              : "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200"
          }`}
        >
          {facts.needsApiKey ? `🔑 ${strings.needsApiKey}` : `✓ ${strings.noApiKey}`}
        </span>
        {facts.runtimes.map((rt) => (
          <span
            key={rt}
            className="rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-600 dark:border-neutral-700 dark:text-neutral-300"
          >
            {rt}
          </span>
        ))}
      </div>

      {facts.configSnippet && (
        <div className="mt-4">
          <p className="mb-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400">{strings.configTitle}</p>
          <pre className="mono overflow-x-auto rounded-lg bg-neutral-900 p-4 text-xs leading-6 text-neutral-100 dark:bg-neutral-950">
            <code>{facts.configSnippet}</code>
          </pre>
        </div>
      )}
    </section>
  );
}
