import React from "react";
import { ViewContainer, ViewTitle } from "../common/layout";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useGetExpenseGroupQuery, useUpdatePaymentMutation } from "../redux/saituriApi";
import { PaymentEditor } from "./PaymentEditor";
import { ButtonLink } from "../common/Button";
import { Breadcrumbs } from "../common/Breadcrumbs";
import { CreatePaymentRequest } from "../../common/api";
import { SuccessAnimation } from "../common/Success";
import { LoadingIndicator } from "../common/LoadingIndicator";
import { delayMs } from "../delay";

export function EditPaymentForm() {
  const navigate = useNavigate();
  const { expenseGroupId, paymentId } = useParams();

  if (!expenseGroupId || !paymentId) {
    return <Navigate to="/" replace />;
  }

  // Use currentData to ensure we get the latest data from the server
  const { currentData: expenseGroup } = useGetExpenseGroupQuery(expenseGroupId, { refetchOnMountOrArgChange: true });
  const [updatePayment, updatePaymentStatus] = useUpdatePaymentMutation();

  if (!expenseGroup) {
    return (
      <ViewContainer>
        <LoadingIndicator />
      </ViewContainer>
    );
  }

  const payment = expenseGroup?.payments.find((e) => e.id === paymentId);

  if (!payment) {
    return (
      <ViewContainer>
        <ViewTitle>Pyydettyä maksua ei löytynyt :(</ViewTitle>
        <ButtonLink to={`/expense-group/${expenseGroupId}`}>Palaa kuluryhmään</ButtonLink>
      </ViewContainer>
    );
  }

  if (updatePaymentStatus.isSuccess) {
    return <SuccessAnimation title="Maksu päivitetty!" />;
  }

  const onSave = async (payment: CreatePaymentRequest) => {
    if (updatePaymentStatus.isLoading) {
      return;
    }

    await updatePayment({
      ...payment,
      expenseGroupId: expenseGroupId,
      paymentId: paymentId,
    });

    setTimeout(() => {
      navigate(`/expense-group/${expenseGroupId}`);
    }, delayMs(1000));
  };

  return (
    <ViewContainer>
      <Breadcrumbs expenseGroup={expenseGroup} payment={payment} />
      <ViewTitle>Muokkaa maksua</ViewTitle>
      <PaymentEditor
        initialPayment={payment}
        expenseGroup={expenseGroup}
        onSave={onSave}
        hidden={updatePaymentStatus.isLoading}
      />
    </ViewContainer>
  );
}
