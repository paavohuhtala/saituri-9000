import * as t from "io-ts";
import { NonEmptyString, type LoggedInUser } from "./authApi";

export const NewMember = t.partial({
  name: t.union([t.string, t.null]),
  phone: t.union([t.string, t.null]),
  email: t.union([t.string, t.null]),
});
export type NewMember = t.TypeOf<typeof NewMember>;

export const Member = t.intersection([
  NewMember,
  t.type({
    id: t.string,
    createdAt: t.string,
  }),
]);
export type Member = t.TypeOf<typeof Member>;

export const NewExpenseGroup = t.type({
  name: t.string,
});
export type NewExpenseGroup = t.TypeOf<typeof NewExpenseGroup>;

export const ExpenseGroup = t.intersection([
  NewExpenseGroup,
  t.type({
    id: t.string,
    createdAt: t.string,
    updatedAt: t.string,
  }),
]);
export type ExpenseGroup = t.TypeOf<typeof ExpenseGroup>;

export const NewExpenseGroupMember = t.type({
  memberId: t.string,
});
export type NewExpenseGroupMember = t.TypeOf<typeof NewExpenseGroupMember>;

export const NewExpense = t.type({
  name: t.string,
  // In cents
  amount: t.Integer,
  expenseGroupId: t.string,
  payerId: t.string,
});
export type NewExpense = t.TypeOf<typeof NewExpense>;

export const Expense = t.intersection([
  NewExpense,
  t.type({
    id: t.string,
    createdAt: t.string,
    updatedAt: t.string,
  }),
]);
export type Expense = t.TypeOf<typeof Expense>;

export const NewExpenseParticipant = t.type({
  expenseId: t.string,
  memberId: t.string,
  weight: t.number,
});
export type NewExpenseParticipant = t.TypeOf<typeof NewExpenseParticipant>;

export const ExpenseParticipant = t.intersection([
  NewExpenseParticipant,
  t.type({
    createdAt: t.string,
    updatedAt: t.string,
  }),
]);
export type ExpenseParticipant = t.TypeOf<typeof ExpenseParticipant>;

export const NewPayment = t.type({
  amount: t.Integer,
  payerId: t.string,
  payeeId: t.string,
  expenseGroupId: t.string,
});
export type NewPayment = t.TypeOf<typeof NewPayment>;

export const Payment = t.intersection([
  NewPayment,
  t.type({
    id: t.string,
    createdAt: t.string,
    updatedAt: t.string,
  }),
]);
export type Payment = t.TypeOf<typeof Payment>;

type DateTimeField = "createdAt" | "updatedAt" | "expiresAt";

// Recursively convert updatedAt and createdAt to Date objects
// Hack because Prisma returns Date objects but our API returns ISO strings
export type DbType<T> = {
  [P in keyof T]: P extends DateTimeField ? Date : DbType<T[P]>;
};

export interface Group {
  id: string;
  name: string;
}

export interface GroupWithUsers extends Group {
  users: LoggedInUser[];
}

export interface GroupWithDetails extends Group {
  members: Member[];
  expenseGroups: ExpenseGroup[];
}

export const NewGroup = t.type({
  name: NonEmptyString,
});
export type NewGroup = t.TypeOf<typeof NewGroup>;

export interface GroupInvite {
  id: string;
  groupId: string;
  expiresAt: string;
}

export interface GroupInviteWithDetails extends GroupInvite {
  groupName: string;
  inviterName: string;
}
