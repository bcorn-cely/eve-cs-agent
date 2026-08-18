import { defineState } from "eve/context";
import type { AuditEntry } from "./types.js";

export interface AuditState {
  escalationCount: number;
  refundTotal: number;
  escalatedIssueIds: string[];
  auditEntries: AuditEntry[];
}

export const auditState = defineState<AuditState>("northwind.audit", () => ({
  escalationCount: 0,
  refundTotal: 0,
  escalatedIssueIds: [],
  auditEntries: [],
}));
