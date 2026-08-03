export type AnalyticsProps = Record<string, string | number | boolean>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

/** 无统计服务时静默降级；事件不得包含邮箱、搜索原文等个人或敏感数据。 */
export function trackEvent(
  eventName: string,
  props?: AnalyticsProps,
): void {
  if (typeof window === "undefined") return;
  const normalizedEventName = eventName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: normalizedEventName,
    ...(props || {}),
  });
}
