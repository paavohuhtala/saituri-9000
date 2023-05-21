import React from "react";
import { ViewContainer, ViewTitle } from "../common/layout";
import { Navigate, useParams } from "react-router-dom";

export function NewExpense() {
  const { id } = useParams();

  if (!id) {
    return <Navigate to="/" replace />;
  }

  return (
    <ViewContainer>
      <ViewTitle>Uusi kulu</ViewTitle>
    </ViewContainer>
  );
}
