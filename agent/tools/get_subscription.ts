import { defineTool } from "eve/tools";
import { z } from "zod";
import { apiFetch } from "#lib/api.js";
import type { Subscription } from "#lib/types.js";

export default defineTool({
  description:
    "Pull a customer's subscription details and recent invoice history so you can reason about charges, renewals, and disputes.",
  inputSchema: z.object({
    customerId: z.string().describe("The customer ID (e.g. CUST-001)"),
  }),
  async execute({ customerId }) {
    try {
      const sub = await apiFetch<Subscription>(
        `/api/subscriptions?customerId=${encodeURIComponent(customerId)}`,
      );
      return {
        found: true,
        subscription: {
          id: sub.id,
          plan: sub.plan,
          status: sub.status,
          monthlyRate: sub.monthlyRate,
          currentPeriodStart: sub.currentPeriodStart,
          currentPeriodEnd: sub.currentPeriodEnd,
        },
        invoices: (sub.recentInvoices ?? []).map((inv) => ({
          id: inv.id,
          amount: inv.amount,
          status: inv.status,
          date: inv.date,
          description: inv.description,
          isDuplicate: inv.duplicate,
        })),
      };
    } catch (err) {
      if (err instanceof Error && err.message.includes("404")) {
        return { found: false, message: `No subscription found for ${customerId}` };
      }
      throw err;
    }
  },
});
