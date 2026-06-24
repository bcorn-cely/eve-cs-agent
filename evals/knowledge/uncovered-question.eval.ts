import { defineEval } from "eve/evals";

export default defineEval({
  description:
    "AC6: When asked a question the knowledge base doesn't cover, the agent says so and offers escalation.",
  async test(t) {
    await t.send(
      "Can you explain how Northwind's HIPAA compliance certification process works for healthcare customers?",
    );
    t.completed();
    t.judge.autoevals
      .closedQA("agent acknowledges it cannot answer the HIPAA compliance question from its knowledge base")
      .atLeast(0.8);
    t.judge.autoevals
      .closedQA("agent offers to escalate to a human or specialist team")
      .atLeast(0.7);
  },
});
