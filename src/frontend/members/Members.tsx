import { css, styled } from "styled-components";
import { Member } from "../../common/domain";
import React from "react";
import { skeletonStyle } from "../common/skeleton";
import { FullWidthTextCell, MoneyCell, MoneyHeader, Table, TextCell } from "../common/Table";
import { DangerLinkButton } from "../common/Button";
import { BalanceMatrix, calculatePersonalBalances } from "../../common/share";
import { centsToEurPrice } from "../../common/money";

const MembersTable = styled(Table)<{ $includeBalanceColumn?: boolean }>`
  grid-template-columns:
    minmax(120px, 1fr)
    ${({ $includeBalanceColumn }) => $includeBalanceColumn && css`max-content`}
    max-content;
`;

const TableSkeleton = styled(MembersTable).attrs({ as: "div" })`
  ${skeletonStyle}
  min-height: 256px;
`;

interface Props {
  members: Member[];
  balanceMatrix?: BalanceMatrix;
}

export function Members({ members, balanceMatrix }: Props) {
  const balancePerMember = React.useMemo(
    () => (balanceMatrix ? calculatePersonalBalances(balanceMatrix) : undefined),
    [balanceMatrix],
  );
  const includeBalanceColumn = Boolean(balancePerMember);

  return (
    <MembersTable $includeBalanceColumn={includeBalanceColumn}>
      <thead>
        <tr>
          <th>Nimi</th>
          {includeBalanceColumn && <MoneyHeader>Balanssi</MoneyHeader>}
          <th />
        </tr>
      </thead>

      <tbody>
        {members.map((member) => {
          const balance = balancePerMember ? balancePerMember[member.id] : undefined;

          return (
            <tr key={member.id}>
              <TextCell>{member.name}</TextCell>
              {includeBalanceColumn && <MoneyCell>{centsToEurPrice(balance ?? 0)}</MoneyCell>}
              <TextCell>
                <DangerLinkButton>Poista</DangerLinkButton>
              </TextCell>
            </tr>
          );
        })}
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
  return <TableSkeleton />;
}
