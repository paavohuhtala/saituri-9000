import React from "react";
import { Form, FormField, FormLabel, InlineForm } from "../common/layout";
import { centsToFloatEur, floatEurToInputValue } from "../../common/money";
import { Payment } from "../../common/domain";
import { CreatePaymentRequest, ExpenseGroupResponse } from "../../common/api";
import { InputField, Select } from "../common/inputs";
import { Button } from "../common/Button";

interface Props {
  initialPayment?: Payment;
  expenseGroup: ExpenseGroupResponse;
  onSave: (payment: CreatePaymentRequest) => void;
  hidden?: boolean;
}

/**
 * A form for editing a payment in an expense group, from one member to another.
 * A warning is displayed when the value of an existing payment is changed,
 * because this will obviously not change the actual transfers that have been made.
 */
export function PaymentEditor({ initialPayment, expenseGroup, onSave, hidden }: Props) {
  const [amount, setAmount] = React.useState<number | null>(() => centsToFloatEur(initialPayment?.amount));
  const [pendingAmount, setPendingAmount] = React.useState<string | null>(() => floatEurToInputValue(amount));
  const [payerId, setPayerId] = React.useState<string | null>(initialPayment?.payerId ?? null);

  const members = expenseGroup.members ?? [];

  const [payeeId, setPayeeId] = React.useState<string | null>(initialPayment?.payeeId ?? null);

  const [warning, setWarning] = React.useState<string | null>(null);

  const onSaveClick = () => {
    if (!amount || !payeeId || !payerId) {
      return;
    }

    onSave({
      amount,
      payerId,
      payeeId,
    });
  };

  const onAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = event.target.value;
    setPendingAmount(newAmount);

    if (newAmount === "") {
      setAmount(null);
      return;
    }

    const cents = Math.round(parseFloat(newAmount) * 100);
    if (isNaN(cents)) {
      setWarning("Syötä luku");
      return;
    }

    if (cents <= 0) {
      setWarning("Summan tulee olla positiivinen");
      return;
    }

    setAmount(cents);
    setWarning(null);
  };

  const onPayerChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPayerId(event.target.value);
  };

  const onRecipientChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPayeeId(event.target.value);
  };

  const membersWithoutPayer = members.filter((m) => m.id !== payerId);

  return (
    <Form hidden={hidden}>
      <FormField>
        <FormLabel htmlFor="amount">Summa</FormLabel>
        <InlineForm>
          <InputField id="amount" value={pendingAmount ?? ""} onChange={onAmountChange} />
          <Select value={payerId ?? ""} onChange={onPayerChange}>
            <option value="">Kuka maksaa?</option>
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </Select>
        </InlineForm>
      </FormField>
      <FormField>
        <FormLabel htmlFor="recipient">Vastaanottaja</FormLabel>
        <Select id="recipient" value={payeeId ?? ""} onChange={onRecipientChange}>
          <option value="">Kenelle?</option>
          {membersWithoutPayer.map((member) => (
            <option key={member.id} value={member.id}>
              {member.name}
            </option>
          ))}
        </Select>
      </FormField>
      {warning && <FormField>{warning}</FormField>}
      <FormField>
        <Button onClick={onSaveClick} disabled={!!warning} />
      </FormField>
    </Form>
  );
}
