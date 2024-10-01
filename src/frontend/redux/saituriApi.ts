import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import type {
  AddExpenseGroupMemberRequest,
  AddExpenseGroupRequest,
  AddExpenseGroupResponse,
  CreateExpenseRequest,
  CreateExpenseResponse,
  CreatePaymentRequest,
  CreatePaymentResponse,
  ExpenseGroupResponse,
  ExpenseGroupsResponse,
  MembersResponse,
} from "../../common/api";
import type { NewMember } from "../../common/domain";
import type { LoginRequest, RegisterRequest, User } from "../../common/authApi";

export const saituriApi = createApi({
  reducerPath: "saituriApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["ExpenseGroup", "Member", "Login"],
  endpoints: (builder) => ({
    getExpenseGroups: builder.query<ExpenseGroupsResponse, { groupId: string }>({
      providesTags: ["ExpenseGroup"],
      query: ({ groupId }) => `/group/${groupId}/expense-groups`,
    }),
    getExpenseGroup: builder.query<ExpenseGroupResponse, { groupId: string; expenseGroupId: string }>({
      providesTags: ["ExpenseGroup"],
      query: ({ groupId, expenseGroupId }) => `/group/${groupId}/expense-groups/${expenseGroupId}`,
    }),
    createExpenseGroup: builder.mutation<AddExpenseGroupResponse, { groupId: string } & AddExpenseGroupRequest>({
      invalidatesTags: ["ExpenseGroup"],
      query: ({ groupId, ...newExpenseGroup }) => ({
        url: `/group/${groupId}/expense-groups`,
        method: "POST",
        body: newExpenseGroup,
      }),
    }),
    addExpenseGroupMember: builder.mutation<
      void,
      AddExpenseGroupMemberRequest & { groupId: string; expenseGroupId: string }
    >({
      invalidatesTags: ["ExpenseGroup"],
      query: ({ groupId, memberId, expenseGroupId }) => ({
        url: `/group/${groupId}/expense-groups/${expenseGroupId}/members`,
        method: "POST",
        body: { memberId },
      }),
    }),
    createExpense: builder.mutation<
      CreateExpenseResponse,
      CreateExpenseRequest & { groupId: string; expenseGroupId: string }
    >({
      invalidatesTags: ["ExpenseGroup"],
      query: ({ groupId, expenseGroupId, ...newExpense }) => ({
        url: `/group/${groupId}/expense-groups/${expenseGroupId}/expenses`,
        method: "POST",
        body: newExpense,
      }),
    }),
    updateExpense: builder.mutation<
      void,
      CreateExpenseRequest & { groupId: string; expenseGroupId: string; expenseId: string }
    >({
      invalidatesTags: ["ExpenseGroup"],
      query: ({ groupId, expenseGroupId, expenseId, ...newExpense }) => ({
        url: `/group/${groupId}/expense-groups/${expenseGroupId}/expenses/${expenseId}`,
        method: "PUT",
        body: newExpense,
      }),
    }),
    getAllMembers: builder.query<MembersResponse, { groupId: string }>({
      providesTags: ["Member"],
      query: ({ groupId }) => `/group/${groupId}/members`,
    }),
    addMember: builder.mutation<string, { groupId: string; name: string }>({
      invalidatesTags: ["Member"],
      query: ({ groupId, name }) => ({
        url: `/group/${groupId}/members`,
        method: "POST",
        body: { name },
      }),
    }),
    updateMember: builder.mutation<string, NewMember & { groupId: string; id: string }>({
      invalidatesTags: ["Member", "ExpenseGroup"],
      query: ({ groupId, id, ...body }) => ({
        url: `/group/${groupId}/members/${id}`,
        method: "PUT",
        body,
      }),
    }),
    createPayment: builder.mutation<
      CreatePaymentResponse,
      CreatePaymentRequest & { groupId: string; expenseGroupId: string }
    >({
      invalidatesTags: ["ExpenseGroup"],
      query: ({ groupId, expenseGroupId, ...newPayment }) => ({
        url: `/group/${groupId}/expense-groups/${expenseGroupId}/payments`,
        method: "POST",
        body: newPayment,
      }),
    }),
    updatePayment: builder.mutation<
      void,
      CreatePaymentRequest & { groupId: string; expenseGroupId: string; paymentId: string }
    >({
      invalidatesTags: ["ExpenseGroup"],
      query: ({ groupId, expenseGroupId, paymentId, ...newPayment }) => ({
        url: `/group/${groupId}/expense-groups/${expenseGroupId}/payments/${paymentId}`,
        method: "PUT",
        body: newPayment,
      }),
    }),
    deletePayment: builder.mutation<void, { groupId: string; expenseGroupId: string; paymentId: string }>({
      invalidatesTags: ["ExpenseGroup"],
      query: ({ groupId, expenseGroupId, paymentId }) => ({
        url: `/group/${groupId}/expense-groups/${expenseGroupId}/payments/${paymentId}`,
        method: "DELETE",
      }),
    }),
    login: builder.mutation<void, LoginRequest>({
      invalidatesTags: ["Login"],
      query: (loginUser) => ({
        url: "/user/login",
        method: "POST",
        body: loginUser,
      }),
    }),
    getCurrentUser: builder.query<User, void>({
      providesTags: ["Login"],
      query: () => "/user/me",
    }),
    register: builder.mutation<void, RegisterRequest>({
      invalidatesTags: ["Login"],
      query: (loginUser) => ({
        url: "/user/register",
        method: "POST",
        body: loginUser,
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
  useCreatePaymentMutation,
  useDeletePaymentMutation,
  useLoginMutation,
  useGetCurrentUserQuery,
  useRegisterMutation,
} = saituriApi;
