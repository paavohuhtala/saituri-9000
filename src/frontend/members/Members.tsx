import { styled } from "styled-components";
import { Member } from "../../common/domain";
import React from "react";
import { skeletonStyle } from "../common/skeleton";
import { gray } from "../theme";
import { InputField } from "../common/inputs";
import { Button, DangerButton } from "../common/Button";
import { IconUserMinus } from "@tabler/icons-react";

const MembersTable = styled.table`
  width: 100%;
  min-width: 100%;
  border-collapse: collapse;
  border: 1px solid ${gray.x700};

  display: grid;
  grid-template-columns:
    minmax(120px, 1fr)
    minmax(64px, 2fr)
    max-content;

  thead, tbody, tr {
    display: contents;
  }

  thead {
    text-align: left;
    border-bottom: 1px solid ${gray.x700};
  }

  th {
    background-color: ${gray.x600};
    padding: 16px;
    font-weight: 700;
  }

  td {
    height: 44px;
    display: flex;
    align-items: center;
  }

  td:not(:last-child) {
    width: 100%;
  }

  td:last-child {
    text-align: right;
  }

  // Add stripes
  tbody tr:nth-child(odd) td {
    background-color: ${gray.x800};
  }
`;

const MembersTableSkeleton = styled(MembersTable).attrs({ as: "div" })`
  ${skeletonStyle}
  min-height: 256px;
`;

const CellInput = styled(InputField)`
  width: 100%;
  border: 1px solid transparent;
  border-radius: 0px;
`;

const TextCell = styled.td`
  padding: 0px 16px;
`;

const FullWidthTextCell = styled(TextCell)`
  grid-column: 1 / -1;
`;

const EditableCell = styled.td`
  padding-left: 0px;
  width: 100%;
`;

const TableButton = styled(Button)`
  border-radius: 0px;
`;

const TableDangerButton = styled(DangerButton)`
  border-radius: 0px;
`;

interface Props {
  members: Member[];
}

export function Members({ members }: Props) {
  const onDeleteUser = React.useCallback(() => {
    alert("Ei veloista noin helpolla pääse :)");
  }, []);

  return (
    <MembersTable>
      <thead>
        <tr>
          <th>Nimi</th>
          <th>Balanssi</th>
          <th />
        </tr>
      </thead>

      <tbody>
        {members.map((member) => (
          <tr key={member.id}>
            <TextCell>{member.name}</TextCell>
            <TextCell>0,00 €</TextCell>
            <td>
              <TableDangerButton onClick={onDeleteUser}>
                <IconUserMinus />
              </TableDangerButton>
            </td>
          </tr>
        ))}
        {members.length === 0 && (
          <tr>
            <FullWidthTextCell>Ei jäseniä.</FullWidthTextCell>
          </tr>
        )}
      </tbody>
    </MembersTable>
  );
}

export function MembersSkeleton() {
  return <MembersTableSkeleton />;
}
