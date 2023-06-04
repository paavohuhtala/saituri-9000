import React from "react";
import { ViewContainer, ViewTitle } from "../common/layout";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useGetExpenseGroupQuery, useUpdateExpenseMutation } from "../redux/saituriApi";
import { ExpenseEditor } from "./ExpenseEditor";
import { ButtonLink } from "../common/Button";
import { BreadcrumbArrow, BreadcrumbLink, Breadcrumbs, StaticBreadcrumb } from "../common/Breadcrumbs";
import { CreateExpenseRequest } from "../../common/api";
import { SuccessAnimation } from "../common/Success";
import { LoadingIndicator } from "../common/LoadingIndicator";

export function EditExpenseForm() {
  const navigate = useNavigate();
  const { id, expenseId } = useParams();

  if (!id || !expenseId) {
    return <Navigate to="/" replace />;
  }

  // Use currentData to ensure we get the latest data from the server
  const { currentData: expenseGroup } = useGetExpenseGroupQuery(id, { refetchOnMountOrArgChange: true });
  const members = expenseGroup?.members ?? [];
  const [updateExpense, updateExpenseStatus] = useUpdateExpenseMutation();

  if (!expenseGroup) {
    return (
      <ViewContainer>
        <LoadingIndicator />
      </ViewContainer>
    );
  }

  const expense = expenseGroup?.expenses.find((e) => e.id === expenseId);

  if (!expense) {
    return (
      <ViewContainer>
        <ViewTitle>Pyydettyä kulua ei löytynyt :(</ViewTitle>
        <ButtonLink to={`/expense-group/${id}`}>Palaa kuluryhmään</ButtonLink>
      </ViewContainer>
    );
  }

  if (updateExpenseStatus.isSuccess) {
    return <SuccessAnimation title="Kulu päivitetty!" />;
  }

  const onSaveExpense = async (expense: CreateExpenseRequest) => {
    if (updateExpenseStatus.isLoading) {
      return;
    }

    await updateExpense({
      ...expense,
      expenseGroupId: id,
      expenseId: expenseId,
    });

    setTimeout(() => {
      navigate(`/expense-group/${id}`);
    }, 1000);
  };

  return (
    <ViewContainer>
      <Breadcrumbs>
        <BreadcrumbLink to="/">Kuluryhmät</BreadcrumbLink>
        <BreadcrumbArrow />
        <BreadcrumbLink to={`/expense-group/${id}`}>{expenseGroup.name}</BreadcrumbLink>
        <BreadcrumbArrow />
        <StaticBreadcrumb>{expense.name}</StaticBreadcrumb>
      </Breadcrumbs>
      {updateExpenseStatus.isLoading && <LoadingIndicator />}
      <ExpenseEditor
        hidden={updateExpenseStatus.isLoading}
        initialExpense={expense}
        expenseGroup={expenseGroup}
        members={members}
        onSaveExpense={onSaveExpense}
      />
    </ViewContainer>
  );
}
