import * as t from "io-ts";
import type {
  Expense,
  ExpenseGroup,
  ExpenseParticipant,
  Group,
  GroupWithDetails,
  Member,
  NewExpenseGroup,
  NewGroup,
  Payment,
} from "./domain";
import type { BalanceMatrix } from "./share";

export interface ExpenseGroupWithDetails extends ExpenseGroup {
  members: Member[];
  expenseCount: number;
}

export type ExpenseGroupsResponse = ExpenseGroupWithDetails[];

export interface PaymentWithDetails extends Payment {
  payer: Member;
  payee: Member;
}

export interface ExpenseWithDetails extends Expense {
  paidBy: Member;
  participants: ExpenseParticipant[];
}

export interface ExpenseGroupWithFullDetails extends ExpenseGroup {
  members: Member[];
  expenses: ExpenseWithDetails[];
  payments: PaymentWithDetails[];
}

export interface ExpenseGroupResponse extends ExpenseGroupWithFullDetails {
  balanceMatrix: BalanceMatrix;
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

export const CreatePaymentRequest = t.type({
  amount: t.Integer,
  payerId: t.string,
  payeeId: t.string,
});
export type CreatePaymentRequest = t.TypeOf<typeof CreatePaymentRequest>;
export type CreatePaymentResponse = { id: string };

export type CreateGroupRequest = NewGroup;
export type CreateGroupResponse = { id: string };

export type GetGroupRequest = { groupId: string };
export type GetGroupResponse = GroupWithDetails;

export type GetGroupsResponse = Group[];

export type CreateGroupInviteRequest = { groupId: string };
export type CreateGroupInviteResponse = { id: string; groupId: string; expiresAt: string };

export type GetGroupInviteRequest = { id: string };
export type GetGroupInviteResponse = {
  id: string;
  groupId: string;
  expiresAt: string;

  groupName: string;
  inviterName: string;
};

export type AcceptGroupInviteError = "invite-not-found" | "invite-expired" | "unknown-error";
export type AcceptGroupInviteRequest = { id: string };
export type AcceptGroupInviteResponse = { groupId: string };
export type AcceptGroupInviteErrorResponse = { error: AcceptGroupInviteError };
