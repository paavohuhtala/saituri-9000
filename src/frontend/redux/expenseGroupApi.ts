import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import {
  AddExpenseGroupMemberRequest,
  AddExpenseGroupRequest,
  AddExpenseGroupResponse,
  CreateExpenseRequest,
  CreateExpenseResponse,
  ExpenseGroupResponse,
  ExpenseGroupsResponse,
} from "../../common/api";

export const expenseGroupApi = createApi({
  reducerPath: "expenseGroupApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["ExpenseGroup"],
  endpoints: (builder) => ({
    getExpenseGroups: builder.query<ExpenseGroupsResponse, void>({
      providesTags: ["ExpenseGroup"],
      query: () => "/expense-groups",
    }),
    getExpenseGroup: builder.query<ExpenseGroupResponse, string>({
      providesTags: ["ExpenseGroup"],
      query: (id) => `/expense-groups/${id}`,
    }),
    createExpenseGroup: builder.mutation<AddExpenseGroupResponse, AddExpenseGroupRequest>({
      invalidatesTags: ["ExpenseGroup"],
      query: (newExpenseGroup) => ({
        url: "/expense-groups",
        method: "POST",
        body: newExpenseGroup,
      }),
    }),
    addExpenseGroupMember: builder.mutation<void, AddExpenseGroupMemberRequest & { expenseGroupId: string }>({
      invalidatesTags: ["ExpenseGroup"],
      query: ({ memberId, expenseGroupId }) => ({
        url: `/expense-groups/${expenseGroupId}/members`,
        method: "POST",
        body: { memberId },
      }),
    }),
    createExpense: builder.mutation<CreateExpenseResponse, CreateExpenseRequest & { expenseGroupId: string }>({
      invalidatesTags: ["ExpenseGroup"],
      query: ({ expenseGroupId, ...newExpense }) => ({
        url: `/expense-groups/${expenseGroupId}/expenses`,
        method: "POST",
        body: newExpense,
      }),
    }),
    updateExpense: builder.mutation<void, CreateExpenseRequest & { expenseGroupId: string; expenseId: string }>({
      invalidatesTags: ["ExpenseGroup"],
      query: ({ expenseGroupId, expenseId, ...newExpense }) => ({
        url: `/expense-groups/${expenseGroupId}/expenses/${expenseId}`,
        method: "PUT",
        body: newExpense,
      }),
    }),
  }),
});

export const {
  useGetExpenseGroupsQuery,
  useGetExpenseGroupQuery,
  useCreateExpenseGroupMutation,
  useAddExpenseGroupMemberMutation,
  useCreateExpenseMutation,
  useUpdateExpenseMutation,
} = expenseGroupApi;
