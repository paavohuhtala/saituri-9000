import { css, keyframes } from "styled-components";
import { gray } from "../theme";

const skeletonAnimation = keyframes`
  0% {
    background-position: 0px 0px;
  }
  100% {
    background-position: 1000px 0px;
  }
`;

export const skeletonStyle = css`
  background-color: ${gray.x700};
  background-image: linear-gradient(
    90deg,
    ${gray.x700},
    ${gray.x800},
    ${gray.x700}
  );
  background-size: 1000px 1000px;
  background-repeat: repeat-x;
  animation: ${skeletonAnimation} 2s linear infinite;
`;
