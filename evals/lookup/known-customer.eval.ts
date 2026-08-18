import { defineEval } from "eve/evals";
import { includes } from "eve/evals/expect";

export default defineEval({
  description: "Agent looks up a known customer and returns correct plan",
  async test(t) {
    await t.send("What plan is sarah@techcorp.com on?");
    t.calledTool("lookup_customer", { input: { email: "sarah@techcorp.com" } });
    t.judge.autoevals.closedQA('Did this user show as on the Growth plan?').atLeast(0.9)
    t.succeeded()
  },
});
