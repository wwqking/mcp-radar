import type { PillarContent } from "./pillar-what-is-mcp";

export const PILLAR_WHAT_IS_MCP_EN_2026: PillarContent = {
  title: "What Is an MCP Server? Architecture, Primitives, Transport, and Setup",
  excerpt: "An MCP server is a local program or hosted service that exposes tools, resources, and prompts to compatible AI applications through the Model Context Protocol.",
  directAnswer: "An MCP server is a program or hosted service that exposes tools, resources, and/or prompts to an AI application through the Model Context Protocol. The server supplies capabilities and context; the AI host creates a client connection, decides what reaches the model, enforces approvals, and returns results to the conversation.",
  lastVerified: "2026-08-12",
  refreshDue: "2026-11-12",
  intro: [
    "MCP stands for Model Context Protocol. It defines a common boundary between an AI host—such as a coding assistant or desktop application—and external capability servers. A server can make a database query available, expose a document as context, package a repeatable prompt, or connect the host to an existing API.",
    "The word server describes a protocol role, not a deployment location. A local MCP server commonly runs as a child process over stdio; a remote MCP server runs independently and is reached over Streamable HTTP. The server does not have to contain a language model, and the protocol does not dictate how the host uses one.",
  ],
  comparison: {
    caption: "The three server primitives have different control semantics. Use the least powerful primitive that satisfies the task.",
    headers: ["Primitive", "Primary controller", "Purpose", "Example"],
    rows: [
      ["Tool", "Model through the host", "Execute a structured operation", "Query an API or create an issue"],
      ["Resource", "Application", "Provide contextual data", "Read a file, schema, or record"],
      ["Prompt", "User", "Start a reusable guided workflow", "Run a review or planning template"],
    ],
  },
  visual: {
    title: "Host, client, server, and downstream system",
    caption: "The host creates one MCP client connection per server and decides how discovered capabilities are made available to the model.",
    items: [
      { label: "MCP host", description: "The AI application that coordinates models, UI, approvals, and multiple clients." },
      { label: "MCP client", description: "The component that maintains a dedicated connection to one server." },
      { label: "MCP server", description: "The program that advertises and serves tools, resources, or prompts." },
      { label: "Downstream system", description: "The file, API, database, SaaS account, or service behind the capability." },
    ],
  },
  sections: [
    {
      heading: "What an MCP server does—and what it does not do",
      body: [
        "An MCP server implements protocol methods that let a compatible client discover its identity and capabilities and use its primitives. A database server may expose a query tool, a schema resource, and a prompt with safe query examples. A repository server may expose issue and pull-request operations. The capability remains owned by the server and its downstream service.",
        "An MCP server is not automatically an AI agent, a model, a security sandbox, or proof that an integration works. The host may use an LLM to select a tool, but it is responsible for deciding which capabilities enter the model context and how user approval is handled.",
      ],
    },
    {
      heading: "How the connection works",
      body: [
        "The host creates a dedicated MCP client for each configured server. The participants exchange protocol-version and capability information, the client discovers available primitives, and the host builds an available capability set. When a tool is selected, the client sends a structured call and returns the server's content to the host.",
        "Current MCP architecture documentation uses a discovery exchange and per-request metadata. Older tutorials may show earlier initialization flows. Always match the server SDK and client documentation to the protocol version you are actually deploying.",
      ],
    },
    {
      heading: "Local stdio and remote Streamable HTTP",
      body: [
        "With stdio, the client launches the server as a subprocess and exchanges protocol messages through standard input and output. This is common for local file, developer, and database integrations. The process runs with the client's operating-system privileges unless an external sandbox or permission boundary restricts it.",
        "With Streamable HTTP, the server runs independently and can serve remote clients. It can use standard HTTP authentication patterns, including OAuth. Remote does not mean verified or safe: requests, context, and credentials may cross a network and operator boundary. Legacy SSE declarations still appear in clients and datasets, but new architecture should follow the current transport guidance.",
      ],
    },
    {
      heading: "Tools, resources, and prompts in one concrete example",
      body: [
        "Consider a customer-support integration. A refund-policy document can be a resource selected by the application. `lookup_order` can be a read-only tool with an order ID schema. `issue_refund` can be a separate consequential tool that requires a narrower credential and user confirmation. A `resolve_refund_case` prompt can package the recommended workflow without hiding those authority boundaries.",
        "This separation matters. Content from a resource can be untrusted or stale; a tool can read or write; a prompt can influence how the model combines both. Describe control, permissions, freshness, and side effects instead of treating every primitive as a generic 'tool.'",
      ],
    },
    {
      heading: "How to choose a server using evidence",
      body: [
        "Start by resolving identity across the registry entry, publisher, package or endpoint, repository, and release. Then inspect maintenance, license, runnable entry, required runtime, credential scopes, tools exposed, downstream systems, and recent changes. Test the exact artifact in the exact client with a non-destructive task before production use.",
        "MCP Radar's TrustScore summarizes public maintenance, adoption, usability, health, and community signals. It helps screen candidates; it does not certify security, correctness, data handling, endpoint reachability, or suitability for your account. A derived compatibility label means the transport appears compatible, not that a real client tool call succeeded.",
      ],
    },
    {
      heading: "How to set up an MCP server",
      body: [
        "First choose the client and trust scope: personal current project, shared project, or personal global. For a local server, verify the launch command and arguments and restrict its files, network, and credentials. For a remote server, verify the endpoint operator, HTTPS, auth flow, requested scopes, and data handling.",
        "Then verify four gates independently: the configuration parses; the process or endpoint is reachable; primitive discovery succeeds; and one read-only or reversible operation returns the expected result. Save the server identity, version, config shape, evidence basis, and test date so the integration can be reviewed after an update.",
      ],
    },
    {
      heading: "Are MCP servers free?",
      body: [
        "The protocol itself is an open standard and does not charge a fee. A server implementation may be open source, commercial, or both. Costs can come from a hosted MCP plan, the downstream API, database or SaaS account, network/compute, and the engineering needed to secure and operate it.",
        "Do not infer free usage from a public repository. Check the server's current license and pricing, then check every upstream service and quota it uses. Local execution can avoid a hosting subscription while still incurring API, infrastructure, and maintenance costs.",
      ],
    },
  ],
  faq: [
    { q: "What is the difference between an MCP server and a regular API?", a: "An API exposes an application interface. An MCP server exposes tools, resources, or prompts through a protocol designed for compatible AI hosts. The server often wraps an existing API and adds discovery, schemas, and MCP lifecycle behavior." },
    { q: "Does an MCP server contain AI?", a: "Not necessarily. The server provides capabilities and context. The language model usually lives behind the host, which decides how to use the server's primitives." },
    { q: "Does an MCP server need the internet?", a: "A local stdio server may work entirely on the machine, though its downstream service may still need a network. A remote Streamable HTTP server requires network access." },
    { q: "Are MCP servers free?", a: "The protocol itself has no fee. A server, hosted plan, downstream API, SaaS account, compute, or support may cost money. Verify each component's current pricing and license." },
    { q: "Are MCP servers safe?", a: "Not by default. Verify identity and source, minimize credential scope, restrict local or remote access, review tool behavior, require confirmation for consequential actions, and monitor changes." },
    { q: "What is the fastest way to try one?", a: "Choose a narrowly scoped, reviewable server; add it privately to one client; confirm discovery; run one non-destructive operation; and remove it if the evidence or permission boundary is unclear." },
  ],
  sources: [
    { label: "Model Context Protocol — architecture overview (2026-07-28)", url: "https://modelcontextprotocol.io/docs/2026-07-28/learn/architecture", retrievedAt: "2026-08-12" },
    { label: "Model Context Protocol — understanding MCP servers", url: "https://modelcontextprotocol.io/docs/learn/server-concepts", retrievedAt: "2026-08-12" },
    { label: "Model Context Protocol — security best practices", url: "https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices", retrievedAt: "2026-08-12" },
  ],
};
