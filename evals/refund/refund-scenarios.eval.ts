import { defineEval } from "eve/evals";

const cases = [
  {
    id: "duplicate-charge-under-500",
    description: "AC2: When a customer reports a duplicate charge ≤$500, the agent identifies it and processes the refund.",
    email: "emily@startuplab.co",
    prompt: "Hi, I'm emily@startuplab.co. I was charged twice for my Starter plan in June — invoice INV-1021 is a duplicate of INV-1020. Can you refund the duplicate?",
    shouldComplete: true,
    refundCompletes: true,
  },
  {
    id: "over-500-requires-approval",
    description: "AC3: A refund over $500 is never completed without human sign-off — the agent pauses for approval.",
    email: "marcus@dataflow.io",
    prompt: "I'm marcus@dataflow.io. Invoice INV-1012 is a duplicate charge of $1,499 on my Scale plan. Please refund it.",
    shouldComplete: false,
    refundCompletes: false,
  },
  {
    id: "pending-described-as-pending",
    description: "AC4: The agent never tells a customer a refund is complete when it's waiting on approval.",
    email: "marcus@dataflow.io",
    prompt: "I'm marcus@dataflow.io. I see a duplicate charge on INV-1012 for $1,499. I need this refunded.",
    shouldComplete: false,
    refundCompletes: false,
  },
] as const;

export default cases.map((c) =>
  defineEval({
    description: c.description,
    async test(t) {
      await t.send(c.prompt);

      t.calledTool("lookup_customer", {
        input: { email: c.email },
      });

      if (c.shouldComplete) {
        t.completed();
      } else {
        t.waiting();
        t.messageIncludes(/pending review|awaiting approval/i);
      }

      if (c.refundCompletes) {
        t.calledTool("issue_refund");
      } else {
        t.expectInputRequests({ toolName: "issue_refund" });
      }
    },
  }),
);
