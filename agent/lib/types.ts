export interface Customer {
  id: string;
  name: string;
  email: string;
  company: string;
  plan: "Starter" | "Growth" | "Scale";
  monthlyRate: number;
  customerSince: string;
  notes: AccountNote[];
  subscriptionStatus?: string | null;
}

export interface Subscription {
  id: string;
  customerId: string;
  plan: "Starter" | "Growth" | "Scale";
  status: "active" | "past_due" | "canceled";
  monthlyRate: number;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  recentInvoices?: Invoice[];
}

export interface Invoice {
  id: string;
  customerId: string;
  subscriptionId: string;
  amount: number;
  status: "paid" | "failed" | "refunded" | "pending";
  date: string;
  description: string;
  duplicate: boolean;
}

export interface Ticket {
  id: string;
  customerId: string;
  subject: string;
  status: "open" | "waiting_on_customer" | "escalated" | "resolved";
  priority: "P1" | "P2" | "P3" | "P4";
  category: "billing" | "technical" | "account" | "plan_change" | "other";
  createdAt: string;
}

export interface AccountNote {
  timestamp: string;
  author: string;
  content: string;
}

export interface Escalation {
  id: string;
  customerId: string;
  ticketId?: string | null;
  reason: string;
  classification: string;
  urgency: string;
  attemptedActions: string;
  customerImpact: string;
  status: "pending" | "resolved";
  createdAt: string;
}

export interface AuditEntry {
  timestamp: string;
  action: "refund" | "escalation" | "credit" | "adjustment";
  details: Record<string, unknown>;
}

export interface RefundReceipt {
  refundId: string;
  invoiceId: string;
  amount: number;
  reason: string;
  status: string;
  timestamp: string;
}
