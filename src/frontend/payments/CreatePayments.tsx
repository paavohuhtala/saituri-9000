import React from "react";
import { Link, Navigate, useLocation, useParams, useSearchParams } from "react-router-dom";
import { useCreatePaymentMutation, useDeletePaymentMutation, useGetExpenseGroupQuery } from "../redux/saituriApi";
import { FormField, HorizontalContainer, ViewContainer, ViewTitle } from "../common/layout";
import { LoadingIndicator } from "../common/LoadingIndicator";
import { FormLabel } from "../common/layout";
import { Select } from "../common/inputs";
import { styled } from "styled-components";
import { Card } from "../common/Card";
import { centsToEurPrice } from "../../common/money";
import { MobilePayQrCode } from "./MobilePayQrCode";
import { IconCheck, IconDeviceMobile } from "@tabler/icons-react";
import { Button, SecondaryButton } from "../common/Button";
import { Member } from "../../common/domain";
import { generateMobilePayAppLink } from "../../common/mobilePay";

const CardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 700px;
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 16px;
  width: 100%;
`;

const AddPhoneNumberPrompt = styled.p`
  text-align: start;
`;

const PaymentOptionsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

interface CreatePaymentCardProps {
  payee: Member;
  amount: number;
  payerId: string;
  expenseGroupId: string;
  onPaymentCreated: ({ id }: { id: string }) => void;
}

function CreatePaymentCard({ payee, amount, payerId, expenseGroupId, onPaymentCreated }: CreatePaymentCardProps) {
  const location = useLocation();
  const { name, phone } = payee;
  const [createPayment, createPaymentStatus] = useCreatePaymentMutation();

  const onCreatePayment = async () => {
    const response = await createPayment({
      expenseGroupId,
      payerId,
      payeeId: payee.id,
      amount,
    });

    if ("data" in response) {
      const paymentId = response.data.id;
      onPaymentCreated({ id: paymentId });
    }
  };

  return (
    <Card title={name} subtitle={centsToEurPrice(amount)}>
      {createPaymentStatus.isLoading ? (
        <LoadingIndicator />
      ) : (
        <CardContent>
          {phone ? (
            <>
              <MobilePayQrCode amount={amount} phone={phone} />
              <PaymentOptionsContainer>
                <span>Lue koodi tai</span>
                <SecondaryButton
                  as={"a"}
                  href={generateMobilePayAppLink({
                    amount,
                    phone,
                  })}
                  target={"_blank"}
                  rel={"noopener noreferrer"}
                >
                  <IconDeviceMobile />
                  Avaa MobilePay
                </SecondaryButton>
              </PaymentOptionsContainer>
            </>
          ) : (
            <AddPhoneNumberPrompt>
              <Link
                to={{
                  pathname: `/member/${payee.id}`,
                  search: `?returnTo=${encodeURIComponent(location.pathname + location.search)}`,
                }}
              >
                Lisää jäsenelle puhelinnumero
              </Link>{" "}
              jotta voit maksaa MobilePaylla.
            </AddPhoneNumberPrompt>
          )}
          <Button onClick={onCreatePayment}>
            <IconCheck />
            Merkitse maksetuksi
          </Button>
        </CardContent>
      )}
    </Card>
  );
}

const CreatedPaymentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
`;

interface CreatedPaymentEntryProps {
  payee: Member;
  paymentId: string;
  amount: number;
  expenseGroupId: string;
  onUndoFinished: () => void;
}

function CreatedPaymentEntry({ payee, amount, paymentId, expenseGroupId, onUndoFinished }: CreatedPaymentEntryProps) {
  const [deletePayment, deletePaymentStatus] = useDeletePaymentMutation();

  const onUndo = async () => {
    await deletePayment({
      expenseGroupId,
      paymentId,
    });

    onUndoFinished();
  };

  if (deletePaymentStatus.isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <CreatedPaymentContainer>
      {centsToEurPrice(amount)} maksettu jäsenelle {payee.name}
      <Button onClick={onUndo}>Peruuta</Button>
    </CreatedPaymentContainer>
  );
}

export function CreatePayments() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const payerId = searchParams.get("payer") ?? "";
  const [createdPayments, setCreatedPayments] = React.useState<
    {
      payeeId: string;
      paymentId: string;
      amount: number;
    }[]
  >([]);

  if (!id) {
    return <Navigate to="/" replace />;
  }

  const { data } = useGetExpenseGroupQuery(id);

  const pendingPayments = React.useMemo(() => {
    if (!data) {
      return [];
    }

    const { members, balanceMatrix } = data;

    if (!balanceMatrix || !payerId) {
      return [];
    }

    const pendingPayments = Object.entries(balanceMatrix[payerId] ?? {}).filter(([_, amount]) => amount < 0);

    return pendingPayments.flatMap(([memberId, amount]) => {
      const member = members.find((m) => m.id === memberId);

      if (!member) {
        return [];
      }

      return [
        {
          member,
          amount: Math.round(-amount),
        },
      ];
    });
  }, [data, payerId]);

  if (!data) {
    return (
      <ViewContainer>
        <LoadingIndicator />
      </ViewContainer>
    );
  }

  const { members } = data;

  const onChangePayer = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchParams({ payer: e.target.value });
  };

  return (
    <ViewContainer>
      <ViewTitle>Maksa velat</ViewTitle>
      <FormField>
        <FormLabel>Maksaja</FormLabel>
        <Select value={payerId} onChange={onChangePayer}>
          <option value="" disabled>
            Valitse maksaja
          </option>
          {members.map((member) => (
            <option key={member.id} value={member.id}>
              {member.name}
            </option>
          ))}
        </Select>
      </FormField>
      {pendingPayments.length === 0 && <p>Ei maksamattomia velkoja!</p>}
      <CardList>
        {pendingPayments.map(({ member, amount }) => (
          <CreatePaymentCard
            key={member.id}
            payee={member}
            amount={amount}
            expenseGroupId={id}
            payerId={payerId}
            onPaymentCreated={({ id }) => {
              setCreatedPayments((prev) => [...prev, { payeeId: member.id, paymentId: id, amount }]);
            }}
          />
        ))}
        {createdPayments.map(({ payeeId, paymentId, amount }) => {
          const payee = members.find((m) => m.id === payeeId);

          if (!payee) {
            return null;
          }

          return (
            <CreatedPaymentEntry
              key={paymentId}
              payee={payee}
              paymentId={paymentId}
              amount={amount}
              expenseGroupId={id}
              onUndoFinished={() => {
                setCreatedPayments((prev) => prev.filter((p) => p.paymentId !== paymentId));
              }}
            />
          );
        })}
      </CardList>
    </ViewContainer>
  );
}
