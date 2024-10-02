import React from "react";
import styled from "styled-components";
import { Form, FormField, FormLabel, ViewContainer, ViewTitle } from "../common/layout";
import { InputField } from "../common/inputs";
import { Button } from "../common/Button";
import { Link } from "react-router-dom";
import { useRegisterMutation } from "../redux/saituriApi";
import { decodeOrThrow } from "../../common/io-ts-util";
import { NonEmptyString, ValidEmail } from "../../common/authApi";
import { PasswordField } from "./authCommon";

const CtaContainer = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export function RegisterPage() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [register, registerStatus] = useRegisterMutation();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validatedName = decodeOrThrow(NonEmptyString, name);
    const validatedEmail = decodeOrThrow(ValidEmail, email);
    const validatedPassword = decodeOrThrow(NonEmptyString, password);

    register({ name: validatedName, email: validatedEmail, password: validatedPassword });
  };

  return (
    <ViewContainer>
      <ViewTitle>Rekisteröidy</ViewTitle>
      <Form onSubmit={handleSubmit} hidden={registerStatus.isLoading}>
        <FormField>
          <FormLabel>Nimi</FormLabel>
          <InputField
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            name="name"
            autoComplete="name"
          />
        </FormField>
        <FormField>
          <FormLabel>Email</FormLabel>
          <InputField
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            name="email"
            autoComplete="email"
          />
        </FormField>
        <PasswordField value={password} onChange={setPassword} kind="new-password" />
        <Button type="submit">Rekisteröidy</Button>
      </Form>
      <CtaContainer hidden={registerStatus.isLoading}>
        <h2>Löytyykö tili sittenkin?</h2>
        <Link to="/login">Kirjaudu sisään!</Link>
      </CtaContainer>
    </ViewContainer>
  );
}
