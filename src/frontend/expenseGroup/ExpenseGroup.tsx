import React from "react";
import { useAddExpenseGroupMemberMutation, useGetExpenseGroupQuery } from "../redux/saituriApi";
import { InlineForm, ViewContainer, HorizontalContainer, ViewSubtitle } from "../common/layout";
import { ErrorView } from "../common/ErrorView";
import { Members } from "../members/Members";
import { Select } from "../common/inputs";
import { useGetAllMembersQuery } from "../redux/saituriApi";
import { Button, ButtonLink } from "../common/Button";
import { IconAxe, IconPlus, IconTrademark } from "@tabler/icons-react";
import { Link, Navigate, useParams } from "react-router-dom";
import { Breadcrumbs } from "../common/Breadcrumbs";
import { Checkbox } from "../common/Checkbox";
import { BalanceMatrix } from "./BalanceMatrix";
import { Expenses } from "./Expenses";
import { Payments } from "./Payments";
import { LoadingIndicator } from "../common/LoadingIndicator";

export function ExpenseGroup() {
  const { expenseGroupId } = useParams();

  if (!expenseGroupId) {
    return <Navigate to="/" replace />;
  }

  const { isLoading, data, error, refetch } = useGetExpenseGroupQuery(expenseGroupId);
  const { isLoading: isLoadingAllMembers, data: allMembers } = useGetAllMembersQuery();
  const [addMember, newMemberStatus] = useAddExpenseGroupMemberMutation();

  const [selectedMember, setSelectedMember] = React.useState("");
  const [showNegative, setShowNegative] = React.useState(false);

  const availableMembers = React.useMemo(() => {
    if (!allMembers) {
      return [];
    }

    return allMembers.filter((member) => !data?.members.find((m) => m.id === member.id));
  }, [allMembers, data]);

  const onChangeSelectedMember = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMember(event.target.value);
  };

  const onChangeShowNegative = () => {
    setShowNegative(!showNegative);
  };

  const onAddMember = () => {
    if (!selectedMember) {
      return;
    }

    addMember({ expenseGroupId: expenseGroupId, memberId: selectedMember }).then(() => {
      setSelectedMember("");
    });
  };

  if (isLoading || isLoadingAllMembers) {
    return (
      <ViewContainer>
        <LoadingIndicator />
      </ViewContainer>
    );
  }

  if (!data) {
    return <ErrorView error={error} refetch={refetch} />;
  }

  const { members, expenses, balanceMatrix, payments } = data;

  return (
    <ViewContainer>
      <Breadcrumbs expenseGroup={data} />
      <ViewSubtitle>Jäsenet</ViewSubtitle>
      <Members members={members} balanceMatrix={balanceMatrix} expenseGroupId={expenseGroupId} />

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
            <IconPlus size={16} />
            Lisää jäsen ryhmään
          </Button>
        </InlineForm>
      )}

      <ViewSubtitle>Kulut</ViewSubtitle>
      <ButtonLink to={`/expense-group/${expenseGroupId}/expenses/new`}>
        <IconPlus size={16} /> Luo uusi kulu
      </ButtonLink>
      <Expenses expenseGroupId={expenseGroupId} expenses={expenses} />

      <HorizontalContainer>
        <ViewSubtitle>
          VelkaMatriisi
          <IconTrademark />
        </ViewSubtitle>
        <Checkbox label="Näytä negatiiviset balanssit" checked={showNegative} onChange={onChangeShowNegative} />
      </HorizontalContainer>
      <BalanceMatrix expenseGroup={data} showNegative={showNegative} />

      <ViewSubtitle>Maksut</ViewSubtitle>
      <ButtonLink to={`/expense-group/${expenseGroupId}/payments/new`}>
        <IconAxe size={16} /> Maksa velat
      </ButtonLink>
      <Payments payments={payments} />
    </ViewContainer>
  );
}
