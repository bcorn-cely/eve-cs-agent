# Northwind CS Agent

A sample customer support agent built with the [Eve framework](https://github.com/vercel/eve). This repository accompanies a webinar on building agents with Eve and demonstrates the core primitives that make up an Eve agent.

**This is not an exhaustive display of Eve's functionality** — it's a teaching tool that covers the most important building blocks to help teams understand how Eve agents are structured.

## What This Demonstrates

This sample agent handles customer support tasks for a fictional company (Northwind) and showcases these Eve primitives:

| Primitive | Location | Purpose |
|-----------|----------|---------|
| **Agent Definition** | `agent/agent.ts`, `agent/instructions.md` | Core agent configuration and system prompt |
| **Tools** | `agent/tools/` | 10 tools for customer lookup, refunds, subscriptions, notes, escalation, and web access |
| **Connections** | `agent/connections/` | OpenAPI integration with the Northwind billing API |
| **Sandbox** | `agent/sandbox/` | Network policy and credential brokering configuration |
| **Hooks** | `agent/hooks/` | Audit logging for compliance and observability |
| **Channels** | `agent/channels/` | Eve channel for agent communication |
| **Schedules** | `agent/schedules/` | Scheduled escalation digest |
| **Subagents** | `agent/subagents/` | Billing investigator subagent for complex billing inquiries |
| **Evals** | `evals/` | Test suite covering security, lookup, refund, escalation, and knowledge scenarios |

## What This Doesn't Cover

This is a simplified sample for educational purposes.


For even more robust agents and Eve capabilities, refer to the full Eve documentation.

## Getting Started

```bash
# Clone the repository
git clone https://github.com/bcorn-cely/eve-cs-agent.git
cd eve-cs-agent

# Install dependencies
npm install

# Run the agent
npx eve dev
```

## Project Structure

```
eve-cs-agent/
├── agent/
│   ├── agent.ts              # Agent definition
│   ├── instructions.md       # System prompt
│   ├── tools/                # Tool definitions
│   ├── connections/          # OpenAPI connections
│   ├── sandbox/              # Network policy
│   ├── hooks/                # Lifecycle hooks
│   ├── channels/             # Communication channels
│   ├── schedules/            # Scheduled tasks
│   ├── subagents/            # Specialized subagents
│   └── lib/                  # Shared utilities
├── evals/                    # Evaluation test suite
├── package.json
└── tsconfig.json
```

## Learn More

- **Eve Documentation**: After installing, see `node_modules/eve/docs/` for the full framework reference
- **Key docs to start with**:
  - `reference/project-layout.md` — File structure conventions
  - `tools/overview.mdx` — How to define tools with Zod schemas
  - `sandbox.mdx` — Network policy and credential brokering
  - `connections.mdx` — OpenAPI connections
