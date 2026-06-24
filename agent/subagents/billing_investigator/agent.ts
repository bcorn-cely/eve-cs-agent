import { defineAgent } from "eve";

export default defineAgent({
  description:
    "Investigate billing disputes: line-by-line invoice analysis, proration checks, duplicate charge detection across dunning history. Reports findings back — does not issue refunds or escalations.",
  model: "anthropic/claude-sonnet-4.6",
});
