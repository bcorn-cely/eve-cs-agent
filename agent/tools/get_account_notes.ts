import { defineTool } from "eve/tools";
import { z } from "zod";
import { apiFetch } from "#lib/api.js";
import type { AccountNote } from "#lib/types.js";

export default defineTool({
  description:
    "Retrieve all notes on a customer's account that were left by support agents.",
  inputSchema: z.object({
    customerId: z.string().describe("The customer ID (e.g. CUST-001)"),
  }),
  async execute({ customerId }) {
    try {
      const notes = await apiFetch<AccountNote[]>(
        `/api/customers/${encodeURIComponent(customerId)}/notes`,
      );
      return {
        found: true,
        customerId,
        notes,
        totalNotes: notes.length,
      };
    } catch (err) {
      if (err instanceof Error && err.message.includes("404")) {
        return { found: false, error: `Customer ${customerId} not found.` };
      }
      throw err;
    }
  },
});
