import styled from "styled-components";
import { blue, gray } from "../theme";

export const InputField = styled.input`
  display: flex;
  flex-direction: row;
  align-items: center;

  padding: 8px 16px;
  border-radius: 8px;
  background-color: ${gray.x700};
  border: 1px solid ${gray.x500};
  color: ${gray.x200};

  height: 44px;

  cursor: text;

  &:hover {
    border: 1px solid ${blue.x500};
  }

  &::placeholder {
    color: ${gray.x300};
  }
`;
