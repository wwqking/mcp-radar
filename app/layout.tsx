import type { Metadata } from "next";
import "./globals.css";
import { SITE_URL, SITE_NAME } from "@/lib/site";

// 根布局只放 <html>/<body> 骨架；站点头/尾、多语言 metadata 在 app/[locale]/layout.tsx。
// <html lang> 由 [locale] 布局无法直接改根节点，这里用默认 en 兜底；
// 各语言页面的 hreflang / og:locale 已在 [locale] 布局里精确声明，SEO 不受影响。

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* 防暗色闪烁 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");var d=t?t==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;if(d)document.documentElement.classList.add("dark")}catch(e){}})()`,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="alternate" type="application/rss+xml" title={`${SITE_NAME} RSS`} href="/feed.xml" />
      </head>
      <body className="flex min-h-screen flex-col">{children}</body>
    </html>
  );
}
