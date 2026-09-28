import { defineEval } from "eve/evals";

export default defineEval({
  description: "Agent looks up a known customer and returns correct plan",
  async test(t) {
    await t.send("What plan is sarah@techcorp.com on?");
    t.calledTool("lookup_customer", { input: { email: "sarah@techcorp.com" } });
    t.judge.autoevals.closedQA("Does the reply state the customer is on the Growth plan?").atLeast(0.8);
    t.succeeded();
  },
});
