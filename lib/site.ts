// 站点级常量 —— 域名/站名/邮箱集中一处，避免散落多文件、上线漏改。
// 所有需要绝对 URL 的地方（sitemap / robots / feed / canonical / schema）都引用这里。

/** 生产域名。可用环境变量覆盖（预览环境用不同域名时）。 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://mcpradars.com").replace(/\/$/, "");

export const SITE_NAME = "MCP Radar";

export const SITE_TAGLINE = "找到能用的 MCP server —— 按用途分类，标注哪个还活着。";

export const SITE_DESCRIPTION =
  "按用途分类的 MCP server 导航。每个 server 都标注维护状态：活跃 / 半年没更新 / 已弃坑。数据来自官方 registry、GitHub、npm，每日更新。";

/** 联系邮箱 */
export const EMAIL_CORRECTIONS = "corrections@mcpradars.com";
export const EMAIL_SPONSOR = "sponsor@mcpradars.com";

/** 拼绝对 URL（path 以 / 开头） */
export function absoluteUrl(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
