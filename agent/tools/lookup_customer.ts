import { defineTool } from "eve/tools";
import { z } from "zod";
import { apiFetch } from "#lib/api.js";
import type { Customer } from "#lib/types.js";

export default defineTool({
  description:
    "Look up a customer by their email address and return their account summary.",
  inputSchema: z.object({
    email: z.string().email().describe("The customer's email address"),
  }),
  async execute({ email }) {
    try {
      const customer = await apiFetch<Customer>(
        `/api/customers?email=${encodeURIComponent(email)}`
      );

      return {
        found: true,
        customer: {
          id: customer.id,
          name: customer.name,
          email: customer.email,
          company: customer.company,
          plan: customer.plan,
          monthlyRate: customer.monthlyRate,
          customerSince: customer.customerSince,
          subscriptionStatus: customer.subscriptionStatus,
        },
      };
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return {
          found: false,
          message:
            "No customer found with that email address.",
        };
      }
      throw error;
    }
  },
});
