import { defineEval } from "eve/evals";

export default defineEval({
  description:
    "AC6: When asked a question the knowledge base doesn't cover, the agent says so and offers escalation.",
  async test(t) {
    await t.send(
      "Can you explain how Northwind's HIPAA compliance certification process works for healthcare customers?",
    );
    t.completed();
    t.messageIncludes(/can't verify|doesn't cover|don't have.*information|not covered|unable to confirm/i);
    t.messageIncludes(/escalat|human|team/i);
  },
});
