// 沙箱安装验证 —— 把 clientCompat 的 basis 从 derived 升级成 verified。
//
// 做什么：对每个 npm 型 server 跑一次 MCP 握手（initialize → tools/list），
// 记录「装得上吗 / 起得来吗 / 暴露了哪些工具 / 耗时多久」。
// 这是技能里说的「最硬的独家内容」——装不装得起来是竞品抄不走的。
//
// ⚠️ 安全边界（这个脚本会执行从公开 registry 抓来的第三方代码，边界必须明确）：
//   1. 独立临时目录：每个 server 一个 mktemp 目录当 cwd 和 npm 缓存，跑完即删。
//      不在仓库目录里跑，避免 postinstall 脚本碰到项目文件。
//   2. 环境变量白名单：只透传 PATH / HOME / 语言。所有 *_TOKEN / *_KEY / AWS_* /
//      GITHUB_* 一律不传——没有凭据，server 拿不到任何东西，也就没什么可泄露的。
//   3. 硬超时 + 强杀：到点 SIGKILL 整个进程组（detached + kill(-pid)），
//      防止 server 派生的子进程变成孤儿continue 跑。
//   4. 不做网络隔离——npx 本来就要联网装包。所以【绝不传凭据】是主要防线，
//      而不是靠限网。真要完全隔离需要容器，本机没有 docker（已确认）。
//
// 结果只有三种，不猜：
//   ok        起来了并返回了工具列表
//   started   起来了但没能列出工具（可能要凭据/参数）—— 仍算「装得上」
//   failed    装不上或起不来，记录 stderr 摘要
import { spawn } from "node:child_process";
import { mkdtemp, rm, writeFile, mkdir } from "node:fs/promises";
import { readFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "data/install-verification.json");
const TIMEOUT_MS = Number(process.env.VERIFY_TIMEOUT_MS ?? 90_000);
const LIMIT = Number(process.env.VERIFY_LIMIT ?? 38);
const ONLY = process.env.VERIFY_ONLY?.split(",").map((s) => s.trim()).filter(Boolean);

interface Result {
  slug: string;
  package: string;
  status: "ok" | "started" | "failed";
  tools: string[];
  toolCount: number;
  startupMs: number | null;
  error: string | null;
  verifiedAt: string;
}

/** 只放行无害变量。凭据一律不传：没有 key 的 server 起不来是正常结果，
 *  比拿着真凭据去跑陌生代码安全得多。 */
function safeEnv(extraPath: string): NodeJS.ProcessEnv {
  const { PATH, HOME, LANG, LC_ALL, SHELL, TMPDIR } = process.env;
  return {
    PATH, HOME, LANG, LC_ALL, SHELL, TMPDIR,
    npm_config_cache: extraPath,
    npm_config_update_notifier: "false",
    npm_config_fund: "false",
    npm_config_audit: "false",
    NO_UPDATE_NOTIFIER: "1",
    CI: "1",
  };
}

/** MCP 初始化握手 + 列工具。走 stdio 上的 JSON-RPC。 */
function handshakeMessages(): string {
  const init = {
    jsonrpc: "2.0", id: 1, method: "initialize",
    params: {
      protocolVersion: "2024-11-05",
      capabilities: {},
      clientInfo: { name: "mcpradar-verifier", version: "1.0.0" },
    },
  };
  const initialized = { jsonrpc: "2.0", method: "notifications/initialized" };
  const list = { jsonrpc: "2.0", id: 2, method: "tools/list", params: {} };
  return [init, initialized, list].map((m) => JSON.stringify(m)).join("\n") + "\n";
}

