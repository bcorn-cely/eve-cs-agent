import { defineTool } from "eve/tools";
import { z } from "zod";
import { apiFetch } from "#lib/api.js";
import type { AccountNote } from "#lib/types.js";

export default defineTool({
  description:
    "Leave a timestamped note on a customer's account so the next session or a human teammate has context.",
  inputSchema: z.object({
    customerId: z.string().describe("The customer ID"),
    content: z.string().describe("The note content"),
  }),
  async execute({ customerId, content }) {
    try {
      const created = await apiFetch<AccountNote>(
        `/api/customers/${encodeURIComponent(customerId)}/notes`,
        { method: "POST", body: JSON.stringify({ note: content }) },
      );
      return {
        success: true,
        note: { customerId, timestamp: created.timestamp, content: created.content },
      };
    } catch (err) {
      if (err instanceof Error && err.message.includes("404")) {
        return { success: false, error: `Customer ${customerId} not found.` };
      }
      throw err;
    }
  },
});
