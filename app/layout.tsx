import type { Metadata } from "next";
import "./globals.css";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import Analytics from "@/components/Analytics";

// 根布局只放 <html>/<body> 骨架；站点头/尾、多语言 metadata 在 app/[locale]/layout.tsx。
// 根节点使用默认英文；[locale] 布局会在实际内容容器上服务端输出精确 lang，
// middleware 同时返回 Content-Language，避免依赖客户端脚本纠正语言。

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  // 搜索引擎站点验证（Next 会渲染成对应的 <meta> 标签）
  verification: {
    google: "tKkAtF_Bz-59xK_MCadc2vvUBy1a2s2oHklIrmsUjyk",
    other: {
      "msvalidate.01": "365B6B723566817E2A8702D3A1A863AF",
      "baidu-site-verification": "codeva-ApeZsR5Peg",
      monetag: "b6994cc0a2e71d9f16de2d7a06fb3ca7",
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5972123080217605"
          crossOrigin="anonymous"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(s){s.dataset.zone='11576425',s.src='https://nap5k.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`,
          }}
        />
        {/* 防暗色闪烁 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");var d=t?t==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;if(d)document.documentElement.classList.add("dark")}catch(e){}})()`,
          }}
        />
        <link rel="alternate" type="application/rss+xml" title={`${SITE_NAME} RSS`} href="/feed.xml" />
      </head>
      <body className="flex min-h-screen flex-col">
        <Analytics />
        {children}
      </body>
    </html>
  );
}
