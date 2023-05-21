import React from "react";
import { keyframes, styled } from "styled-components";
import { ViewContainer, ViewTitle } from "./layout";
import { pink } from "../theme";
import { IconPigMoney } from "@tabler/icons-react";

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

interface Props {
  title: string;
}

export function SuccessAnimation({ title }: Props) {
  return (
    <CenteredViewContainer>
      <ExpenseCreatedAnimationContainer>
        <IconPigMoney size={64} />
      </ExpenseCreatedAnimationContainer>
      <ViewTitle>{title}</ViewTitle>
    </CenteredViewContainer>
  );
}
