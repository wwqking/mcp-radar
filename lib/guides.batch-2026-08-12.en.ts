import type { GuideContent, GuideSource } from "./guides";

const VERIFIED_AT = "2026-08-12";

const MCP_ARCHITECTURE: GuideSource = {
  label: "Model Context Protocol — architecture overview (2026-07-28)",
  url: "https://modelcontextprotocol.io/docs/2026-07-28/learn/architecture",
  retrievedAt: VERIFIED_AT,
};

const MCP_SERVER_CONCEPTS: GuideSource = {
  label: "Model Context Protocol — server concepts",
  url: "https://modelcontextprotocol.io/docs/learn/server-concepts",
  retrievedAt: VERIFIED_AT,
};

const MCP_SECURITY: GuideSource = {
  label: "Model Context Protocol — security best practices",
  url: "https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices",
  retrievedAt: VERIFIED_AT,
};

const CLAUDE_MCP: GuideSource = {
  label: "Claude Code — connect to tools via MCP",
  url: "https://code.claude.com/docs/en/mcp",
  retrievedAt: VERIFIED_AT,
};

const CURSOR_MCP: GuideSource = {
  label: "Cursor — Model Context Protocol",
  url: "https://cursor.com/docs/mcp",
  retrievedAt: VERIFIED_AT,
};

