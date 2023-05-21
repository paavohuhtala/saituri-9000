import { styled } from "styled-components";
import { gray } from "../theme";

export const ViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 32px;

  margin-top: 32px;
  margin-bottom: 32px;
  width: 100%;
`;

export const ViewTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  line-height: 40px;
  color: ${gray.x100};
`;

export const ViewSubtitle = styled.h2`
  font-size: 24px;
  font-weight: 500;
  line-height: 32px;
  color: ${gray.x100};
`;
