// verdict / deathReason 的运行时多语言渲染。
// 数据集里存结构化 key（verdictKey/deathReasonKey）+ 天数变量，页面按 locale 出句。
// 旧数据没有 key 时，回退到采集期写死的 verdict/deathReason 字符串（中文），不报错。

import type { MCPServer, RadarEntry } from "@/lib/types";
import type { Locale } from "./locales";
import { getDictionary } from "./dictionaries";
import { formatNumber } from "@/lib/constants";

/** 一句判断。优先 verdictKey → 词典；否则回退旧 verdict 字段。 */
export function verdictText(server: MCPServer, locale: Locale): string {
  const key = server.verdictKey;
  if (!key) return server.verdict; // 旧数据兜底
  const v = getDictionary(locale).verdict;
  if (key === "dying") {
    const days = server.verdictDays != null ? String(server.verdictDays) : v.dyingFallbackDays;
    return v.dying.replace("{days}", days);
  }
  return v[key];
}

/** 死因说明。优先 deathReasonKey → 词典；否则回退旧 deathReason 字段。 */
export function deathReasonText(server: MCPServer, locale: Locale): string | undefined {
  const key = server.deathReasonKey;
  if (!key) return server.deathReason; // 旧数据兜底（可能 undefined）
  const d = getDictionary(locale).deathReason;
  if (key === "stale") {
    const days = server.deathReasonDays != null ? String(server.deathReasonDays) : "?";
    return d.stale.replace("{days}", days);
  }
  return d.archived;
}

/** 雷达 evidence 一句依据。优先 evidenceKey → 词典；否则回退旧 evidence 字段。 */
export function evidenceText(entry: RadarEntry, locale: Locale): string {
  const key = entry.evidenceKey;
  if (!key) return entry.evidence; // 旧数据兜底
  const e = getDictionary(locale).evidence;
  const v = entry.evidenceVars ?? {};
  const dl = v.downloads != null ? e.downloadsSuffix.replace("{n}", formatNumber(v.downloads)) : "";
  switch (key) {
    case "trendingDelta":
      return e.trendingDelta.replace("{delta}", formatNumber(v.starsDelta ?? 0)).replace("{downloads}", dl);
    case "trendingStars":
      return e.trendingStars.replace("{stars}", formatNumber(v.stars ?? 0)).replace("{downloads}", dl);
    case "new":
      return e.new.replace("{date}", v.addedAt ?? "").replace("{stars}", formatNumber(v.stars ?? 0));
    case "dead":
      // dead 的依据就是死因，直接复用死因渲染
      return deathReasonText(entry.server, locale) ?? e.deadFallback;
  }
}
