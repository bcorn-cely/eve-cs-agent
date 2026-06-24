---
description: Load when answering general product questions, billing FAQ, or "how does this work" questions.
---

# Northwind Product Knowledge Base

## What Northwind does

Northwind is a subscription billing and revenue-analytics platform for B2B SaaS companies. We handle recurring billing, invoicing, revenue recognition, and analytics so our customers can focus on their product instead of building billing infrastructure.

## Plans

| Plan | Price | Best for | Key features |
|------|-------|----------|--------------|
| **Starter** | $49/mo | Early-stage startups, small teams | Basic recurring billing, invoice generation, payment processing, email receipts |
| **Growth** | $299/mo | Scaling companies, 50-500 customers | Everything in Starter + revenue analytics dashboard, webhook integrations, dunning management, multi-currency support |
| **Scale** | $1,499/mo | Large operations, 500+ customers | Everything in Growth + custom invoicing templates, advanced revenue recognition, dedicated API rate limits, priority support, SLA guarantees |

## Billing FAQ

**How does billing work?**
Monthly subscription billed on the same date each month (your signup date). Charges process automatically via the card on file.

**Can I change plans?**
Yes. Upgrades take effect immediately with a prorated charge for the remainder of your current billing period. Downgrades take effect at the start of your next billing period, with a prorated credit.

**What happens if my payment fails?**
We retry failed payments 3 times over 7 days. You'll receive an email notification after each attempt. If all retries fail, your account enters a "past due" state. Service continues for 14 days in past-due status, then is suspended until payment is resolved.

**How do I cancel?**
Contact support or go to Settings → Subscription → Cancel. Cancellation takes effect at the end of your current billing period — you keep access until then. No partial-month refunds for cancellation (but our standard refund policy applies to recent charges).

**Do you offer annual billing?**
Yes, for Growth and Scale plans. Annual billing includes a 15% discount. Contact support to switch.

## Webhooks & Integrations

**What events can I subscribe to?**
Payment succeeded, payment failed, subscription created, subscription updated, subscription canceled, invoice generated, refund processed.

**What format are webhook payloads?**
JSON over HTTPS POST. Each payload includes an event type, timestamp, and the relevant object (invoice, subscription, etc.).

**How do I verify webhook signatures?**
Every webhook includes an `X-Northwind-Signature` header. Validate it using your webhook secret (found in Settings → Webhooks) with HMAC-SHA256.

**What's the retry policy?**
We retry failed deliveries (non-2xx response) up to 3 times with exponential backoff: 1 minute, 10 minutes, 1 hour.

## API

**Rate limits:**
- Starter: 100 requests/minute
- Growth: 500 requests/minute
- Scale: 2,000 requests/minute

**Authentication:**
Bearer token via API key. Generate keys in Settings → API Keys. Keys can be scoped to read-only or read-write.

**Base URL:** `https://api.northwind.com/v1`

## Support

- **Starter**: Community support (help center + forums)
- **Growth**: Email support, 24-hour response SLA
- **Scale**: Priority email + live chat, 4-hour response SLA, dedicated account manager
