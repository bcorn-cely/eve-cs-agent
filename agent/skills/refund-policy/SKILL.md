---
description: Load before processing or evaluating any refund, credit, or billing adjustment.
---

# Northwind Refund & Billing Policy

## Refund eligibility

| Scenario | Policy |
|----------|--------|
| Charge within 14 days | Full refund |
| Mid-cycle downgrade | Prorated refund for unused portion |
| Duplicate charge | Always refunded in full, regardless of amount or timing |
| Charge older than 14 days (not duplicate) | Escalate to human |
| Anything outside these rules | Escalate to human |

## Approval thresholds

- **$500 or less**: Agent can approve if the scenario fits the eligibility table above.
- **Over $500**: Must prepare refund with explanation. Cannot complete without human approval — the system will pause automatically.

## Processing steps

1. Look up the customer's subscription and invoice history.
2. Identify the specific invoice or charge in question.
3. Determine which policy scenario applies from the eligibility table.
4. Verify the refund amount does not exceed the original charge.
5. If eligible issue refund
7. If not eligible, explain why and offer to escalate to a human agent.
8. Always leave an account note documenting the decision and outcome.

## Honesty rule

- **Completed refund**: Tell the customer the refund has been processed.
- **Pending human approval**: Tell the customer the request is "pending review by our team." Never say a refund has been processed when it has not.
