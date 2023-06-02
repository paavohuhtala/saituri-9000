import React from "react";
import { css, styled } from "styled-components";
import { Member } from "../../common/domain";
import { gray } from "../theme";
import { IconCheck, IconX } from "@tabler/icons-react";
import { FormConstant, FormField, FormLabel } from "../common/layout";
import { InputField } from "../common/inputs";

const ParticipantCard = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  border-radius: 16px;
  border: 1px solid ${gray.x700};
  color: ${gray.x50};
  width: 100%;
  max-width: 400px;
`;

const CardHeader = styled.div<{ $selected: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 16px;
  width: 100%;
  border-radius: 16px;
  padding: 8px;
  color: ${gray.x50};
  border: none;
  user-select: none;

  ${({ $selected }) =>
    $selected &&
    css`
    border-radius: 16px 16px 0 0;
  `}

  background-color: ${({ $selected }) => ($selected ? gray.x800 : gray.x900)};
  &:hover {
    background-color: ${({ $selected }) => ($selected ? gray.x700 : gray.x800)};
  }

  cursor: pointer;
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  width: 100%;
  padding: 0px 16px 16px 16px;

  input {
    width: 100%;
  }
`;

interface Props {
  member: Member;
  isParticipant: boolean;
  setIsParticipant: (value: boolean) => void;
  initialWeight?: number;
  setWeight: (value: number) => void;
  share?: number;
}

export function ParticipantEditor({ member, isParticipant, setIsParticipant, initialWeight, setWeight, share }: Props) {
  const [pendingWeight, setPendingWeight] = React.useState<string>(initialWeight?.toFixed(1).replace(".", ",") ?? "");

  return (
    <ParticipantCard key={member.id}>
      <CardHeader
        role={"button"}
        tabIndex={0}
        $selected={isParticipant}
        onClick={() => {
          setIsParticipant(!isParticipant);
          if (!isParticipant) {
            setPendingWeight("1,0");
          }
        }}
      >
        {isParticipant ? <IconCheck /> : <IconX />}
        {member.name}
      </CardHeader>
      {isParticipant && (
        <CardContent>
          <FormField>
            <FormLabel>Kerroin</FormLabel>
            <InputField
              value={pendingWeight}
              onChange={(event) => {
                setPendingWeight(event.target.value.trim());
              }}
              onBlur={() => {
                if (pendingWeight !== undefined) {
                  const isValidFloat = /^\d*([,.]\d*)?$/.test(pendingWeight);
                  const weight = parseFloat(pendingWeight.replace(",", "."));

                  // We use both regex and parsing to check, because parseFloat allows trailing garbage
                  if (!isValidFloat || isNaN(weight)) {
                    setPendingWeight("1,0");
                    setWeight(1);
                  } else {
                    setWeight(weight);
                  }
                }
              }}
              placeholder="esim. 1,5"
              inputMode="numeric"
            />
          </FormField>
          {share !== undefined && (
            <FormField>
              <FormLabel>Osuus</FormLabel>
              <FormConstant>{share?.toFixed(2).replace(".", ",")} €</FormConstant>
            </FormField>
          )}
        </CardContent>
      )}
    </ParticipantCard>
  );
}
