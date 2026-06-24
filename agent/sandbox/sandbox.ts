import { defineSandbox } from "eve/sandbox";
import { vercel } from "eve/sandbox/vercel";
import { microsandbox } from "eve/sandbox/microsandbox";

const BILLING_API_HOST = "billing-api.northwind.vercel.zone";
const BILLING_API_TOKEN =
  process.env.NORTHWIND_BILLING_API_TOKEN ?? "northwind-dev-token-2025";

export default defineSandbox({
  backend: process.env.NODE_ENV === "production" ? vercel() : microsandbox(),
  async onSession({ use }) {
    await use({
      networkPolicy: {
        allow: {
          [BILLING_API_HOST]: [
            {
              transform: [
                {
                  headers: {
                    authorization: `Bearer ${BILLING_API_TOKEN}`,
                  },
                },
              ],
            },
          ],
        },
      },
    });
  },
});
