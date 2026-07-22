// 对比栏的客户端状态：存 localStorage，跨页面/刷新保留。
// 用自定义事件广播变化，让「加入对比」按钮和浮动对比栏实时同步。
// 纯客户端，无 Node 依赖。

const KEY = "mcp-radar:compare";
const EVT = "mcp-radar:compare-change";
export const MAX_COMPARE = 4;

function read(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const arr = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(arr) ? arr.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function write(slugs: string[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(slugs));
  } catch {
    /* 存储满/隐私模式：忽略 */
  }
  window.dispatchEvent(new CustomEvent(EVT));
}

export function getCompare(): string[] {
  return read();
}

export function isInCompare(slug: string): boolean {
  return read().includes(slug);
}

/** 加入/移出，返回操作后是否在列表里。达上限时不再加入。 */
export function toggleCompare(slug: string): boolean {
  const cur = read();
  if (cur.includes(slug)) {
    write(cur.filter((s) => s !== slug));
    return false;
  }
  if (cur.length >= MAX_COMPARE) return false;
  write([...cur, slug]);
  return true;
}

export function removeCompare(slug: string) {
  write(read().filter((s) => s !== slug));
}

export function clearCompare() {
  write([]);
}

/** 订阅变化（含跨标签页的 storage 事件）。返回取消订阅函数。 */
export function subscribeCompare(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => cb();
  window.addEventListener(EVT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(EVT, handler);
    window.removeEventListener("storage", handler);
  };
}
