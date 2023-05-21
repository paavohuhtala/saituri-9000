import { styled } from "styled-components";
import { gray, green, red, indigo } from "../theme";
import { Link } from "react-router-dom";

const BaseButton = styled.button`
  --disabled-bg-color: ${gray.x700};
  --disabled-border-color: ${gray.x500};
  --disabled-text-color: ${gray.x300};

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-grow: 0;
  gap: 4px;

  padding: 0px 16px;
  background-color: var(--bg-color);
  border-radius: 8px;
  border: 1px solid var(--border-color);
  color: ${gray.x200};

  height: 44px;

  cursor: pointer;

  &:hover {
    background-color: var(--hover-bg-color);
  }

  &:disabled {
    background-color: var(--disabled-bg-color);
    border: 1px solid var(--disabled-border-color);
    color: var(--disabled-text-color);
    cursor: not-allowed;
  }

  & > svg {
    margin-left: -8px;
  }
`;

export const Button = styled(BaseButton)`
  --bg-color: ${green.x900};
  --border-color: ${green.x700};
  --text-color: ${gray.x200};

  --hover-bg-color: ${green.x700};
`;

export const SecondaryButton = styled(BaseButton)`
  --bg-color: ${gray.x800};
  --border-color: ${gray.x700};
  --text-color: ${gray.x200};

  --hover-bg-color: ${gray.x700};
`;

export const DangerButton = styled(BaseButton)`
  --bg-color: ${red.x900};
  --border-color: ${red.x700};
  --text-color: ${gray.x200};

  --hover-bg-color: ${red.x700};
`;

export const LinkButton = styled(Button).attrs({ as: Link })`
  text-decoration: none;

  &:hover {
    color: var(--text-color);
  }
` as typeof Link;
