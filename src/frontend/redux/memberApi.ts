import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { MembersResponse } from "../../common/api";

export const membersApi = createApi({
  reducerPath: "membersApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Member"],
  endpoints: (builder) => ({
    getMembers: builder.query<MembersResponse, void>({
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
  }),
});

export const { useGetMembersQuery, useAddMemberMutation } = membersApi;
