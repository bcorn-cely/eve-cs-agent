import { defineTool } from "eve/tools";
import { z } from "zod";
import { apiFetch } from "#lib/api.js";
import { auditState } from "#lib/audit.js";
import type { Invoice, RefundReceipt } from "#lib/types.js";

export default defineTool({
  description:
    "Issue a refund, credit, or billing adjustment against a specific invoice. Refunds over $500 require human approval and will pause for sign-off.",
  inputSchema: z.object({
    invoiceId: z.string().describe("The invoice ID to refund against"),
    amount: z.number().positive().describe("The refund amount in dollars"),
    reason: z.string().describe("Why the refund is being issued"),
  }),
  needsApproval: ({ toolInput }) => (toolInput?.amount ?? 0) > 500,
  async execute({ invoiceId, amount, reason }) {
    let invoice: Invoice;
    try {
      invoice = await apiFetch<Invoice>(
        `/api/invoices/${encodeURIComponent(invoiceId)}`,
      );
    } catch {
      return { success: false, error: `Invoice ${invoiceId} not found.` };
    }

    if (amount > invoice.amount) {
      return {
        success: false,
        error: `Refund amount ($${amount}) exceeds the invoice charge ($${invoice.amount}). A refund cannot exceed the original charge.`,
      };
    }
    if (invoice.status === "refunded") {
      return {
        success: false,
        error: `Invoice ${invoiceId} has already been refunded.`,
      };
    }

    const receipt = await apiFetch<RefundReceipt>(
      `/api/invoices/${encodeURIComponent(invoiceId)}/refund`,
      { method: "POST", body: JSON.stringify({ amount, reason }) },
    );

    auditState.update((s) => ({
      ...s,
      refundTotal: s.refundTotal + amount,
      auditEntries: [
        ...s.auditEntries,
        {
          timestamp: receipt.timestamp,
          action: "refund" as const,
          details: {
            invoiceId,
            amount,
            reason,
            customerId: invoice.customerId,
          },
        },
      ],
    }));

    await apiFetch(
      `/api/customers/${encodeURIComponent(invoice.customerId)}/notes`,
      {
        method: "POST",
        body: JSON.stringify({
          note: `Refund of $${amount} issued against invoice ${invoiceId}. Reason: ${reason}`,
        }),
      },
    ).catch(() => {});

    return {
      success: true,
      refund: {
        invoiceId,
        amount,
        reason,
        timestamp: receipt.timestamp,
        status: "completed",
        customerId: invoice.customerId,
      },
    };
  },
});
