import { styled } from "styled-components";
import { MoneyCell, MoneyHeader, Table, TextCell } from "../common/Table";
import React from "react";
import { ExpenseWithDetails } from "../../common/api";
import { Link } from "react-router-dom";
import { centsToEurPrice } from "../../common/money";

const ExpensesTable = styled(Table)`
  grid-template-columns:
    minmax(max-content, 2fr)
    minmax(120px, 200px)
    minmax(max-content, 2fr)
    max-content;

  td {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
`;

const ExpensePayerCell = styled(TextCell)`
  max-width: 200px;

  span {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
`;

interface Props {
  expenseGroupId: string;
  expenses: ExpenseWithDetails[];
}

export function Expenses({ expenseGroupId, expenses }: Props) {
  const total = React.useMemo(() => expenses.reduce((sum, expense) => sum + expense.amount, 0), [expenses]);

  return (
    <ExpensesTable>
      <thead>
        <tr>
          <th>Selite</th>
          <th>Maksaja</th>
          <MoneyHeader>Summa</MoneyHeader>
          <th />
        </tr>
      </thead>
      <tbody>
        {expenses.map((expense) => (
          <tr key={expense.id}>
            <TextCell>{expense.name}</TextCell>
            <ExpensePayerCell>
              <span>
                <Link to={`./member/${expense.paidBy.id}`}>{expense.paidBy.name}</Link>
              </span>
            </ExpensePayerCell>
            <MoneyCell>{centsToEurPrice(expense.amount)}</MoneyCell>
            <TextCell>
              <Link to={`/expense-group/${expenseGroupId}/expenses/${expense.id}`}>Muokkaa</Link>
            </TextCell>
          </tr>
        ))}
        <tr>
          <th>Yhteensä</th>
          <th />
          <MoneyHeader>{centsToEurPrice(total)}</MoneyHeader>
          <th />
        </tr>
      </tbody>
    </ExpensesTable>
  );
}
