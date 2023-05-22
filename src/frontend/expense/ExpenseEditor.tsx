import React from "react";
import { Form, FormField, FormLabel, InlineForm } from "../common/layout";
import { InputField, Select } from "../common/inputs";
import { styled } from "styled-components";
import { Member } from "../../common/domain";
import { calculateShares } from "../../common/share";
import { ParticipantEditor } from "./ParticipantEditor";
import { Button, SecondaryButtonLink } from "../common/Button";
import { IconPigMoney } from "@tabler/icons-react";
import { centsToFloatEur, floatEurToInputValue } from "../../common/money";
import { CreateExpenseRequest, ExpenseWithDetails } from "../../common/api";

const Participants = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  width: 100%;
`;

const NameField = styled(InputField)`
  width: 100%;
  max-width: 800px;
`;

interface Props {
  initialExpense?: ExpenseWithDetails;
  expenseGroupId: string;
  members: Member[];
  onSaveExpense: (expense: CreateExpenseRequest) => void;
  hidden?: boolean;
}

export function ExpenseEditor({ initialExpense, expenseGroupId, members, onSaveExpense, hidden }: Props) {
  const [name, setName] = React.useState(initialExpense?.name ?? "");
  const [amount, setAmount] = React.useState<number | null>(() => centsToFloatEur(initialExpense?.amount));
  const [pendingAmount, setPendingAmount] = React.useState<string | null>(() => floatEurToInputValue(amount));
  const [payerId, setPayerId] = React.useState<string | null>(initialExpense?.payerId ?? null);

  const [participants, setParticipants] = React.useState<Record<string, boolean>>(() => {
    if (initialExpense) {
      return initialExpense.participants.reduce((acc, participant) => {
        acc[participant.memberId] = true;
        return acc;
      }, {} as Record<string, boolean>);
    }

    return members.reduce((acc, member) => {
      acc[member.id] = true;
      return acc;
    }, {} as Record<string, boolean>);
  });

  const [participantWeights, setParticipantWeights] = React.useState<Record<string, number>>(() => {
    if (initialExpense) {
      return initialExpense.participants.reduce((acc, participant) => {
        acc[participant.memberId] = participant.weight;
        return acc;
      }, {} as Record<string, number>);
    }

    return members.reduce((acc, member) => {
      acc[member.id] = 1;
      return acc;
    }, {} as Record<string, number>);
  });

  const onChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const participantsWithWeights = React.useMemo(() => {
    return Object.entries(participants).flatMap(([memberId, selected]) => {
      if (!selected) {
        return [];
      }

      return [
        {
          memberId,
          weight: participantWeights[memberId] ?? 0,
        },
      ];
    });
  }, [participants, participantWeights]);

  const shareByParticipant = React.useMemo(() => {
    return calculateShares({
      amount: amount ?? 0,
      participants: participantsWithWeights,
    });
  }, [amount, participantsWithWeights]);

  const isFormValid = React.useMemo(() => {
    return (
      name.length > 0 &&
      amount !== null &&
      amount > 0 &&
      members.some((member) => member.id === payerId) &&
      Object.values(participants).some((selected) => selected)
    );
  }, [name, amount, participants, payerId]);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Asserting that these are not null is not strictly necessary because
    // isFormValid already contains the same information, but this is to satisfy TypeScript.
    if (!isFormValid || payerId === null || amount === null) {
      return;
    }

    const amountInCents = Math.ceil(amount * 100);

    const expense: CreateExpenseRequest = {
      payerId,
      amount: amountInCents,
      name,
      participants: participantsWithWeights,
    };

    onSaveExpense(expense);
  };

  return (
    <Form onSubmit={onSubmit} hidden={hidden}>
      <FormField>
        <FormLabel>Kuvaus</FormLabel>
        <NameField
          placeholder="esim. Olutta ja makkaraa"
          value={name}
          onChange={onChangeName}
          maxLength={80}
          width={120}
        />
      </FormField>
      <FormField>
        <FormLabel>Maksaja</FormLabel>
        <Select
          value={payerId ?? ""}
          onChange={(event) => {
            setPayerId(event.target.value);
          }}
        >
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
      <FormField>
        <FormLabel>Summa €</FormLabel>
        <InputField
          placeholder="esim. 6,66"
          inputMode="numeric"
          onChange={(event) => {
            setPendingAmount(event.target.value);
          }}
          onBlur={() => {
            if (pendingAmount !== null) {
              const isValidFloat = /^\d*([,.]\d*)?$/.test(pendingAmount);
              const amount = parseFloat(pendingAmount.replace(",", "."));

              if (!isValidFloat || isNaN(amount)) {
                setPendingAmount("");
                setAmount(null);
              } else {
                setAmount(amount);
                setPendingAmount(floatEurToInputValue(amount) ?? "");
              }
            }
          }}
          value={pendingAmount ?? amount ?? ""}
        />
      </FormField>
      <FormField>
        <FormLabel>Osallistujat</FormLabel>
        {members.length > 0 && (
          <Participants>
            {members.map((member) => {
              const share: number | undefined = shareByParticipant[member.id];
              const isParticipant = participants[member.id];
              const weight = participantWeights[member.id];

              return (
                <ParticipantEditor
                  key={member.id}
                  member={member}
                  isParticipant={isParticipant}
                  setIsParticipant={(value) => {
                    setParticipants((prev) => {
                      return {
                        ...prev,
                        [member.id]: value,
                      };
                    });
                  }}
                  initialWeight={weight}
                  setWeight={(value) => {
                    setParticipantWeights((prev) => {
                      return {
                        ...prev,
                        [member.id]: value,
                      };
                    });
                  }}
                  share={share}
                />
              );
            })}
          </Participants>
        )}
      </FormField>
      <InlineForm>
        <Button type="submit" disabled={!isFormValid}>
          <IconPigMoney />
          Tallenna kulu
        </Button>
        <SecondaryButtonLink to={`/expense-group/${expenseGroupId}`}>Peruuta</SecondaryButtonLink>
      </InlineForm>
    </Form>
  );
}
