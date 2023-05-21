import { Parser, Response, Route, route, router } from "typera-express";
import { DbType, Member, NewMember } from "../common/domain";
import { prisma } from "./db";

const getAllMembers: Route<Response.Ok<DbType<Member[]>>> = route.get("/members").handler(async () => {
  const members = await prisma.member.findMany({
    orderBy: {
      updatedAt: "desc",
    },
  });

  return Response.ok(members);
});

const getMember: Route<Response.Ok<DbType<Member>> | Response.BadRequest<string> | Response.NotFound<string>> = route
  .get("/members/:id")
  .handler(async (request) => {
    const { id } = request.routeParams;

    const member = await prisma.member.findUnique({
      where: {
        id,
      },
    });

    if (!member) {
      return Response.notFound("Member not found");
    }

    return Response.ok(member);
  });

const createMember: Route<Response.Ok<DbType<Member>> | Response.BadRequest<string> | Response.NotFound<string>> = route
  .post("/members")
  .use(Parser.body(NewMember))
  .handler(async (request) => {
    const { name } = request.body;

    const member = await prisma.member.create({
      data: {
        name,
      },
    });

    return Response.ok(member);
  });

export const membersApi = router(getAllMembers, getMember, createMember);
