import { defineEval } from "eve/evals";
import { includes } from "eve/evals/expect";

export default defineEval({
  description:
    "AC5: When asked about an unknown email, the agent asks to confirm rather than inventing an account.",
  async test(t) {
    await t.send(
      "I need help with my account. My email is nobody@nonexistent.com.",
    );
    t.completed();
    t.calledTool("lookup_customer");
    t.check(t.reply, includes("confirm"));
    t.notCalledTool("get_subscription");
  },
});
