// 生成 MCP server 的安装/接入命令（客户端安全：纯字符串拼接，无 Node 依赖）。
//
// 两种形态：
//  1) npm 包型（有 npmPackage）：给 `claude mcp add` CLI 命令 + npx 型 JSON 配置。
//  2) 仅仓库型（无 npm，只有 repo）：给指向仓库的说明 + JSON 占位，引导去 README。
//
// 说明：MCP 生态没有统一「一行装好」的标准，具体 env/参数各 server 不同。
// 这里给的是最常见的 stdio + npx 接法，作为起点；页面会标注「以官方 README 为准」。

export interface InstallCommand {
  /** 短标签（tab 名） */
  label: string;
  /** 语言（用于代码块高亮提示，可空） */
  lang: string;
  /** 命令/配置正文 */
  code: string;
}

/** 把包名/slug 归一成一个简短的 server key（配置里的键名）。 */
function serverKey(slug: string, npmPackage: string | null): string {
  const base = npmPackage
    ? npmPackage.replace(/^@[^/]+\//, "").replace(/^server-/, "")
    : slug;
  return base.replace(/[^a-z0-9-]/gi, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") || "server";
}

export function installCommands(server: {
  slug: string;
  npmPackage: string | null;
  repoUrl: string | null;
}): InstallCommand[] {
  const { slug, npmPackage, repoUrl } = server;
  const key = serverKey(slug, npmPackage);

  if (npmPackage) {
    const claudeCli = `claude mcp add ${key} -- npx -y ${npmPackage}`;
    const jsonConfig = `{
  "mcpServers": {
    "${key}": {
      "command": "npx",
      "args": ["-y", "${npmPackage}"]
    }
  }
}`;
    return [
      { label: "Claude Code", lang: "bash", code: claudeCli },
      { label: "JSON config", lang: "json", code: jsonConfig },
    ];
  }

  // 仅仓库型：没有可直接 npx 的包，给出仓库指引 + 通用占位 JSON。
  const repoHint = repoUrl
    ? `# No npm package — install from source.\n# See the repo's README for the exact command:\n# ${repoUrl}`
    : `# No npm package or public repo found. Check the MCP registry entry for install steps.`;
  const jsonConfig = `{
  "mcpServers": {
    "${key}": {
      "command": "<see README>",
      "args": []
    }
  }
}`;
  return [
    { label: "From source", lang: "bash", code: repoHint },
    { label: "JSON config", lang: "json", code: jsonConfig },
  ];
}