export const GUIDE_BATCH_2026_08_12_EN: Record<string, GuideContent> = {
  "claude-code-mcp-config": {
    title: "Claude Code MCP Configuration: Scopes, Commands, and Verification",
    excerpt: "Add local or remote MCP servers to Claude Code at the right scope, keep secrets out of shared config, and verify the connection with current commands.",
    directAnswer: "Use `claude mcp add` for a one-off local or user configuration; use a project-scoped `.mcp.json` when the team should share the server definition. Keep secret values outside version control, then verify with `claude mcp list`, `claude mcp get <name>`, and the in-session `/mcp` panel.",
    keyFacts: [
      { label: "CLI checked", value: "2.1.117", note: "Installed Claude Code version on 2026-08-12" },
      { label: "Scopes", value: "Local · Project · User", note: "Local and user live in ~/.claude.json; project uses .mcp.json" },
      { label: "Transports", value: "stdio · HTTP", note: "Choose by process boundary, not by package language" },
      { label: "Evidence", value: "Config verified", note: "A harmless project config was created; health did not finish in the observation window" },
    ],
    comparison: {
      caption: "Scope behavior verified against the current Claude Code MCP documentation on 2026-08-12.",
      headers: ["Scope", "Loads in", "Shared", "Stored in", "Use it for"],
      rows: [
        ["Local", "Current project", "No", "~/.claude.json under that project", "Personal experiments or private credentials"],
        ["Project", "Current project", "Yes", ".mcp.json in the project root", "A team-owned server definition reviewed in version control"],
        ["User", "Every project", "No", "~/.claude.json", "Personal utilities used across repositories"],
      ],
    },
    visual: {
      title: "The 60-second configuration chooser",
      caption: "The scope controls who receives the definition. The transport controls how Claude Code reaches the server.",
      items: [
        { label: "Choose scope", description: "Private current repo, shared current repo, or private all repos." },
        { label: "Choose transport", description: "stdio launches a child process; HTTP connects to an existing endpoint." },
        { label: "Add credentials", description: "Reference environment values; do not commit live tokens." },
        { label: "Verify", description: "List, inspect, open /mcp, and run one non-destructive tool." },
      ],
    },
    sections: [
      {
        heading: "Choose `claude mcp add` or `.mcp.json`",
        body: [
          "Use the CLI when you want Claude Code to write the correct structure for you. It reduces syntax mistakes and makes the chosen scope explicit. Use a hand-reviewed `.mcp.json` when a project needs a shared, versioned definition or when you are editing a pull request that introduces an integration.",
          "A project-scoped file is code. Review the command, arguments, endpoint, headers, and requested privileges before approval. Claude Code prompts before using project-scoped servers, but that prompt is not a source or package audit.",
        ],
      },
      {
        heading: "Add a local stdio server or a remote HTTP server",
        body: [
          "For stdio, everything after `--` is passed to the server process. Put Claude options before the server name. For HTTP, provide the endpoint instead of a launch command. Use a harmless server while validating mechanics; a successful launch does not prove that a production package is trustworthy.",
        ],
        codeBlocks: [
          { label: "Local stdio server", language: "bash", code: "claude mcp add --transport stdio --scope local demo -- npx -y example-mcp-server" },
          { label: "Remote Streamable HTTP server", language: "bash", code: "claude mcp add --transport http --scope local hosted https://example.com/mcp" },
        ],
      },
      {
        heading: "Share configuration without sharing secrets",
        body: [
          "Claude Code supports environment expansion in `command`, `args`, `env`, `url`, and `headers` inside `.mcp.json`. Commit the variable reference, not the token. A missing required variable without a default causes config parsing to fail, which is preferable to silently sending an empty credential.",
          "Do not assume environment variables are automatically safe: they can still leak through logs, child processes, screenshots, or shell history. Use the least-privileged credential, keep it out of source control, and redact it from diagnostic bundles.",
        ],
        codeBlocks: [
          { label: "Shared HTTP definition with a private token", language: "json", code: "{\n  \"mcpServers\": {\n    \"hosted\": {\n      \"type\": \"http\",\n      \"url\": \"${MCP_BASE_URL:-https://example.com}/mcp\",\n      \"headers\": {\n        \"Authorization\": \"Bearer ${MCP_TOKEN}\"\n      }\n    }\n  }\n}" },
        ],
      },
      {
        heading: "Verify the declaration, connection, and first tool separately",
        body: [
          "Run `claude mcp list` to check configured servers and health, then `claude mcp get <name>` to inspect one definition. Inside Claude Code, open `/mcp` and confirm the server and its tools are visible. Finally invoke one read-only or otherwise reversible tool and check the returned result.",
          "Treat these as separate gates: the JSON can parse while the executable is missing; the process can start while discovery fails; tools can list while the upstream API rejects authorization. Record which gate failed before changing configuration.",
        ],
        codeBlocks: [
          { label: "Operational commands", language: "bash", code: "claude mcp list\nclaude mcp get demo\nclaude mcp remove --scope local demo\nclaude mcp reset-project-choices" },
        ],
      },
      {
        heading: "Use the failure tree instead of changing everything at once",
        body: [
          "If the executable is not found, test the exact command from the environment that launches Claude Code and prefer a stable absolute path only when necessary. If the endpoint returns 401 or 403, repair authentication rather than retrying. If the process stays alive but exposes zero tools, inspect the server's discovery output and stderr. Restart the client only after a config or environment change that requires it.",
        ],
        bullets: [
          "Executable failure: command/PATH/permissions before package arguments.",
          "Connection failure: transport, URL, TLS, proxy, then authentication.",
          "Discovery failure: protocol compatibility, stderr, and tool/resource list responses.",
          "Tool failure: input schema, downstream credentials, rate limits, and handler logs.",
        ],
      },
    ],
    methodology: [
      "Commands and scope paths were checked against the official Claude Code docs and the locally installed CLI on 2026-08-12.",
      "A temporary project-scoped stdio definition was created successfully. Health checking did not finish within the observation window, so this page does not claim a successful client invocation.",
      "Examples use placeholder package names and credentials to avoid recommending an unreviewed third-party server as a universal default.",
    ],
    faq: [
      { question: "Where does Claude Code store local MCP servers?", answer: "Local-scoped servers are stored in `~/.claude.json` under the current project's path. This is different from `.claude/settings.local.json`, which is used for other local settings." },
      { question: "Should `.mcp.json` contain API keys?", answer: "No live key should be committed. Reference environment variables or the secret mechanism used by your organization, and grant the smallest scope the server needs." },
      { question: "Does `claude mcp list` prove a server is safe?", answer: "No. It can help verify configuration and health. Safety still requires source, package, permission, credential, network, and behavior review." },
    ],
    relatedLinks: [
      { href: "/remote-mcp-servers", label: "Remote MCP server directory", note: "Find declared hosted endpoints and review their evidence basis." },
      { href: "/guides/claude-mcp-list-command", label: "Claude MCP list command", note: "A narrower reference for listing and inspecting configured servers." },
      { href: "/guides/mcp-security-red-lines", label: "MCP security best practices", note: "Review trust boundaries before approving a command or credential." },
    ],
    sources: [CLAUDE_MCP, MCP_SECURITY],
  },

  "mcp-proxy-vs-gateway": {
    title: "MCP Proxy vs Gateway: Which Infrastructure Layer Do You Need?",
    excerpt: "Use an MCP proxy to bridge or mediate a connection; use an MCP gateway to centralize routing, identity, policy, and observability across many servers.",
    directAnswer: "An MCP proxy usually solves a connection or mediation problem for one path: translate a transport, terminate a connection, or forward requests. An MCP gateway governs a fleet: route among servers, apply identity and policy, rate-limit, and centralize audit. Vendor terminology varies, and a gateway may contain multiple proxies.",
    comparison: {
      caption: "These are infrastructure roles, not protocol-defined MCP product classes. Verify each vendor's actual feature set.",
      headers: ["Responsibility", "Proxy", "Gateway"],
      rows: [
        ["Primary job", "Bridge or mediate one connection path", "Govern and route many client/server paths"],
        ["Transport", "Often translates stdio, HTTP, or legacy SSE", "Usually terminates a common remote interface"],
        ["Identity/policy", "May pass through or add narrow controls", "Often centralizes authentication, authorization, allowlists, and quotas"],
        ["Discovery/routing", "Usually one upstream target", "May aggregate, select, or namespace multiple servers"],
        ["Audit", "Per-path logs", "Fleet-level logs and policy decisions"],
        ["Blast radius", "Usually limited to the proxied path", "Larger if the shared control plane fails or is misconfigured"],
      ],
    },
    visual: {
      title: "Three common deployment shapes",
      caption: "A gateway can own policy while separate proxies handle local process or transport boundaries.",
      items: [
        { label: "Direct", description: "Host connects to one server with no intermediary." },
        { label: "Proxy", description: "An intermediary bridges one client/server path." },
        { label: "Gateway", description: "A shared entry point applies routing and policy." },
        { label: "Gateway + proxies", description: "Central policy with edge-specific transport adapters." },
      ],
    },
    sections: [
      { heading: "Start with the problem, not the product label", body: ["If a local stdio server must be reachable over HTTP, that is a transport-boundary problem and a proxy can be enough. If many teams need a shared endpoint, consistent identity, allowlists, quotas, audit, and lifecycle controls, the problem is a gateway. Buying a gateway for a single transport bridge adds an unnecessary control plane; treating a proxy as fleet governance leaves policy scattered."] },
      { heading: "A proxy does not automatically preserve security semantics", body: ["A proxy that forwards OAuth or API tokens can become a confused deputy. Current MCP security guidance forbids accepting tokens that were not issued for the MCP server and passing them through unchecked. Document which component is the OAuth client, which resource a token targets, where consent occurs, and which identity reaches the downstream service."], bullets: ["Terminate TLS and validate the upstream destination.", "Keep token audience separation between the MCP endpoint and downstream APIs.", "Define whether the proxy rewrites tool names, schemas, errors, or timeouts.", "Log correlation IDs without logging credentials or full sensitive payloads."] },
      { heading: "A gateway centralizes controls and centralizes failure", body: ["Central routing, tool allowlists, schema monitoring, rate limits, and audit can reduce inconsistent enforcement. The trade-off is a wider blast radius: a bad route, stale cache, identity mapping error, or outage can affect every connected server. Run the gateway as production infrastructure with health checks, policy tests, change review, and an escape path for critical workflows."] },
      { heading: "Decide by team shape", body: ["A solo developer usually needs direct connections or one lightweight proxy. A small team may use a shared remote endpoint when it eliminates repeated local setup. A platform team serving many groups should evaluate a gateway when it can name the policies it will enforce and the evidence it will produce. 'Enterprise' alone is not a requirement."] },
      { heading: "Validate the chosen architecture", body: ["Trace one request end to end: discovery, tool selection, authorization, downstream call, response, cancellation, and logs. Then repeat with an unreachable upstream, an expired token, a schema change, and a slow tool. Measure added latency in your environment; do not copy a vendor benchmark into an architecture decision."] },
    ],
    methodology: ["Protocol claims use current MCP architecture and security documentation.", "Gateway capabilities are described as common product behavior, not as requirements imposed by the MCP specification.", "No universal latency or security improvement is claimed; both depend on the implementation and deployment."],
    faq: [
      { question: "Is an MCP gateway part of the MCP specification?", answer: "No. Gateway and proxy are infrastructure/product terms used inconsistently by vendors. MCP defines protocol behavior; you must inspect what a product actually routes, transforms, authenticates, and logs." },
      { question: "Can I use a proxy and a gateway together?", answer: "Yes. Edge proxies can bridge local or legacy transports while a gateway provides a shared entry point and centralized policy." },
      { question: "Does a gateway make MCP secure?", answer: "No. It can enforce controls, but it also becomes a high-value shared component. Secure identity, token audience, policy, isolation, logging, and change management still have to be designed and tested." },
    ],
    relatedLinks: [
      { href: "/remote-mcp-servers", label: "Remote MCP servers", note: "Inspect the hosted endpoints a proxy or gateway may front." },
      { href: "/guides/mcp-remote", label: "Remote MCP connection guide", note: "Configuration mechanics for reaching a remote server." },
      { href: "/guides/mcp-security-red-lines", label: "MCP security best practices", note: "Token, consent, isolation, and monitoring controls." },
      { href: "/guides/mcp-server-hosting", label: "MCP server hosting", note: "Deployment concerns behind the intermediary." },
    ],
    sources: [MCP_ARCHITECTURE, MCP_SECURITY, { label: "Microsoft MCP Gateway documentation", url: "https://microsoft.github.io/mcp-gateway/", retrievedAt: VERIFIED_AT }],
  },

  "mcp-security-red-lines": {
    title: "MCP Security Best Practices: Source, Identity, Permissions, and Runtime",
    excerpt: "Treat every MCP server as a separate trust domain: verify source and identity, minimize privilege, isolate execution, and monitor tool and schema changes.",
    directAnswer: "Treat each MCP server as an independent trust domain. Verify the repository/package/endpoint identity, grant the smallest useful permissions, isolate local execution or constrain remote egress, validate token audience, require consent for consequential tools, and monitor tool-schema and behavior changes. TrustScore is a screening signal, not a security certification.",
    comparison: {
      caption: "MCP Radar can expose observable signals; it does not replace security testing or an authorization review.",
      headers: ["Control area", "Minimum control", "Useful evidence", "What does not prove safety"],
      rows: [
        ["Source", "Match publisher, package, repo, release", "Signed release, registry identity, reviewed code", "Stars or a familiar name"],
        ["Credential", "Least privilege and correct audience", "Scopes, token issuer/audience, rotation path", "A secret stored in an env variable"],
        ["Runtime", "Restrict files, network, process privileges", "Sandbox policy and egress logs", "Running locally"],
        ["Tool behavior", "Review schemas and consequential actions", "Versioned tool inventory and approvals", "A successful tools/list response"],
        ["Operations", "Log, detect change, revoke, recover", "Correlation IDs, alerts, incident runbook", "Recent commits alone"],
      ],
    },
    visual: {
      title: "Threat boundary: follow data and authority",
      caption: "Every arrow can carry sensitive context or delegated authority. Review both the server and its downstream services.",
      items: [
        { label: "User + host", description: "Prompt, local files, approvals, and client privileges." },
        { label: "MCP client", description: "Discovery, tool selection, credentials, and session state." },
        { label: "MCP server", description: "Third-party code or hosted operator with its own trust boundary." },
        { label: "Downstream", description: "APIs, databases, SaaS accounts, networks, and stored data." },
      ],
    },
    sections: [
      { heading: "Before install: resolve source and package identity", body: ["Match the server name to the publisher, repository, package identifier, release artifact, and documented command. Look for ownership changes, typo-squatting, unreviewed install scripts, dependency drift, and a mismatch between the registry entry and the code that actually executes. Pin versions when your change process requires reproducibility, then plan how updates will be reviewed.", "Open source improves inspectability; it does not prove that the reviewed commit matches the installed package or that the code is vulnerability-free."] },
      { heading: "Credentials: validate audience and minimize scope", body: ["For remote authorization, the access token must be intended for the MCP resource. Current MCP security guidance explicitly rejects token passthrough: a server must not accept a token issued for another service and simply forward it. Use narrow scopes, short lifetimes, secure storage, revocation, and explicit consent for sensitive capabilities.", "For local stdio servers, environment-based credentials may be practical, but the child process inherits them and may log or exfiltrate them. Supply only the credential that server needs, not a broad shell environment or an account-wide administrator token."] },
      { heading: "Runtime: local and remote fail differently", body: ["A local MCP server is executable code running with the client's operating-system privileges. Prefer stdio for a private child-process channel, restrict filesystem and network access, and use a sandbox or container where the risk warrants it. A remote server moves execution to an operator, but sends requests and possibly credentials across a network boundary; require HTTPS, inspect authentication, and understand retention and subprocessors."] },
      { heading: "Tools and prompts are an integrity surface", body: ["Tool descriptions and schemas influence model selection and arguments. Record the approved inventory, review additions or permission changes, and require human confirmation for destructive, external-message, financial, administrative, or irreversible actions. Treat content returned by tools and resources as untrusted data that can contain prompt injection.", "Cross-server workflows amplify risk: one server can retrieve untrusted instructions and another can execute an action. Keep data sources and action tools in separate permission domains and show the user the actual action and arguments before commitment."] },
      { heading: "Monitor, revoke, and recover", body: ["Log server identity, tool name, approved arguments or a privacy-preserving digest, result status, latency, and correlation ID. Never log access tokens. Alert on new tools, changed schemas, unusual destinations, repeated authorization failures, and spikes in destructive operations. Maintain a fast path to disable the server, revoke its credential, preserve evidence, and restore affected data."] },
      { heading: "Printable pre-production checklist", body: ["Use MCP Radar fields to prioritize review, not to skip it. Registry presence, repository auditability, runnable entry, maintenance activity, adoption, and sandbox install evidence answer narrow questions. None of them certifies the server, its operator, dependencies, downstream API, deployment, or suitability for your data."], bullets: ["Identity matched across registry, repository, package/endpoint, and release.", "Permissions and credential scopes enumerated; token audience validated.", "Local filesystem/network/process access or remote data flow documented.", "Tool/resource/prompt inventory reviewed and consequential actions gated.", "Logs redact secrets; schema/ownership changes trigger review.", "Disable, revoke, incident, backup, and recovery paths exercised."] },
    ],
    methodology: ["Normative protocol claims come from current MCP security and authorization guidance.", "The checklist separates observable directory signals from controls that require code, deployment, identity, or runtime testing.", "This is engineering guidance, not a certification or a substitute for a threat model specific to your data and organization."],
    faq: [
      { question: "Is an official-registry MCP server safe?", answer: "Registry identity is useful provenance, not a security certification. Review the executable artifact, permissions, dependencies, operator, downstream systems, and runtime behavior." },
      { question: "Are local MCP servers safer than remote servers?", answer: "Not categorically. Local servers avoid a hosted operator but run code with local privileges. Remote servers reduce local installation but send data and credentials across a network and operator boundary." },
      { question: "Does TrustScore measure vulnerabilities?", answer: "No. It summarizes public maintenance, adoption, usability, health, and community signals. It does not run a penetration test, inspect every dependency, or certify data handling." },
    ],
    relatedLinks: [
      { href: "/guides/choosing-mcp-server", label: "Choosing an MCP server", note: "Use public signals to narrow the candidate set." },
      { href: "/guides/mcp-production-checklist", label: "Production checklist", note: "Turn selection into rollout and operational gates." },
      { href: "/remote-mcp-servers", label: "Remote MCP servers", note: "Review endpoint evidence and the remote trust boundary." },
      { href: "/graveyard", label: "MCP graveyard", note: "Identify archived or stale dependencies before rollout." },
    ],
    sources: [MCP_SECURITY, { label: "MCP — understanding authorization", url: "https://modelcontextprotocol.io/docs/tutorials/security/authorization", retrievedAt: VERIFIED_AT }, { label: "OWASP MCP Security Cheat Sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/MCP_Security_Cheat_Sheet.html", retrievedAt: VERIFIED_AT }],
  },

  "cursor-mcp-spawn-npx-enoent": {
    title: "Fix Cursor MCP `spawn npx ENOENT` on macOS, Linux, and Windows",
    excerpt: "ENOENT happens before the MCP package starts. Make Cursor find the executable first, then test package resolution, protocol discovery, and tools separately.",
    directAnswer: "`spawn npx ENOENT` means Cursor could not launch the configured executable; the MCP package has not run yet. Verify the `npx` path visible to the Cursor process, relaunch Cursor after PATH changes, and use the OS-appropriate executable or launcher. Then continue testing package resolution and MCP discovery as separate stages.",
    comparison: {
      caption: "Classify the first failed stage before editing package names, timeouts, or credentials.",
      headers: ["Observed error", "Failed stage", "First check"],
      rows: [
        ["spawn npx ENOENT", "Executable lookup", "Cursor process PATH or full command path"],
        ["npm E404 / package not found", "Package resolution", "Package identifier and registry"],
        ["Process exits immediately", "Server startup", "stderr, runtime version, required environment"],
        ["Handshake/discovery error", "MCP protocol", "Server logs and current protocol support"],
        ["Connected but no tools", "Capability discovery", "MCP Logs and tools/resources exposed"],
      ],
    },
    visual: {
      title: "The launch pipeline",
      caption: "ENOENT is stage one. Fixing it only proves that the operating system located a command.",
      items: [
        { label: "Locate executable", description: "Cursor resolves `command` using its own environment." },
        { label: "Resolve package", description: "npx contacts a registry or cache for the named package." },
        { label: "Start server", description: "The package loads runtime, config, and credentials." },
        { label: "Discover MCP", description: "Cursor connects and learns the exposed capabilities." },
      ],
    },
    sections: [
      { heading: "Run the 60-second checklist", body: ["Open Cursor's Output panel with Cmd+Shift+U on macOS or Ctrl+Shift+U on Windows/Linux, choose MCP Logs, and copy the first error without secrets. In a terminal, locate `npx`; then compare that path with the command in `.cursor/mcp.json` or `~/.cursor/mcp.json`. If Node was installed or changed while Cursor was open, fully quit and relaunch the app."], bullets: ["Confirm Node and npm/npx are installed for the same user that runs Cursor.", "Confirm the config uses `command` for stdio and `url` for a remote server.", "Test the package command in a clean terminal before testing inside Cursor.", "Do not add a long timeout to an executable-not-found error."] },
      { heading: "Why the terminal and Cursor can see different PATH values", body: ["A GUI application may inherit its environment from the desktop session rather than an interactive shell startup file. Node version managers commonly modify PATH only when a shell initializes. Cursor therefore may not see the same `npx` that `which npx` or `where npx` finds in your terminal.", "An absolute path is a useful diagnostic and sometimes a stable fix, but version-manager paths can change after upgrades. Prefer a stable launcher path or ensure the desktop environment receives the intended Node installation."] },
      { heading: "macOS and Linux checks", body: ["Use `command -v npx` or `which npx`, then run that exact path with `--version`. Put the resolved executable in the config temporarily, relaunch Cursor, and watch MCP Logs. If this fixes ENOENT, decide whether to keep the stable path or repair the environment that launches Cursor."], codeBlocks: [{ label: "Locate and test npx", language: "bash", code: "command -v npx\nnpx --version\n# Example diagnostic only:\n# \"command\": \"/absolute/path/to/npx\"" }] },
      { heading: "Windows checks: `npx.cmd` and `cmd.exe /c`", body: ["Use `where npx` and `where node` in Command Prompt. Node's child-process documentation explains that `.cmd` files are not executable on their own on Windows; a launcher may need a shell or `cmd.exe /c`. Cursor's current docs require the command to be on PATH or supplied as a full path. Preserve JSON escaping for backslashes and quote paths with spaces correctly."], codeBlocks: [{ label: "Locate Windows launchers", language: "bat", code: "where node\nwhere npm\nwhere npx\nnpx --version" }, { label: "Fallback config shape when direct npx launch fails", language: "json", code: "{\n  \"mcpServers\": {\n    \"example\": {\n      \"type\": \"stdio\",\n      \"command\": \"C:\\\\Windows\\\\System32\\\\cmd.exe\",\n      \"args\": [\"/d\", \"/s\", \"/c\", \"npx.cmd\", \"-y\", \"example-mcp-server\"]\n    }\n  }\n}" }] },
      { heading: "Verify the fix in MCP Logs", body: ["After ENOENT disappears, expect a different result: a running process, a package error, an initialization/discovery error, or listed capabilities. Cursor documents MCP Logs in the Output panel and shows server initialization, tool calls, and errors there. A successful process launch is not proof that the package initialized, exposed tools, or is safe."] },
      { heading: "Know when this guide no longer applies", body: ["If npm reports a missing package, correct the package name or registry. If the process exits, read stderr for runtime or credential requirements. If it connects but times out or exposes no tools, move to protocol, auth, or handler diagnostics. Keep the original error and sanitized config in an escalation packet so maintainers can reproduce the same stage."] },
    ],
    methodology: ["Cursor configuration and log locations were verified from current official Cursor docs on 2026-08-12.", "Windows `.cmd` behavior is based on official Node child-process documentation.", "Cursor IDE is not installed in this environment, and Windows/Linux were not locally reproduced. Those experience gaps are disclosed rather than presented as tests."],
    faq: [
      { question: "Does `spawn npx ENOENT` mean the MCP package is broken?", answer: "No. The operating system could not locate or execute the configured `npx` command, so the package did not start." },
      { question: "Should I always hardcode an absolute npx path?", answer: "No. It is a strong diagnostic and can be a fix, but version-manager paths may change. A stable Node installation or launcher environment can be easier to maintain." },
      { question: "Where are Cursor MCP logs?", answer: "Open the Output panel with Cmd+Shift+U or Ctrl+Shift+U and select MCP Logs from the dropdown." },
    ],
    relatedLinks: [
      { href: "/guides/best-mcp-servers-for-cursor", label: "Best MCP servers for Cursor", note: "Use the evidence labels before adding another server." },
      { href: "/guides/mcp-error-32001-timeout", label: "MCP request timeout", note: "Continue here after the process launches but a request stalls." },
      { href: "/guides/mcp-security-red-lines", label: "MCP security best practices", note: "Review the command before making Cursor execute it." },
    ],
    sources: [CURSOR_MCP, { label: "Node.js — child process", url: "https://nodejs.org/api/child_process.html", retrievedAt: VERIFIED_AT }],
  },

  "mcp-error-32001-timeout": {
    title: "MCP Error -32001: Diagnose Request Timed Out by Stage",
    excerpt: "Locate the stage that exceeded its timeout—launch, discovery, authentication, upstream call, or handler—before increasing any timeout.",
    directAnswer: "`-32001: Request timed out` is not one protocol-wide diagnosis. First prove that the process or HTTP endpoint is reachable, then isolate discovery, capability listing, authentication, and the specific tool handler. Increase a client/server timeout only after logs show a healthy operation that legitimately needs more time.",
    comparison: {
      caption: "The same client-visible timeout can originate at different layers; capture timestamps at each boundary.",
      headers: ["Stage", "Probe", "Likely evidence", "Fix direction"],
      rows: [
        ["Local process", "Launch exact command", "No PID or immediate exit", "PATH, runtime, args, stderr"],
        ["Remote endpoint", "DNS/TLS/HTTP reachability", "Connect/TLS/401/404", "URL, network, auth discovery"],
        ["Discovery/list", "Connect and enumerate capabilities", "Long gap before tool list", "Protocol/SDK compatibility, server startup"],
        ["Tool handler", "Call one small read-only tool", "Request reaches handler then stalls", "Upstream latency, deadlock, pagination"],
        ["Result delivery", "Correlate server completion and client receipt", "Server ends but client waits", "Transport/session/proxy buffering"],
      ],
    },
    visual: {
      title: "Timeout stage map",
      caption: "Add a timestamp and correlation ID at every boundary; the largest gap identifies the next owner.",
      items: [
        { label: "Reach", description: "Process starts or HTTP connection completes." },
        { label: "Discover", description: "Client and server agree on capabilities." },
        { label: "Authorize", description: "Credential and required scope are accepted." },
        { label: "Execute", description: "Handler and downstream dependency return." },
      ],
    },
    sections: [
      { heading: "Fast triage: capture the first slow boundary", body: ["Record the client version, server identity/version, transport, request name, start time, end/error time, and a correlation ID. Check server stderr or structured logs at the same clock. Do not paste tokens, authorization headers, database rows, or private prompts into an issue.", "Repeat with the smallest non-destructive request. A broad agent task can hide several sequential calls, retries, or upstream waits."] },
      { heading: "Local stdio versus remote HTTP", body: ["For stdio, run the exact command and arguments in the intended working directory, then inspect stderr. stdout is reserved for protocol messages and stray logging can corrupt the stream. For a remote endpoint, check DNS, TLS, redirects, HTTP status, proxy behavior, and authorization discovery before investigating tool code."] },
      { heading: "Discovery, capability listing, and auth", body: ["A process can be alive while discovery or a list operation stalls. Compare the server's current protocol support with the client, and inspect whether capability enumeration depends on a slow upstream API. A 401 or authorization flow that never completes is not solved by giving a tool call more time; repair the credential, issuer, audience, scope, callback, or consent path."] },
      { heading: "Upstream API and handler latency", body: ["Instrument the handler around validation, queueing, downstream DNS/connect, API response, transformation, and result write. Bound retries and pagination. For legitimately long work, use progress, cancellation, or a durable task pattern supported by the implementation rather than holding an opaque request open indefinitely."] },
      { heading: "Change a timeout only after diagnosis", body: ["Timeout settings belong to particular clients, SDKs, gateways, or servers. There is no safe universal environment variable or default for every MCP stack. If the normal operation completes reliably just beyond a known limit, make the smallest documented change and retain an upper bound, cancellation, and alerting."] },
      { heading: "Prepare an escalation packet", body: ["Include sanitized config, versions, transport, one minimal request, timestamps, correlation ID, client error, server logs, and whether the same server works in another client or Inspector. State which stage is proven healthy and which boundary has the unexplained gap. That packet is far more actionable than the error code alone."] },
    ],
    methodology: ["This page does not assign one universal root cause or default timeout to `-32001`.", "The stage model follows current MCP architecture and debugging guidance; exact settings must be verified in the affected client/server.", "No controlled delayed-handler benchmark was run in this task, so no performance numbers are published."],
    faq: [
      { question: "What does MCP error -32001 mean?", answer: "In affected implementations it is surfaced as a request timeout, but the code does not identify one protocol-wide layer or cause. Use logs and timestamps to find the stalled boundary." },
      { question: "Should I increase MCP_TIMEOUT?", answer: "Only if the tested client documents that setting and logs show a healthy operation that needs longer. It will not repair a missing executable, bad URL, failed auth, or deadlocked handler." },
      { question: "What logs should I share?", answer: "Share versions, sanitized config, request name, timestamps, correlation IDs, and relevant client/server errors. Remove tokens, headers, private prompts, and sensitive tool results." },
    ],
    relatedLinks: [
      { href: "/guides/mcp-production-checklist", label: "MCP production checklist", note: "Add liveness, timeouts, cancellation, and observability before rollout." },
      { href: "/guides/mcp-server-hosting", label: "MCP server hosting", note: "Inspect deployment and network bottlenecks." },
      { href: "/remote-mcp-servers", label: "Remote MCP servers", note: "Compare declared endpoints and current lifecycle evidence." },
    ],
    sources: [MCP_ARCHITECTURE, { label: "Model Context Protocol — debugging", url: "https://modelcontextprotocol.io/docs/tools/debugging", retrievedAt: VERIFIED_AT }, CLAUDE_MCP, CURSOR_MCP],
  },

  "rag-vs-mcp": {
    title: "RAG vs MCP: Retrieval Architecture, Interoperability Protocol, or Both?",
    excerpt: "RAG retrieves indexed knowledge for generation; MCP standardizes how an AI host discovers and invokes external context and actions. Most real systems can use both.",
    directAnswer: "RAG and MCP solve different problems. RAG is an architecture for retrieving relevant knowledge and supplying it to generation; MCP is a protocol for discovering and invoking external capabilities. Use RAG for indexed corpus retrieval, MCP for standardized live access and actions, and expose a RAG service through MCP when you need both.",
    comparison: {
      caption: "This is a layer comparison, not a universal quality or latency benchmark.",
      headers: ["Question", "RAG", "MCP"],
      rows: [
        ["Primary role", "Retrieve relevant knowledge for generation", "Standardize host-to-server context and action exchange"],
        ["Data preparation", "Usually chunking, indexing, embeddings or another retriever", "Depends on the server; no index is required by the protocol"],
        ["Freshness", "Bound by ingestion/update pipeline", "Can call live systems, but freshness depends on the server"],
        ["Actions", "Not inherent", "Tools can perform reads or writes"],
        ["Portability", "Architecture and APIs vary", "Common discovery and invocation protocol across compatible hosts"],
        ["Failure boundary", "Retriever/index/corpus/model", "Host/client/server/transport/downstream"],
      ],
    },
    visual: {
      title: "Three valid system shapes",
      caption: "MCP may expose retrieval as a tool or resource; it does not replace the retrieval system behind it.",
      items: [
        { label: "RAG only", description: "Application retrieves from an index and builds model context." },
        { label: "MCP only", description: "Host calls live tools/resources without a separate retrieval index." },
        { label: "RAG behind MCP", description: "An MCP server exposes search/retrieval to multiple hosts." },
        { label: "Combined workflow", description: "Retrieve evidence, then use another tool for an action." },
      ],
    },
    sections: [
      { heading: "Do not compare a retrieval architecture to a wire protocol as substitutes", body: ["The original RAG work combines a generator's parametric memory with retrieved non-parametric memory. MCP defines participants, discovery, primitives, and transports between an AI host and capability servers. Replacing a vector database with an MCP connection does not create retrieval; adding RAG does not create a reusable cross-client tool interface."] },
      { heading: "Choose RAG for a corpus question", body: ["Use RAG when the core task is finding relevant passages across a document collection, controlling chunking and ranking, preserving source metadata, and updating an index on a known schedule. Evaluate retrieval recall and answer grounding with a disclosed corpus and question set. Do not infer quality from the label 'RAG' alone."] },
      { heading: "Choose MCP for a capability boundary", body: ["Use MCP when multiple compatible hosts need to discover a server's tools, resources, or prompts; when the system must call live APIs or perform actions; or when you want a consistent protocol boundary around an existing service. MCP can expose data, but the server still owns authorization, query semantics, caching, and downstream reliability."] },
      { heading: "Use both for governed live knowledge workflows", body: ["A retrieval service can expose `search_documents` as a tool, a document or schema as a resource, and a guided research prompt. Another MCP server can then create an issue or update a system based on the retrieved evidence. Separate read-only retrieval credentials from action credentials and keep user confirmation between evidence and consequential writes."] },
      { heading: "Measure the same task before making performance claims", body: ["For a fair comparison, freeze a corpus, model, queries, top-k policy, MCP client/server versions, and downstream service. Capture retrieval metrics, end-to-end latency, context size, answer citations, and failures. This page does not generalize third-party latency or cost figures because those values depend on the exact implementation."] },
    ],
    methodology: ["Definitions use the original RAG paper and current MCP architecture documentation.", "No claim is made that either layer universally improves accuracy, latency, or cost.", "The worked architecture separates retrieval evidence from action authority to make the security boundary explicit."],
    faq: [
      { question: "Does MCP replace RAG?", answer: "No. MCP can expose a retrieval system, but the corpus, indexing, retriever, ranking, and evaluation still belong to the RAG implementation." },
      { question: "Can an MCP resource be a vector database?", answer: "A server can expose retrieved data or metadata through resources or tools. The vector database remains a downstream implementation detail, not an MCP primitive." },
      { question: "When should I use both?", answer: "Use both when compatible AI hosts need standardized access to indexed knowledge and the workflow also benefits from live tools or actions." },
    ],
    relatedLinks: [
      { href: "/what-is-mcp-server", label: "What is an MCP server?", note: "Understand the protocol participants and primitives." },
      { href: "/guides/mcp-resources-vs-tools", label: "MCP resources vs tools", note: "Choose how retrieval should be exposed." },
      { href: "/category/search", label: "Search MCP servers", note: "Browse current search and knowledge integrations." },
      { href: "/guides/mcp-security-red-lines", label: "MCP security", note: "Separate untrusted retrieved content from action tools." },
    ],
    sources: [MCP_ARCHITECTURE, { label: "Lewis et al. — Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks", url: "https://arxiv.org/abs/2005.11401", retrievedAt: VERIFIED_AT }],
  },

  "a2a-vs-mcp": {
    title: "A2A vs MCP: Agent-to-Agent Coordination vs Tool and Context Access",
    excerpt: "MCP standardizes an AI host's access to external capabilities; A2A standardizes communication and task coordination between independent agents. A system may use both.",
    directAnswer: "MCP and A2A operate at different boundaries. MCP connects an AI host to tools, resources, and prompts; A2A coordinates messages, tasks, artifacts, and long-running work between independent agents. Use MCP inside an agent's capability layer, A2A between agents, or both in the same architecture.",
    keyFacts: [
      { label: "MCP docs", value: "2026-07-28", note: "Current architecture revision checked" },
      { label: "A2A release", value: "1.0.0", note: "Latest release reported by the current specification" },
      { label: "MCP boundary", value: "Host ↔ capability", note: "Tools, resources, prompts" },
      { label: "A2A boundary", value: "Agent ↔ agent", note: "Discovery, tasks, messages, artifacts" },
    ],
    comparison: {
      caption: "Protocol versions and roles were checked on 2026-08-12. Review again when either specification changes.",
      headers: ["Dimension", "MCP", "A2A"],
      rows: [
        ["Primary actors", "Host/client and MCP server", "A2A client and independent agent"],
        ["Discovery", "Server identity, versions, capabilities and primitives", "Agent Card with capabilities, skills and interfaces"],
        ["Work unit", "Primitive request such as tool call or resource read", "Message or task with status and artifacts"],
        ["Long-running work", "Progress/extensions depend on implementation", "Async-first task lifecycle is a core design goal"],
        ["Internal opacity", "Server implementation hidden behind primitives", "Agents collaborate without exposing internal state or tools"],
        ["Typical use", "Give an agent access to a database, browser, or API", "Delegate a job to another specialized agent"],
      ],
    },
    visual: {
      title: "Combined A2A + MCP architecture",
      caption: "A receiving agent may use its own MCP servers to complete the task and return an A2A artifact.",
      items: [
        { label: "Orchestrator agent", description: "Chooses a specialist and creates an A2A task." },
        { label: "A2A boundary", description: "Carries messages, task state, updates, and artifacts." },
        { label: "Specialist agent", description: "Owns reasoning and decides which capabilities it needs." },
        { label: "MCP boundary", description: "Connects the specialist host to tools and context servers." },
      ],
    },
    sections: [
      { heading: "Use MCP when the remote party is a capability", body: ["An MCP server exposes structured primitives to a host. The host can discover tools, resources, and prompts and route model-selected operations to the server. The server is not required to be an autonomous collaborator with its own public task lifecycle or skills card."] },
      { heading: "Use A2A when the remote party is an agent", body: ["A2A is designed for independent, potentially opaque agent systems to discover capabilities, exchange messages and artifacts, and coordinate synchronous or long-running tasks. The receiving agent can retain control of its internal model, memory, tools, and workflow while exposing a collaboration interface."] },
      { heading: "The same delegated task looks different", body: ["With MCP, the host discovers a tool schema and calls the operation with structured arguments, then receives tool content. With A2A, an orchestrator discovers an Agent Card, sends a message or creates a task, follows status or streaming updates, and receives artifacts. One is capability invocation; the other is delegated work coordination."] },
      { heading: "Use both without collapsing the trust boundaries", body: ["An orchestrator can delegate research to a specialist over A2A. That specialist can use MCP servers for search, files, or databases, then return an artifact over A2A. Authenticate and authorize both boundaries, propagate only the minimum user context, and preserve correlation IDs without forwarding credentials meant for another resource."] },
      { heading: "Decide with a non-goals checklist", body: ["Do not add A2A merely to call a deterministic function, and do not stretch an MCP tool call into a public multi-agent task protocol. Ask whether the remote party owns a task lifecycle, can negotiate modalities, and returns artifacts as an agent. If not, MCP or a regular API may be the simpler fit."] },
    ],
    methodology: ["A2A terminology and release state use the current official specification.", "The July 2026 comparative paper is treated as one implementation-grounded scenario, not as a universal performance benchmark.", "No claim is made that one protocol is faster, safer, or a replacement for the other."],
    faq: [
      { question: "Is A2A a competitor to MCP?", answer: "They can overlap in implementation choices, but their primary boundaries differ: A2A coordinates independent agents; MCP exposes tools and context to hosts." },
      { question: "Can an A2A agent use MCP servers?", answer: "Yes. An agent receiving an A2A task can use MCP internally to access tools or data and return the resulting artifact." },
      { question: "Which protocol should I implement first?", answer: "Start with the boundary you actually need. Use MCP for a capability integration; add A2A when independent agents must discover and coordinate delegated work." },
    ],
    relatedLinks: [
      { href: "/what-is-mcp-server", label: "What is an MCP server?", note: "Review the host/client/server boundary." },
      { href: "/guides/mcp-resources-vs-tools", label: "MCP resources vs tools", note: "Model capabilities inside the MCP layer." },
      { href: "/guides/rag-vs-mcp", label: "RAG vs MCP", note: "Separate another commonly confused architecture layer." },
    ],
    sources: [MCP_ARCHITECTURE, { label: "A2A Protocol Specification 1.0.0", url: "https://a2a-protocol.org/latest/specification", retrievedAt: VERIFIED_AT }, { label: "Comparative Study of MCP and A2A (July 2026)", url: "https://arxiv.org/abs/2607.23884", retrievedAt: VERIFIED_AT }],
  },

  "mcp-vs-cli": {
    title: "MCP vs CLI: Choose the Interface Per Integration",
    excerpt: "Prefer an existing, well-known CLI for local developer loops; prefer MCP for standardized discovery, typed schemas, per-user auth, and cross-client reuse. Mix them per tool.",
    directAnswer: "Choose per integration. A mature CLI is often the simplest interface for local developer tasks the model and humans already understand. MCP is stronger when compatible hosts need structured discovery, schemas, reusable connections, or per-user authorization. A practical stack uses both instead of declaring one universal winner.",
    comparison: {
      caption: "Actual context size, latency, and reliability depend on the client, command, tool schema, and task. No fixed multiplier is claimed.",
      headers: ["Dimension", "CLI", "MCP"],
      rows: [
        ["Discovery", "Help text, docs, shell knowledge", "Protocol capability and primitive discovery"],
        ["Inputs", "Strings, flags, files, stdin", "Structured arguments described by schemas"],
        ["Outputs", "Text/JSON/exit code", "Structured protocol content and errors"],
        ["Auth", "Shell config, files, env, vendor login", "Server/client-specific local credentials or remote OAuth"],
        ["Portability", "Strong where the CLI is installed", "Strong across compatible MCP hosts"],
        ["Human use", "First-class terminal workflow", "Usually mediated by an AI host"],
        ["Governance", "Shell/endpoint controls can be strong", "Host/server policies can be strong"],
      ],
    },
    visual: {
      title: "Same task, two interface paths",
      caption: "The downstream service may be identical; the difference is how the host discovers, invokes, and validates it.",
      items: [
        { label: "User request", description: "The intent begins in the same place." },
        { label: "Host chooses", description: "Run a command or call a discovered MCP tool." },
        { label: "Interface executes", description: "CLI parses flags; MCP server validates structured arguments." },
        { label: "Result returns", description: "Text/JSON or MCP content is supplied back to the model." },
      ],
    },
    sections: [
      { heading: "Prefer CLI for a mature local developer loop", body: ["Use the CLI when it already provides stable commands, machine-readable output, useful exit codes, and a working authentication story. Humans can reproduce the command directly, CI can run it, and the model may already know common tools. Pin dangerous actions behind review and request JSON output when available."] },
      { heading: "Prefer MCP for reusable structured capability access", body: ["Use MCP when multiple compatible hosts should discover the same capabilities, arguments need schemas, a remote service needs a standardized connection, or per-user auth and tool approvals belong in the host. The MCP server can wrap an existing CLI, but it should translate failures and schemas deliberately rather than shelling out blindly."] },
      { heading: "Context and token cost must be measured", body: ["A host may load tool definitions, discover them progressively, or keep a large registry in context. A CLI path may spend tokens on help text, command construction, and parsing verbose output. Either can be smaller for a particular task. Measure the definitions and results actually sent to your model instead of repeating a third-party fixed ratio."] },
      { heading: "Auth, audit, and failure recovery exist on both sides", body: ["CLI tools can use OS accounts, configuration profiles, audited shells, and policy wrappers. MCP can use host approvals, structured logs, OAuth, and gateway policies. Neither interface automatically supplies complete governance. Compare the identity that reaches the downstream service, the action log, revocation, retries, cancellation, and recovery."] },
      { heading: "Use a hybrid decision tree", body: ["Start with the simplest existing interface. If a reliable CLI already solves the task, keep it. Add an MCP wrapper when the schema, cross-client reuse, remote auth, or managed discovery produces measurable value. Keep both when humans and automation need the CLI while AI hosts benefit from MCP. Retire one only after observing real duplication or maintenance cost."] },
    ],
    methodology: ["No fixed token, cost, or latency advantage is published because no controlled cross-client benchmark was run for this batch.", "Recommendations account for current Claude Code and Cursor support for terminal commands and MCP tools.", "The decision unit is one integration, not an organization-wide mandate."],
    faq: [
      { question: "Is MCP always easier for an AI agent than a CLI?", answer: "No. A well-known CLI with JSON output may be simpler. MCP adds value when discovery, schemas, reusable connections, or host-level controls matter." },
      { question: "Can an MCP server wrap a CLI?", answer: "Yes. The wrapper should validate structured inputs, constrain commands, translate errors, and avoid exposing arbitrary shell execution." },
      { question: "Which uses fewer tokens?", answer: "It depends on tool definitions, discovery strategy, help text, command output, client behavior, and the task. Measure the actual context and result sizes in your stack." },
    ],
    relatedLinks: [
      { href: "/guides/claude-code-mcp-config", label: "Claude Code MCP config", note: "Set up the MCP side with current scopes." },
      { href: "/guides/best-mcp-servers-for-cursor", label: "MCP servers for Cursor", note: "Compare MCP picks with Cursor's built-in and terminal tools." },
      { href: "/guides/mcp-resources-vs-tools", label: "Resources vs tools", note: "Choose the primitive if MCP wins the interface decision." },
      { href: "/guides/mcp-security-red-lines", label: "MCP security", note: "Review both shell and MCP execution boundaries." },
    ],
    sources: [MCP_ARCHITECTURE, CLAUDE_MCP, CURSOR_MCP],
  },

  "mcp-resources-vs-tools": {
    title: "MCP Resources vs Tools vs Prompts: Choose the Right Primitive",
    excerpt: "Resources provide application-controlled context, tools expose model-invoked operations, and prompts package user-invoked workflows. Use the least powerful primitive that fits.",
    directAnswer: "MCP resources expose context the application chooses to read or attach; MCP tools expose executable operations the model can request; MCP prompts expose reusable workflows the user invokes. Start with the least powerful primitive that satisfies the task, and separate read context from consequential actions.",
    comparison: {
      caption: "Control semantics follow the current MCP server overview; a host may present these capabilities through different UI patterns.",
      headers: ["Primitive", "Primary controller", "Best for", "Side effects", "Core operations"],
      rows: [
        ["Resource", "Application", "Documents, schemas, records, reference context", "Interaction is read-oriented; the backing data may still change", "resources/list, resources/read"],
        ["Tool", "Model", "Queries, computations, API calls, writes and other operations", "May be read-only or consequential", "tools/list, tools/call"],
        ["Prompt", "User", "Reusable, parameterized workflows and instructions", "Indirect; can guide use of resources/tools", "prompts/list, prompts/get"],
      ],
    },
    visual: {
      title: "Control flows before capability",
      caption: "The least-powerful rule reduces accidental authority while keeping the user task clear.",
      items: [
        { label: "User chooses workflow", description: "A prompt packages an explicit reusable starting point." },
        { label: "Application supplies context", description: "A resource is selected and attached or read." },
        { label: "Model requests operation", description: "A tool call proposes structured arguments." },
        { label: "Host enforces policy", description: "The application approves, executes, and returns results." },
      ],
    },
    sections: [
      { heading: "Use a resource when the application should control context", body: ["A resource is a named or templated data source that a client can discover and read. It fits file contents, database schemas, API documentation, records, or other reference material. Resource interaction is read-oriented, but do not call the underlying world immutable: the backing file, database, or API can change between reads."] },
      { heading: "Use a tool when the model must request an operation", body: ["A tool has a name, description, input schema, and execution result. It fits calculations, searches, live queries, file changes, messages, deployments, and downstream API calls. Mark read-only behavior precisely, validate arguments server-side, and put human approval in front of consequential operations."] },
      { heading: "Model the same domain both ways", body: ["For a support system, `support://policies/refunds` can be a resource the application attaches as policy context. `lookup_order` can be a read-only tool using an order ID. `issue_refund` is a consequential tool with a separate scope and confirmation. A `resolve_refund_case` prompt can guide the user through the sequence without owning the underlying authority."] },
      { heading: "Caching, pagination, tokens, and errors", body: ["Use resources when application-controlled selection and caching match the data. Use tools when a parameterized operation or fresh computation is required. Both lists can be paginated and both paths can produce errors. Token use depends on the host: loading a large resource can cost more than a narrow tool result, while loading many tool definitions can cost more than a focused resource. Measure your client/model path."] },
      { heading: "Avoid common anti-patterns", body: ["Do not expose an arbitrary SQL or shell tool when a narrow resource or typed query tool is enough. Do not hide a write inside a tool described as 'get' or 'sync'. Do not make every static document a tool merely because tools are familiar. Do not split the same primitive comparison into separate near-duplicate URLs; prompts belong in this three-way decision."] },
      { heading: "Decision tree", body: ["If the user is choosing a reusable workflow, start with a prompt. If the application needs to supply named context without asking the model to execute an operation, use a resource. If the model must request a parameterized query, computation, or action, use a tool. When a task spans all three, keep their permissions and control semantics distinct."] },
    ],
    methodology: ["Definitions and control roles were checked against current official MCP architecture and server-concept documentation.", "This page does not claim universal token savings; client discovery and context strategies vary.", "The support example is a design illustration, not a tested vendor implementation."],
    faq: [
      { question: "Are MCP resources always read-only?", answer: "Resource interaction is read-oriented, but the backing system can change. Describe freshness, access control, caching, and mutation paths separately." },
      { question: "Can a tool only perform actions?", answer: "No. Tools can also retrieve information or compute results. Use a tool when a model-requested parameterized operation is the right control model." },
      { question: "Where do MCP prompts fit?", answer: "Prompts are user-controlled reusable templates. They can guide the model to use resources and tools without replacing either primitive." },
    ],
    relatedLinks: [
      { href: "/what-is-mcp-server", label: "What is an MCP server?", note: "See the full host/client/server architecture." },
      { href: "/guides/mcp-security-red-lines", label: "MCP security", note: "Apply permissions and approvals to tools and data." },
      { href: "/guides/mcp-production-checklist", label: "Production checklist", note: "Validate discovery, schemas, errors, and operations." },
      { href: "/guides/mcp-vs-function-calling", label: "MCP vs function calling", note: "Place MCP primitives in the model invocation stack." },
    ],
    sources: [MCP_ARCHITECTURE, MCP_SERVER_CONCEPTS, { label: "MCP specification — server overview", url: "https://modelcontextprotocol.io/specification/2025-06-18/server/index", retrievedAt: VERIFIED_AT }],
  },

  "best-mcp-servers-for-claude-code": {
    title: "Best MCP Servers for Claude Code: A Data-Backed Shortlist",
    excerpt: "Choose a small Claude Code server set by job, with transparent maintenance, adoption, permission, and compatibility evidence—not a universal must-have list.",
    directAnswer: "There is no universal best Claude Code stack. Start with one server for a repeated gap—documentation, repository, browser testing, database, or project tracking—and add another only after measuring value and tool clutter. The ranking below is a dated shortlist: only two catalog samples have stored sandbox verification; most compatibility rows are transport-derived, not Claude Code tool-call tests.",
    keyFacts: [
      { label: "Snapshot", value: "2,636 records", note: "Collected 2026-08-05" },
      { label: "Claude rows", value: "2,400", note: "2 verified · 2,398 derived" },
      { label: "Verified samples", value: "2", note: "Startup and tool list stored; not a full workflow review" },
      { label: "Refresh", value: "Monthly", note: "Recompute after ownership, archive, or client changes" },
    ],
    comparison: {
      caption: "Choose by job and evidence. A listing is not an endorsement and a derived transport match is not a successful Claude Code invocation.",
      headers: ["Job", "What to prefer", "What to avoid", "Verification goal"],
      rows: [
        ["Docs/context", "Narrow source, current corpus, citations", "Huge unfiltered context dumps", "Retrieve one current API answer with provenance"],
        ["Repository", "Official identity, scoped permissions, reversible reads", "Broad write/admin token by default", "Read one issue/PR before enabling writes"],
        ["Browser/testing", "Maintained browser engine and explicit target scope", "Unbounded profiles or saved sessions", "Open a local test page and return one observation"],
        ["Database", "Read-only credential and schema/query limits", "Production owner credentials", "List schema and run a bounded read query"],
        ["Project tracking", "Per-user auth and clear create/update scopes", "Silent external writes", "Read first; create only with confirmation"],
      ],
    },
    sections: [
      { heading: "Start with the smallest useful stack", body: ["For most coding sessions, one or two high-value servers are enough. Claude Code already has repository and terminal capabilities, so an MCP server should close a repeated gap rather than duplicate a built-in path. Begin with documentation or one system of record, then add browser, database, or project tools when the workflow proves it needs them."] },
      { heading: "How the live shortlist is computed", body: ["The table is generated from the active catalog rather than hand-written. Candidates must match a developer workflow category, declare Claude Code compatibility, and clear the displayed adoption floor. Duplicate repositories are collapsed; eligible entries are ordered by TrustScore, then stars. TrustScore combines public maintenance, adoption, usability, health, and community signals. It is not a security score."] },
      { heading: "Read the compatibility basis before the rank", body: ["The 2026-08-05 snapshot has 2,400 Claude Code compatibility rows. Only two are marked verified from stored sandbox startup and tool-list evidence; 2,398 are derived from a declared stdio or remote transport. Derived means 'configuration appears compatible,' not 'MCP Radar completed a Claude Code workflow.' Open each entity page and inspect the basis before installation."] },
      { heading: "Set up and smoke-test one pick", body: ["Add the server at local scope first, inspect it with `claude mcp list` and `claude mcp get`, open `/mcp`, and run one non-destructive task. Record the exact server identity, command/URL, auth scope, tools exposed, result, and date. Move a definition to project scope only after the team reviews the command and permission boundary."] },
      { heading: "Exclude servers that add more risk than leverage", body: ["Exclude a candidate when ownership or package identity is ambiguous, maintenance is stale, the requested credential is broader than the task, the same outcome is simpler through a trusted CLI, or the server exposes a large tool surface you will not use. A high rank cannot override a failed source, permission, or client test."] },
    ],
    methodology: ["Dataset frozen at 2026-08-05; client/docs checked 2026-08-12.", "Ranking is computed from public signals after a category, lifecycle, adoption, and declared-client gate.", "Two stored sandbox verifications prove startup and tool discovery only. The attempted current Claude Code health probe did not complete in the observation window and is not counted as a success.", "Paid upstream APIs and vendor plans are not assumed to be free; verify pricing on the chosen server's primary source."],
    faq: [
      { question: "How many MCP servers should I enable in Claude Code?", answer: "Start with one for a repeated gap and add only when the next server produces measurable value. More tools increase permission surface, selection ambiguity, and context overhead." },
      { question: "Does the ranking mean every server was tested in Claude Code?", answer: "No. The table requires a compatibility declaration, but most rows are transport-derived. The evidence basis is disclosed and only two catalog samples have stored sandbox startup/tool-list verification." },
      { question: "Should I share MCP config with my team?", answer: "Share a project-scoped definition only after reviewing the command, endpoint, source, and permissions. Keep live credentials out of `.mcp.json`." },
    ],
    relatedLinks: [
      { href: "/guides/claude-code-mcp-config", label: "Claude Code MCP configuration", note: "Add a server at the right scope and verify it." },
      { href: "/guides/claude-mcp-list-command", label: "Claude MCP list", note: "Inspect configured servers and health." },
      { href: "/guides/mcp-security-red-lines", label: "MCP security", note: "Review source, credentials, runtime, and tool changes." },
      { href: "/leaderboard", label: "MCP leaderboard", note: "Explore the broader data-driven catalog without client-specific claims." },
    ],
    sources: [CLAUDE_MCP, MCP_SECURITY, { label: "MCP Radar dataset snapshot (2026-08-05)", url: "/dataset.json", retrievedAt: VERIFIED_AT }],
  },

  "best-mcp-servers-for-cursor": {
    title: "Best MCP Servers for Cursor: A Transparent, Dated Shortlist",
    excerpt: "Pick Cursor MCP servers by workflow and evidence, with a clear split between transport-derived compatibility and actual client verification.",
    directAnswer: "Choose Cursor MCP servers by the job they improve, not by list popularity. Prefer one narrow docs, browser, repository, database, or design integration that beats Cursor's built-in or terminal path. The ranking below is a screened shortlist; this environment has no Cursor IDE installation, so it does not claim current IDE smoke tests.",
    keyFacts: [
      { label: "Snapshot", value: "2,636 records", note: "Collected 2026-08-05" },
      { label: "Cursor rows", value: "2,400", note: "2 verified · 2,398 derived" },
      { label: "IDE test", value: "Not run", note: "Cursor CLI reports no IDE installation in this environment" },
      { label: "Official config", value: ".cursor/mcp.json", note: "Global: ~/.cursor/mcp.json" },
    ],
    comparison: {
      caption: "Run the redundancy test before installation: prefer built-in or CLI capabilities when they are clearer and lower-maintenance.",
      headers: ["Job", "When MCP adds value", "When built-in/CLI may win", "First smoke test"],
      rows: [
        ["Docs/context", "A maintained current knowledge source with citations", "Repository docs are already local and searchable", "Retrieve one version-specific answer"],
        ["Browser/testing", "Structured browser control and repeatable observations", "A project test script already covers the flow", "Open a local page and inspect one element"],
        ["Repository", "Remote issue/PR/project data with per-user auth", "git/gh commands already provide audited JSON", "Read one issue; do not write"],
        ["Database", "Schema/query tools with a read-only identity", "A local migration or query CLI is sufficient", "List schema and run a bounded query"],
        ["Design", "Live design-system or file context is required", "Exported assets/specs are already in the repo", "Read one named component without mutation"],
      ],
    },
    sections: [
      { heading: "Use a job-first starter stack", body: ["Do not install a generic bundle of 'must-have' servers. Pick the one external system that repeatedly blocks your Cursor workflow. Docs/context is a common first candidate; browser/testing, repository, database, and design follow only when the built-in agent or a trusted CLI cannot satisfy the same task clearly."] },
      { heading: "How the live Cursor shortlist is computed", body: ["The data table includes active developer-workflow entries that declare Cursor compatibility and clear the displayed star floor. Duplicate repositories are collapsed, then TrustScore and adoption order the eligible set. The formula is repeatable and the pool size is printed below the table. A rank is a research starting point, not a safety or workflow guarantee."] },
      { heading: "Separate derived compatibility from tested behavior", body: ["In the frozen snapshot, two catalog samples have stored sandbox startup/tool-list evidence and 2,398 Cursor rows are derived from transport metadata. This environment's Cursor CLI reports that no Cursor IDE is installed, so MCP Radar did not exercise discovery or a real tool invocation in the current stable IDE for this batch. Treat every selected row as requiring a local smoke test."] },
      { heading: "Configure and verify in Cursor", body: ["Put project-specific definitions in `.cursor/mcp.json` or personal global definitions in `~/.cursor/mcp.json`. Cursor supports stdio, SSE, and Streamable HTTP and documents MCP Logs in the Output panel. Enable one server, inspect its tools, run one non-destructive request, and verify the result and permission scope before enabling automatic execution."] },
      { heading: "Run the redundancy and exclusion tests", body: ["Compare the same task through Cursor's built-in capability or terminal command. Exclude the server if it merely wraps a familiar CLI without better schemas or controls, requests broad credentials, duplicates another server, has unclear ownership, or fails the current IDE smoke test. Remove unused servers to reduce tool clutter and attack surface."] },
    ],
    methodology: ["Dataset frozen at 2026-08-05 and official Cursor docs retrieved 2026-08-12.", "Compatibility is explicitly labeled verified or derived in the underlying data; derived is never described as a successful Cursor invocation.", "No macOS/Windows Cursor IDE test matrix was possible in this environment, so the page is a transparent shortlist pending those checks.", "Maintenance and adoption are public screening signals, not proof of security or task quality."],
    faq: [
      { question: "Were all ranked servers tested in Cursor?", answer: "No. Most compatibility rows are transport-derived, and this environment has no Cursor IDE installation. Run a current IDE smoke test before relying on any pick." },
      { question: "Where is Cursor MCP configuration stored?", answer: "Use `.cursor/mcp.json` for project configuration and `~/.cursor/mcp.json` for global personal configuration." },
      { question: "Where can I debug a Cursor MCP server?", answer: "Open the Output panel, choose MCP Logs, and inspect initialization, tool calls, authentication, and server errors." },
    ],
    relatedLinks: [
      { href: "/guides/cursor-mcp-spawn-npx-enoent", label: "Fix Cursor spawn npx ENOENT", note: "Repair the executable lookup stage before debugging MCP." },
      { href: "/guides/mcp-vs-cli", label: "MCP vs CLI", note: "Run the redundancy test per integration." },
      { href: "/guides/mcp-security-red-lines", label: "MCP security", note: "Review commands, endpoints, credentials, and tool permissions." },
      { href: "/leaderboard", label: "MCP leaderboard", note: "Explore the broader dataset and evidence fields." },
    ],
    sources: [CURSOR_MCP, MCP_SECURITY, { label: "MCP Radar dataset snapshot (2026-08-05)", url: "/dataset.json", retrievedAt: VERIFIED_AT }],
  },

  "mcp-vs-function-calling": {
    title: "MCP vs Function Calling: Different Layers, Often Used Together",
    excerpt: "Function calling is a model/API mechanism for structured calls; MCP standardizes how a host discovers and invokes external capabilities. An MCP host may expose MCP tools through function calling.",
    directAnswer: "Function calling and MCP are different layers. Function calling lets a model select a structured operation defined by an application. MCP standardizes how an AI host discovers, connects to, and invokes capabilities on external servers. A host commonly converts discovered MCP tools into the provider's tool/function definitions and routes the returned call back to the MCP server.",
    comparison: {
      caption: "Provider APIs differ. The function-calling column describes the common application-controlled pattern, not one universal wire format.",
      headers: ["Dimension", "Direct function calling", "MCP"],
      rows: [
        ["Layer", "Model API ↔ application", "Host/client ↔ capability server"],
        ["Discovery", "Application supplies selected definitions", "Client discovers server capabilities/primitives"],
        ["Schema", "Provider-specific tool/function schema", "MCP tool input schema, then adapted by the host"],
        ["Transport", "Provider API transport", "stdio or Streamable HTTP for MCP connection"],
        ["Auth", "Application authenticates model and downstream APIs", "Client/server and downstream auth boundaries"],
        ["Reuse", "Usually application/provider integration", "Reusable across compatible MCP hosts"],
        ["Operations", "Application executes the call", "MCP server executes and returns protocol content"],
      ],
    },
    visual: {
      title: "The layered call path",
      caption: "MCP does not remove model tool calling; the host bridges the layers.",
      items: [
        { label: "Model API", description: "Receives tool definitions and may return a structured call." },
        { label: "AI host", description: "Selects definitions, enforces approvals, and routes calls." },
        { label: "MCP client/server", description: "Discovers and invokes the external capability." },
        { label: "Downstream API", description: "Performs the underlying business operation." },
      ],
    },
    sections: [
      { heading: "Direct function calling keeps the integration inside your application", body: ["Your application defines a function/tool schema, sends it with the model request, receives a structured call, validates the arguments, executes code or an API, and returns the result. This is a good fit for a small number of application-owned capabilities where provider coupling and custom lifecycle code are acceptable."] },
      { heading: "MCP creates a reusable capability boundary", body: ["An MCP host connects to servers, discovers tools/resources/prompts, and invokes them through the protocol. The server can be local or remote and can serve multiple compatible hosts. You still need application logic to decide which discovered tools reach the model and how approval, errors, and results map to the chosen provider."] },
      { heading: "Implement the same capability both ways", body: ["For `lookup_order`, direct function calling defines the schema in the model request and executes a local handler. Through MCP, an order server advertises the tool; the host adapts that schema to the model provider; the model selects it; the host sends `tools/call`; and the server calls the same downstream order API. The underlying business function can be identical while the discovery and operational boundary changes."] },
      { heading: "Choose direct, MCP, or both", body: ["Use direct function calling for application-owned functions with no cross-host reuse requirement. Use MCP when external capability teams need a standard server boundary or multiple compatible hosts should reuse the integration. Use both when the host's model API uses function calling to select tools that were discovered through MCP—which is a common composition, not a contradiction."] },
      { heading: "Account for operational cost and failure layers", body: ["Direct calling has fewer protocol participants but leaves discovery, auth, versioning, and adapters in the application. MCP adds a connection, lifecycle, and server deployment boundary but can consolidate reusable capability logic. Measure setup, schema translation, context size, latency, authorization, observability, and failure recovery in your own stack before claiming a portability or performance win."] },
    ],
    methodology: ["MCP behavior uses the current official architecture documentation.", "Function-calling behavior uses current OpenAI official documentation as a concrete provider example; other providers may differ.", "No latency, token, or portability advantage is claimed because the two example implementations were not benchmarked in this batch."],
    faq: [
      { question: "Does MCP replace function calling?", answer: "No. A host may still use the model provider's function/tool-calling mechanism to let the model select tools discovered through MCP." },
      { question: "Can I use MCP without a model function-calling API?", answer: "Yes. An application can invoke MCP primitives through its own UI or control logic. The protocol does not dictate how the host uses an LLM." },
      { question: "When is direct function calling simpler?", answer: "It is often simpler for a few application-owned functions that do not need cross-host discovery, a separate server boundary, or reusable MCP connectivity." },
    ],
    relatedLinks: [
      { href: "/what-is-mcp-server", label: "What is an MCP server?", note: "Review the host/client/server layers." },
      { href: "/guides/mcp-resources-vs-tools", label: "MCP resources vs tools", note: "Choose the primitive inside the MCP layer." },
      { href: "/guides/mcp-vs-cli", label: "MCP vs CLI", note: "Compare another application-to-capability interface." },
      { href: "/guides/mcp-production-checklist", label: "Production checklist", note: "Validate schemas, auth, errors, and observability." },
    ],
    sources: [MCP_ARCHITECTURE, { label: "OpenAI API — function calling", url: "https://developers.openai.com/api/docs/guides/function-calling", retrievedAt: VERIFIED_AT }],
  },
};
