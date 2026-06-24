import { defineTool } from "eve/tools";
import { z } from "zod";
import { auditState } from "#lib/audit.js";

export default defineTool({
  description:
    "Retrieve the audit trail for this session — every refund, escalation, and adjustment with timestamps and running totals.",
  inputSchema: z.object({}),
  async execute() {
    const state = auditState.get();
    return {
      sessionSummary: {
        totalRefunded: state.refundTotal,
        escalationCount: state.escalationCount,
        escalatedIssueIds: state.escalatedIssueIds,
      },
      entries: state.auditEntries,
    };
  },
});
