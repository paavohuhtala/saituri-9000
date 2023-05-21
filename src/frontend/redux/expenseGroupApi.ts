import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { NewExpenseGroup } from "../../common/domain";
import { ExpenseGroupResponse, ExpenseGroupsResponse } from "../../common/api";

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
    createExpenseGroup: builder.mutation<string, NewExpenseGroup>({
      invalidatesTags: ["ExpenseGroup"],
      query: (newExpenseGroup) => ({
        url: "/expense-groups",
        method: "POST",
        body: newExpenseGroup,
      }),
    }),
  }),
});

export const { useGetExpenseGroupsQuery, useGetExpenseGroupQuery, useCreateExpenseGroupMutation } = expenseGroupApi;
