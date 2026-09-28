# Northwind CS Agent

A complete, runnable reference agent built with [**eve**](https://eve.dev/docs), Vercel's filesystem-first framework for durable backend agents.

This repository is the starter you take home from a hands-on workshop that introduces developers and builders to eve. Rather than a "hello world," it is a realistic customer-support agent that exercises the core building blocks you'll use in your own eve apps: instructions, tools, skills, connections, hooks, a sandbox, a channel, a subagent, and evals. Each concept lives in its own file, so you can read one file to understand one idea.

It is meant to be read, run, and taken apart. Clone it, talk to the agent, change something, watch what happens, then use it as the skeleton for an agent of your own. The Northwind billing scenario is fictional and exists only to give every eve primitive a realistic job to do; the point you're meant to walk away with is the framework, not the domain.

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
| **Hooks** | `agent/hooks/compliance_logger.ts` | Code that reacts to runtime events (here: send session, message, and turn activity to a simulated analytics warehouse). |
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
NORTHWIND_BILLING_API_TOKEN=testtoken
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

These npm scripts wrap the most common eve commands:

```bash
npm run typecheck   # tsc: type-check the project
npm run build       # eve build: compile to .eve/ and build the host output
npm start           # eve start: serve the built output
```

For the rest of the toolchain, call the `eve` binary directly with `npx eve <command>`. The ones you'll reach for most:

| Command | What it does |
|---|---|
| `npx eve info` | Prints everything eve discovered from the filesystem: tools, skills, subagents, channels, routes, and discovery diagnostics. Run it first whenever the agent behaves unexpectedly; it confirms a file was picked up without booting the dev server. |
| `npx eve dev` | Starts the local dev server and interactive terminal UI (what `npm run dev` runs). Pass a URL, e.g. `npx eve dev https://your-app.vercel.app`, to point the UI at a deployed instance instead of a local one. |
| `npx eve eval` | Runs the eval suites under `evals/`, against the local app or a remote `--url`. |
| `npx eve link` | Links the directory to a Vercel project and pulls an AI Gateway credential into `.env.local`, an alternative to setting `AI_GATEWAY_API_KEY` by hand. |
| `npx eve deploy` | Deploys the agent to Vercel production, linking first if needed. This is how you take it from a local REPL to a live URL. |

A good working loop: edit files under `agent/`, run `eve info` to confirm discovery, iterate with `eve dev`, then `eve build` and `eve deploy` when you're ready to ship.

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
  hooks/                    # event-driven side effects (session analytics)
  sandbox/                  # sandbox + network policy
  channels/                 # HTTP entry point + auth
  subagents/                # specialist child agents
  lib/                      # shared authored code (API client, types, audit state)
evals/                      # automated end-to-end tests with a judge
AGENTS.md                   # notes for coding assistants working in this repo
```

## Suggested explorations

The agent is a starting point. The fastest way to learn eve is to change one thing, run it, and watch the behavior move.

**Warm-ups**

- **Tighten a guardrail.** Lower the approval threshold in `agent/tools/issue_refund.ts` and re-run the large-refund conversation.
- **Add a rule or a tool.** Extend `agent/instructions.md` (or the `refund-policy` skill), or drop a new file in `agent/tools/`; the filename becomes the tool name the model sees.
- **Lock a behavior in.** Copy a file in `evals/` to pin a behavior you care about, then run `npx eve eval`.

**Go further**

These reach for eve's more advanced primitives, and each one maps to a question builders actually ask after seeing eve for the first time. Each references the matching doc under `node_modules/eve/docs/`.

- **Wire it to your own backend.** The most common question: "how do I make this part of my existing service?" The pattern is already in this repo. Swap the OpenAPI spec URL in `agent/connections/billing-records.ts` for your own API's spec (or an MCP server), and the agent calls your systems instead of Northwind's mock. Your existing backend can call the agent back through its HTTPS channel like any other internal API. (`connections/`, `guides/remote-agents.md`)
  *Try:* change `spec` and `baseUrl` in `billing-records.ts` to your API, set its `auth`, then run `npx eve info` to see the new tools appear.
- **Lock down the front door.** The channel currently ends in `placeholderAuth()`, which fails closed in production. Replace it with your real auth provider so the channel establishes who is calling, then use that identity to decide what the caller can do. Auth in eve has three deliberate seams: channel auth (who can call the agent), connection auth (what identity the agent uses when calling other systems), and approval (what pauses for a human). This repo demonstrates all three. (`guides/auth-and-route-protection.md`)
  *Try:* in `agent/channels/eve.ts`, swap `placeholderAuth()` for `httpBasic()`, then log `ctx.session.auth` from a tool to see the caller's identity arrive.
- **Serve a different playbook per caller.** Once callers have identities, make the `refund-policy` skill dynamic: wrap it in `defineDynamic` + `defineSkill` keyed on `ctx.session.auth`, so an enterprise caller loads a stricter escalation playbook than a starter one, and nobody else ever sees it. The same mechanism works for tools and instructions. (`guides/dynamic-capabilities.md`)
  *Try:* add `agent/skills/tier_playbook.ts` exporting `defineDynamic` with a `"session.started"` resolver that reads the caller and returns a `defineSkill({ markdown })`, or `null`.
- **Give it durable memory.** Use `defineState` (`eve/context`) to track something across turns, like a running total of refunds this session, and have `issue_refund` refuse once the session crosses a cap. The agent already accumulates totals in `agent/lib/audit.ts`, so this is a short step from what's there. (`guides/state.md`)
  *Try:* declare `defineState("cs.refunds", () => ({ total: 0 }))` in `agent/lib/`, then `get()` and `update()` it inside `issue_refund`'s `execute`.
- **Swap the model, then prove which is better.** The model is one string in `agent/agent.ts`, and eve runs on the AI SDK, so you are not locked to one provider. Change it, then run the same eval suite against each candidate with `npx eve eval` and diff the score reports. That is a model bake-off with the tests you already have. (`agent-config.md`, `evals/`)
  *Try:* `npx eve eval --json > run-a.json`, change the model string, run again, diff the two files.
- **Make it proactive.** Add a `defineSchedule` under `agent/schedules/` that runs a nightly sweep, such as re-checking open escalations and posting a digest, so the agent starts itself on a cron cadence instead of waiting for a message. (`schedules.mdx`)
  *Try:* create `agent/schedules/sweep.md` with `cron: "0 6 * * *"` frontmatter and the prompt as the body; in dev, fire it once with `curl -X POST localhost:3000/eve/v1/dev/schedules/sweep`.
- **Let it get sharper over time.** The most-asked question after every session: "how do I build an agent that improves itself?" The safe shape: keep the agent's knowledge in markdown (instructions and skills are already files, so they can live in git like a reviewable brain), have a hook record every miss (an escalation, an "I can't verify that") into durable state, summarize the recurring ones on a schedule, and fold them back into instructions, a skill, or a new eval. A subagent can even draft that change as a PR. The loop is capture, review, encode, with a human merging, not the agent rewriting its own prompt unsupervised. (`guides/state.md`, `schedules.mdx`, `evals/`)
  *Try:* add a `miss_logger.ts` hook that listens for `"action.result"` and appends escalations to a `defineState` list, add a weekly schedule whose prompt is "summarize this session's recorded misses and propose an edit to instructions.md", and review what it suggests.
- **Add another specialist.** The root agent already delegates invoice analysis to the `billing_investigator` subagent. Add a second one, say a read-only `compliance_auditor`, with its own tools and instructions, and watch the router pick it. This is eve's orchestration story: a top-level agent composing scoped, auditable specialists rather than one giant agent doing everything. (`subagents.mdx`)
  *Try:* copy `agent/subagents/billing_investigator/` to a new folder, rewrite its `instructions.md` and tools, run `npx eve info` to confirm discovery, then ask the root agent an audit question.
- **Make its behavior visible.** `agent/hooks/compliance_logger.ts` already records session boundaries, messages, and turns. Extend it to emit structured events for tool calls and approvals to whatever observability stack you run (OpenTelemetry is a natural fit), so you can audit what the agent did and why, in your own UI. (`guides/instrumentation.md`, `guides/hooks.md`)
  *Try:* in `compliance_logger.ts`, add an `"action.result"` handler that logs every tool call as one JSON line, then replace `sendToWarehouse` with a call to your log pipeline.

Taking this toward real, multi-tenant traffic? Eve is tenant-agnostic infrastructure, so tenancy is yours to design, and the `patterns/` docs (`multi-tenant-auth`, `multi-tenant-approvals`, `multi-tenant-memory`) show per-tenant auth, approval thresholds, and memory.

## Learn more

The installed eve package ships its own docs under `node_modules/eve/docs/` (start with `README.md` and `getting-started.mdx`). The public documentation lives at [eve.dev/docs](https://eve.dev/docs).

> eve is in preview: the framework, APIs, and behavior may change. As the deployer, you are responsible for configuring approvals, tool restrictions, connection scopes, and other safeguards appropriate to your data and use case. This sample talks only to a mock API with fictional data.
