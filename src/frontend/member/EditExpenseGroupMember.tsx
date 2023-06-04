import React from "react";
import { ViewContainer, ViewTitle } from "../common/layout";
import { useGetAllMembersQuery } from "../redux/saituriApi";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { MemberEditor } from "./MemberEditor";
import { Breadcrumbs, BreadcrumbLink, BreadcrumbArrow, StaticBreadcrumb } from "../common/Breadcrumbs";
import { useGetExpenseGroupQuery } from "../redux/saituriApi";
import { LoadingIndicator } from "../common/LoadingIndicator";

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
    }, 1000);
  };

  return (
    <ViewContainer>
      <Breadcrumbs>
        <BreadcrumbLink to="/">Kuluryhmät</BreadcrumbLink>
        <BreadcrumbArrow />
        <BreadcrumbLink to={`/expense-group/${expenseGroupId}`}>{expenseGroup?.name}</BreadcrumbLink>
        <BreadcrumbArrow />
        <StaticBreadcrumb>Jäsenet</StaticBreadcrumb>
        <BreadcrumbArrow />
        <StaticBreadcrumb>{member.name}</StaticBreadcrumb>
      </Breadcrumbs>
      <MemberEditor initialMember={member} onSaved={onSaved} />
    </ViewContainer>
  );
}
