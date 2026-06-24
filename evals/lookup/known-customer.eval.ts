import { defineEval } from "eve/evals";
import { includes } from "eve/evals/expect";

export default defineEval({
  description:
    "AC1: When asked about a known customer's plan, the agent looks them up and answers correctly.",
  async test(t) {
    await t.send("What plan is sarah@techcorp.com on?");
    t.completed();
    t.calledTool("lookup_customer", {
      input: { email: "sarah@techcorp.com" },
    });
    t.check(t.reply, includes("Growth"));
  },
});
