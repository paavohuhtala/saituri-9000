import React from "react";
import { ViewContainer, ViewTitle } from "../common/layout";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useGetExpenseGroupQuery, useUpdateExpenseMutation } from "../redux/saituriApi";
import { ExpenseEditor } from "./ExpenseEditor";
import { ButtonLink } from "../common/Button";
import { Breadcrumbs } from "../common/Breadcrumbs";
import { CreateExpenseRequest } from "../../common/api";
import { SuccessAnimation } from "../common/Success";
import { LoadingIndicator } from "../common/LoadingIndicator";
import { delayMs } from "../delay";

export function EditExpenseForm() {
  const navigate = useNavigate();
  const { expenseGroupId, expenseId } = useParams();

  if (!expenseGroupId || !expenseId) {
    return <Navigate to="/" replace />;
  }

  // Use currentData to ensure we get the latest data from the server
  const { currentData: expenseGroup } = useGetExpenseGroupQuery(expenseGroupId, { refetchOnMountOrArgChange: true });
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
        <ButtonLink to={`/expense-group/${expenseGroupId}`}>Palaa kuluryhmään</ButtonLink>
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
      expenseGroupId: expenseGroupId,
      expenseId: expenseId,
    });

    setTimeout(() => {
      navigate(`/expense-group/${expenseGroupId}`);
    }, delayMs(1000));
  };

  return (
    <ViewContainer>
      <Breadcrumbs expenseGroup={expenseGroup} expense={expense} />
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
