---
description: Load when the customer reports a webhook failure, integration error, or API problem.
---

# Integration & Webhook Troubleshooting Playbook

## Step 1 — Reproduce and gather details

Ask the customer for:
- The specific error message or HTTP status code they're seeing.
- When it started (approximate time/date).
- Which endpoint or webhook URL is affected.
- Whether it was working before and what changed.

## Step 2 — Check the status page

Before diagnosing, check whether there's a known incident:
- Northwind status page: `https://billing-api.northwind.vercel.zone/status`
- If there's an active incident, inform the customer and offer to follow up when it's resolved.

## Step 3 — Match against known error codes

| Code | Meaning | Common cause | Action |
|------|---------|--------------|--------|
| 401 | Unauthorized | API key expired or missing | Ask customer to regenerate their API key in Settings → API Keys |
| 403 | Forbidden | IP allowlist or permission scope issue | Verify their API key has the required scopes |
| 404 | Not found | Wrong endpoint URL or deleted resource | Confirm the endpoint path and resource ID |
| 429 | Rate limited | Too many requests | Advise implementing exponential backoff; check their plan's rate limits |
| 500 | Internal server error | Server-side issue | Check status page; if no incident, escalate as P2 |
| 502 | Bad gateway | Upstream timeout | Usually transient — ask customer to retry; escalate if persistent |
| 503 | Service unavailable | Maintenance or overload | Check status page; advise waiting 5-10 minutes and retrying |

## Step 4 — Webhook debugging checklist

If the issue involves webhook delivery:

1. **Is the webhook URL reachable?** Ask if they can `curl` the endpoint from their server.
2. **Is the endpoint returning 2xx?** Northwind retries on non-2xx responses up to 3 times with exponential backoff.
3. **Is there an SSL certificate issue?** Expired or self-signed certs cause delivery failures.
4. **Is the payload format expected?** Check if they recently changed their webhook handler.
5. **Is the webhook secret correct?** Signature validation fails if the secret was rotated but not updated on their side.
6. **Check delivery logs.** Advise the customer to review webhook delivery history in Settings → Webhooks → Delivery Log.

## Step 5 — Decide: resolve or escalate

- If you can identify the cause and guide the customer to a fix → resolve.
- If the error is on Northwind's side (5xx with no status page incident) → escalate as P2.
- If the customer has followed all steps and the issue persists → escalate with full diagnostic context.
- If it's a P1 (customer actively losing money due to the failure) → escalate immediately.

## Escalation context for integration issues

When escalating, include:
- Error code and message
- Affected endpoint/webhook URL
- Timeline (when it started, frequency)
- Steps already taken
- Customer impact
