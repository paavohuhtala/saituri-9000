import React from "react";
import { useAddExpenseGroupMemberMutation, useGetExpenseGroupQuery } from "../redux/expenseGroupApi";
import { InlineForm, ViewContainer, ViewSubtitle, ViewTitle } from "../common/layout";
import { ErrorView } from "../common/ErrorView";
import { Members } from "../members/Members";
import { Select } from "../common/inputs";
import { useGetMembersQuery } from "../redux/memberApi";
import { Button, ButtonLink } from "../common/Button";
import { IconChevronRight, IconPlus } from "@tabler/icons-react";
import { Link, Navigate, useParams } from "react-router-dom";
import { Table, TextCell } from "../common/Table";
import { styled } from "styled-components";
import { centsToEurPrice } from "../../common/money";
import { BreadcrumbArrow, BreadcrumbLink, Breadcrumbs, StaticBreadcrumb } from "../common/Breadcrumbs";

const ExpensesTable = styled(Table)`
  grid-template-columns:
    minmax(max-content, 2fr)
    minmax(max-content, 2fr)
    minmax(max-content, 2fr)
    max-content;

  td {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
`;

export function ExpenseGroup() {
  const { id } = useParams();

  if (!id) {
    return <Navigate to="/" replace />;
  }

  const { isLoading, data, error, refetch } = useGetExpenseGroupQuery(id);
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

    addMember({ expenseGroupId: id, memberId: selectedMember }).then(() => {
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
      <Breadcrumbs>
        <BreadcrumbLink to="/">Kuluryhmät</BreadcrumbLink>
        <BreadcrumbArrow />
        <StaticBreadcrumb>{data.name}</StaticBreadcrumb>
      </Breadcrumbs>
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
      <ButtonLink to={`/expense-group/${id}/expenses/new`}>
        <IconPlus /> Luo uusi kulu
      </ButtonLink>
      <ExpensesTable>
        <thead>
          <tr>
            <th>Selite</th>
            <th>Maksaja</th>
            <th>Summa</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {data.expenses.map((expense) => (
            <tr key={expense.id}>
              <TextCell>{expense.name}</TextCell>
              <TextCell>{expense.paidBy.name}</TextCell>
              <TextCell>{centsToEurPrice(expense.amount)}</TextCell>
              <TextCell>
                <Link to={`/expense-group/${id}/expenses/${expense.id}`}>Muokkaa</Link>
              </TextCell>
            </tr>
          ))}
        </tbody>
      </ExpensesTable>
    </ViewContainer>
  );
}
