// 客户端兼容性推导 —— 从 registry 声明的包和传输方式，推出「这个 server 能接哪些客户端」。
//
// 为什么需要：站上 866 个实体一条 supported_clients 都没有，导致
//   ① 390 个 client×server 集成页没有任何证据支撑，写了就是凭空捏造兼容性；
//   ② 57 个实体卡在「五占二」独特性门槛上，只占到一类。
//
// 这里做的是【静态推导】，不是【实测验证】。两者的区别必须在页面上如实体现：
//   - derived  = 按 registry 声明的 transport/registryType 推出来的，没跑过
//   - verified = 沙箱里真装过、真起来过、真列出过工具
// 长尾只做 derived 并标注「未验证」——技能里说得很清楚，诚实标注本身是价值主张，
// 不是缺陷。把 derived 当 verified 展示才是缺陷。
//
// 推导规则的依据是各客户端公开的配置文档：
//   - stdio 包：客户端本地起进程。npm→npx、pypi→uvx、oci→docker。
//     几乎所有桌面/编辑器类客户端都支持 stdio，这是 MCP 的默认形态。
//   - streamable-http / sse：远程直连，不需要本地运行时，但客户端要支持远程传输。
//     Claude Desktop 需要 connector 配置，Cursor/VS Code 走 url 字段。

import type { ClientCompat, InstallablePackage } from "../types";
import type { RemoteEndpoint } from "./registry";

export type { ClientCompat };

/** 我们建集成页会覆盖的客户端。顺序即页面展示顺序。 */
export const KNOWN_CLIENTS = [
  "claude-desktop",
  "claude-code",
  "cursor",
  "vscode",
  "windsurf",
] as const;

export type ClientId = (typeof KNOWN_CLIENTS)[number];

/** 各客户端支持的传输方式。保守取值：只写文档明确支持的。
 *  不确定的一律不写——漏判只是少一个页面，误判是在页面上撒谎。 */
const CLIENT_TRANSPORTS: Record<ClientId, { stdio: boolean; remote: boolean }> = {
  "claude-desktop": { stdio: true, remote: true },
  "claude-code": { stdio: true, remote: true },
  cursor: { stdio: true, remote: true },
  vscode: { stdio: true, remote: true },
  windsurf: { stdio: true, remote: false },
};

/** 本地运行时：registryType → 启动器。没有对应启动器的包类型不算 stdio 可跑。 */
const RUNNER: Record<string, string> = {
  npm: "npx",
  pypi: "uvx",
  oci: "docker",
};

/** 这个包能不能被本地起起来？能的话返回启动器名。 */
function stdioRunnerFor(pkg: InstallablePackage): string | null {
  // transport 明确声明为远程的，不是 stdio 包。
  if (pkg.transport && pkg.transport !== "stdio") return null;
  return RUNNER[pkg.registryType] ?? null;
}

/**
 * 推导一个 server 的客户端兼容性。
 *
 * 只依据 registry manifest 的硬事实（包类型 + transport + remotes），
 * 推不出来就返回空数组——空数组是诚实的结果，不是失败。
 */
export function deriveClientCompat(
  packages: InstallablePackage[],
  remoteEndpoints: RemoteEndpoint[],
): ClientCompat[] {
  const runners = packages
    .map(stdioRunnerFor)
    .filter((r): r is string => r !== null);
  const hasStdio = runners.length > 0;
  const hasRemote = remoteEndpoints.length > 0
    || packages.some((p) => p.transport === "streamable-http" || p.transport === "sse");

  const out: ClientCompat[] = [];
  for (const client of KNOWN_CLIENTS) {
    const caps = CLIENT_TRANSPORTS[client];
    // stdio 优先：本地跑是主流形态，配置片段也更具体（能写出真实的 npx 命令）。
    if (hasStdio && caps.stdio) {
      out.push({ client, basis: "derived", via: "stdio", runner: runners[0] });
    } else if (hasRemote && caps.remote) {
      out.push({ client, basis: "derived", via: "remote", runner: null });
    }
  }
  return out;
}

/** 生成该客户端下可直接复制的安装命令。没有足够信息时返回 null，不编。 */
export function installCommand(
  compat: ClientCompat,
  packages: InstallablePackage[],
): string | null {
  if (compat.via === "remote") return null;
  const pkg = packages.find((p) => stdioRunnerFor(p) === compat.runner);
  if (!pkg) return null;
  const pinned = pkg.version ? `${pkg.identifier}@${pkg.version}` : pkg.identifier;
  switch (compat.runner) {
    case "npx":
      return `npx -y ${pinned}`;
    case "uvx":
      return `uvx ${pinned}`;
    case "docker":
      return `docker run -i --rm ${pinned}`;
    default:
      return null;
  }
}
