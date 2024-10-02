import React from "react";
import { ExpenseGroups } from "./expenseGroups/ExpenseGroups";
import { AllMembers } from "./members/AllMembers";
import { ViewContainer, ViewTitle } from "./common/layout";
import { useParams } from "react-router-dom";

export function GroupHome() {
  const { groupId } = useParams();

  return (
    <ViewContainer>
      <ViewTitle>{group.name}</ViewTitle>
      <ExpenseGroups groupId={group.id} />
      <AllMembers groupId={group.id} />
    </ViewContainer>
  );
}
