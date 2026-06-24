import { defineEval } from "eve/evals";

export default defineEval({
  description:
    "AC11: Refunds and escalations leave a durable, timestamped audit record.",
  async test(t) {
    await t.send(
      "I'm emily@startuplab.co. Invoice INV-1021 is a duplicate — please refund the $49.",
    );
    t.calledTool("lookup_customer", {
      input: { email: "emily@startuplab.co" },
    });
    t.calledTool("issue_refund");

    await t.send("Can you show me the audit log for this session?");
    t.completed();
    t.calledTool("get_audit_log");
    t.judge.autoevals
      .closedQA("agent shows an audit log that includes the refund action and invoice INV-1021")
      .atLeast(0.8);
  },
});
