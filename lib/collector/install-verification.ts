// 读取沙箱验证结果（data/install-verification.json），把 clientCompat 的
// basis 从 derived 升级成 verified，并把实测到的工具列表挂到 server 上。
//
// 为什么单独一个文件而不是塞进 build-data：验证结果由 CI 的
// verify-install workflow 独立产出，节奏和每日采集不同（验证慢、要隔离环境）。
// 采集只是**消费**它，两边解耦，验证跑挂了也不影响每日数据更新。
//
// 关键约束：只有 status === "ok" 才算 verified。
//   started = 进程起来了但没列出工具（多半缺凭据）——装得上，但我们没真正确认它能干活
//   failed  = 装不上
// 这两种都不升级 basis。把 started 当 verified 就是在页面上夸大验证程度。

import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import type { MCPServer } from "../types";

export interface InstallVerification {
  slug: string;
  package: string;
  status: "ok" | "started" | "failed";
  tools: string[];
  toolCount: number;
  startupMs: number | null;
  error: string | null;
  verifiedAt: string;
}

const FILE = path.join(process.cwd(), "data/install-verification.json");

export function readVerifications(): Map<string, InstallVerification> {
  if (!existsSync(FILE)) return new Map();
  try {
    const raw = JSON.parse(readFileSync(FILE, "utf8"));
    return new Map<string, InstallVerification>(
      (raw.results ?? []).map((r: InstallVerification) => [r.slug, r]),
    );
  } catch {
    // 文件损坏时当作没有验证数据，而不是让整条采集挂掉。
    // 少一批 verified 标记不影响正确性，只是少一层证据。
    return new Map();
  }
}

/** 把验证结果合并进 server 列表。没有对应结果的原样返回。 */
export function applyVerifications(
  servers: MCPServer[],
  verifications: Map<string, InstallVerification>,
): MCPServer[] {
  if (!verifications.size) return servers;
  return servers.map((s) => {
    const v = verifications.get(s.slug);
    if (!v || v.status !== "ok") return s;
    return {
      ...s,
      installVerified: {
        verifiedAt: v.verifiedAt,
        startupMs: v.startupMs,
        tools: v.tools,
      },
      // stdio 型才是这次实测过的路径；remote 条目没跑过，保持 derived。
      clientCompat: (s.clientCompat ?? []).map((c) =>
        c.via === "stdio" ? { ...c, basis: "verified" as const } : c,
      ),
    };
  });
}
