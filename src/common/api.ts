import * as t from "io-ts";
import { Expense, ExpenseGroup, ExpenseParticipant, Member, NewExpense, NewExpenseGroup, Payment } from "./domain";

export interface ExpenseGroupWithDetails extends ExpenseGroup {
  members: Member[];
  expenseCount: number;
}

export type ExpenseGroupsResponse = ExpenseGroupWithDetails[];

export interface PaymentWithDetails extends Payment {
  payer: Member;
}

export interface ExpenseWithDetails extends Expense {
  paidBy: Member;
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

// We pass expenseGroupId separately in the URL and
// io-ts doesn't support Omit / Exclude so we need to
// duplicate most of NewExpense here :(
export const CreateExpenseRequest = t.type({
  name: t.string,
  amount: t.Integer,
  payerId: t.string,
  participants: t.array(
    t.type({
      memberId: t.string,
      weight: t.number,
    }),
  ),
});
export type CreateExpenseRequest = t.TypeOf<typeof CreateExpenseRequest>;
export type CreateExpenseResponse = { id: string };
