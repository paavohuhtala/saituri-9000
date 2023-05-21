import styled, { css } from "styled-components";
import { blue, gray } from "../theme";

const baseInputStyle = css`
  display: flex;
  flex-direction: row;
  align-items: center;

  padding: 8px 16px;
  border-radius: 8px;
  background-color: ${gray.x700};
  border: 1px solid ${gray.x500};
  color: ${gray.x200};
  height: 44px;

  &:hover {
    border: 1px solid ${blue.x500};
  }

  &::placeholder {
    color: ${gray.x300};
  }
`;

export const InputField = styled.input`
  ${baseInputStyle}
  cursor: text;
`;

export const Select = styled.select`
  ${baseInputStyle}
  cursor: pointer;
`;
