---
description: Load before processing or evaluating any refund, credit, or billing adjustment.
---

# Northwind Refund & Billing Policy

## Refund eligibility

| Scenario | Policy |
|----------|--------|
| Charge within 14 days | Full refund |
| Mid-cycle downgrade | Prorated refund for unused portion of the billing period |
| Duplicate charge | Always refunded in full, regardless of amount or timing |
| Charge older than 14 days (not a duplicate) | Escalate to a human — you cannot approve this |
| Anything outside these rules | Escalate to a human |

## Approval thresholds

- **$500 or less**: You may approve and issue the refund yourself, provided it fits one of the scenarios above.
- **Over $500**: You must prepare the refund with a clear explanation, but it **cannot be completed without human approval**. The system will pause for sign-off.

## Processing steps

1. Look up the customer's subscription and invoice history.
2. Identify the invoice in question. Confirm the charge amount.
3. Determine which policy row applies.
4. Verify the refund amount does not exceed the invoice charge.
5. If eligible and ≤$500: issue the refund using `issue_refund`.
6. If eligible but >$500: issue the refund — the system will automatically pause for human approval.
7. If not eligible: explain why, offer to escalate.
8. Always leave an account note documenting the refund or denial.

## Honesty rule

- Completed refund → tell the customer it's done.
- Refund pending human approval → tell the customer it's **pending review by our team**. Never say it's been processed when it hasn't.
