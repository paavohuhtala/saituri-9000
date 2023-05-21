import React from "react";
import { ExpenseGroups } from "./expenseGroups/ExpenseGroups";
import { AllMembers } from "./members/AllMembers";

export function Home() {
  return (
    <>
      <ExpenseGroups />
      <AllMembers />
    </>
  );
}
