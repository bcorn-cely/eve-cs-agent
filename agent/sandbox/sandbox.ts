import { defineSandbox } from "eve/sandbox";
import { vercel } from "eve/sandbox/vercel";
import { microsandbox } from 'eve/sandbox/microsandbox';

export default defineSandbox({
  backend: process.env.VERCEL ? vercel() : microsandbox(),
  async onSession({ use }) {
    await use({
      networkPolicy: {
        allow: ["billing-api.northwind.vercel.zone"],
      },
    });
  },
});
