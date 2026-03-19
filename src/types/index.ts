export interface Group {
  id: string;
  name: string;
  pin_hash: string;
  default_currency: string;
  created_at: string;
}

export interface Member {
  id: string;
  group_id: string;
  name: string;
  created_at: string;
}

export interface Expense {
  id: string;
  group_id: string;
  paid_by: string;
  amount: number;
  currency: string;
  description: string;
  receipt_url: string | null;
  created_at: string;
}

export interface ExpenseWithMember extends Expense {
  member: Member;
}

export interface Settlement {
  from: Member;
  to: Member;
  amount: number;
  currency: string;
}

export interface MemberBalance {
  member: Member;
  totalPaid: number;
  fairShare: number;
  balance: number;
}
