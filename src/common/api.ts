import { Expense, ExpenseGroup, ExpenseParticipant, Member, Payment } from "./domain";

export interface ExpenseGroupWithDetails extends ExpenseGroup {
  members: Member[];
  expenseCount: number;
}

export type ExpenseGroupsResponse = ExpenseGroupWithDetails[];

export interface PaymentWithDetails extends Payment {
  payer: Member;
}

export interface ExpenseWithDetails extends Expense {
  createdBy: Member;
  participants: ExpenseParticipant[];
}

export interface ExpenseGroupResponse extends ExpenseGroup {
  members: Member[];
  expenses: ExpenseWithDetails[];
  payments: PaymentWithDetails[];
}
