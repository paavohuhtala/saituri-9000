import { IconCheck } from "@tabler/icons-react";
import React from "react";
import styled from "styled-components";
import { gray } from "../theme";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  gap: 8px;
  background: ${gray.x800};
  border: 1px solid ${gray.x600};
  border-radius: 4px;
  position: relative;
  cursor: pointer;
`;

const NativeCheckbox = styled.input.attrs({ type: "checkbox" })`
  appearance: none;
  width: 16px;
  height: 16px;
  cursor: pointer;
`;

const Label = styled.label`
  display: flex;
  flex-direction: row;
  gap: 8px;
  cursor: pointer;
`;

const Checkmark = styled(IconCheck).attrs({ size: 16 })`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Checkbox({ label, ...props }: Props) {
  return (
    <Label>
      <Container>
        {props.checked && <Checkmark />}
        <NativeCheckbox {...props} />
      </Container>
      {label}
    </Label>
  );
}
