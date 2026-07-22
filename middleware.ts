import { NextRequest, NextResponse } from "next/server";
import { LOCALES, DEFAULT_LOCALE } from "@/lib/i18n/locales";

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

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 已带 locale 前缀的放行
  const hasLocale = LOCALES.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
  );
  if (hasLocale) return NextResponse.next();

  const locale = detectLocale(req);
  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // 排除：API、_next 内部、以及所有基础设施路由（保持在根、不加前缀）
  matcher: [
    "/((?!api|_next|feed\\.xml|feed\\.json|llms\\.txt|sitemap\\.xml|robots\\.txt|icon|apple-icon|opengraph-image|favicon\\.ico|.*\\..*).*)",
  ],
};
