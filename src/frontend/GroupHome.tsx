import React from "react";
import { ExpenseGroups } from "./expenseGroups/ExpenseGroups";
import { AllMembers } from "./members/AllMembers";
import { ViewContainer, ViewTitle } from "./common/layout";
import type { Group } from "../common/domain";

interface Props {
  group: Group;
}

export function GroupHome({ group }: Props) {
  return (
    <ViewContainer>
      <ViewTitle>{group.name}</ViewTitle>
      <ExpenseGroups groupId={group.id} />
      <AllMembers groupId={group.id} />
    </ViewContainer>
  );
}
