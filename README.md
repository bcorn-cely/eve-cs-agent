# Northwind CS Agent

A complete, runnable sample agent built with [**eve**](https://eve.dev/docs), Vercel's filesystem-first framework for durable backend agents.

This project is a hands-on learning resource. Rather than a "hello world," it is a realistic customer-support agent that exercises the core building blocks you will use in your own eve apps: instructions, tools, skills, connections, hooks, a sandbox, a channel, a subagent, and evals. Each concept lives in its own file, so you can read one file to understand one idea.

## The scenario

The agent is the customer-support rep for **Northwind**, a fictional mid-size SaaS company that sells subscription billing and revenue-analytics software. It handles Tier-1 and Tier-2 support: looking up accounts, explaining charges, issuing refunds within policy, and escalating what it cannot safely resolve.

Northwind has three plans: Starter ($49/mo), Growth ($299/mo), and Scale ($1,499/mo). The agent talks to a hosted mock billing API (`billing-api.northwind.vercel.zone`) for all account data, so nothing you do here touches real customers.

The domain is deliberately chosen to force the interesting problems every production agent hits: it must look facts up instead of guessing, it must follow a written policy, it must move money carefully (with a human in the loop above a threshold), and it must be honest about what it did and did not do.

## What it demonstrates

Every eve capability is a file (or a folder) under `agent/`. Here is the map from concept to code:

| eve concept | Where to look | What it shows |
|---|---|---|
| **Runtime config** | `agent/agent.ts` | The minimal agent definition: pick a model, and eve runs the loop. |
| **Instructions** | `agent/instructions.md` | The always-on system prompt: triage rules, money rules, escalation philosophy, tone, and guardrails. |
| **Tools** | `agent/tools/` | Typed capabilities the model can call (`lookup_customer`, `get_subscription`, `issue_refund`, `escalate_to_human`, `get_audit_log`). The filename becomes the tool name. |
| **Human-in-the-loop approval** | `agent/tools/issue_refund.ts` | A tool that pauses for human approval when a refund exceeds $500, and runs automatically below it. |
| **Skills** | `agent/skills/refund-policy/` | A procedure the agent loads on demand, only when it is about to touch a refund, keeping the base prompt lean. |
| **Connections** | `agent/connections/billing-records.ts` | An external OpenAPI integration wired in with auth and an approval policy. |
| **Hooks** | `agent/hooks/compliance_logger.ts` | Code that reacts to runtime events (here: log every completed refund for compliance). |
| **Sandbox** | `agent/sandbox/sandbox.ts` | A per-agent execution sandbox with a network allow-list. |
| **Channel** | `agent/channels/eve.ts` | The HTTP entry point and its auth configuration. |
| **Subagent** | `agent/subagents/billing_investigator/` | A specialist child agent the main agent delegates deep invoice analysis to. |
| **Shared library code** | `agent/lib/` | Plain authored TypeScript shared across tools (API client, types, session audit state). |
| **Evals** | `evals/` | Automated tests that drive the agent end to end and grade the result, including one that verifies the >$500 refund pauses for approval. |

Reading these in the order above is a good tour of the framework.

## How to use this

### 1. Prerequisites

- **Node 24 or newer** (`node --version`)
- **npm** (bundled with Node)
- **A model credential.** The agent routes its model through the Vercel AI Gateway, which needs either an `AI_GATEWAY_API_KEY` or a `VERCEL_OIDC_TOKEN` obtained by running `vercel link` in this directory.
- **A billing API token.** The tools call the hosted Northwind mock API using a bearer token read from `NORTHWIND_BILLING_API_TOKEN`.

### 2. Install

```bash
npm install
```

### 3. Configure credentials

Create a `.env.local` file in the project root with the credentials above:

```bash
# Model access via the Vercel AI Gateway (use one of these)
AI_GATEWAY_API_KEY=your_gateway_key
# ...or run `vercel link` to populate VERCEL_OIDC_TOKEN instead

# Access to the Northwind mock billing API
NORTHWIND_BILLING_API_TOKEN=your_token
```

`.env.local` is git-ignored, so your keys never get committed. If a credential is missing, the dev interface will flag it and its `/model` command can walk you through adding a model key.

### 4. Run it locally

```bash
npm run dev
```

This starts the local runtime and opens eve's interactive terminal UI. Type a message and watch the loop run: you will see each tool call, its result, and then the reply, in order.

### 5. Try some conversations

Talk to the agent the way a customer would. Good starting prompts:

- **A simple lookup:** *"Hi, I'm marcus@dataflow.io. What plan am I on?"* Watch it call `lookup_customer` before answering anything.
- **A small refund:** *"I was double-charged on my last invoice, can you refund it?"* Watch it load the refund-policy skill, check the invoice, and act within policy.
- **A large refund (human-in-the-loop):** *"Invoice INV-1012 is a duplicate $1,499 charge. Please refund it."* The agent prepares the refund, then pauses for your approval before completing it.
- **Something it cannot verify:** ask about a feature or fact that is not in the account data, and watch it say so plainly and offer to escalate instead of guessing.

### 6. Run the evals

The `evals/` folder contains automated tests that drive the agent and grade the outcome:

```bash
npx eve eval
```

Open `evals/refund/over-500.eval.ts` to see how a test sends a message, asserts which tools were called, responds to the approval request, and judges the final answer.

### Other useful commands

```bash
npm run typecheck   # type-check the project
npm run build       # compile the agent into .eve/ and build the host output
npm start           # serve the built output
```

You can also point the CLI at a running instance over HTTP. Every eve app exposes a stable session API:

```bash
curl -X POST http://127.0.0.1:2000/eve/v1/session \
  -H 'content-type: application/json' \
  -d '{"message":"I am marcus@dataflow.io, what plan am I on?"}'
```

The response includes a `continuationToken` (to resume the conversation) and an `x-eve-session-id` header (to stream the run).

## Project layout

```
agent/
  agent.ts                  # runtime config (model selection)
  instructions.md           # the system prompt: policy, rules, tone, guardrails
  tools/                    # typed capabilities the model can call
  skills/                   # on-demand procedures (refund policy)
  connections/              # external OpenAPI integrations
  hooks/                    # event-driven side effects (compliance logging)
  sandbox/                  # sandbox + network policy
  channels/                 # HTTP entry point + auth
  subagents/                # specialist child agents
  lib/                      # shared authored code (API client, types, audit state)
evals/                      # automated end-to-end tests with a judge
AGENTS.md                   # notes for coding assistants working in this repo
```

## Suggested explorations

Once you have it running, try changing something and watching the effect:

- **Tighten a guardrail.** Lower the refund approval threshold in `agent/tools/issue_refund.ts` and re-run the refund conversation.
- **Add a rule.** Extend `agent/instructions.md` or the `refund-policy` skill and see how behavior shifts.
- **Add a tool.** Create a new file in `agent/tools/`; the filename becomes the tool name the model sees.
- **Write an eval.** Copy one of the files in `evals/` to lock in a behavior you care about, then run the suite.

## Learn more

The installed eve package ships its own docs under `node_modules/eve/docs/` (start with `README.md` and `getting-started.mdx`). The public documentation lives at [eve.dev/docs](https://eve.dev/docs).

> eve is in preview: the framework, APIs, and behavior may change. As the deployer, you are responsible for configuring approvals, tool restrictions, connection scopes, and other safeguards appropriate to your data and use case. This sample talks only to a mock API with fictional data.
