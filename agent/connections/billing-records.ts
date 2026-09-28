import { defineOpenAPIConnection } from "eve/connections";
import { once } from "eve/tools/approval";

export default defineOpenAPIConnection({
  spec: "https://billing-api.northwind.vercel.zone/api/openapi.json",
  baseUrl: "https://billing-api.northwind.vercel.zone",
  description:
    "Northwind billing records — payment-processor-side records for cross-referencing charges, refunds, and payment method status.",
  auth: {
    getToken: async () => ({ token: process.env.NORTHWIND_BILLING_API_TOKEN! }),
  },
  approval: once(),
});
