// 通用 JSON-LD 注入组件。传入任意 schema.org 对象，输出 <script type="application/ld+json">。
// 服务端渲染，进 HTML 首屏，利于搜索引擎与 AI 引擎解析。

export default function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
