import { defineEval } from "eve/evals";
import { includes } from "eve/evals/expect";

export default defineEval({
  description:
    "AC10: A note left on an account can be read back later in the same conversation.",
  async test(t) {
    await t.send(
      "I'm priya@cloudnine.dev. Please add a note to my account saying: Customer requested annual billing quote.",
    );
    t.calledTool("add_account_note");

    await t.send("What notes are on my account?");
    t.completed();
    t.check(t.reply, includes("annual billing"));
  },
});
