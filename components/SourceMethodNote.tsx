interface Props {
  sources: string[];
  updatedAt?: string;
  className?: string;
}

/** "数据来自 X，更新于 Y" 透明标注 */
export default function SourceMethodNote({ sources, updatedAt, className = "" }: Props) {
  return (
    <p className={`text-xs text-neutral-400 dark:text-neutral-500 ${className}`}>
      数据来源：{sources.join(" · ")}
      {updatedAt ? ` · 更新于 ${updatedAt}` : ""}
    </p>
  );
}
