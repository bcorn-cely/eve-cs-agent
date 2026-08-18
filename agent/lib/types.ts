export interface AccountNote {
  timestamp: string;
  author: string;
  note: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  company: string;
  plan: "Starter" | "Growth" | "Scale";
  monthlyRate: number;
  customerSince: string;
  notes: AccountNote[];
  subscriptionStatus?: string;
}

export interface Invoice {
  id: string;
  customerId: string;
  subscriptionId: string;
  amount: number;
  status: "paid" | "failed" | "refunded" | "pending";
  date: string;
  description: string;
  isDuplicate: boolean;
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

export interface Ticket {
  id: string;
  customerId: string;
  subject: string;
  status: "open" | "waiting_on_customer" | "escalated" | "resolved";
  priority: "P1" | "P2" | "P3" | "P4";
  category: string;
  createdAt: string;
}

export interface Escalation {
  id: string;
  customerId: string;
  ticketId?: string;
  reason: string;
  classification: string;
  urgency: string;
  attemptedActions: string[];
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
