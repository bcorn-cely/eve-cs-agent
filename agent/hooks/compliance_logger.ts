import { defineHook, type HookContext } from "eve/hooks";

interface AnalyticsRecord {
  event: string;
  sessionId: string;
  agent: string;
  timestamp: string;
  messageLength?: number;
}

// Simulated warehouse sync: logs the payload instead of calling a real
// endpoint, so the demo has no external dependency.
async function sendToWarehouse(payload: AnalyticsRecord): Promise<void> {
  console.log("[ANALYTICS]", JSON.stringify(payload));
}

function record(event: string, ctx: HookContext, extra: Partial<AnalyticsRecord> = {}): AnalyticsRecord {
  return {
    event,
    sessionId: ctx.session.id,
    agent: ctx.agent.name,
    timestamp: new Date().toISOString(),
    ...extra,
  };
}

async function track(payload: AnalyticsRecord): Promise<void> {
  try {
    await sendToWarehouse(payload);
  } catch (error) {
    // An analytics failure must never break the turn.
    console.error("[ANALYTICS] send failed", error);
  }
}

export default defineHook({
  events: {
    async "session.started"(_event, ctx) {
      await track(record("session.started", ctx));
    },
    async "message.completed"(event, ctx) {
      await track(record("message.completed", ctx, { messageLength: event.data.message?.length ?? 0 }));
    },
    async "turn.completed"(_event, ctx) {
      await track(record("turn.completed", ctx));
    },
  },
});
