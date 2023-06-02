import React from "react";
import { useAddExpenseGroupMemberMutation, useGetExpenseGroupQuery } from "../redux/expenseGroupApi";
import { InlineForm, ViewContainer, HorizontalContainer, ViewSubtitle, ViewTitle } from "../common/layout";
import { ErrorView } from "../common/ErrorView";
import { Members } from "../members/Members";
import { Select } from "../common/inputs";
import { useGetMembersQuery } from "../redux/memberApi";
import { Button, ButtonLink } from "../common/Button";
import { IconPlus, IconTrademark } from "@tabler/icons-react";
import { Link, Navigate, useParams } from "react-router-dom";
import { BreadcrumbArrow, BreadcrumbLink, Breadcrumbs, StaticBreadcrumb } from "../common/Breadcrumbs";
import { Checkbox } from "../common/Checkbox";
import { BalanceMatrix } from "./BalanceMatrix";
import { Expenses } from "./Expenses";

export function ExpenseGroup() {
  const { id } = useParams();

  if (!id) {
    return <Navigate to="/" replace />;
  }

  const { isLoading, data, error, refetch } = useGetExpenseGroupQuery(id);
  const { isLoading: isLoadingAllMembers, data: allMembers } = useGetMembersQuery();
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

  const { name, members, expenses, balanceMatrix } = data;

  return (
    <ViewContainer>
      <Breadcrumbs>
        <BreadcrumbLink to="/">Kuluryhmät</BreadcrumbLink>
        <BreadcrumbArrow />
        <StaticBreadcrumb>{name}</StaticBreadcrumb>
      </Breadcrumbs>
      <ViewSubtitle>Jäsenet</ViewSubtitle>
      <Members members={members} balanceMatrix={balanceMatrix} />

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
      <Expenses expenseGroupId={id} expenses={expenses} />

      <HorizontalContainer>
        <ViewSubtitle>
          VelkaMatriisi
          <IconTrademark />
        </ViewSubtitle>
        <Checkbox label="Näytä negatiiviset balanssit" checked={showNegative} onChange={onChangeShowNegative} />
      </HorizontalContainer>
      <BalanceMatrix expenseGroup={data} showNegative={showNegative} />
    </ViewContainer>
  );
}
