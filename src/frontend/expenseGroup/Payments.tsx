import { styled } from "styled-components";
import { PaymentWithDetails } from "../../common/api";
import { MoneyCell, MoneyHeader, Table, TextCell } from "../common/Table";
import React from "react";
import { centsToEurPrice } from "../../common/money";
import { parseEET } from "../../common/date";
import { DateTime } from "luxon";
import { Link } from "react-router-dom";

const PaymentsTable = styled(Table)`
  grid-template-columns:
    minmax(120px, 1fr)
    minmax(120px, 1fr)
    max-content
    max-content;

  td {
    span {
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }
`;

interface Props {
  payments: PaymentWithDetails[];
}

export function Payments({ payments }: Props) {
  if (payments.length === 0) {
    return <p>Ei maksuja.</p>;
  }

  return (
    <PaymentsTable>
      <thead>
        <tr>
          <th>Maksaja</th>
          <th>Saaja</th>
          <MoneyHeader>Summa</MoneyHeader>
          <th>Aika</th>
        </tr>
      </thead>
      <tbody>
        {payments.map((payment) => (
          <tr key={payment.id}>
            <TextCell>
              <span>
                <Link to={`./member/${payment.payer.id}`}>{payment.payer.name}</Link>
              </span>
            </TextCell>
            <TextCell>
              <span>
                <Link to={`./member/${payment.payee.id}`}>{payment.payee.name}</Link>
              </span>
            </TextCell>
            <MoneyCell>{centsToEurPrice(payment.amount)}</MoneyCell>
            <TextCell>{parseEET(payment.createdAt).toLocaleString(DateTime.DATETIME_SHORT)}</TextCell>
          </tr>
        ))}
      </tbody>
    </PaymentsTable>
  );
}
