import React from "react";
import { styled } from "styled-components";
import { useCreateExpenseGroupMutation, useGetExpenseGroupsQuery } from "../redux/saituriApi";
import { InputField } from "../common/inputs";
import { Button } from "../common/Button";
import { CardLinkArea, LinkCard, SkeletonCard } from "../common/Card";
import { InlineForm, SectionTitle, ViewContainer, ViewTitle } from "../common/layout";
import { times } from "lodash";
import { ErrorView } from "../common/ErrorView";
import { IconPlus } from "@tabler/icons-react";

const ExpenseList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 8px;
  width: 100%;
`;

interface Props {
  groupId: string;
}

export function ExpenseGroups({ groupId }: Props) {
  const { isError, data, error, refetch } = useGetExpenseGroupsQuery({ groupId });

  const [newExpenseGroupName, setNewExpenseGroupName] = React.useState("");
  const [createExpenseGroup, newExpenseGroupStatus] = useCreateExpenseGroupMutation();

  const onChangeExpenseGroupName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewExpenseGroupName(event.target.value);
  };

  const onCreateNewExpenseGroup = () => {
    createExpenseGroup({ groupId, name: newExpenseGroupName }).then(() => {
      setNewExpenseGroupName("");
    });
  };

  if (!data) {
    return (
      <ViewContainer>
        <SectionTitle>Kuluryhmät</SectionTitle>

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
      <SectionTitle>Kuluryhmät</SectionTitle>

      <ExpenseList>
        {newExpenseGroupStatus.isLoading && <SkeletonCard />}
        {data.map((expenseGroup) => (
          <LinkCard
            key={expenseGroup.id}
            title={expenseGroup.name}
            as="li"
            link={<CardLinkArea to={`/expense-group/${expenseGroup.id}`} />}
          >
            <span>{expenseGroup.members.length} jäsentä</span>
            <span>{expenseGroup.expenseCount} kulua</span>
          </LinkCard>
        ))}
        {data.length < 1 && !newExpenseGroupStatus.isLoading ? <span>Ei kuluryhmiä.</span> : null}
      </ExpenseList>

      <InlineForm>
        <InputField placeholder="Nimi" onChange={onChangeExpenseGroupName} value={newExpenseGroupName} />
        <Button
          disabled={newExpenseGroupName.length < 1 || newExpenseGroupStatus.isLoading}
          onClick={onCreateNewExpenseGroup}
        >
          <IconPlus size={16} />
          Lisää kuluryhmä
        </Button>
      </InlineForm>
    </ViewContainer>
  );
}
