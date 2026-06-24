import { defineEval } from "eve/evals";

export default defineEval({
  description:
    "AC2: When a customer reports a duplicate charge ≤$500, the agent identifies it and processes the refund.",
  async test(t) {
    await t.send(
      "Hi, I'm emily@startuplab.co. I was charged twice for my Starter plan in June — invoice INV-1021 is a duplicate of INV-1020. Can you refund the duplicate?",
    );
    t.completed();
    t.calledTool("lookup_customer");
    t.calledTool("issue_refund");
  },
});
