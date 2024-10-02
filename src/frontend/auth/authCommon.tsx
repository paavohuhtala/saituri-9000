import React from "react";
import { FormField, FormLabel } from "../common/layout";
import { InputField } from "../common/inputs";

export interface PasswordFieldProps {
  value: string;
  onChange: (value: string) => void;
  kind: "current-password" | "new-password";
}

export function PasswordField({ value, onChange, kind }: PasswordFieldProps) {
  return (
    <FormField>
      <FormLabel>Salasana</FormLabel>
      <InputField
        required
        type="password"
        autoComplete={kind}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </FormField>
  );
}
