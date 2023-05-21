import React from "react";
import { useAddExpenseGroupMemberMutation, useGetExpenseGroupQuery } from "../redux/expenseGroupApi";
import { InlineForm, ViewContainer, ViewSubtitle, ViewTitle } from "../common/layout";
import { ErrorView } from "../common/ErrorView";
import { Members } from "../members/Members";
import { Select } from "../common/inputs";
import { useGetMembersQuery } from "../redux/memberApi";
import { Button } from "../common/Button";
import { IconPlus } from "@tabler/icons-react";
import { Link } from "@tanstack/router";

interface Props {
  groupId: string;
}

export function ExpenseGroup({ groupId }: Props) {
  const { isLoading, data, error, refetch } = useGetExpenseGroupQuery(groupId);
  const { isLoading: isLoadingAllMembers, data: allMembers } = useGetMembersQuery();
  const [addMember, newMemberStatus] = useAddExpenseGroupMemberMutation();

  const [selectedMember, setSelectedMember] = React.useState("");

  const availableMembers = React.useMemo(() => {
    if (!allMembers) {
      return [];
    }

    return allMembers.filter((member) => !data?.members.find((m) => m.id === member.id));
  }, [allMembers, data]);

  const onChangeSelectedMember = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMember(event.target.value);
  };

  const onAddMember = () => {
    if (!selectedMember) {
      return;
    }

    addMember({ expenseGroupId: groupId, memberId: selectedMember }).then(() => {
      setSelectedMember("");
    });
  };

  if (isLoading || isLoadingAllMembers) {
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
      <Members members={data.members} />

      {availableMembers.length === 0 ? (
        <p>
          Voit lisätä uusia jäseniä järjestelmään <Link to="/">etusivulta</Link>.
        </p>
      ) : (
        <InlineForm>
          <Select value={selectedMember} onChange={onChangeSelectedMember}>
            <option value="" disabled>
              Valitse jäsen
            </option>
            {availableMembers.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </Select>
          <Button disabled={selectedMember === "" || newMemberStatus.isLoading} onClick={onAddMember}>
            <IconPlus />
            Lisää jäsen ryhmään
          </Button>
        </InlineForm>
      )}
      <ViewSubtitle>Kulut</ViewSubtitle>
    </ViewContainer>
  );
}
