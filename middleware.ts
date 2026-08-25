import { NextRequest, NextResponse } from "next/server";
import { LOCALES, DEFAULT_LOCALE } from "@/lib/i18n/locales";
import { SITE_URL } from "@/lib/site";

// 无 locale 前缀的路径 → 重定向到带前缀的版本。
// 语言判定优先级：cookie（用户上次选择）> Accept-Language 头 > 默认英文。

function detectLocale(req: NextRequest): string {
  const cookie = req.cookies.get("NEXT_LOCALE")?.value;
  if (cookie && (LOCALES as readonly string[]).includes(cookie)) return cookie;

  const accept = req.headers.get("accept-language") ?? "";
  // 简单判定：Accept-Language 里第一个语言是 zh* 就中文，其余一律走默认英文
  if (/^\s*zh\b/i.test(accept)) return "zh";
  return DEFAULT_LOCALE;
}

const CANONICAL_URL = new URL(SITE_URL);
const CANONICAL_HOST = CANONICAL_URL.host;
const APEX_HOST = CANONICAL_HOST.replace(/^www\./, "");

function forwardedValue(value: string | null): string {
  return (value ?? "").split(",")[0].trim().toLowerCase();
}

function canonicalRedirect(req: NextRequest): NextResponse | null {
  const host = forwardedValue(
    req.headers.get("x-forwarded-host") ?? req.headers.get("host"),
  );
  const protocol = forwardedValue(req.headers.get("x-forwarded-proto")) || req.nextUrl.protocol.replace(":", "");
  const isProductionHost = host === CANONICAL_HOST || host === APEX_HOST;

  // Preview/local hosts must remain reachable on their own origin.
  if (!isProductionHost || (host === CANONICAL_HOST && protocol === "https")) {
    return null;
  }

  const url = new URL(
    `${req.nextUrl.pathname}${req.nextUrl.search}`,
    CANONICAL_URL,
  );
  return NextResponse.redirect(url, 301);
}

function isInfrastructurePath(pathname: string): boolean {
  return (
    pathname.startsWith("/api/") ||
    pathname === "/api" ||
    pathname.startsWith("/_next/") ||
    pathname === "/feed.xml" ||
    pathname === "/feed.json" ||
    pathname === "/llms.txt" ||
    pathname === "/sitemap.xml" ||
    pathname === "/robots.txt" ||
    pathname === "/icon" ||
    pathname === "/apple-icon" ||
    pathname === "/opengraph-image" ||
    pathname === "/favicon.ico" ||
    /\.[^/]+$/.test(pathname)
  );
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const normalized = canonicalRedirect(req);
  if (normalized) return normalized;

  // Infrastructure routes stay at the root; host/protocol normalization above
  // still applies to them.
  if (isInfrastructurePath(pathname)) return NextResponse.next();

  // 已带 locale 前缀的放行
  const hasLocale = LOCALES.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
  );
  if (hasLocale) {
    const locale = LOCALES.find(
      (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
    ) ?? DEFAULT_LOCALE;
    const response = NextResponse.next();
    response.headers.set("Content-Language", locale === "zh" ? "zh-CN" : "en");
    return response;
  }

  const locale = detectLocale(req);
  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Run on infrastructure routes too so HTTP/non-www variants cannot bypass
  // canonicalization. Next's immutable static assets are the only exception.
  matcher: ["/((?!_next/static|_next/image).*)"],
};
