import React from "react";
import { ViewContainer, ViewTitle } from "../common/layout";
import { useGetAllMembersQuery } from "../redux/saituriApi";
import { Navigate, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { MemberEditor } from "./MemberEditor";
import { Breadcrumbs } from "../common/Breadcrumbs";
import { LoadingIndicator } from "../common/LoadingIndicator";
import { delayMs } from "../delay";

export function EditMember() {
  const navigate = useNavigate();
  const { groupId, id } = useParams();

  if (!groupId || !id) {
    return <Navigate to="/" replace />;
  }

  const [searchParams] = useSearchParams();
  const { currentData: members } = useGetAllMembersQuery({ groupId });

  const returnTo = searchParams.get("returnTo") ?? "/";

  if (!members) {
    return (
      <ViewContainer>
        <LoadingIndicator />
      </ViewContainer>
    );
  }

  const member = members.find((m) => m.id === id);

  if (!member) {
    return (
      <ViewContainer>
        <ViewTitle>Jäsentä ei löytynyt :(</ViewTitle>
      </ViewContainer>
    );
  }

  const onSaved = () => {
    setTimeout(() => {
      navigate(returnTo);
    }, delayMs(1000));
  };

  return (
    <ViewContainer>
      <Breadcrumbs member={member} />
      <MemberEditor groupId={groupId} initialMember={member} onSaved={onSaved} />
    </ViewContainer>
  );
}
