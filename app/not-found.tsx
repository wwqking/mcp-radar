import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-site flex flex-col items-center py-24 text-center">
      <p className="text-5xl">🛰️</p>
      <h1 className="mt-4 text-2xl font-bold text-neutral-900 dark:text-neutral-100">这个页面不存在</h1>
      <p className="mt-2 text-neutral-500 dark:text-neutral-400">可能链接已过期，或者这个 server 还没被收录。</p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
      >
        回首页搜索
      </Link>
    </div>
  );
}
