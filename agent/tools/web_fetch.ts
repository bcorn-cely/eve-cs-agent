import { defineTool } from "eve/tools";
import { webFetch } from "eve/tools/defaults";
import { z } from "zod";

const ALLOWED_DOMAINS = ["billing-api.northwind.vercel.zone"];

export default defineTool({
  description:
    "Fetch a URL. Only Northwind's approved domains (billing-api.northwind.vercel.zone/docs, billing-api.northwind.vercel.zone/status) are allowed. All other URLs are rejected.",
  inputSchema: z.object({
    url: z.string().url().describe("The URL to fetch"),
  }),
  async execute({ url }, ctx) {
    let hostname: string;
    try {
      hostname = new URL(url).hostname;
    } catch {
      return { error: "Invalid URL." };
    }

    if (!ALLOWED_DOMAINS.includes(hostname)) {
      return {
        error: `Access denied. Only Northwind's approved domains are allowed: ${ALLOWED_DOMAINS.join(", ")}. The URL "${url}" is not on the approved list.`,
      };
    }

    return webFetch.execute({ url }, ctx);
  },
});
