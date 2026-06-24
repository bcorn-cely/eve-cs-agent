import { defineHook } from "eve/hooks";

export default defineHook({
  events: {
    async "message.completed"(event) {
      const message = event.data?.message;
      if (message) {
        console.info(
          `[audit] message.completed — turn=${event.data.turnId}`,
        );
      }
    },
  },
});
