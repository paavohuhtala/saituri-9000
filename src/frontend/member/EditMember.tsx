import React from "react";
import { ViewContainer, ViewTitle } from "../common/layout";
import { useGetAllMembersQuery } from "../redux/saituriApi";
import { Navigate, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { MemberEditor } from "./MemberEditor";
import { BreadcrumbArrow, BreadcrumbLink, Breadcrumbs, StaticBreadcrumb } from "../common/Breadcrumbs";
import { LoadingIndicator } from "../common/LoadingIndicator";

export function EditMember() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { currentData: members } = useGetAllMembersQuery();

  const returnTo = searchParams.get("returnTo") ?? "/";

  if (!id) {
    return <Navigate to="/" replace />;
  }

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
    }, 1000);
  };

  return (
    <ViewContainer>
      <Breadcrumbs>
        <BreadcrumbLink to="/">Kaikki jäsenet</BreadcrumbLink>
        <BreadcrumbArrow />
        <StaticBreadcrumb>{member.name}</StaticBreadcrumb>
      </Breadcrumbs>
      <MemberEditor initialMember={member} onSaved={onSaved} />
    </ViewContainer>
  );
}
