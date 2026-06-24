import { defineEval } from "eve/evals";

export default defineEval({
  description:
    "AC7: When a customer reports a webhook failure, the agent works through the troubleshooting playbook.",
  async test(t) {
    await t.send(
      "Hi, I'm sarah@techcorp.com. Our webhooks stopped delivering payment events about 2 hours ago. We're getting 502 errors on every delivery attempt.",
    );
    t.completed();
    t.calledTool("lookup_customer", {
      input: { email: "sarah@techcorp.com" },
    });
    t.loadedSkill("troubleshooting");
    t.judge.autoevals
      .closedQA("agent begins webhook troubleshooting by asking diagnostic questions or suggesting specific steps")
      .atLeast(0.7);
  },
});
