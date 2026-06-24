import { defineTool } from "eve/tools";
import { z } from "zod";
import { apiFetch } from "#lib/api.js";
import type { Ticket } from "#lib/types.js";

export default defineTool({
  description: "Update the status of a support ticket.",
  inputSchema: z.object({
    ticketId: z.string().describe("The ticket ID"),
    status: z
      .enum(["open", "waiting_on_customer", "escalated", "resolved"])
      .describe("The new ticket status"),
    note: z
      .string()
      .optional()
      .describe("Optional note to add to the ticket"),
  }),
  async execute({ ticketId, status, note }) {
    try {
      const ticket = await apiFetch<Ticket>(
        `/api/tickets/${encodeURIComponent(ticketId)}`,
        {
          method: "PATCH",
          body: JSON.stringify({ status, ...(note ? { note } : {}) }),
        },
      );
      return {
        success: true,
        ticket: {
          id: ticket.id,
          status: ticket.status,
        },
      };
    } catch (err) {
      if (err instanceof Error && err.message.includes("404")) {
        return { success: false, error: `Ticket ${ticketId} not found.` };
      }
      throw err;
    }
  },
});
