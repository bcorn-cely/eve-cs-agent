# Northwind CS Agent

A sample customer support agent built with the [Eve framework](https://github.com/vercel/eve). This project demonstrates how Eve's filesystem-first architecture translates into a working agent — each folder under `agent/` is a capability the agent gains.

## What This Agent Does

This agent handles Tier-1 and Tier-2 support for Northwind, a fictional SaaS billing company. It can:

- Look up customers by email and retrieve subscription details
- Process refunds with human-in-the-loop approval for amounts over $500
- Leave and read account notes for context across sessions
- Escalate issues to human agents with full audit trails
- Answer product questions by loading on-demand knowledge (skills)
- Run scheduled tasks like daily escalation digests

## Eve Primitives Demonstrated

Eve discovers capabilities from the filesystem. Each folder under `agent/` is a slot that adds a capability:

| Primitive | What Eve Does | Docs |
|-----------|---------------|------|
| **Instructions** | Always-on system prompt that shapes agent behavior | `instructions.mdx` |
| **Tools** | Typed functions the model can call, with optional human approval gates | `tools/overview.mdx` |
| **Skills** | On-demand procedures loaded only when relevant — keeps context lean | `skills.mdx` |
| **Connections** | Expose external APIs (MCP or OpenAPI) as tools the model can call | `connections.mdx` |
| **Sandbox** | Isolated bash environment with network policy and credential brokering | `sandbox.mdx` |
| **Hooks** | Lifecycle subscribers that react to stream events (audit, metrics, alerting) | `guides/hooks.md` |
| **Schedules** | Cron-triggered tasks that run the agent on a cadence | `schedules.mdx` |
| **Subagents** | Specialist child agents with their own instructions and sandbox | `subagents.mdx` |
| **Evals** | Scored checks that assert on tool calls, responses, and behavior | `evals/overview.mdx` |

Docs are at `node_modules/eve/docs/` after install. See `reference/project-layout.md` for the full slot table.

## Getting Started

```bash
git clone https://github.com/bcorn-cely/eve-cs-agent.git
cd eve-cs-agent
npm install
npx eve dev
```

## Project Structure

```
eve-cs-agent/
├── agent/
│   ├── agent.ts              # Model selection and runtime config
│   ├── instructions.md       # System prompt — who the agent is
│   ├── tools/                # 10 tools: lookup, refund, notes, escalation, web
│   ├── skills/               # 4 skills: refund-policy, troubleshooting, brand-voice, product-kb
│   ├── connections/          # OpenAPI connection to billing API
│   ├── sandbox/              # Network policy (approved domains only)
│   ├── hooks/                # Audit logger
│   ├── schedules/            # Daily escalation digest
│   ├── subagents/            # Billing investigator for complex cases
│   └── lib/                  # Shared utilities (API client, types)
├── evals/                    # Test suite: security, refund, escalation, lookup
└── package.json
```

## Key Patterns Demonstrated

### Human-in-the-Loop Approval

Tools can require human sign-off before executing. Eve's `needsApproval` pauses the session durably until approved:

```typescript
needsApproval: ({ toolInput }) => (toolInput?.amount ?? 0) > 500
```

See `tools/human-in-the-loop.mdx`.

### Credential Brokering

The sandbox's network policy can inject credentials at the firewall level — the agent never sees the token:

```typescript
networkPolicy: {
  allow: {
    "api.example.com": [{
      transform: [{ headers: { authorization: `Bearer ${TOKEN}` } }]
    }]
  }
}
```

See `sandbox.mdx` under "Credential brokering".

### Skills as Progressive Disclosure

Skills are loaded on-demand via `load_skill()`, keeping the context window lean. The model sees skill descriptions and loads the full procedure only when relevant.

### Subagent Delegation

Subagents are specialist child agents with their own instructions, tools, and sandbox. The parent delegates focused subtasks; the child reports back.

### Evals

Scored checks that drive the agent through real sessions and assert on behavior:

```bash
npx eve eval
```
