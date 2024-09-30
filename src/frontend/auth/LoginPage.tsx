import React from "react";
import styled from "styled-components";
import { Form, FormField, FormLabel, ViewContainer, ViewTitle } from "../common/layout";
import { InputField } from "../common/inputs";
import { Button } from "../common/Button";
import { Link } from "react-router-dom";
import { useLoginMutation } from "../redux/saituriApi";
import { NonEmptyString, ValidEmail } from "../../common/authApi";
import { decodeOrThrow } from "../../common/io-ts-util";
import { LoadingIndicator } from "../common/LoadingIndicator";

const CtaContainer = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export function LoginPage() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [login, loginStatus] = useLoginMutation();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validatedEmail = decodeOrThrow(ValidEmail, email);
    const validatedPassword = decodeOrThrow(NonEmptyString, password);

    login({ email: validatedEmail, password: validatedPassword });
  };

  return (
    <ViewContainer>
      <ViewTitle>Kirjaudu</ViewTitle>
      {loginStatus.isLoading && <LoadingIndicator />}
      <Form onSubmit={handleSubmit} hidden={loginStatus.isLoading}>
        <FormField>
          <FormLabel>Email</FormLabel>
          <InputField required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        </FormField>
        <FormField>
          <FormLabel>Salasana</FormLabel>
          <InputField
            required
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </FormField>
        <Button type="submit">Kirjaudu</Button>
      </Form>
      <CtaContainer hidden={loginStatus.isLoading}>
        <h2>Uupuuko tili?</h2>
        <Link to="/register">Rekisteröidy!</Link>
      </CtaContainer>
    </ViewContainer>
  );
}

export function RegisterForm() {
  return (
    <Form>
      <FormField>
        <FormLabel>Email</FormLabel>
        <InputField />
      </FormField>
      <FormField>
        <FormLabel>Salasana</FormLabel>
        <InputField type="password" />
      </FormField>
    </Form>
  );
}
