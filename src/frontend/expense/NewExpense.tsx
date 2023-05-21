import React from "react";
import { Form, FormField, FormLabel, ViewContainer, ViewTitle } from "../common/layout";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { InputField, Select } from "../common/inputs";
import { keyframes, styled } from "styled-components";
import { useCreateExpenseMutation, useGetExpenseGroupQuery } from "../redux/expenseGroupApi";
import { Member } from "../../common/domain";
import { calculateShares } from "../../common/share";
import { ParticipantEditor } from "./ParticipantEditor";
import { Button } from "../common/Button";
import { IconPigMoney } from "@tabler/icons-react";
import { gray, pink } from "../theme";

const Participants = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  width: 100%;
`;

// Shake the piggy bank icon sideways and up and down
const expenseCreatedAnimation = keyframes`
  0% {
    transform: rotate(0deg) translate(0px, 5px);
  }

  25% {
    transform: rotate(10deg) translate(0px, -5px);
  }

  50% {
    transform: rotate(0deg) translate(0px, 5px);
  }

  75% {
    transform: rotate(-10deg) translate(0px, -5px);
  }
  
  100% {
    transform: rotate(0deg) translate(0px, 5px);
  }
`;

const ExpenseCreatedAnimationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  padding: 32px;
  background-color: ${pink.x500};
  color: ${pink.x900};
  border-radius: 50%;


  svg {
    animation: ${expenseCreatedAnimation} 1s cubic-bezier(0.165, 0.84, 0.44, 1) infinite;
  }
`;

const CenteredViewContainer = styled(ViewContainer)`
  align-items: center;
  justify-content: center;
`;

function NewExpenseEditor({ expenseGroupId, members }: { expenseGroupId: string; members: Member[] }) {
  const navigate = useNavigate();

  const [name, setName] = React.useState("");
  const [amount, setAmount] = React.useState<number | null>(null);
  const [pendingAmount, setPendingAmount] = React.useState<string | null>(null);
  const [payerId, setPayerId] = React.useState<string | null>(null);

  const [participants, setParticipants] = React.useState<Record<string, boolean>>(() => {
    return members.reduce((acc, member) => {
      acc[member.id] = true;
      return acc;
    }, {} as Record<string, boolean>);
  });

  const [participantWeights, setParticipantWeights] = React.useState<Record<string, number>>(() => {
    return members.reduce((acc, member) => {
      acc[member.id] = 1;
      return acc;
    }, {} as Record<string, number>);
  });

  const onChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const participantsWithWeights = React.useMemo(() => {
    return Object.entries(participants).flatMap(([id, selected]) => {
      if (!selected) {
        return [];
      }

      return [
        {
          id,
          weight: participantWeights[id],
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
      members.some((member) => member.id === payerId) &&
      Object.values(participants).some((selected) => selected)
    );
  }, [name, amount, participants, payerId]);

  const [createExpense, createExpenseStatus] = useCreateExpenseMutation();

  if (createExpenseStatus.isLoading) {
    return (
      <ViewContainer>
        <ViewTitle>Luodaan kulua...</ViewTitle>
      </ViewContainer>
    );
  }

  if (createExpenseStatus.isSuccess) {
    return (
      <CenteredViewContainer>
        <ExpenseCreatedAnimationContainer>
          <IconPigMoney size={64} />
        </ExpenseCreatedAnimationContainer>
        <ViewTitle>Kulu luotu!</ViewTitle>
      </CenteredViewContainer>
    );
  }

  return (
    <ViewContainer>
      <ViewTitle>Uusi kulu</ViewTitle>
      <Form
        onSubmit={(event) => {
          event.preventDefault();

          // Asserting that these are not null is not strictly necessary because
          // isFormValid already contains the same information, but this is to satisfy TypeScript.
          if (!isFormValid || createExpenseStatus.isLoading || payerId === null || amount === null) {
            return;
          }

          const amountInCents = Math.ceil(amount * 100);

          createExpense({
            expenseGroupId,
            payerId,
            amount: amountInCents,
            name,
            participants: participantsWithWeights,
          }).then(() => {
            setTimeout(() => {
              navigate(`/expense-group/${expenseGroupId}`);
            }, 1000);
          });
        }}
      >
        <FormField>
          <FormLabel>Kuvaus</FormLabel>
          <InputField placeholder="esim. Olutta ja makkaraa" value={name} onChange={onChangeName} />
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
                // Truncate to two decimals

                if (!isValidFloat || isNaN(amount)) {
                  setPendingAmount("");
                  setAmount(null);
                } else {
                  setAmount(amount);
                  setPendingAmount(amount?.toFixed(2).replace(".", ",") ?? "");
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
        <Button type="submit" disabled={!isFormValid || createExpenseStatus.isLoading}>
          <IconPigMoney />
          Tallenna kulu
        </Button>
      </Form>
    </ViewContainer>
  );
}

export function NewExpense() {
  const { id } = useParams();

  if (!id) {
    return <Navigate to="/" replace />;
  }

  const { data: expenseGroup } = useGetExpenseGroupQuery(id);
  const members = expenseGroup?.members ?? [];

  if (!expenseGroup) {
    return (
      <ViewContainer>
        <ViewTitle>Ladataan...</ViewTitle>
      </ViewContainer>
    );
  }

  return <NewExpenseEditor expenseGroupId={id} members={members} />;
}
