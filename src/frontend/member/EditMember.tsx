import React from "react";
import { ViewContainer, ViewTitle } from "../common/layout";
import { useGetAllMembersQuery } from "../redux/saituriApi";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { MemberEditor } from "./MemberEditor";
import { BreadcrumbArrow, BreadcrumbLink, Breadcrumbs, StaticBreadcrumb } from "../common/Breadcrumbs";

export function EditMember() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentData: members } = useGetAllMembersQuery();

  if (!id) {
    return <Navigate to="/" replace />;
  }

  if (!members) {
    return <ViewContainer>Ladataan...</ViewContainer>;
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
      navigate("/");
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
