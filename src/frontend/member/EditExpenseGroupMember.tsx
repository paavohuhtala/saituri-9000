import React from "react";
import { ViewContainer, ViewTitle } from "../common/layout";
import { useGetAllMembersQuery } from "../redux/saituriApi";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { MemberEditor } from "./MemberEditor";
import { Breadcrumbs } from "../common/Breadcrumbs";
import { useGetExpenseGroupQuery } from "../redux/saituriApi";
import { LoadingIndicator } from "../common/LoadingIndicator";
import { delayMs } from "../delay";

export function EditExpenseGroupMember() {
  const navigate = useNavigate();
  const { memberId, expenseGroupId } = useParams();

  if (!memberId || !expenseGroupId) {
    return <Navigate to="/" replace />;
  }

  const { currentData: members } = useGetAllMembersQuery();
  const { data: expenseGroup } = useGetExpenseGroupQuery(expenseGroupId);

  if (!members || !expenseGroup) {
    return (
      <ViewContainer>
        <LoadingIndicator />
      </ViewContainer>
    );
  }

  const member = members.find((m) => m.id === memberId);

  if (!member) {
    return (
      <ViewContainer>
        <ViewTitle>Jäsentä ei löytynyt :(</ViewTitle>
      </ViewContainer>
    );
  }

  const onSaved = () => {
    setTimeout(() => {
      navigate(`/expense-group/${expenseGroupId}`);
    }, delayMs(1000));
  };

  return (
    <ViewContainer>
      <Breadcrumbs member={member} expenseGroup={expenseGroup} />
      <MemberEditor initialMember={member} onSaved={onSaved} />
    </ViewContainer>
  );
}
