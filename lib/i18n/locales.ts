// i18n 语言配置集中一处。新增语言只改这里 + 补词典文件。

export const LOCALES = ["en", "zh"] as const;
export type Locale = (typeof LOCALES)[number];

/** 默认语言：英文。用户不带前缀访问 / 时重定向到 /en（无浏览器语言偏好时）。 */
export const DEFAULT_LOCALE: Locale = "en";

/** 语言切换器显示的名字（用各自母语写，符合惯例）。 */
export const LOCALE_LABELS: Record<Locale, string> = {
  zh: "中文",
  en: "English",
};

/** <html lang=""> 用的 BCP-47 标签。 */
export const LOCALE_HTML_LANG: Record<Locale, string> = {
  zh: "zh-CN",
  en: "en",
};

/** 运行期校验：路径里的段是不是合法 locale。 */
export function isLocale(x: string): x is Locale {
  return (LOCALES as readonly string[]).includes(x);
}
