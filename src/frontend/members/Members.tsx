import { styled } from "styled-components";
import { Member } from "../../common/domain";
import React from "react";
import { skeletonStyle } from "../common/skeleton";
import { FullWidthTextCell, Table, TextCell } from "../common/Table";
import { DangerLinkButton } from "../common/Button";

const MembersTable = styled(Table)`
  grid-template-columns:
    minmax(120px, 1fr)
    minmax(64px, 2fr)
    max-content;
`;

const TableSkeleton = styled(MembersTable).attrs({ as: "div" })`
  ${skeletonStyle}
  min-height: 256px;
`;

interface Props {
  members: Member[];
}

export function Members({ members }: Props) {
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
            <TextCell>
              <DangerLinkButton>Poista</DangerLinkButton>
            </TextCell>
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
  return <TableSkeleton />;
}
