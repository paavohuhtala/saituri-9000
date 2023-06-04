import { styled } from "styled-components";
import { gray, green } from "../theme";
import React from "react";
import { StyledLink } from "./StyledLink";
import { skeletonStyle } from "./skeleton";
import { Link } from "react-router-dom";

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  position: relative;

  background-color: ${gray.x800};
  padding: 16px;
  border-radius: 8px;
  border: 1px solid ${gray.x700};
  color: ${gray.x50};
`;

const InteractiveCardContainer = styled(CardContainer).attrs({ as: "button" })`
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

export const CardSubtitle = styled.span`
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
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
  subtitle?: string;
  children?: React.ReactNode;
  as?: React.ElementType;
}

interface ButtonCardProps extends CardProps {
  onClick?: () => void;
}

export function ButtonCard({ title, subtitle, children, onClick, as }: ButtonCardProps) {
  return (
    <InteractiveCardContainer onClick={onClick} as={as}>
      <CardTitle>{title}</CardTitle>
      {subtitle && <CardSubtitle>{subtitle}</CardSubtitle>}
      {children && <CardDetails>{children}</CardDetails>}
    </InteractiveCardContainer>
  );
}

interface LinkCardProps extends CardProps {
  link: React.ReactNode;
}

export function LinkCard({ title, subtitle, children, as, link }: LinkCardProps) {
  return (
    <InteractiveCardContainer as={as}>
      {link}
      <CardTitle>{title}</CardTitle>
      {subtitle && <CardSubtitle>{subtitle}</CardSubtitle>}
      {children && <CardDetails>{children}</CardDetails>}
    </InteractiveCardContainer>
  );
}

export function Card({ title, subtitle, children, as }: CardProps) {
  return (
    <CardContainer as={as}>
      <CardTitle>{title}</CardTitle>
      {subtitle && <CardSubtitle>{subtitle}</CardSubtitle>}
      {children && <CardDetails>{children}</CardDetails>}
    </CardContainer>
  );
}

export const CardLinkArea = styled(StyledLink)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
` as typeof Link;

export const SkeletonCard = styled(CardContainer)`
  ${skeletonStyle}
  border: 1px solid ${gray.x600};
  cursor: default;
  min-height: 128px;

  &:hover {
    transform: unset;
  }
`;
