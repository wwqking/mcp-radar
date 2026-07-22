import type { Locale } from "./locales";
import { LOCALES } from "./locales";

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

// 把带 locale 前缀的路径还原成“裸路径”（用于语言切换时保留当前页面）。
//   stripLocale("/en/leaderboard") -> "/leaderboard"
export function stripLocale(path: string): string {
  for (const l of LOCALES) {
    if (path === `/${l}`) return "/";
    if (path.startsWith(`/${l}/`)) return path.slice(l.length + 1);
  }
  return path;
}
