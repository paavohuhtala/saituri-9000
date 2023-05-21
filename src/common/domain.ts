import * as t from "io-ts";

export const NewMember = t.type({
  name: t.string,
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

export const NewExpenseParticipant = t.intersection([
  t.type({
    expenseId: t.string,
    memberId: t.string,
  }),
  t.partial({
    weight: t.number,
  }),
]);
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

// Recursively convert updatedAt and createdAt to Date objects
// Hack because Prisma returns Date objects but our API returns ISO strings
export type DbType<T> = {
  [P in keyof T]: P extends "createdAt" | "updatedAt" ? Date : DbType<T[P]>;
};
