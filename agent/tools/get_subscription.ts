import { defineTool } from "eve/tools";
import { z } from "zod";
import { apiFetch, ApiError } from "#lib/api.js";
import type { Subscription } from "#lib/types.js";

export default defineTool({
  description:
    "Pull a customer's subscription details and recent invoice history so you can reason about charges, renewals, and disputes.",
  inputSchema: z.object({
    customerId: z.string().describe("The customer's unique identifier"),
  }),
  async execute({ customerId }) {
    try {
      const subscription = await apiFetch<Subscription>(
        `/api/subscriptions?customerId=${encodeURIComponent(customerId)}`
      );

      return {
        found: true,
        subscription: {
          id: subscription.id,
          plan: subscription.plan,
          status: subscription.status,
          monthlyRate: subscription.monthlyRate,
          currentPeriodStart: subscription.currentPeriodStart,
          currentPeriodEnd: subscription.currentPeriodEnd,
        },
        invoices: (subscription.recentInvoices ?? []).map((inv) => ({
          id: inv.id,
          amount: inv.amount,
          status: inv.status,
          date: inv.date,
          description: inv.description,
          isDuplicate: inv.isDuplicate,
        })),
      };
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        return {
          found: false,
          message:
            "No subscription found for this customer. They may not have an active subscription.",
        };
      }
      throw error;
    }
  },
});
