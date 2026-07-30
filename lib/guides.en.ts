// 指南英文内容。缺某篇时，accessor 会回退中文（见 guides.ts）。
import type { GuideContent } from "./guides";

export const GUIDES_EN: Record<string, GuideContent> = {
  "claude-code-mcp-config": {
    title: "How to Configure MCP Servers in Claude Code",
    excerpt:
      "A step-by-step guide to adding, configuring, and debugging MCP servers in Claude Code — the config file, the `claude mcp add` command, environment variables, and the errors people hit most.",
    sections: [
      {
        heading: "The two ways to add an MCP server in Claude Code",
        body: [
          "Claude Code gives you two paths to connect an MCP server. The fastest is the CLI: `claude mcp add <name> -- npx -y <package>`. This registers the server and writes the config for you.",
          "The second is editing the config file directly, which you'll want when you need fine control over environment variables, arguments, or a remote HTTP endpoint. Both end up in the same place — the CLI is just a convenience wrapper.",
          "Whichever you use, the mental model is the same: you're telling Claude Code the command to launch the server (for local stdio servers) or the URL to reach it (for remote servers).",
        ],
      },
      {
        heading: "The config file: shape and location",
        body: [
          "The core of MCP configuration is a JSON block under an `mcpServers` key. Each server gets a name, a `command` (e.g. `npx`), and an `args` array (the package and any flags).",
          "A minimal local server looks like this: `{ \"mcpServers\": { \"filesystem\": { \"command\": \"npx\", \"args\": [\"-y\", \"@modelcontextprotocol/server-filesystem\", \"/Users/me/projects\"] } } }`. The last arg here is the directory the server is allowed to touch.",
          "After editing the file, restart Claude Code so it re-reads the config and launches the server as a child process.",
        ],
      },
      {
        heading: "Passing secrets: environment variables, not plaintext",
        body: [
          "Most useful servers need a credential — a GitHub token, a database URL, an API key. Pass these through an `env` object in the server's config block, not hardcoded into args where they'd leak into logs and shell history.",
          "Example: a GitHub server takes `\"env\": { \"GITHUB_PERSONAL_ACCESS_TOKEN\": \"ghp_...\" }`. Scope the token to the minimum permissions the task needs — a read-only token for read-only work.",
          "For servers you share across a team, keep the token out of committed config and inject it from your shell environment instead.",
        ],
      },
      {
        heading: "Verifying the server actually connected",
        body: [
          "After restarting, the quickest check is to ask Claude directly: \"what MCP tools do you have?\" If the server connected, its tools show up in the list.",
          "If they don't, the server failed to start. The two most common causes are a wrong package name (typo in `args`) and a missing runtime (the server needs Node or Python you don't have).",
          "Run the server's launch command manually in a terminal — e.g. `npx -y <package>` — to see the real error message, which Claude Code otherwise swallows.",
        ],
      },
      {
        heading: "The errors people hit most",
        body: [
          "\"Server disconnected\" right after launch: usually a missing required environment variable. Check the server's README for which env vars it needs.",
          "Tools appear but every call fails: almost always a credential/permission problem — the token is expired, or scoped too narrowly for the action.",
          "Server works in one client but not Claude Code: different clients read config from different files. Make sure you edited Claude Code's config, not Claude Desktop's.",
          "Once it's connected and a test call returns real data, you're done — the server is now part of Claude's context and you can use it in plain language.",
        ],
      },
    ],
  },
  "mcp-proxy-vs-gateway": {
    title: "MCP Proxy Server vs MCP Gateway: Which Do You Need?",
    excerpt:
      "\"Proxy\" and \"gateway\" get used interchangeably in the MCP world, but they solve different problems. Here's how to tell them apart and pick the right one for your setup.",
    sections: [
      {
        heading: "The short answer",
        body: [
          "An MCP proxy sits between one client and one (or a few) servers, mainly to bridge transports or add a thin layer — for example, exposing a local stdio server over HTTP so a remote client can reach it.",
          "An MCP gateway sits in front of many servers and many clients, adding centralized concerns: authentication, access control, rate limiting, routing, logging, and a single connection point.",
          "Rule of thumb: if your problem is \"how do I reach this one server,\" you want a proxy. If your problem is \"how do I govern dozens of servers across a team,\" you want a gateway.",
        ],
      },
      {
        heading: "What a proxy actually does",
        body: [
          "The classic use for an MCP proxy is transport bridging. Many servers only speak stdio (they run as a local child process). A proxy can wrap one and expose it over Streamable HTTP so it can be hosted and reached over the network.",
          "Proxies are also handy for local development — inspecting the traffic between client and server, injecting a fixed set of headers, or adapting a slightly non-standard server. They stay intentionally thin.",
          "What a proxy is not: it's not where you put your org's auth policy or fan-out routing. Pushing those into a proxy is how you end up reinventing a gateway badly.",
        ],
      },
      {
        heading: "What a gateway adds on top",
        body: [
          "A gateway is the control plane for MCP at scale. It presents one endpoint to clients and routes to the right backend server, so clients don't each need to know about every server.",
          "On top of routing, it centralizes the things you don't want duplicated per server: authentication and authorization (who can call what), rate limiting, audit logging, and often a policy layer for which tools are allowed.",
          "For teams, this is the difference between every developer wiring up raw tokens to raw servers versus a single governed entry point where access is granted, revoked, and observed centrally.",
        ],
      },
      {
        heading: "How to choose",
        body: [
          "Choose a proxy if: you're an individual or small team, you need to make a specific server reachable (transport bridging), or you're debugging MCP traffic locally. Low overhead, fast to stand up.",
          "Choose a gateway if: multiple people connect to multiple servers, you need centralized auth and audit for compliance, or you want to control which tools are exposed without touching each server.",
          "It's not either/or — a gateway may use proxies internally to reach stdio servers. Start with a proxy for a single need; adopt a gateway when governance across many servers becomes the real problem.",
        ],
      },
      {
        heading: "Before you pick a specific product",
        body: [
          "Both proxies and gateways are third-party components sitting in your credential path, so the same due diligence applies: is it actively maintained, how does it handle secrets, and does it have a clear license?",
          "That's exactly what MCP Radar scores. Whichever category you land in, check the TrustScore and maintenance signals of the specific implementation before routing production traffic through it.",
        ],
      },
    ],
  },
  "choosing-mcp-server": {
    title: "Choosing an MCP server for your company: a due-diligence checklist",
    excerpt:
      "Installing successfully is only the start. This checklist turns public maintenance, licensing and security signals into a repeatable review before you connect a server.",
    sections: [
      {
        heading: "Why \"it runs\" doesn't mean \"it's usable\"",
        body: [
          "MCP servers have almost no install barrier — one npx command and it's running. But the real question in an enterprise setting is: will this server still be maintained in three months? Is the way it handles credentials safe? How long do its maintainers take to respond to a security vulnerability?",
          "Catalog size and lifecycle counts change with each data snapshot, so use the current leaderboard rather than a hard-coded ecosystem total.",
          "This checklist turns due diligence into repeatable checks you can perform from public data before testing in an isolated environment.",
        ],
      },
      {
        heading: "Part 1: Liveness checks (5 must-check items)",
        body: [
          "1. Check the last commit date and review what recent commits actually changed; recency alone does not prove quality.",
          "2. Review the 90-day commit history for meaningful fixes, releases and dependency maintenance rather than relying on a single threshold.",
          "3. Sample recent issues and confirm whether maintainers reply and close actionable reports. MCP Radar reports the share with replies, not a median response time.",
          "4. Check whether the repo is archived. Treat archived software as unsupported unless a maintained successor is clearly documented.",
          "5. Is there a clear license? Code with no license is legally \"all rights reserved\" for enterprises — unusable commercially.",
        ],
      },
      {
        heading: "Part 2: Security & compliance",
        body: [
          "6. How are credentials passed? Prefer servers that inject via environment variables; be wary of implementations that require writing a token into a config file — the latter leaks easily in multi-client setups.",
          "7. Any third-party hosted dependencies? Hosted servers (e.g. Firecrawl, Exa) mean your data passes through a third party's servers; evaluate their privacy policy…",
        ],
      },
      {
        heading: "Part 3: Adoption cross-check",
        body: [
          "Treat stars, downloads and forks as context rather than proof. Confirm that the package belongs to the linked repository, releases are recent, and independent users report successful setups.",
        ],
      },
      {
        heading: "Appendix: due-diligence checklist",
        body: [
          "Record repository and package identity, last review date, license, required permissions, credential handling, network destinations, maintenance evidence, rollback plan and an owner for re-review.",
        ],
      },
    ],
  },
  "mcp-security-red-lines": {
    title: "10 MCP security red lines",
    excerpt:
      "An MCP server has every permission you grant it. If any one of these 10 red lines is crossed, uninstall immediately — no matter how useful it is.",
    sections: [
      {
        heading: "Red lines 1-3: credentials & permissions",
        body: [
          "Red line 1: Requires long-lived credentials in plaintext without explaining safer alternatives. Prefer scoped environment variables or a system keychain, and protect any client configuration that must contain a token.",
          "Red line 2: Requests permissions beyond what the feature needs. A \"read calendar\" server asking for write access, a \"query database\" server asking for DDL rights — reject outright.",
          "Red line 3: A hosted server that can't explain where data flows. When your prompts and returned data pass through a third party's servers, you must have a clear answer on whether they log it, how long they keep it, and what it's used for.",
        ],
      },
      {
        heading: "Red lines 4-7: supply-chain risk",
        body: [
          "Red line 4: A remote-only server with no open-source repo. You can't audit what code it actually runs — you're handing permissions to a black box.",
          "Red line 5: Install script of unknown provenance. Behind a one-line npx install is package-execution permission; confirm the package name, publisher and repository before running it.",
          "Red line 6: Dependency chain too deep or containing known-vulnerable deps. Run npm audit; skip anything with unpatched high-severity vulnerabilities.",
          "Red line 7: Maintainer identity untraceable. Anonymous accounts, no prior projects, no community presence — the trust cost is on you.",
        ],
      },
      {
        heading: "Red lines 8-10: behavioral anomalies",
        body: [
          "Red line 8: The server makes network requests when you haven't called it. Verify by capturing traffic with tools like mitmproxy.",
          "Red line 9: The tool description contains manipulative prompt injection (e.g. \"ignore previous instructions\"). This is a new attack surface that emerged after 2025.",
          "Red line 10: Leftover processes or scheduled tasks after uninstall. A legitimate server terminates on exit; any residency is a danger signal.",
          "This list is updated continuously. When we find new attack techniques, we report them first in the newsletter.",
        ],
      },
    ],
  },
  "self-host-vs-remote": {
    title: "Self-host vs remote server: cost, latency and trust model",
    excerpt:
      "The difference between a locally-run server and a cloud-hosted one is more than latency. The trade-off between three trust models decides where you draw your data boundary.",
    sections: [
      {
        heading: "Three deployment shapes",
        body: [
          "Local stdio: the server runs as a child process on your machine. Transport is local, but the process can still read granted data or make outbound network requests; use OS permissions or a sandbox.",
          "Self-hosted HTTP: the server runs on your infrastructure. You control the deployment boundary, but dependencies and configured integrations may still send data elsewhere; you also own auth and availability.",
          "Hosted remote: run by the official team or a third party, ready to use. Least effort, but data flows through a third party; the trust model is most complex — you trust the code, the operator, and their infrastructure at once.",
        ],
      },
      {
        heading: "Decision matrix",
        body: [
          "Handling sensitive data (production databases, internal docs) → consider only local stdio or self-host.",
          "Shared by a team, needs centralized audit logs → self-hosted HTTP.",
          "Personal productivity tools, data is public anyway (web scraping, search) → the convenience of hosted remote is usually worth it.",
          "Latency-sensitive scenarios (real-time code analysis in the IDE) → local stdio, saving the 50-200ms network round-trip.",
        ],
      },
      {
        heading: "Hybrid strategy (recommended)",
        body: [
          "In practice most teams use a hybrid strategy: run data servers (databases, file systems) locally, use hosting for capability servers (search, scraping). Draw the boundary by data sensitivity, not one-size-fits-all.",
        ],
      },
    ],
  },
  "mcp-production-checklist": {
    title: "Before you move an MCP server into production",
    excerpt:
      "Timeouts, retries, concurrency, logging — the distance from demo to production lives in these details nobody writes down.",
    sections: [
      {
        heading: "Four new variables in production",
        body: [
          "In a demo an MCP server only needs to \"work\"; in production it must have controllable timeouts, retryable failures, bearable concurrency, and observable behavior.",
          "Use this checklist as a starting point and adapt thresholds to your workload, client behavior and recovery requirements.",
        ],
      },
      {
        heading: "Stability config",
        body: [
          "Timeouts: the MCP protocol doesn't enforce timeouts, so you must configure them client-side. We suggest a 30s default for tool calls, with long tasks declared explicitly…",
          "Retries: idempotent read-only tools can retry safely; write operations must implement a dedup key…",
        ],
      },
      {
        heading: "Observability plan",
        body: [
          "A complete log-collection plan: which fields must be recorded (tool name, latency, token cost, error type), how to feed it into your existing APM, and our open-source JSON log schema.",
        ],
      },
    ],
  },

  "best-mcp-servers-for-business": {
    title: "Best MCP servers for business, sales and marketing",
    excerpt:
      "A ranked shortlist of MCP servers for CRM, ads, analytics, payments and email — scored on public maintenance and adoption signals, not on who paid us. The table is regenerated from live data, so it does not go stale.",
    sections: [
      {
        heading: "How this list is built",
        body: [
          "Most \"best MCP server\" lists are somebody's handwritten opinion from six months ago. This one is generated from the same daily-collected dataset that powers the rest of this site, so when a project stops being maintained it drops off without anyone editing this page.",
          "Two filters decide who appears. First, an adoption floor of 200 GitHub stars — a \"best\" list that includes projects nobody uses is padding. Second, the project must be classified as marketing or commerce and still be actively maintained; archived and stalled repos are excluded outright.",
          "Whatever survives both filters is ordered by TrustScore, our five-dimension score over public signals (maintenance 30%, adoption 25%, usability 20%, health 15%, community 10%). The full weighting and every input field is published on our editorial policy page — you can disagree with the formula, but you can check it.",
          "One caveat worth stating plainly: TrustScore measures maintenance and adoption, not security and not fitness for your use case. A high score means the project is alive and used, not that it is safe to point at your production CRM. Do your own review before connecting anything that holds customer data.",
        ],
      },
      {
        heading: "The shortlist",
        body: [
          "Ranked by TrustScore among actively-maintained marketing and commerce servers with at least 200 stars. Scores and star counts refresh daily.",
        ],
      },
      {
        heading: "How to choose between them",
        body: [
          "Start from the system that owns your data rather than from the server list. If your pipeline lives in HubSpot, a HubSpot server beats a higher-scoring generic one every time — the integration you don't have to build is worth more than a few TrustScore points.",
          "For ads and analytics work, check whether the server exposes write operations or is read-only. Read-only analytics servers (pulling GA4 reports, for example) are low-risk and a reasonable first thing to connect. Anything that can spend money — creating campaigns, adjusting budgets — deserves a scoped API key and a hard look at what the tools actually do.",
          "For payments, the calculus is different again: prefer official vendor servers over community reimplementations. Stripe and Shopify publish their own, and a payments integration is not where you want a well-meaning third-party wrapper sitting between you and the API.",
          "Check the client compatibility section on each server's detail page before you commit. Most of these run locally over stdio and work with Claude Desktop, Claude Code, Cursor and VS Code, but the remote-only ones need a client that supports HTTP transport.",
        ],
      },
      {
        heading: "What this list deliberately leaves out",
        body: [
          "Servers under 200 stars, even well-built ones. The threshold is arbitrary but it has to be somewhere, and below it the signal from adoption gets too thin to rank on.",
          "Anything archived or without a commit in a long time, regardless of how popular it once was. A dead payments integration is worse than no integration.",
          "Two servers that our classifier tagged as commerce but which are not business tools at all — a trading-memory server and an API gateway. The classifier matches keywords in project descriptions, so \"unified billing\" and \"trading\" both trip the commerce rule. We exclude them by hand rather than pretend the classifier is perfect.",
        ],
      },
    ],
  },
};
