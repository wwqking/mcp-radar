import type { Locale } from "./locales";
import { LOCALES, DEFAULT_LOCALE } from "./locales";

// 给站内路径加上 locale 前缀。
//   localizedHref("en", "/leaderboard") -> "/en/leaderboard"
//   localizedHref("zh", "/")            -> "/zh"
// 已带前缀或外链 / 锚点/ 邮件的原样返回。
export function localizedHref(locale: Locale, path: string): string {
  if (!path.startsWith("/")) return path; // http(s):// mailto: #anchor 等
  // 已经带了某个 locale 前缀，先剥掉再套当前 locale（用于语言切换）
  for (const l of LOCALES) {
    if (path === `/${l}`) return `/${locale}`;
    if (path.startsWith(`/${l}/`)) return `/${locale}${path.slice(l.length + 1)}`;
  }
  if (path === "/") return `/${locale}`;
  return `/${locale}${path}`;
}

// 生成 Next Metadata.alternates 用的 canonical + hreflang 语言映射。
// 传入“裸路径”（不带 locale 前缀，如 "/server/foo" 或 "/"），当前 locale 的 canonical 指向自己，
// languages 里每种语言互指同一内容，并给 x-default 兜底到默认语言。
//   hreflangAlternates("en", "/server/foo")
//   -> { canonical: "/en/server/foo",
//        languages: { en: "/en/server/foo", zh: "/zh/server/foo", "x-default": "/en/server/foo" } }
export function hreflangAlternates(
  locale: Locale,
  barePath: string,
): { canonical: string; languages: Record<string, string> } {
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[l] = localizedHref(l, barePath);
  languages["x-default"] = localizedHref(DEFAULT_LOCALE, barePath);
  return { canonical: localizedHref(locale, barePath), languages };
}

// 把带 locale 前缀的路径还原成“裸路径”（用于语言切换时保留当前页面）。
//   stripLocale("/en/leaderboard") -> "/leaderboard"
export function stripLocale(path: string): string {
  for (const l of LOCALES) {
    if (path === `/${l}`) return "/";
    if (path.startsWith(`/${l}/`)) return path.slice(l.length + 1);
  }
  return path;
}
