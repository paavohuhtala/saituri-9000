import React from "react";
import { styled } from "styled-components";
import { useCreateExpenseGroupMutation, useGetExpenseGroupsQuery } from "../redux/expenseGroupApi";
import { InputField } from "../common/InputField";
import { Button } from "../common/Button";
import { CardLinkArea, LinkCard, SkeletonCard } from "../common/Card";
import { ViewContainer, ViewTitle } from "../common/layout";
import { times } from "lodash";
import { ErrorView } from "../common/ErrorView";

const ExpenseList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 8px;
  width: 100%;
`;

const AddNewContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
	flex-wrap: wrap;
`;

export function ExpenseGroups() {
  const { isError, data, error, refetch } = useGetExpenseGroupsQuery();

  const [newExpenseGroupName, setNewExpenseGroupName] = React.useState("");
  const [createExpenseGroup, newExpenseGroupStatus] = useCreateExpenseGroupMutation();

  const onChangeExpenseGroupName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewExpenseGroupName(event.target.value);
  };

  const onCreateNewExpenseGroup = () => {
    createExpenseGroup({ name: newExpenseGroupName }).then(() => {
      setNewExpenseGroupName("");
    });
  };

  if (!data) {
    return (
      <ViewContainer>
        <ViewTitle>Kuluryhmät</ViewTitle>

        <ExpenseList>
          {times(5, (i) => (
            <SkeletonCard key={i} />
          ))}
        </ExpenseList>
      </ViewContainer>
    );
  }

  if (isError) {
    return <ErrorView error={error} refetch={refetch} />;
  }

  return (
    <ViewContainer>
      <ViewTitle>Kuluryhmät</ViewTitle>

      <ExpenseList>
        {newExpenseGroupStatus.isLoading && <SkeletonCard />}
        {data?.map((expenseGroup) => (
          <LinkCard
            key={expenseGroup.id}
            title={expenseGroup.name}
            as="li"
            link={<CardLinkArea to={"/expense-group/$id"} params={{ id: expenseGroup.id }} />}
          >
            <span>{expenseGroup.members.length} jäsentä</span>
            <span>{expenseGroup.expenseCount} kulua</span>
          </LinkCard>
        ))}
      </ExpenseList>

      <AddNewContainer>
        <InputField placeholder="Nimi" onChange={onChangeExpenseGroupName} value={newExpenseGroupName} />
        <Button
          disabled={newExpenseGroupName.length < 1 || newExpenseGroupStatus.isLoading}
          onClick={onCreateNewExpenseGroup}
        >
          + Luo uusi
        </Button>
      </AddNewContainer>
    </ViewContainer>
  );
}
