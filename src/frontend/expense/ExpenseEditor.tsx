import React from "react";
import { Form, FormField, FormLabel, InlineForm } from "../common/layout";
import { InputField, Select } from "../common/inputs";
import { styled } from "styled-components";
import { Member } from "../../common/domain";
import { WeightByMemberId, calculateShares, calculateSuggestedPayerId } from "../../common/share";
import { ParticipantEditor } from "./ParticipantEditor";
import { Button, MultiLineButton, SecondaryButtonLink } from "../common/Button";
import { IconPigMoney, IconThumbUpFilled } from "@tabler/icons-react";
import { centsToFloatEur, floatEurToInputValue } from "../../common/money";
import { CreateExpenseRequest, ExpenseGroupResponse, ExpenseWithDetails } from "../../common/api";
import { green } from "../theme";
import { createNextState } from "@reduxjs/toolkit";

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

const SuggestedPayerLabel = styled.span`
  color: ${green.x500};
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 8px;
`;

interface Props {
  initialExpense?: ExpenseWithDetails;
  expenseGroup: ExpenseGroupResponse;
  members: Member[];
  onSaveExpense: (expense: CreateExpenseRequest) => void;
  hidden?: boolean;
}

export function ExpenseEditor({ initialExpense, expenseGroup, members, onSaveExpense, hidden }: Props) {
  const [name, setName] = React.useState(initialExpense?.name ?? "");
  const [amount, setAmount] = React.useState<number | null>(() => centsToFloatEur(initialExpense?.amount));
  const [pendingAmount, setPendingAmount] = React.useState<string | null>(() => floatEurToInputValue(amount));
  const [payerId, setPayerId] = React.useState<string | null>(initialExpense?.payerId ?? null);

  const [participantWeights, setParticipantWeights] = React.useState<WeightByMemberId>(() => {
    if (initialExpense) {
      return initialExpense.participants.reduce((acc, participant) => {
        acc[participant.memberId] = participant.weight;
        return acc;
      }, {} as WeightByMemberId);
    }

    return members.reduce((acc, member) => {
      acc[member.id] = 1;
      return acc;
    }, {} as WeightByMemberId);
  });

  const suggestedPayer = React.useMemo(() => {
    const participantIds = Object.entries(participantWeights)
      .filter(([_, value]) => (value ?? 0) > 0)
      .map(([key, _]) => key);

    if (participantIds.length === 0) {
      return undefined;
    }

    const id = calculateSuggestedPayerId(expenseGroup.balanceMatrix, participantIds);
    return members.find((member) => member.id === id);
  }, [expenseGroup, participantWeights]);

  const onChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const participantsWithWeights = React.useMemo(() => {
    return Object.entries(participantWeights).flatMap(([memberId, weight]) => {
      if (weight === undefined || weight <= 0) {
        return [];
      }

      return [
        {
          memberId,
          weight,
        },
      ];
    });
  }, [participantWeights]);

  const shareByParticipant = React.useMemo(() => {
    return calculateShares(amount ?? 0, participantsWithWeights);
  }, [amount, participantsWithWeights]);

  const isFormValid = React.useMemo(() => {
    return (
      name.length > 0 &&
      amount !== null &&
      amount > 0 &&
      members.some((member) => member.id === payerId) &&
      Object.values(participantWeights).some((weight) => (weight ?? 0) > 0)
    );
  }, [name, amount, participantWeights, payerId]);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Asserting that these are not null is not strictly necessary because
    // isFormValid already contains the same information, but this is to satisfy TypeScript.
    if (!isFormValid || payerId === null || amount === null) {
      return;
    }

    const amountInCents = Math.round(amount * 100);

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
        <FormLabel>Summa €</FormLabel>
        <InputField
          placeholder="esim. 6,66"
          inputMode="decimal"
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
              const share = shareByParticipant[member.id];
              const weight = participantWeights[member.id] ?? 0;
              const isParticipant = weight > 0;

              return (
                <ParticipantEditor
                  key={member.id}
                  member={member}
                  isParticipant={isParticipant}
                  setIsParticipant={(value) => {
                    setParticipantWeights(
                      createNextState((participants) => {
                        if (value) {
                          participants[member.id] = 1.0;
                        } else {
                          delete participants[member.id];
                        }
                      }),
                    );
                  }}
                  initialWeight={weight}
                  setWeight={(value) => {
                    setParticipantWeights(
                      createNextState((participants) => {
                        participants[member.id] = value;
                      }),
                    );
                  }}
                  share={share}
                />
              );
            })}
          </Participants>
        )}
      </FormField>
      <FormField>
        <FormLabel>Maksaja</FormLabel>
        <InlineForm>
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
          {suggestedPayer ? (
            payerId !== suggestedPayer.id ? (
              <MultiLineButton type="button" onClick={() => setPayerId(suggestedPayer.id)}>
                Käytä suositeltua maksajaa: {suggestedPayer.name}
              </MultiLineButton>
            ) : (
              <SuggestedPayerLabel>
                Suositeltu maksaja
                <IconThumbUpFilled size={16} />
              </SuggestedPayerLabel>
            )
          ) : null}
        </InlineForm>
      </FormField>
      <InlineForm>
        <Button type="submit" disabled={!isFormValid}>
          <IconPigMoney />
          Tallenna kulu
        </Button>
        <SecondaryButtonLink to={`/expense-group/${expenseGroup.id}`}>Peruuta</SecondaryButtonLink>
      </InlineForm>
    </Form>
  );
}
