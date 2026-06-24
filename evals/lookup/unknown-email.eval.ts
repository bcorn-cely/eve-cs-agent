import { defineEval } from "eve/evals";

export default defineEval({
  description:
    "AC5: When asked about an unknown email, the agent asks to confirm rather than inventing an account.",
  async test(t) {
    await t.send(
      "I need help with my account. My email is nobody@nonexistent.com.",
    );
    t.completed();
    t.calledTool("lookup_customer", {
      input: { email: "nobody@nonexistent.com" },
    });
    t.notCalledTool("get_subscription");
    t.judge.autoevals
      .closedQA("agent indicates the email was not found and asks the customer to confirm or provide a different email")
      .atLeast(0.8);
  },
});
