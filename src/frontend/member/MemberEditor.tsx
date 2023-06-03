import React from "react";
import { Form, FormField, FormLabel, ViewContainer, ViewTitle } from "../common/layout";
import { Member } from "../../common/domain";
import { InputField } from "../common/inputs";
import { styled } from "styled-components";
import { useUpdateMemberMutation } from "../redux/saituriApi";
import { Button } from "../common/Button";
import { useNavigate } from "react-router-dom";

const FieldInfo = styled.p`
  line-height: 1.5;
`;

const NameField = styled(InputField)`
  width: 45ch;
`;

interface Props {
  initialMember: Member;
  onSaved: () => void;
}

export function MemberEditor({ initialMember, onSaved }: Props) {
  const [name, setName] = React.useState<string>(initialMember.name);
  const [phone, setPhone] = React.useState<string>(initialMember.phone ?? "");
  const [email, setEmail] = React.useState<string>(initialMember.email ?? "");

  const [updateMember, updateMemberStatus] = useUpdateMemberMutation();

  const isFormValid = name.length > 0;

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isFormValid) {
      return;
    }

    await updateMember({
      id: initialMember.id,
      name,
      phone,
      email,
    });

    onSaved();
  };

  if (updateMemberStatus.isLoading) {
    return (
      <ViewContainer>
        <ViewTitle>Tallennetaan...</ViewTitle>
      </ViewContainer>
    );
  }

  if (updateMemberStatus.isSuccess) {
    return (
      <ViewContainer>
        <ViewTitle>Jäsen tallennettu!</ViewTitle>
      </ViewContainer>
    );
  }

  return (
    <Form hidden={updateMemberStatus.isLoading} onSubmit={onSubmit}>
      <FormField>
        <FormLabel>Nimi</FormLabel>
        <NameField
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="esim. Jorma"
          maxLength={48}
        />
      </FormField>

      <FormField>
        <FormLabel>Puhelinnumero</FormLabel>
        <InputField
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="esim. +358 123456789"
        />
        <FieldInfo>Syötä puhelinnumero kansainvälisessä muodossa.</FieldInfo>
      </FormField>

      <FormField>
        <FormLabel>Sähköposti</FormLabel>
        <InputField
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="esim. foo@example.com"
        />
      </FormField>

      <Button type="submit" disabled={!isFormValid}>
        Tallenna
      </Button>
    </Form>
  );
}
