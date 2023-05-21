import { Expense, ExpenseGroup, ExpenseParticipant, Member, NewExpenseGroup, Payment } from "./domain";

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

export type MembersResponse = Member[];

export type AddExpenseGroupRequest = NewExpenseGroup;
export type AddExpenseGroupResponse = { id: string };

export type AddExpenseGroupMemberRequest = { memberId: string };
