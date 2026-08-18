import { defineEval } from "eve/evals";
import { includes } from "eve/evals/expect";

export default defineEval({
  description: "Refund over $500 should pause for approval",
  async test(t) {
    await t.send(
      "I'm marcus@dataflow.io. Invoice INV-1012 is a duplicate $1,499 charge. Refund it."
    );
    t.calledTool("lookup_customer");
    const request = await t.requireInputRequest({ optionIds: ['approve', 'deny'], toolName: 'issue_refund'})
    await t.respond({ requestId: request.requestId, optionId: 'approve'});
    t.calledTool('issue_refund');
    t.judge.autoevals.closedQA('Did the agent issue a refund?').atLeast(0.8);
    t.succeeded();
  },
});
