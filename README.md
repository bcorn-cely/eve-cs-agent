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

Eve discovers capabilities from the filesystem. This project uses every major primitive:

| Primitive | This Project | What It Does |
|-----------|--------------|--------------|
| **Instructions** | `agent/instructions.md` | The always-on system prompt that defines who the agent is and how it behaves |
| **Tools** | `agent/tools/*.ts` | Typed functions the model can call — customer lookup, refunds, notes, escalation |
| **Skills** | `agent/skills/*/SKILL.md` | On-demand procedures loaded only when relevant (refund policy, troubleshooting guides) |
| **Connections** | `agent/connections/*.ts` | External API integrations — here, an OpenAPI connection to the billing API |
| **Sandbox** | `agent/sandbox/sandbox.ts` | Network policy controlling what URLs the agent can access |
| **Hooks** | `agent/hooks/*.ts` | Lifecycle subscribers for audit logging and observability |
| **Schedules** | `agent/schedules/*.ts` | Cron-triggered tasks — a daily escalation digest |
| **Subagents** | `agent/subagents/*/` | Specialist child agents — a billing investigator for complex inquiries |
| **Evals** | `evals/*.eval.ts` | Test suite asserting on tool calls, responses, and agent behavior |

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

The `issue_refund` tool uses Eve's `needsApproval` to pause execution for amounts over $500:

```typescript
needsApproval: ({ toolInput }) => (toolInput?.amount ?? 0) > 500
```

The agent communicates "pending review" to the customer and the session parks until a human approves.

### Skills as Progressive Disclosure

Skills keep the context window lean. The refund policy isn't loaded on every turn — only when the agent calls `load_skill("refund-policy")` for a billing issue.

### Subagent Delegation

Complex billing analysis delegates to the `billing_investigator` subagent, which has its own instructions and tools. The parent stays in control of customer communication and money movement.

### Eval-Driven Development

The `evals/` folder contains assertions for security (blocked URLs), refund workflows (approval gates), and response quality. Run them with:

```bash
npx eve eval
```

## Documentation Reference

After `npm install`, the full Eve documentation is at `node_modules/eve/docs/`. Key files mapped to what this project demonstrates:

| This Project | Eve Docs |
|--------------|----------|
| `agent/instructions.md` | `instructions.mdx` |
| `agent/tools/*.ts` | `tools/overview.mdx`, `tools/human-in-the-loop.mdx` |
| `agent/skills/*/SKILL.md` | `skills.mdx` |
| `agent/connections/*.ts` | `connections.mdx` |
| `agent/sandbox/sandbox.ts` | `sandbox.mdx` |
| `agent/hooks/*.ts` | `guides/hooks.md` |
| `agent/schedules/*.ts` | `schedules.mdx` |
| `agent/subagents/*/` | `subagents.mdx` |
| `evals/*.eval.ts` | `evals/overview.mdx` |
| Overall structure | `reference/project-layout.md` |
