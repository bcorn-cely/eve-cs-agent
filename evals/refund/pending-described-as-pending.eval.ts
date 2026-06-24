import { defineEval } from "eve/evals";

export default defineEval({
  description:
    "AC4: The agent never tells a customer a refund is complete when it's waiting on approval.",
  async test(t) {
    await t.send(
      "I'm marcus@dataflow.io. I see a duplicate charge on INV-1012 for $1,499. I need this refunded.",
    );
    t.waiting();
    t.notCalledTool("issue_refund");
    t.messageIncludes(/pending|review|approv/i);
  },
});
