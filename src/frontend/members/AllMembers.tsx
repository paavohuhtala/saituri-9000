import React from "react";
import { ViewContainer, ViewTitle } from "../common/layout";
import { Members, MembersSkeleton } from "./Members";
import { useAddMemberMutation, useGetAllMembersQuery } from "../redux/saituriApi";
import { NewMember } from "./NewMember";

export function AllMembers() {
  const { data } = useGetAllMembersQuery();

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
