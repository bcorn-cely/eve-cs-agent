import { defineTool } from "eve/tools";
import { z } from "zod";
import { apiFetch } from "#lib/api.js";
import { auditState } from "#lib/audit.js";
import type { Escalation } from "#lib/types.js";

export default defineTool({
  description:
    "Escalate an issue to a human support lead with full context. Check for duplicate escalations before filing.",
  inputSchema: z.object({
    customerId: z.string().describe("The customer ID"),
    ticketId: z.string().optional().describe("Related ticket ID, if any"),
    reason: z.string().describe("Why this is being escalated"),
    classification: z
      .string()
      .describe("Issue category: billing, technical, account, plan_change, other"),
    urgency: z.string().describe("Urgency level: P1, P2, P3, P4"),
    attemptedActions: z
      .string()
      .describe("What the agent already tried before escalating"),
    customerImpact: z
      .string()
      .describe("The customer's own description of the problem and impact"),
  }),
  async execute({
    customerId,
    ticketId,
    reason,
    classification,
    urgency,
    attemptedActions,
    customerImpact,
  }) {
    const state = auditState.get();
    const issueKey = `${customerId}:${ticketId ?? "general"}:${classification}`;

    if (state.escalatedIssueIds.includes(issueKey)) {
      return {
        success: false,
        duplicate: true,
        message:
          "This issue has already been escalated in this session. The escalation is still open and a human will review it.",
        existingEscalationCount: state.escalationCount,
      };
    }

    const escalation = await apiFetch<Escalation>("/api/escalations", {
      method: "POST",
      body: JSON.stringify({
        customerId,
        ticketId,
        reason,
        classification,
        urgency,
        attemptedActions,
        customerImpact,
      }),
    });

    auditState.update((s) => ({
      ...s,
      escalationCount: s.escalationCount + 1,
      escalatedIssueIds: [...s.escalatedIssueIds, issueKey],
      auditEntries: [
        ...s.auditEntries,
        {
          timestamp: escalation.createdAt,
          action: "escalation" as const,
          details: {
            escalationId: escalation.id,
            customerId,
            ticketId,
            reason,
            classification,
            urgency,
          },
        },
      ],
    }));

    return {
      success: true,
      escalation: {
        id: escalation.id,
        timestamp: escalation.createdAt,
        status: "pending",
        customerId,
        ticketId,
        urgency,
      },
      sessionEscalationCount: state.escalationCount + 1,
    };
  },
});
