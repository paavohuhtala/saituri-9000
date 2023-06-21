import styled from "styled-components";
import { gray } from "../theme";
import { Link, useMatches } from "react-router-dom";
import { IconChevronRight } from "@tabler/icons-react";
import React from "react";

export interface CrumbParams {
  expenseGroup?: { name: string; id: string };
  member?: { name: string; id: string };
  expense?: { name: string; id: string };
}

export interface Crumb {
  label: string;
  to?: string;
}

export type CrumbCreator = (params: CrumbParams) => Crumb[];

export const BreadcrumbsContainer = styled.nav`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  color: ${gray.x50};
  overflow: hidden;
  flex-wrap: wrap;
`;

export const StaticBreadcrumb = styled.span`
  // Break on several lines if needed
  white-space: pre-wrap;
  word-wrap: break-word;
`;

export const BreadcrumbLink = styled(Link)`
  text-decoration: none;
`;

export const BreadcrumbArrow = styled(IconChevronRight).attrs({ size: 16, "aria-hidden": true, role: "presentation" })`
  flex-shrink: 0;
`;

function getCrumbCreator(handle: unknown): CrumbCreator | undefined {
  if (handle && typeof handle === "object" && "crumb" in handle) {
    return handle.crumb as CrumbCreator;
  } else {
    return undefined;
  }
}

export function Breadcrumbs(props: CrumbParams) {
  const matches = useMatches();

  const crumbs: Crumb[] = React.useMemo(
    () =>
      matches.flatMap((match) => {
        const createCrumbs = getCrumbCreator(match.handle);

        if (createCrumbs) {
          return [...createCrumbs(props)];
        } else {
          return [];
        }
      }),
    [matches, props],
  );

  return (
    <BreadcrumbsContainer data-testid="breadcrumbs">
      {crumbs.map((crumb, index) => (
        <React.Fragment key={crumb.label + (crumb.to ?? "")}>
          {crumb.to && index !== crumbs.length - 1 ? (
            <BreadcrumbLink to={crumb.to} data-testid="breadcrumb">
              {crumb.label}
            </BreadcrumbLink>
          ) : (
            <StaticBreadcrumb data-testid="breadcrumb">{crumb.label}</StaticBreadcrumb>
          )}
          {index < crumbs.length - 1 && <BreadcrumbArrow />}
        </React.Fragment>
      ))}
    </BreadcrumbsContainer>
  );
}
