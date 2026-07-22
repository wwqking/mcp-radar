// 指南英文内容。缺某篇时，accessor 会回退中文（见 guides.ts）。
import type { GuideContent } from "./guides";

export const GUIDES_EN: Record<string, GuideContent> = {
  "choosing-mcp-server": {
    title: "Choosing an MCP server for your company: a due-diligence checklist",
    excerpt:
      "Between \"it installs and runs\" and \"it's production-ready\" sits a due-diligence checklist nobody has written. We reverse-engineered 12 must-check items from the health data of 1,200+ servers.",
    sections: [
      {
        heading: "Why \"it runs\" doesn't mean \"it's usable\"",
        body: [
          "MCP servers have almost no install barrier — one npx command and it's running. But the real question in an enterprise setting is: will this server still be maintained in three months? Is the way it handles credentials safe? How long do its maintainers take to respond to a security vulnerability?",
          "We tracked maintenance data for 1,247 MCP servers: 137 are abandoned and 168 haven't been updated in over six months — meaning if you pick one at random from an \"awesome MCP\" list, there's nearly a one-in-four chance of hitting a zombie project.",
          "This checklist turns due diligence into 12 tickable items, all doable in 15 minutes from public data.",
        ],
      },
      {
        heading: "Part 1: Liveness checks (5 must-check items)",
        body: [
          "1. Is the last commit < 30 days ago? For projects past 90 days, issue response rate falls off a cliff to under 20%.",
          "2. Are there > 10 commits in 90 days? Below that, projects usually only have \"life-support commits\" (README tweaks, version bumps).",
          "3. Is the median open-issue response time < 7 days? Sort the repo's Issues page by \"recently commented\" to judge quickly.",
          "4. Is the repo archived? An archived repo's API dependencies rot over time, typically becoming unusable after ~6 months.",
          "5. Is there a clear license? Code with no license is legally \"all rights reserved\" for enterprises — unusable commercially.",
        ],
      },
      {
        heading: "Part 2: Security & compliance (member preview)",
        body: [
          "6. How are credentials passed? Prefer servers that inject via environment variables; be wary of implementations that require writing a token into a config file — the latter leaks easily in multi-client setups.",
          "7. Any third-party hosted dependencies? Hosted servers (e.g. Firecrawl, Exa) mean your data passes through a third party's servers; evaluate their privacy policy…",
        ],
      },
      {
        heading: "Part 3: Adoption cross-check (member)",
        body: [
          "This part covers: healthy ratio ranges between stars and downloads, how to spot \"star-farmed\" servers, how much weight to give awesome-list inclusions, and the cross-check table template we use internally.",
        ],
      },
      {
        heading: "Appendix: due-diligence checklist template (member)",
        body: [
          "A 12-item due-diligence table you can copy straight into Notion / Lark Docs, with the data source and pass threshold for each item.",
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
          "Red line 1: Requires storing credentials in plaintext in a config file. Legitimate MCP servers always read credentials via environment variables or the system keychain. The config-file approach scatters tokens to uncontrolled locations in multi-client setups like Claude Desktop.",
          "Red line 2: Requests permissions beyond what the feature needs. A \"read calendar\" server asking for write access, a \"query database\" server asking for DDL rights — reject outright.",
          "Red line 3: A hosted server that can't explain where data flows. When your prompts and returned data pass through a third party's servers, you must have a clear answer on whether they log it, how long they keep it, and what it's used for.",
        ],
      },
      {
        heading: "Red lines 4-7: supply-chain risk",
        body: [
          "Red line 4: A remote-only server with no open-source repo. You can't audit what code it actually runs — you're handing permissions to a black box.",
          "Red line 5: Install script of unknown provenance. Behind a one-line npx install is full package-execution permission; confirm the package name matches the official repo (typosquatting attacks happen monthly in the npm ecosystem).",
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
          "Local stdio: the server runs as a child process on your machine, communicating over standard input/output. Data never leaves the machine; the trust model is simplest — you only need to trust the code itself.",
          "Self-hosted HTTP: the server runs on your own servers, shared by the team. Data never leaves your infrastructure boundary, but you handle auth and high availability yourself.",
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
          "We compiled a checklist distilled from 12 real production deployments (including 3 failed-rollback cases).",
        ],
      },
      {
        heading: "Stability config (member preview)",
        body: [
          "Timeouts: the MCP protocol doesn't enforce timeouts, so you must configure them client-side. We suggest a 30s default for tool calls, with long tasks declared explicitly…",
          "Retries: idempotent read-only tools can retry safely; write operations must implement a dedup key…",
        ],
      },
      {
        heading: "Observability plan (member)",
        body: [
          "A complete log-collection plan: which fields must be recorded (tool name, latency, token cost, error type), how to feed it into your existing APM, and our open-source JSON log schema.",
        ],
      },
    ],
  },
};
