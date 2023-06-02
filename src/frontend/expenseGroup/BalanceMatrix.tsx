import { styled } from "styled-components";
import { ExpenseGroupResponse } from "../../common/api";
import React from "react";
import { MoneyCell, Table, TextCell } from "../common/Table";
import { centsToEurPrice } from "../../common/money";

interface Props {
  expenseGroup: ExpenseGroupResponse;
  showNegative: boolean;
}

const BalanceMatrixTable = styled(Table)<{ $memberCount: number }>`
  grid-template-columns: max-content repeat(${(props) => props.$memberCount}, minmax(max-content, 1fr));

  td {
    height: 100%;
  }

  th {
    display: flex;
    gap: 4px;

    p {
      max-width: 100px;
      text-overflow: ellipsis;
      display: inline-block;
      white-space: nowrap;
      overflow: hidden;
    }
  }
`;

export function BalanceMatrix({ expenseGroup: { members, balanceMatrix }, showNegative }: Props) {
  return (
    <BalanceMatrixTable $memberCount={members.length}>
      <thead>
        <tr>
          <th />
          {members.map((member) => (
            <th key={member.id}>
              <p>{member.name}</p> saa
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {members.map((member) => (
          <tr key={member.id}>
            <th>
              <p>{member.name}</p> maksaa
            </th>
            {members.map((otherMember) => {
              const isSelf = member.id === otherMember.id;
              const balance = balanceMatrix[otherMember.id][member.id];

              if (isSelf || isNaN(balance) || (showNegative ? balance === 0 : balance <= 0)) {
                return <MoneyCell key={otherMember.id}>-</MoneyCell>;
              }

              return <MoneyCell key={otherMember.id}>{centsToEurPrice(balance)}</MoneyCell>;
            })}
          </tr>
        ))}
      </tbody>
    </BalanceMatrixTable>
  );
}
