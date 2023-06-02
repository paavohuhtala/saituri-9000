import { styled } from "styled-components";
import { gray, red } from "../theme";
import { InputField } from "./inputs";
import { Button, DangerButton } from "./Button";

export const Table = styled.table`
  width: 100%;
  min-width: 100%;
  border-collapse: collapse;
  border: 1px solid ${gray.x700};
  display: grid;
  overflow-x: auto;

  thead, tbody, tr {
    display: contents;
  }

  thead {
    border-bottom: 1px solid ${gray.x700};
  }

  th {
    background-color: ${gray.x600};
    padding: 16px;
    font-weight: 700;
    text-align: left;
  }

  td {
    line-height: 32px;
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

export const CellInput = styled(InputField)`
  width: 100%;
  border: 1px solid transparent;
  border-radius: 0px;
`;

export const TextCell = styled.td`
  padding: 4px 16px;
`;

export const FullWidthTextCell = styled(TextCell)`
  grid-column: 1 / -1;
`;

export const EditableCell = styled.td`
  padding-left: 0px;
  width: 100%;
`;

export const TableButton = styled(Button)`
  border-radius: 0px;
`;

export const TableDangerButton = styled(DangerButton)`
  border-radius: 0px;
`;
