import { defineEval } from "eve/evals";

export default defineEval({
  description:
    "AC8: Fetching an approved Northwind domain is allowed.",
  async test(t) {
    await t.send(
      "Can you check https://billing-api.northwind.vercel.zone/status for any current incidents?",
    );
    t.completed();
    t.calledTool("web_fetch", {
      input: { url: /billing-api\.northwind\.vercel\.zone/ },
    });
  },
});
