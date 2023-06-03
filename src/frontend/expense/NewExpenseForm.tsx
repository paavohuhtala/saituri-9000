import React from "react";
import { ViewContainer, ViewTitle } from "../common/layout";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useCreateExpenseMutation, useGetExpenseGroupQuery } from "../redux/saituriApi";
import { ExpenseEditor } from "./ExpenseEditor";
import { BreadcrumbArrow, BreadcrumbLink, Breadcrumbs, StaticBreadcrumb } from "../common/Breadcrumbs";
import { CreateExpenseRequest } from "../../common/api";
import { SuccessAnimation } from "../common/Success";

export function NewExpenseForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  if (!id) {
    return <Navigate to="/" replace />;
  }

  const { data: expenseGroup } = useGetExpenseGroupQuery(id);
  const members = expenseGroup?.members ?? [];
  const [createExpense, createExpenseStatus] = useCreateExpenseMutation();

  if (!expenseGroup) {
    return (
      <ViewContainer>
        <ViewTitle>Ladataan...</ViewTitle>
      </ViewContainer>
    );
  }

  if (createExpenseStatus.isSuccess) {
    return <SuccessAnimation title="Kulu luotu!" />;
  }

  const onSaveExpense = async (expense: CreateExpenseRequest) => {
    if (createExpenseStatus.isLoading) {
      return;
    }

    await createExpense({
      ...expense,
      expenseGroupId: id,
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
        <StaticBreadcrumb>Uusi kulu</StaticBreadcrumb>
      </Breadcrumbs>
      {createExpenseStatus.isLoading && <ViewTitle>Luodaan kulua...</ViewTitle>}
      <ExpenseEditor
        hidden={createExpenseStatus.isLoading}
        expenseGroup={expenseGroup}
        members={members}
        onSaveExpense={onSaveExpense}
      />
    </ViewContainer>
  );
}
