import React from "react";
import { useLoggedInUser, useLoginStatus } from "./redux/hooks";
import { LoadingIndicator } from "./common/LoadingIndicator";
import { Navigate } from "react-router-dom";
import { SectionTitle, ViewContainer, ViewTitle } from "./common/layout";
import { useGetGroupsQuery } from "./redux/saituriApi";
import styled from "styled-components";
import { CardLinkArea, LinkCard } from "./common/Card";
import { Button, ButtonLink } from "./common/Button";
import { IconPlus } from "@tabler/icons-react";
import { Modal, ModalContent, ModalHeader, UrlStateModal } from "./common/Modal";

export function Home() {
  const loginStatus = useLoginStatus();

  if (loginStatus === "unknown") {
    return <LoadingIndicator />;
  }

  if (loginStatus === "loggedOut") {
    return <Navigate to="/login" />;
  }

  return <AuthenticatedHome />;
}

const GroupList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 8px;
  width: 100%;
`;

function AuthenticatedHome() {
  const user = useLoggedInUser();
  const { isLoading: isLoadingGroups, data } = useGetGroupsQuery();

  if (user === undefined) {
    return null;
  }

  return (
    <ViewContainer>
      <ViewTitle>Tervetuloa, {user.name}!</ViewTitle>
      <UrlStateModal query="exampleModal">
        <ModalHeader title="Esimerkkimodaali" onClose={() => null} />
        <ModalContent>
          <p>Tämä on esimerkkimodaali. Esimerkillistä työtä.</p>
        </ModalContent>
      </UrlStateModal>
      <ViewContainer>
        <SectionTitle>Ryhmät</SectionTitle>
        {isLoadingGroups && <LoadingIndicator />}
        {data && data.length > 0 && (
          <GroupList>
            {data.map((group) => (
              <LinkCard key={group.id} title={group.name} link={<CardLinkArea to={`/group/${group.id}`} />}>
                {group.name}
              </LinkCard>
            ))}
          </GroupList>
        )}
        {data && data.length === 0 && <p>Et kuulu vielä ryhmiin.</p>}
        <ButtonLink to="/group/new">
          <IconPlus size={16} /> Luo uusi ryhmä
        </ButtonLink>
      </ViewContainer>
    </ViewContainer>
  );
}
