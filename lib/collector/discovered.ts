// 自动发现的 server 种子 —— 由 `npm run discover` 生成，经人工审 PR 后合并。
//
// ⚠️ 这个文件是机器写的，别手工改：下次 discover 会整体重写它。
// 手工挑的 server 请加到 curated.ts —— 两份分开是刻意的：
//   - curated.ts  手工维护，采集时**无条件保留**（优质保底）
//   - discovered.ts 机器发现，采集时仍要过 passesQualityGate（机器没人看过，不给豁免）
// 分开还有一个作用：自动开的 PR 永远只碰这个文件，改坏了也污染不到手工白名单。
//
// 上次生成：2026-07-27

import type { CuratedSeed } from "./curated";

export const DISCOVERED_SEEDS: CuratedSeed[] = [
  { name: "outlook-mcp", repoUrl: "https://github.com/ryaker/outlook-mcp", npmPackage: null }, // ★412 · 730/mo 有人搜
  { name: "ghidra-mcp", repoUrl: "https://github.com/bethington/ghidra-mcp", npmPackage: null }, // ★2982 · GitHub 趋势
  { name: "markdownify-mcp", repoUrl: "https://github.com/zcaceres/markdownify-mcp", npmPackage: null }, // ★2892 · GitHub 趋势
  { name: "jadx-ai-mcp", repoUrl: "https://github.com/zinja-coder/jadx-ai-mcp", npmPackage: null }, // ★2559 · GitHub 趋势
  { name: "brightdata-mcp", repoUrl: "https://github.com/brightdata/brightdata-mcp", npmPackage: null }, // ★2539 · GitHub 趋势
  { name: "korean-law-mcp", repoUrl: "https://github.com/chrisryugj/korean-law-mcp", npmPackage: "korean-law-mcp" }, // ★2328 · GitHub 趋势
  { name: "js-reverse-mcp", repoUrl: "https://github.com/zhizhuodemao/js-reverse-mcp", npmPackage: "js-reverse-mcp" }, // ★2321 · GitHub 趋势
  { name: "mcp2cli", repoUrl: "https://github.com/knowsuchagency/mcp2cli", npmPackage: null }, // ★2319 · GitHub 趋势
  { name: "gemini-mcp-tool", repoUrl: "https://github.com/jamubc/gemini-mcp-tool", npmPackage: "gemini-mcp-tool" }, // ★2265 · GitHub 趋势
  { name: "ios-simulator-mcp", repoUrl: "https://github.com/joshuayoes/ios-simulator-mcp", npmPackage: "ios-simulator-mcp" }, // ★2114 · GitHub 趋势
  { name: "mcpb", repoUrl: "https://github.com/modelcontextprotocol/mcpb", npmPackage: null }, // ★2052 · GitHub 趋势
  { name: "davinci-resolve-mcp", repoUrl: "https://github.com/samuelgursky/davinci-resolve-mcp", npmPackage: "davinci-resolve-mcp" }, // ★1882 · GitHub 趋势
  { name: "kubernetes-mcp-server", repoUrl: "https://github.com/containers/kubernetes-mcp-server", npmPackage: "kubernetes-mcp-server" }, // ★1852 · GitHub 趋势
  { name: "mcp-brasil", repoUrl: "https://github.com/Mcp-Brasil/mcp-brasil", npmPackage: null }, // ★1690 · GitHub 趋势
  { name: "KiCAD-MCP-Server", repoUrl: "https://github.com/mixelpixx/KiCAD-MCP-Server", npmPackage: null }, // ★1663 · GitHub 趋势
  { name: "datagouv-mcp", repoUrl: "https://github.com/datagouv/datagouv-mcp", npmPackage: null }, // ★1573 · GitHub 趋势
  { name: "mcp-language-server", repoUrl: "https://github.com/isaacphi/mcp-language-server", npmPackage: null }, // ★1571 · GitHub 趋势
  { name: "MiniMax-MCP", repoUrl: "https://github.com/MiniMax-AI/MiniMax-MCP", npmPackage: null }, // ★1541 · GitHub 趋势
  { name: "iMCP", repoUrl: "https://github.com/mattt/iMCP", npmPackage: null }, // ★1506 · GitHub 趋势
  { name: "freecad-mcp", repoUrl: "https://github.com/neka-nat/freecad-mcp", npmPackage: null }, // ★1469 · GitHub 趋势
  { name: "duckduckgo-mcp-server", repoUrl: "https://github.com/nickclyde/duckduckgo-mcp-server", npmPackage: null }, // ★1375 · GitHub 趋势
  { name: "mcp-google-sheets", repoUrl: "https://github.com/xing5/mcp-google-sheets", npmPackage: null }, // ★962 · GitHub 趋势
  { name: "annas-mcp", repoUrl: "https://github.com/iosifache/annas-mcp", npmPackage: null }, // ★946 · GitHub 趋势
  { name: "kubectl-mcp-server", repoUrl: "https://github.com/rohitg00/kubectl-mcp-server", npmPackage: "kubectl-mcp-server" }, // ★934 · GitHub 趋势
  { name: "mcp-notion-server", repoUrl: "https://github.com/suekou/mcp-notion-server", npmPackage: "@suekou/mcp-notion-server" }, // ★918 · GitHub 趋势
];
