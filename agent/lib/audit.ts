import { defineState } from "eve/context";
import type { AuditEntry } from "./types.js";

export const auditState = defineState("northwind.audit", () => ({
  escalationCount: 0,
  refundTotal: 0,
  escalatedIssueIds: [] as string[],
  auditEntries: [] as AuditEntry[],
}));
