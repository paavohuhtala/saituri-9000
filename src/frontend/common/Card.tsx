import { styled } from "styled-components";
import { gray, green } from "../theme";
import React from "react";
import { StyledLink } from "./StyledLink";
import { Link } from "@tanstack/router";
import { skeletonStyle } from "./skeleton";

const Container = styled.button`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  position: relative;

  background-color: ${gray.x800};
  padding: 16px 16px;
  border-radius: 8px;
  border: 1px solid ${gray.x700};
  color: ${gray.x50};

  cursor: pointer;

  &:hover {
    background-color: ${gray.x700};
  }
`;

const CardTitle = styled.span`
  font-size: 24px;
  font-weight: 500;
  line-height: 32px;
  text-align: start;
`;

const CardDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
`;

interface CardProps {
  title: string;
  children?: React.ReactNode;
  as?: React.ElementType;
}

interface ButtonCardProps extends CardProps {
  onClick?: () => void;
}

export function ButtonCard({ title, children, onClick, as }: ButtonCardProps) {
  return (
    <Container onClick={onClick} as={as}>
      <CardTitle>{title}</CardTitle>
      {children && <CardDetails>{children}</CardDetails>}
    </Container>
  );
}

interface LinkCardProps extends CardProps {
  link: React.ReactNode;
}

export function LinkCard({ title, children, as, link }: LinkCardProps) {
  return (
    <Container as={as}>
      {link}
      <CardTitle>{title}</CardTitle>
      {children && <CardDetails>{children}</CardDetails>}
    </Container>
  );
}

export const CardLinkArea = styled(StyledLink)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
` as typeof Link;

export const SkeletonCard = styled(Container)`
  ${skeletonStyle}
  border: 1px solid ${gray.x600};
  cursor: default;
  min-height: 128px;

  &:hover {
    transform: unset;
  }
`;
