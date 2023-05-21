import { Link } from "react-router-dom";
import { styled } from "styled-components";
import { red, blue } from "../theme";

export const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;

  &:visited {
    color: inherit;
  }
` as typeof Link;

export const ActionLink = styled(StyledLink)`
  color: ${blue.x600};
`;

export const DangerLink = styled(StyledLink)`
  color: ${red.x600};
`;
