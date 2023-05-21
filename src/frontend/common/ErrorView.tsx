import React from "react";
import { Button } from "./Button";
import { ViewContainer, ViewTitle } from "./layout";

interface Props {
  error: unknown;
  refetch: () => void;
}

export function ErrorView({ error, refetch }: Props) {
  return (
    <ViewContainer>
      <ViewTitle>Pieleen meni :(</ViewTitle>
      <code>{JSON.stringify(error, undefined, 2)}</code>
      <Button onClick={() => refetch()}>Yritä uudelleen</Button>
    </ViewContainer>
  );
}
