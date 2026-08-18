import { defineTool } from "eve/tools";
import { z } from "zod";
import { apiFetch } from "#lib/api.js";
import { auditState } from "#lib/audit.js";
import type { Escalation } from "#lib/types.js";

export default defineTool({
  description:
    "Escalate an issue to human support when the agent cannot resolve it.",
  inputSchema: z.object({
    customerId: z.string().describe("The customer's unique identifier"),
    ticketId: z.string().optional().describe("Associated ticket ID, if any"),
    reason: z.string().describe("Why this issue requires human intervention"),
    classification: z.string().describe("Category of the escalation (e.g., billing_dispute, technical_issue, policy_exception)"),
    urgency: z.string().describe("Urgency level (e.g., low, medium, high, critical)"),
    attemptedActions: z.array(z.string()).describe("List of actions already attempted by the agent"),
    customerImpact: z.string().describe("Description of how this issue affects the customer"),
  }),
  async execute({ customerId, ticketId, reason, classification, urgency, attemptedActions, customerImpact }) {
    const state = auditState.get();

    // Build deduplication key
    const issueKey = `${customerId}:${ticketId ?? "no-ticket"}:${classification}`;

    // Check for duplicate escalation
    if (state.escalatedIssueIds.includes(issueKey)) {
      return {
        success: false,
        duplicate: true,
        message: `This issue has already been escalated in this session (${classification} for customer ${customerId})`,
      };
    }

    // Create escalation via API
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

    // Update audit state
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
            classification,
            urgency,
            reason,
          },
        },
      ],
    }));

    return {
      success: true,
      escalation: {
        id: escalation.id,
        timestamp: escalation.createdAt,
        status: "pending" as const,
        customerId,
        ticketId,
        urgency,
      },
      sessionEscalationCount: state.escalationCount + 1,
    };
  },
});
