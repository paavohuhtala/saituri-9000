import { IconPlus } from "@tabler/icons-react";
import React from "react";
import { Button } from "../common/Button";
import { InputField } from "../common/inputs";
import { InlineForm } from "../common/layout";

interface Props {
  onAddMember: (name: string) => Promise<unknown>;
}

export function NewMember({ onAddMember }: Props) {
  const [name, setName] = React.useState("");
  const [adding, setAdding] = React.useState(false);

  const onChangeName = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  }, []);

  const onClickAdd = React.useCallback(() => {
    setAdding(true);
    onAddMember(name)
      .then(() => {
        setName("");
      })
      .finally(() => {
        setAdding(false);
      });
  }, [onAddMember, name]);

  return (
    <InlineForm>
      <InputField placeholder="Nimi" value={name} onChange={onChangeName} disabled={adding} maxLength={48} />

      <Button onClick={onClickAdd} disabled={name.length < 1 || adding}>
        <IconPlus />
        Lisää jäsen
      </Button>
    </InlineForm>
  );
}
