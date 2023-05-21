import React from "react";
import { styled } from "styled-components";
import { useGetExpenseGroupQuery } from "../redux/expenseGroupApi";
import { Button } from "../common/Button";
import { ViewContainer, ViewSubtitle, ViewTitle } from "../common/layout";
import { ErrorView } from "../common/ErrorView";

interface Props {
  groupId: string;
}

export function ExpenseGroup({ groupId }: Props) {
  const { isLoading, data, error, refetch } = useGetExpenseGroupQuery(groupId);

  if (isLoading) {
    return (
      <ViewContainer>
        <ViewTitle>Ladataan...</ViewTitle>
      </ViewContainer>
    );
  }

  if (!data) {
    return <ErrorView error={error} refetch={refetch} />;
  }

  return (
    <ViewContainer>
      <ViewTitle>{data.name}</ViewTitle>
      <ViewSubtitle>Jäsenet</ViewSubtitle>
      <ViewSubtitle>Kulut</ViewSubtitle>
    </ViewContainer>
  );
}
