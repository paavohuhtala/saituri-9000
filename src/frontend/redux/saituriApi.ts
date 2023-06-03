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
  MembersResponse,
} from "../../common/api";
import { NewMember } from "../../common/domain";

export const saituriApi = createApi({
  reducerPath: "saituriApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["ExpenseGroup", "Member"],
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
    getAllMembers: builder.query<MembersResponse, void>({
      providesTags: ["Member"],
      query: () => "/members",
    }),
    addMember: builder.mutation<string, string>({
      invalidatesTags: ["Member"],
      query: (name) => ({
        url: "/members",
        method: "POST",
        body: { name },
      }),
    }),
    updateMember: builder.mutation<string, NewMember & { id: string }>({
      invalidatesTags: ["Member", "ExpenseGroup"],
      query: ({ id, ...body }) => ({
        url: `/members/${id}`,
        method: "PUT",
        body,
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
  useGetAllMembersQuery,
  useAddMemberMutation,
  useUpdateMemberMutation,
} = saituriApi;