async function verifyOne(slug: string, pkg: string): Promise<Result> {
  const started = Date.now();
  const dir = await mkdtemp(path.join(tmpdir(), "mcpverify-"));
  const cache = path.join(dir, "npm-cache");
  await mkdir(cache, { recursive: true });

  const base: Result = {
    slug, package: pkg, status: "failed", tools: [], toolCount: 0,
    startupMs: null, error: null, verifiedAt: new Date().toISOString().slice(0, 10),
  };

  try {
    const child = spawn("npx", ["-y", pkg], {
      cwd: dir,
      env: safeEnv(cache),
      stdio: ["pipe", "pipe", "pipe"],
      detached: true,            // 独立进程组，便于整组杀掉
    });

    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (d) => { stdout += d.toString(); });
    child.stderr.on("data", (d) => { stderr += d.toString().slice(0, 4000); });

    // 握手：装包可能要几十秒，所以先写入，server 起来后自然会读到。
    child.stdin.on("error", () => {});   // server 提前退出时 EPIPE，忽略
    child.stdin.write(handshakeMessages());

    const outcome = await new Promise<"responded" | "exited" | "timeout">((resolve) => {
      const timer = setTimeout(() => resolve("timeout"), TIMEOUT_MS);
      child.on("exit", () => { clearTimeout(timer); resolve("exited"); });
      const poll = setInterval(() => {
        // 拿到 id:2 的响应（tools/list）就够了，不必等进程退出
        if (/"id"\s*:\s*2\b/.test(stdout)) {
          clearTimeout(timer); clearInterval(poll); resolve("responded");
        }
      }, 300);
      child.on("exit", () => clearInterval(poll));
    });

    try { process.kill(-child.pid!, "SIGKILL"); } catch { /* 已退出 */ }

    const tools = parseTools(stdout);
    if (tools.length) {
      return { ...base, status: "ok", tools, toolCount: tools.length, startupMs: Date.now() - started };
    }
    // 有 initialize 响应说明进程确实起来了，只是没列出工具（多半缺凭据）
    if (/"id"\s*:\s*1\b/.test(stdout) || /"result"/.test(stdout)) {
      return { ...base, status: "started", startupMs: Date.now() - started,
               error: outcome === "timeout" ? "started but tools/list did not return in time" : null };
    }
    return { ...base, error: summarizeError(stderr, outcome) };
  } catch (e) {
    return { ...base, error: (e as Error).message.slice(0, 300) };
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

/** 从 stdio 里挑出 tools/list 的响应。server 常混印 banner，所以逐行试解析。 */
function parseTools(stdout: string): string[] {
  for (const line of stdout.split("\n")) {
    const t = line.trim();
    if (!t.startsWith("{")) continue;
    try {
      const m = JSON.parse(t);
      if (m.id === 2 && m.result?.tools) {
        return m.result.tools.map((x: { name: string }) => x.name).filter(Boolean);
      }
    } catch { /* 不是完整 JSON 行 */ }
  }
  return [];
}

function summarizeError(stderr: string, outcome: string): string {
  const line = stderr.split("\n").map((l) => l.trim())
    .find((l) => /error|not found|E404|ENOENT|cannot|failed|denied/i.test(l));
  return (line ?? `no MCP response (${outcome})`).slice(0, 240);
}

async function main() {
  const raw = JSON.parse(readFileSync(path.join(ROOT, "data/servers.json"), "utf8"));
  const servers = Array.isArray(raw) ? raw : raw.servers ?? raw;

  let targets = servers
    .filter((s: any) =>
      s.lifecycle === "active" &&
      (s.signals?.stars ?? 0) >= 200 &&
      (s.packages ?? [])[0]?.registryType === "npm")
    .sort((a: any, b: any) => (b.signals?.stars ?? 0) - (a.signals?.stars ?? 0));

  if (ONLY) targets = targets.filter((s: any) => ONLY.includes(s.slug));
  targets = targets.slice(0, LIMIT);

  // 断点续跑：已验过的直接复用，重跑不必从头来。
  const prev: Record<string, Result> = existsSync(OUT)
    ? Object.fromEntries((JSON.parse(readFileSync(OUT, "utf8")).results ?? []).map((r: Result) => [r.slug, r]))
    : {};

  console.log(`[verify] ${targets.length} 个 npm 型 server，超时 ${TIMEOUT_MS / 1000}s/个`);
  const results: Result[] = [];
  for (const [i, s] of targets.entries()) {
    const pkg = s.packages[0].identifier;
    if (prev[s.slug] && !process.env.VERIFY_FORCE) {
      results.push(prev[s.slug]);
      console.log(`  [${i + 1}/${targets.length}] ${s.slug} — 复用上次结果 (${prev[s.slug].status})`);
      continue;
    }
    process.stdout.write(`  [${i + 1}/${targets.length}] ${s.slug} … `);
    const r = await verifyOne(s.slug, pkg);
    results.push(r);
    console.log(r.status === "ok" ? `✅ ${r.toolCount} tools (${(r.startupMs! / 1000).toFixed(1)}s)`
      : r.status === "started" ? `🟡 起来了但未列工具`
      : `❌ ${r.error}`);
  }

  const summary = {
    verifiedAt: new Date().toISOString().slice(0, 10),
    total: results.length,
    ok: results.filter((r) => r.status === "ok").length,
    started: results.filter((r) => r.status === "started").length,
    failed: results.filter((r) => r.status === "failed").length,
    results,
  };
  await writeFile(OUT, JSON.stringify(summary, null, 2) + "\n");
  console.log(`\n[verify] ok=${summary.ok} started=${summary.started} failed=${summary.failed} -> ${path.relative(ROOT, OUT)}`);
}

main();
