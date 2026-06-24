import { defineEval } from "eve/evals";

export default defineEval({
  description:
    "AC9: After escalating an issue, the agent does not file a duplicate escalation on the next message.",
  async test(t) {
    await t.send(
      "I'm james@megafinance.com. My payment failed and I'm about to lose service. This is urgent — I need to talk to someone NOW.",
    );
    t.calledTool("lookup_customer", {
      input: { email: "james@megafinance.com" },
    });
    t.calledTool("escalate_to_human");

    await t.send(
      "I need this escalated immediately! Why hasn't anyone contacted me yet?",
    );
    t.completed();
    t.calledTool("escalate_to_human", { times: 1 });
    t.judge.autoevals
      .closedQA("agent acknowledges the issue is already escalated and reassures the customer without creating a duplicate escalation")
      .atLeast(0.8);
  },
});
