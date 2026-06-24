import { defineEvalConfig } from "eve/evals";

export default defineEvalConfig({
  judge: { model: "openai/gpt-4o-mini" },
  maxConcurrency: 4,
  timeoutMs: 60000,
});
