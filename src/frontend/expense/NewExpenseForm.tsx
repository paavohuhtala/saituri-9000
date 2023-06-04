import React from "react";
import { ViewContainer, ViewTitle } from "../common/layout";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useCreateExpenseMutation, useGetExpenseGroupQuery } from "../redux/saituriApi";
import { ExpenseEditor } from "./ExpenseEditor";
import { Breadcrumbs } from "../common/Breadcrumbs";
import { CreateExpenseRequest } from "../../common/api";
import { SuccessAnimation } from "../common/Success";
import { LoadingIndicator } from "../common/LoadingIndicator";

export function NewExpenseForm() {
  const navigate = useNavigate();
  const { expenseGroupId } = useParams();

  if (!expenseGroupId) {
    return <Navigate to="/" replace />;
  }

  const { data: expenseGroup } = useGetExpenseGroupQuery(expenseGroupId);
  const members = expenseGroup?.members ?? [];
  const [createExpense, createExpenseStatus] = useCreateExpenseMutation();

  if (!expenseGroup) {
    return (
      <ViewContainer>
        <LoadingIndicator />
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
      expenseGroupId: expenseGroupId,
    });

    setTimeout(() => {
      navigate(`/expense-group/${expenseGroupId}`);
    }, 1000);
  };

  return (
    <ViewContainer>
      <Breadcrumbs expenseGroup={expenseGroup} />
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
