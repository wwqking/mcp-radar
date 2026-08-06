// 兼容旧调用点。完整的受控分类、主题与置信度逻辑统一放在 taxonomy.ts，
// 避免采集器和前台各维护一套会逐渐漂移的规则。
import { classifyTaxonomy } from "../taxonomy";

/** 返回命中的分类 slug 数组；无命中返回 ["misc"] */
export function classify(name: string, description: string): string[] {
  return classifyTaxonomy(name, description).categories;
}

export { classifyTaxonomy };
