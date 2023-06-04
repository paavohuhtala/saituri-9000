import { keyframes, styled } from "styled-components";
import { blue, gray } from "../theme";
import React from "react";

const bounce = keyframes`
  0% {
    transform: translateY(0) scaleY(0.8);
  }
  30% {
    transform: translateY(-100%) scaleY(1.0);
  }
  100% {
    transform: translateY(0) scaleY(0.8);
  }
`;

const Ball = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: ${gray.x300};
  animation: ${bounce} 800ms cubic-bezier(0.165, 0.84, 0.44, 1) infinite both;

  display: flex;
  align-items: center;
  justify-content: center;

  &:nth-child(2) {
    animation-delay: 100ms;
  }

  &:nth-child(3) {
    animation-delay: 200ms;
  }

  &:nth-child(4) {
    animation-delay: 300ms;
  }

  &:nth-child(5) {
    animation-delay: 400ms;
  }
`;

const Container = styled.div.attrs({ role: "progressbar" })`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 16px;
  margin-bottom: 16px;
`;

export function LoadingIndicator() {
  return (
    <Container>
      <Ball />
      <Ball />
      <Ball />
      <Ball />
      <Ball />
    </Container>
  );
}
