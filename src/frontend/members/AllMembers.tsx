import React from "react";
import { ViewContainer, ViewTitle } from "../common/layout";
import { Members, MembersSkeleton } from "./Members";
import { useAddMemberMutation, useGetMembersQuery } from "../redux/memberApi";
import { NewMember } from "./NewMember";

export function AllMembers() {
  const { data } = useGetMembersQuery();

  const [addMember, _] = useAddMemberMutation();

  return (
    <ViewContainer>
      <ViewTitle>Kaikki jäsenet</ViewTitle>
      {data ? (
        <>
          <Members members={data} />
          <NewMember onAddMember={async (name) => await addMember(name)} />
        </>
      ) : (
        <MembersSkeleton />
      )}
    </ViewContainer>
  );
}
