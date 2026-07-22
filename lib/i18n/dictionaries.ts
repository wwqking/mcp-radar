// 服务端按 locale 加载词典。全站 SSG，词典在构建期就确定，import 静态 json 即可。
// 用法（服务端组件）：
//   const dict = await getDictionary(locale);
//   dict.nav.leaderboard
//
// 只覆盖本轮翻译的模块（通用 / 导航 / 页脚 / 首页 / 订阅 / 赞助）。
// 内容页（榜单/详情/指南）后续逐个补——补的时候往 zh.json / en.json 加同名 key 即可。

import type { Locale } from "./locales";
import zh from "./zh.json";
import en from "./en.json";

// zh.json 是翻译的“真源”，用它的结构作为类型，保证 en.json 不漏 key。
export type Dictionary = typeof zh;

const DICTIONARIES: Record<Locale, Dictionary> = {
  zh,
  en: en as Dictionary,
};

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale] ?? DICTIONARIES.zh;
}
