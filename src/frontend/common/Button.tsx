import { styled } from "styled-components";
import { gray, green } from "../theme";

export const Button = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-grow: 0;

  padding: 0px 16px;
  background-color: ${green.x900};
  border-radius: 8px;
  border: 1px solid ${green.x700};
  color: ${gray.x200};

  height: 44px;

  cursor: pointer;

  &:hover {
    background-color: ${green.x700};
  }

  &:disabled {
    background-color: ${gray.x700};
    border: 1px solid ${gray.x500};
    color: ${gray.x300};
    cursor: not-allowed;
  }
`;
