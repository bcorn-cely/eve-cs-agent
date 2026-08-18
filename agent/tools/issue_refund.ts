import { defineTool } from "eve/tools";
import { z } from "zod";
import { apiFetch, ApiError } from "#lib/api.js";
import { auditState } from "#lib/audit.js";
import type { Invoice } from "#lib/types.js";
import { always } from "eve/tools/approval";

interface RefundResponse {
  refundId: string;
  invoiceId: string;
  amount: number;
  reason: string;
  status: string;
  timestamp: string;
}

export default defineTool({
  description:
    "Issue a refund for a specific invoice after verifying eligibility.",
  inputSchema: z.object({
    invoiceId: z.string().describe("The invoice ID to refund"),
    amount: z.number().positive().describe("Refund amount (must not exceed invoice amount)"),
    reason: z.string().describe("Reason for the refund"),
  }),
  approval: ({ toolInput }) =>
    (toolInput?.amount ?? 0) > 500,
  async execute({ invoiceId, amount, reason }) {
    // Fetch invoice to get customerId and validate
    let invoice: Invoice;
    try {
      invoice = await apiFetch<Invoice>(`/api/invoices/${encodeURIComponent(invoiceId)}`);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        return {
          success: false,
          error: "Invoice not found",
          invoiceId,
        };
      }
      throw error;
    }

    // Validate amount doesn't exceed invoice
    if (amount > invoice.amount) {
      return {
        success: false,
        error: `Refund amount $${amount} exceeds invoice total $${invoice.amount}`,
        invoiceId,
        customerId: invoice.customerId,
      };
    }

    // Check if already refunded
    if (invoice.status === "refunded") {
      return {
        success: false,
        error: "Invoice has already been refunded",
        invoiceId,
        customerId: invoice.customerId,
      };
    }

    // Issue the refund
    let refund: RefundResponse;
    try {
      refund = await apiFetch<RefundResponse>(
        `/api/invoices/${encodeURIComponent(invoiceId)}/refund`,
        {
          method: "POST",
          body: JSON.stringify({ amount, reason }),
        }
      );
    } catch (error) {
      if (error instanceof ApiError && error.status === 400) {
        return {
          success: false,
          error: "Invalid refund request — amount may exceed invoice total",
          invoiceId,
          customerId: invoice.customerId,
        };
      }
      throw error;
    }

    // Update audit state
    auditState.update((state) => ({
      ...state,
      refundTotal: state.refundTotal + amount,
      auditEntries: [
        ...state.auditEntries,
        {
          timestamp: refund.timestamp,
          action: "refund" as const,
          details: {
            refundId: refund.refundId,
            invoiceId,
            amount,
            reason,
            customerId: invoice.customerId,
          },
        },
      ],
    }));

    // Add account note
    await apiFetch(`/api/customers/${encodeURIComponent(invoice.customerId)}/notes`, {
      method: "POST",
      body: JSON.stringify({
        note: `Refund issued: $${amount} for invoice ${invoiceId}. Reason: ${reason}`,
      }),
    });

    return {
      success: true,
      refund: {
        refundId: refund.refundId,
        invoiceId: refund.invoiceId,
        amount: refund.amount,
        reason: refund.reason,
        timestamp: refund.timestamp,
        status: "completed",
        customerId: invoice.customerId,
      },
    };
  },
});
