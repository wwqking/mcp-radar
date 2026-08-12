// 指南英文内容。缺某篇时，accessor 会回退中文（见 guides.ts）。
import type { GuideContent } from "./guides";
import { GUIDE_BATCH_2026_08_12_EN } from "./guides.batch-2026-08-12.en";

const GUIDES_EN_BASE: Record<string, GuideContent> = {
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

  "cursor-mcp-spawn-npx-enoent": {
    title: "Fixing \"spawn npx ENOENT\" in Cursor's MCP config",
    excerpt:
      "Cursor reports spawn npx ENOENT when it cannot find the npx binary — almost always a PATH problem caused by how GUI apps are launched, not a broken server. Here is how to confirm the cause and the three fixes that work.",
    sections: [
      {
        heading: "What the error actually means",
        body: [
          "ENOENT is \"Error NO ENTity\" — the operating system could not find the file it was asked to execute. When Cursor prints spawn npx ENOENT, the missing file is npx itself, not your MCP server. The server never started, so nothing about the server's code or config is at fault yet.",
          "This matters because the obvious next move — reinstalling the MCP server, or rewriting its arguments — cannot possibly help. The failure happens one step earlier, when Cursor tries to launch the process at all.",
          "The reason it happens on a machine where npx clearly works: a GUI application launched from Finder, Spotlight or the Dock does not inherit the PATH from your shell profile. Your terminal reads ~/.zshrc and picks up nvm, Homebrew or fnm; Cursor, launched by the window manager, gets a much shorter system PATH that usually contains only /usr/bin, /bin, /usr/sbin and /sbin. If node was installed through a version manager, it lives somewhere else entirely and is invisible to Cursor.",
        ],
      },
      {
        heading: "Confirm it in ten seconds",
        body: [
          "Run `which npx` in your terminal and note the path. If it contains .nvm, .fnm, .volta, or /opt/homebrew, you have just confirmed the diagnosis: that directory is almost certainly not on the PATH Cursor sees.",
          "For a definitive check, open Cursor's own integrated terminal and run `echo $PATH` there, then compare it with `echo $PATH` in your normal terminal. On macOS the two are frequently different. The integrated terminal usually does load your profile, so it is not a perfect proxy for what the MCP subprocess sees, but a difference here is a strong signal.",
        ],
      },
      {
        heading: "Fix 1 — use an absolute path (most reliable)",
        body: [
          "Rather than hoping Cursor can resolve npx, tell it exactly where the binary is. Take the output of `which npx` and put it in the command field verbatim.",
          "This is the fix we recommend first because it does not depend on shell configuration, survives restarts, and behaves identically whether Cursor was opened from the Dock or the command line. Its one downside is that the path embeds a Node version if you use nvm, so it will need updating when you upgrade Node — a worthwhile trade for a config that actually works.",
          "The same applies to uvx for Python-based servers: use the absolute path there too.",
        ],
      },
      {
        heading: "Fix 2 — launch Cursor from the terminal",
        body: [
          "Starting Cursor with the `cursor` command from a shell means it inherits that shell's full environment, including the PATH that makes npx resolvable. This is useful for confirming the diagnosis quickly, but it is a poor permanent fix: the moment you open Cursor from the Dock out of habit, the error is back.",
          "Treat this as a diagnostic step rather than a solution. If launching from the terminal fixes it, you have proven the problem is PATH inheritance and can then apply fix 1 or 3 properly.",
        ],
      },
      {
        heading: "Fix 3 — install Node system-wide",
        body: [
          "If you do not need multiple Node versions, installing Node from the official installer places it in /usr/local/bin, which is on the default PATH that GUI applications see. This removes the class of problem entirely rather than working around it.",
          "This is the wrong choice if you rely on nvm to switch versions per project, since a system-wide install can shadow your managed versions and cause confusing mismatches. For most people who hit this error while just trying to get one MCP server running, it is the simplest permanent answer.",
        ],
      },
      {
        heading: "If it still fails after all three",
        body: [
          "Check that the package name in your config actually exists. A typo produces a different but easily-confused error: npx will resolve fine, then fail to find the package, which surfaces as a non-zero exit rather than ENOENT. If the message changed after applying a fix above, you have made progress and are now debugging a different problem.",
          "On Windows, ENOENT more often means npx.cmd rather than npx — the extension matters, and some configs need the full `npx.cmd` name or a shell wrapper.",
          "Finally, verify the server itself is installable at all by running the exact command from your config in a terminal. If it fails there too, the problem is the server or the package, and the Cursor configuration was never the issue.",
        ],
      },
    ],
  },

  "claude-mcp-list-command": {
    title: "claude mcp list: checking which MCP servers are actually connected",
    excerpt:
      "The claude mcp list command shows which servers Claude Code has registered and whether each one is connecting. A reference for the command, how to read its output, and what to do when a server shows as failed.",
    sections: [
      {
        heading: "What the command does",
        body: [
          "`claude mcp list` prints every MCP server registered with Claude Code along with its connection state. It answers the question people usually have at that moment: I edited a config, did it take effect?",
          "It is worth understanding that registration and connection are separate things. A server can be correctly registered — it appears in the list — and still fail to connect, because connecting means actually launching the process and completing the MCP handshake. The list command is the fastest way to see which of those two stages you are stuck at.",
        ],
      },
      {
        heading: "Reading the output",
        body: [
          "Each entry shows the server name you registered it under, the command used to start it, and a status. A connected server has completed the initialize handshake and its tools are available to the model. A failed server was launched but did not respond as expected — the process may have exited immediately, or crashed while starting.",
          "If a server you just added is missing from the list entirely, the config was not read. That points at editing the wrong file or the wrong scope, not at the server itself.",
        ],
      },
      {
        heading: "The related commands you will need",
        body: [
          "`claude mcp add <name> -- <command>` registers a server. The double dash matters: everything after it is the command Claude Code will run, so flags belonging to the server are not mistaken for flags belonging to Claude.",
          "`claude mcp remove <name>` unregisters one. Useful when a half-configured server is failing on every start and cluttering the output.",
          "`claude mcp get <name>` shows the full configuration for a single server, which is the quickest way to confirm that arguments and environment variables were stored the way you intended rather than mangled by shell quoting.",
        ],
      },
      {
        heading: "When a server shows as failed",
        body: [
          "Run the server's command directly in a terminal first. If it fails there, the problem is the server or its package and has nothing to do with Claude Code — you have just saved yourself from debugging the wrong layer.",
          "If it runs fine in the terminal but fails under Claude Code, suspect the environment. Servers that need an API key fail at startup when the key was not passed through, and a PATH that works in your shell may not be available to a GUI-launched client. The same class of problem produces the spawn npx ENOENT error in Cursor, and the diagnosis is the same.",
          "A server that starts but exposes no tools is usually waiting on credentials rather than broken. Our detail pages record the tools each server exposed when we installed it in a clean sandbox with no credentials — comparing that list against what you see is a quick way to tell \"this server needs configuration\" from \"this server is misbehaving\".",
        ],
      },
    ],
  },

  "youtube-transcript-for-claude": {
    title: "How to get a YouTube transcript into Claude",
    excerpt:
      "Three ways to give Claude the text of a YouTube video — copy-paste, an MCP server that fetches transcripts on demand, or a download tool — with the trade-offs and limits of each.",
    sections: [
      {
        heading: "The quickest way, with no setup",
        body: [
          "YouTube generates transcripts for most videos automatically. Open the video, expand the description, and use \"Show transcript\" — you can select the text and paste it into Claude directly. For a single video this beats installing anything.",
          "Two caveats. Auto-generated transcripts have no punctuation and mis-hear proper nouns and jargon, so a technical talk may arrive noticeably garbled. And a long video produces a lot of text: an hour of speech is roughly 9,000 words, which is fine for Claude's context window but will crowd out other material in a long conversation.",
          "Pasting also loses timestamps unless you keep them, which matters if you want to ask \"where in the video does she talk about X\" rather than just summarizing.",
        ],
      },
      {
        heading: "Using an MCP server instead",
        body: [
          "If you do this regularly, an MCP server lets you give Claude a URL and have it fetch the transcript itself. The practical difference is not effort per video so much as what becomes possible: Claude can pull several videos in one conversation, or fetch a transcript midway through a task without you leaving the chat.",
          "Transcript servers are generally read-only and need no API key, which makes them one of the lower-risk things to connect. They work by requesting the caption track YouTube already publishes, so they are subject to the same limitation as the manual approach — a video with captions disabled has nothing to fetch, and no server can work around that.",
          "Search our catalog for YouTube transcript servers and check the detail page before installing. The maintenance signals matter here more than usual: this category depends on an undocumented YouTube endpoint, so a server that stopped being updated is likely to be broken rather than merely stale.",
        ],
      },
      {
        heading: "When the video has no captions",
        body: [
          "Some videos genuinely have no caption track — the uploader disabled them, or the video is too new for YouTube's automatic pass. In that case there is no transcript to fetch by any method, and the remaining option is to transcribe the audio yourself with a speech-to-text tool, then paste the result.",
          "This is worth knowing before you start debugging: a transcript server returning nothing for one specific video is usually correct behavior, not a bug.",
        ],
      },
      {
        heading: "Which approach to pick",
        body: [
          "For one video, paste it. Setting up an MCP server to summarize a single talk is strictly more work than selecting text.",
          "For repeated research across many videos, install a server. The break-even is somewhere around the third or fourth video in a session.",
          "For anything where accuracy of specific quotes matters, verify against the video itself regardless of method. Auto-generated captions are good enough to summarize from and not good enough to quote from.",
        ],
      },
    ],
  },

  "mcp-remote": {
    title: "mcp-remote: connecting stdio-only clients to remote MCP servers",
    excerpt:
      "mcp-remote is a proxy that lets MCP clients which only speak stdio connect to remote HTTP servers, handling OAuth along the way. What it does, when you need it, and when you do not.",
    sections: [
      {
        heading: "The problem it solves",
        body: [
          "MCP servers come in two shapes. Local ones run as a process on your machine and talk over stdio — standard input and output. Remote ones are hosted somewhere and speak HTTP. These are different transports, and a client built for one cannot talk to the other.",
          "That becomes a problem when the server you want is remote-only but your client only supports stdio. mcp-remote sits between them: your client launches it as an ordinary local stdio process, and it forwards everything to the remote server over HTTP, translating in both directions.",
          "It also handles the OAuth flow that hosted servers typically require, which is the part that is genuinely awkward to do yourself. On first connection it opens a browser for you to authorize, then keeps the resulting token for subsequent runs.",
        ],
      },
      {
        heading: "How you configure it",
        body: [
          "You do not install mcp-remote as a server in its own right. It goes in the command position of a normal server entry, with the remote server's URL as its argument — so from the client's point of view it is just another local stdio server that happens to be a bridge.",
          "Because it runs through npx, everything in our guide to npx PATH problems applies: if your client cannot find npx, mcp-remote will fail to start with an ENOENT error before it ever reaches the network.",
        ],
      },
      {
        heading: "When you do not need it",
        body: [
          "Check your client's native support first. Claude Desktop, Claude Code, Cursor and VS Code have all added remote server support, and where a client can connect directly, going through a proxy adds a moving part for no benefit. Our detail pages list which transports each server offers, so you can see whether a direct connection is available.",
          "You also do not need it for local servers, which is a surprisingly common mistake. If the server runs on your machine via npx or uvx, it already speaks stdio and there is nothing to bridge.",
        ],
      },
      {
        heading: "What to watch out for",
        body: [
          "A proxy is one more thing that can break, and it fails in ways that are harder to read than a direct connection: an authentication failure at the remote end may surface as a generic startup error locally. When debugging, establish whether the remote server is reachable at all before investigating the bridge.",
          "The stored OAuth token is a credential sitting on your disk. Treat it with the same care as an API key, and revoke it at the provider if you stop using the server.",
          "Latency is added on every tool call, which is usually irrelevant but can matter for chatty tools that make many small requests. If a remote server feels slow through the bridge, that is expected rather than a misconfiguration.",
        ],
      },
    ],
  },

  "mcp-error-32001-timeout": {
    title: "MCP error -32001: request timed out — causes and fixes",
    excerpt:
      "The -32001 error means an MCP request did not get a response within the time limit. It is a symptom, not a root cause — here is how to find out which of the usual culprits is behind it and what to do about each.",
    sections: [
      {
        heading: "What -32001 actually is",
        body: [
          "-32001 is the MCP protocol's code for \"request timed out\". Your client sent a request — usually a tool call — and did not receive a response within the window it was willing to wait, so it gave up and surfaced this error.",
          "The key thing to understand is that a timeout is a symptom. It tells you the server did not answer in time; it does not tell you why. The server might be slow, stuck, waiting on something external, or already dead. Debugging -32001 is a process of narrowing down which.",
        ],
      },
      {
        heading: "The common causes, roughly in order",
        body: [
          "A slow tool doing real work. Some tool calls genuinely take a while — a large web scrape, a heavy database query, a model call inside the server. If the operation legitimately needs 40 seconds and the client's timeout is 30, you get -32001 even though nothing is broken. This is the most common and most benign cause.",
          "A server hung on startup or on an external dependency. If the server is waiting on an API that is itself slow or unreachable, the request never completes. This looks identical to a slow tool from the client's side, which is why you have to look at the server to tell them apart.",
          "A server that crashed mid-request. If the process died after accepting the request, no response is ever coming, and the client waits out the full timeout before reporting -32001. Here the timeout is real but the timeout value is irrelevant — the fix is whatever crashed the server.",
        ],
      },
      {
        heading: "How to narrow it down",
        body: [
          "Run the tool's underlying operation directly, outside the MCP client, and time it. If it takes longer than your client's timeout, you have found the cause and the fix is to raise the timeout or make the operation faster — not to touch the MCP config.",
          "Check whether the server is still alive after the error. A server that shows as connected but times out on every call is usually hung on a dependency; one that has disconnected crashed. The claude mcp list command (or your client's equivalent) tells you which.",
          "Look at what the tool depends on. Timeouts that come and go with the same input often trace to a flaky external service rather than the server itself — in which case the MCP layer is the messenger, not the problem.",
        ],
      },
      {
        heading: "The fixes",
        body: [
          "If the operation is legitimately slow, raise the client's timeout for that server. Most clients let you configure this; the protocol itself does not impose a fixed limit, so the number is entirely up to the client.",
          "If the server is hanging on an external call, the fix belongs in the server or the service it depends on, not in your config. A timeout inside the server (so it fails fast with a real error instead of hanging) turns a mysterious -32001 into a readable message.",
          "If the server is crashing, run its command manually to see the actual error, exactly as you would for any server that fails to start. The timeout is downstream of the crash; fix the crash and the timeout goes away.",
        ],
      },
    ],
  },

  "mcp-server-hosting": {
    title: "Hosting an MCP server: local, self-hosted, or managed",
    excerpt:
      "MCP servers can run on your own machine, on infrastructure you host, or as a managed remote service. The three models differ in effort, security surface and who can reach them — here's how to choose.",
    sections: [
      {
        heading: "The three ways to run a server",
        body: [
          "Local: the server runs as a process on the same machine as the client, launched on demand over stdio. This is how most MCP servers are used today, and for a single developer it is the simplest option — nothing to deploy, nothing exposed to the network.",
          "Self-hosted remote: you run the server on your own infrastructure and clients reach it over HTTP. This makes sense when a team needs to share one server, or when the server needs to sit close to data that lives in your environment.",
          "Managed remote: a vendor hosts the server and you connect to their endpoint, usually with OAuth. You trade control for not having to operate anything — the vendor handles uptime, updates and scaling.",
        ],
      },
      {
        heading: "When local is enough",
        body: [
          "If you are one person connecting a server to your own client, run it locally. Deploying a server to shared infrastructure to solve a single-user problem adds an attack surface, an uptime obligation and a maintenance burden for no benefit.",
          "Local also keeps credentials on your machine rather than on a server others can reach, which for something like a filesystem or database server is a meaningful security advantage. The limit is simply that a local server is only available to that machine — nobody else can use it, and it is not running when your laptop is closed.",
        ],
      },
      {
        heading: "When to self-host a remote server",
        body: [
          "Self-hosting becomes worthwhile when multiple people or agents need the same server, or when the server must run somewhere specific — inside your network, next to a database, on a schedule independent of any laptop.",
          "It comes with the responsibilities of any service you expose: authentication so that only authorized clients can connect, transport security so traffic is encrypted, and monitoring so you notice when it breaks. A remote MCP server with no auth in front of it is an open door to whatever it can do, which for a server holding real credentials is a serious risk. Our guide to MCP security red lines covers what not to skip.",
        ],
      },
      {
        heading: "When managed hosting makes sense",
        body: [
          "Managed hosting is the right call when the server is offered as a product by the vendor whose system it talks to — a SaaS company's official MCP server, hosted by them. You get first-party maintenance and no operational load, at the cost of routing your access through their infrastructure.",
          "The trade-off to weigh is trust and data flow: a managed server sees the requests you send it, so for sensitive data you may prefer to self-host even when a managed option exists. For connecting to a vendor's own service you were already using, managed hosting usually adds no new exposure and saves real effort.",
          "If your client only speaks stdio and the server is remote, you may need a bridge to connect the two — our guide to mcp-remote covers that case.",
        ],
      },
    ],
  },

  "rag-vs-mcp": {
    title: "RAG vs MCP: they solve different problems (and work together)",
    excerpt:
      "RAG and MCP are often compared as if you must pick one, but they answer different questions. RAG is about retrieving knowledge; MCP is about giving a model live access to tools and data. Here's when each applies.",
    sections: [
      {
        heading: "The short version",
        body: [
          "RAG — retrieval-augmented generation — is a technique for feeding a model relevant text at inference time, usually by searching a vector database of documents you embedded beforehand. It exists to answer questions from a body of knowledge the model was not trained on.",
          "MCP — the Model Context Protocol — is a standard for connecting a model to external tools and data sources at runtime. It exists to let a model do things: query a live database, call an API, read a file, send a message.",
          "So the comparison is slightly misframed. RAG retrieves knowledge; MCP grants capability. You can use either alone, and plenty of real systems use both — an MCP server can itself perform a RAG lookup.",
        ],
      },
      {
        heading: "What RAG is good at",
        body: [
          "RAG shines when the task is \"answer from these documents\". You have a corpus — support articles, internal wikis, a product manual — and you want the model to ground its answers in that specific material rather than its training data. Embedding the corpus once and retrieving the relevant chunks per query is efficient and well-understood.",
          "Its limits are worth naming. RAG gives the model text to read, not actions to take — it cannot place an order or update a record. And it works on a snapshot: if the underlying documents change, the index has to be rebuilt, so RAG is a poor fit for data that changes by the minute.",
        ],
      },
      {
        heading: "What MCP is good at",
        body: [
          "MCP shines when the task needs live data or side effects. \"What's the current status of order 4471\" cannot be answered from a pre-built index — it requires querying the system of record right now. \"Create a calendar event\" is an action, not a retrieval. These are MCP's territory.",
          "MCP also handles freshness for free: because the server queries the source at call time, there is no index to go stale. The trade-off is latency and reliability — every tool call is a live request that can be slow or fail, whereas a vector lookup is fast and local.",
        ],
      },
      {
        heading: "When to use which — and both",
        body: [
          "Use RAG when the answer lives in a stable body of documents and you only need the model to read. Use MCP when the answer requires querying a live system, or when the model needs to take an action rather than just answer.",
          "Use both when a task spans the two. A support agent might retrieve the relevant policy with RAG and then look up the customer's actual account state through an MCP server — knowledge plus capability in one flow. Treating them as rivals leads to picking the wrong tool; treating them as complementary is usually closer to what real systems need.",
          "One practical note: because an MCP server is just a program, nothing stops it from doing retrieval internally. A \"docs\" MCP server that searches your knowledge base on demand is RAG wearing an MCP interface — which is often the cleanest way to expose a corpus that also changes over time.",
        ],
      },
    ],
  },

  "a2a-vs-mcp": {
    title: "A2A vs MCP: agent-to-agent communication vs model-to-tool access",
    excerpt:
      "A2A and MCP are both protocols in the agent ecosystem, but they operate at different layers. MCP connects one model to tools; A2A lets independent agents talk to each other. They are complementary, not competing.",
    sections: [
      {
        heading: "Two protocols, two layers",
        body: [
          "MCP — the Model Context Protocol — standardizes how a single model or agent reaches out to tools and data. It is the layer between one agent and the capabilities it uses: a database, an API, a filesystem.",
          "A2A — agent-to-agent — standardizes how separate, independently-built agents communicate and delegate to one another. It is the layer between agents, letting a scheduling agent hand a task to a research agent that neither team built together.",
          "So they are not alternatives. MCP answers \"how does my agent use a tool\"; A2A answers \"how does my agent talk to your agent\". A sophisticated system uses both: each agent uses MCP to reach its own tools, and A2A to coordinate with peers.",
        ],
      },
      {
        heading: "Where MCP fits",
        body: [
          "If you are building one agent and want to give it access to your systems, MCP is what you need. The agent stays a single entity; MCP is the wiring to everything it can touch. The vast majority of \"connect my AI to X\" problems are MCP problems, not A2A problems.",
          "MCP assumes a client-server shape: your agent is the client, and each tool is a server. It does not attempt to coordinate multiple autonomous agents — that is deliberately out of scope, which is part of why the protocol stayed simple enough to be widely adopted.",
        ],
      },
      {
        heading: "Where A2A fits",
        body: [
          "A2A becomes relevant once you have multiple agents that were not designed as one system and need to interoperate — often across organizational boundaries. Its job is discovery, capability negotiation, and message passing between peers that treat each other as black boxes.",
          "This is a genuinely harder problem than tool access, involving identity, trust, and long-running tasks between parties that do not share a codebase. It is also much earlier in adoption than MCP, so if you are unsure which you need, you almost certainly need MCP first.",
        ],
      },
      {
        heading: "Which one you actually need",
        body: [
          "Building a single agent that uses your tools and data: MCP. This covers most projects, and it is where to start.",
          "Coordinating multiple independent agents, especially ones you don't control: that is the A2A layer, and you would typically add it on top of agents that already use MCP internally.",
          "If the question is which to learn first, the answer is MCP — it is more mature, more widely supported, and solves the problem most teams actually have today. A2A matters as multi-agent systems spanning organizations become common, which is still emerging.",
        ],
      },
    ],
  },

  "mcp-vs-cli": {
    title: "MCP vs CLI: when to expose a tool as an MCP server instead of a command",
    excerpt:
      "A CLI and an MCP server can wrap the same underlying tool, but they are built for different callers — humans at a terminal versus a model in a conversation. Here's how to decide which to build, or whether to build both.",
    sections: [
      {
        heading: "Same tool, different caller",
        body: [
          "A CLI exposes functionality to a person typing commands. An MCP server exposes functionality to a model deciding what to call. Often they wrap the exact same logic — the difference is who is on the other end and what they need from the interface.",
          "A human at a CLI reads help text, remembers flags, and interprets output with their own judgment. A model needs the tool described in a structured way it can reason about: what the tool does, what arguments it takes, what it returns. MCP provides that structured description; a CLI's --help was written for eyes, not for a scheduler.",
        ],
      },
      {
        heading: "Why not just let the model run CLI commands",
        body: [
          "It is tempting to give a model shell access and let it call your existing CLI. This works in demos and is risky in practice. A CLI's surface is unstructured — the model has to construct command strings, parse free-text output, and guess at error meanings, all of which are error-prone.",
          "More importantly, shell access is a blunt, dangerous capability: a model that can run one command can usually run any command. An MCP server exposes exactly the operations you chose, with typed arguments and defined results, which is both safer and more reliable than hoping the model assembles the right incantation.",
        ],
      },
      {
        heading: "When a CLI is still the right answer",
        body: [
          "If the primary user is a human, build the CLI. Scripting, CI pipelines, and interactive terminal use are all better served by a command than by a protocol designed for models. Not every tool needs an MCP interface, and adding one to a tool no model will call is wasted effort.",
          "Many tools legitimately want both: a CLI for people and an MCP server for agents, sharing the same core logic underneath. That is a reasonable architecture — the two interfaces serve different callers and neither makes the other redundant.",
        ],
      },
      {
        heading: "Deciding for your tool",
        body: [
          "Ask who calls it. Humans in terminals and scripts: CLI. A model in a conversation choosing actions: MCP server. Both audiences: both interfaces over shared logic.",
          "If you are wrapping an existing CLI for model use, resist the urge to just shell out to it. Model the operations you actually want the model to perform as proper MCP tools with typed inputs — you will get more reliable behavior and a far smaller blast radius than handing over the whole command line.",
        ],
      },
    ],
  },

  "can-claude-generate-images": {
    title: "Can Claude generate images? What MCP does and doesn't change",
    excerpt:
      "Claude cannot draw images itself — it is a text and vision model. But with an image-generation MCP server connected, it can call an external model to produce them. Here is the honest distinction and how to set it up.",
    sections: [
      {
        heading: "The short answer",
        body: [
          "Out of the box, no. Claude reads and understands images, but it does not generate them — its own output is text. If you ask it to \"draw a logo\", it will describe one, or write code that draws one, but it will not return a picture.",
          "This trips people up because Claude is clearly capable with images: it can analyze a screenshot, read a chart, or describe a photo in detail. That is vision — understanding images that come in. Generation — producing images that go out — is a different capability, and Claude does not have it natively.",
          "What changes the answer is tooling. Through MCP, Claude can call an external image model and hand you back the result, so from your side of the conversation it looks like Claude made an image. Strictly, Claude decided what to ask for and an image server produced it.",
        ],
      },
      {
        heading: "How image generation through MCP actually works",
        body: [
          "An image-generation MCP server wraps a model like DALL·E, Stable Diffusion or Flux behind a tool Claude can call. You describe what you want in the conversation, Claude formulates the prompt and calls the tool, and the server returns an image.",
          "The division of labour is worth understanding because it affects quality. Claude is good at turning your vague request into a detailed, well-structured image prompt — that is a language task, and it is genuinely helpful. The actual pixels come from the image model, so the ceiling on quality is set by that model, not by Claude.",
          "These servers almost always need an API key for the underlying image service, and that service usually charges per image. So unlike a read-only transcript or search server, this is one where connecting it has a direct cost attached, and the key gives whatever holds it the ability to spend money. Scope it accordingly.",
        ],
      },
      {
        heading: "Setting it up",
        body: [
          "Search our catalog for image-generation servers and read the detail page before installing. This is a young, thin category — there are far fewer maintained image servers than, say, filesystem or search servers — so pay attention to the maintenance signals rather than assuming any given one is solid.",
          "Because these servers hold a paid API key, treat the key as you would any billing credential: use a scoped key if the provider supports it, watch the usage dashboard for the first while, and revoke it if you stop using the server.",
          "Check the client compatibility on the detail page too. Most run locally over stdio and work with Claude Desktop, Claude Code, Cursor and VS Code, but confirm before you rely on it.",
        ],
      },
      {
        heading: "When you don't need MCP for this",
        body: [
          "If image generation is the main thing you want, a dedicated image tool or a chat product with generation built in may be a better fit than wiring one into Claude through MCP. The MCP route makes sense when generating an image is one step inside a larger task Claude is already doing — writing a blog post and illustrating it, say — not when the image is the whole job.",
          "It is also worth remembering that Claude can write the code to generate images programmatically. For charts, diagrams and anything data-driven, having Claude produce a script is often better than a generative model, because the output is exact and reproducible rather than an approximation.",
        ],
      },
    ],
  },

  "awesome-mcp-servers": {
    title: "Awesome MCP servers: a maintained list, ranked by real signals",
    excerpt:
      "A curated list of MCP servers that are actually maintained and actually used — generated from daily-collected GitHub, npm and registry data rather than hand-edited, so entries drop off when projects die.",
    sections: [
      {
        heading: "Why another list",
        body: [
          "The awesome-* convention has served open source well, but it has a known failure mode: the list is a file in a repository, and files do not notice when the projects they link to are abandoned. Popular awesome lists routinely carry entries that stopped being maintained a year ago, because removing something requires a human to notice and open a pull request.",
          "This list is generated instead. It comes from the same dataset that powers the rest of this site, refreshed daily, so a project that stops getting commits or gets archived simply stops appearing here. Nobody has to remember to remove it.",
          "The trade-off is that a generated list cannot capture taste. It cannot tell you that one server has a nicer API than another, or that a particular maintainer is responsive. For that, read the detail pages and the repositories themselves — this list is a filter, not a verdict.",
        ],
      },
      {
        heading: "The list",
        body: [
          "Actively-maintained servers with at least 1,000 stars that are verified in the official MCP registry, ordered by TrustScore. Refreshed daily.",
        ],
      },
      {
        heading: "How to read it",
        body: [
          "TrustScore combines five dimensions of public data: maintenance activity, adoption, usability, repository health and community signals. The weighting is published in full on our editorial policy page. It measures whether a project is alive and used — not whether it is secure, and not whether it fits your particular problem.",
          "Star counts are included alongside the score because the two answer different questions. A high score with modest stars usually means a well-run but niche project; high stars with a middling score often means something popular that has slowed down. Neither is inherently better.",
          "The clients column shows how many MCP clients the server can connect to, derived from the package type and transport it declares. A check mark means we installed it in a sandbox and confirmed it starts — measured, not inferred.",
        ],
      },
      {
        heading: "What is filtered out, and why",
        body: [
          "Projects under 1,000 stars. This list is deliberately a high bar; our full catalog covers everything else and lets you filter by category.",
          "Anything not verified in the official registry. For a broad cross-category list this filter does real work — it removes entries whose metadata nobody has checked.",
          "One entry that is registry-verified but declares a repository it does not own: its manifest points at an unrelated project with 88,000 stars, which would have placed it near the top on borrowed adoption. The error is upstream in the registry and we cannot fix it there, but we are not going to republish someone else's stars as theirs.",
        ],
      },
    ],
  },
};

/** 关键词验证后的内容批次覆盖旧短文，并注册新指南。 */
export const GUIDES_EN: Record<string, GuideContent> = Object.assign(
  {},
  GUIDES_EN_BASE,
  GUIDE_BATCH_2026_08_12_EN,
);
