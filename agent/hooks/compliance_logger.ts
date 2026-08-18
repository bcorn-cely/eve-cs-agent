import { defineHook } from "eve/hooks";
import { toolResultFrom } from "eve/tools";
import issueRefund from "../tools/issue_refund.js";

export default defineHook({
  events: {
    "action.result"(event, ctx) {
      const result = toolResultFrom(event.data.result, issueRefund);
      if (!result || !result.output.success || !result.output.refund) return;

      const { refund } = result.output;
      console.log("[COMPLIANCE] Refund issued", {
        sessionId: ctx.session.id,
        refundId: refund.refundId,
        amount: refund.amount,
        customerId: refund.customerId,
        timestamp: new Date().toISOString(),
      });
    },
  },
});
