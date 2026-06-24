import { defineSchedule } from "eve/schedules";

export default defineSchedule({
  cron: "0 13 * * 1-5",
  markdown: `Produce a morning digest of unresolved escalations.

1. Use the get_audit_log tool to retrieve the current session's audit entries for any recent escalation context.
2. Query the Northwind Billing API for all customers and check their escalation and ticket status:
   - For each customer, call the escalations endpoint to find any with status "pending".
   - For each customer, call the tickets endpoint to find any with status "escalated".
3. Cross-reference escalations against open tickets.
4. Produce a summary that includes:
   - Total unresolved escalations
   - For each: escalation ID, customer name, urgency, reason, how long it's been open
   - Any P1 items highlighted at the top
5. Save the digest to /workspace/digests/ with today's date as the filename (e.g. 2025-06-23-escalation-digest.md).

This digest ensures nothing high-severity quietly falls through the cracks overnight.`,
});
