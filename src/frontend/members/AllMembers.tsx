import React from "react";
import { SectionTitle, ViewContainer } from "../common/layout";
import { Members, MembersSkeleton } from "./Members";
import { useAddMemberMutation, useGetAllMembersQuery } from "../redux/saituriApi";
import { NewMember } from "./NewMember";

interface Props {
  groupId: string;
}

export function AllMembers({ groupId }: Props) {
  const { data } = useGetAllMembersQuery({ groupId });

  const [addMember, _] = useAddMemberMutation();

  return (
    <ViewContainer>
      <SectionTitle>Kaikki jäsenet</SectionTitle>
      {data ? (
        <>
          <Members members={data} />
          <NewMember onAddMember={async (name) => await addMember({ groupId, name })} />
        </>
      ) : (
        <MembersSkeleton />
      )}
    </ViewContainer>
  );
}
