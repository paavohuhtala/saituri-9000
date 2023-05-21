import styled from "styled-components";
import { blue, gray, indigo } from "../theme";
import { Link } from "react-router-dom";
import { IconChevronRight } from "@tabler/icons-react";

export const Breadcrumbs = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  color: ${gray.x50};
  overflow: hidden;
`;

export const StaticBreadcrumb = styled.span`
  // Break on several lines if needed
  white-space: pre-wrap;
  word-wrap: break-word;
  word-break: break-all;
`;

export const BreadcrumbLink = styled(Link)`
  text-decoration: none;
`;

export const BreadcrumbArrow = styled(IconChevronRight).attrs({ size: 16 })`
  flex-shrink: 0;
`;
