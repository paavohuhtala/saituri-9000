import React from "react";
import styled from "styled-components";
import { Form, FormField, FormLabel, ViewContainer, ViewTitle } from "../common/layout";
import { InputField } from "../common/inputs";
import { Button } from "../common/Button";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../redux/saituriApi";
import { NonEmptyString, ValidEmail } from "../../common/authApi";
import { decodeOrThrow } from "../../common/io-ts-util";
import { LoadingIndicator } from "../common/LoadingIndicator";
import { red } from "../theme";
import { useLoginStatus } from "../redux/hooks";
import { PasswordField } from "./authCommon";

const CtaContainer = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ErrorMessage = styled.p`
  color: ${red.x600};
  font-weight: bold;
  text-align: center;
`;

export function LoginPage() {
  const navigate = useNavigate();
  const loginStatus = useLoginStatus();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [login, loginMutationStatus] = useLoginMutation();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validatedEmail = decodeOrThrow(ValidEmail, email);
    const validatedPassword = decodeOrThrow(NonEmptyString, password);

    const result = await login({ email: validatedEmail, password: validatedPassword });
    if (!result.error) {
      navigate("/");
    }
  };

  React.useEffect(() => {
    if (loginStatus === "loggedIn") {
      navigate("/");
    }
  }, [loginStatus, navigate]);

  return (
    <ViewContainer>
      <ViewTitle>Kirjaudu</ViewTitle>
      {loginMutationStatus.isLoading && <LoadingIndicator />}
      <Form onSubmit={handleSubmit} hidden={loginMutationStatus.isLoading}>
        <FormField>
          <FormLabel>Email</FormLabel>
          <InputField required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        </FormField>
        <PasswordField value={password} onChange={setPassword} kind="current-password" />
        <Button type="submit">Kirjaudu</Button>
        {loginMutationStatus.error && <ErrorMessage>Kirjautuminen epäonnistui :(</ErrorMessage>}
      </Form>
      <CtaContainer hidden={loginMutationStatus.isLoading}>
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
