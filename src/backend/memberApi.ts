import { Parser, Response, Route, route, router } from "typera-express";
import { DbType, Member, NewMember } from "../common/domain.js";
import { BackendContext } from "./context.js";

export function createMemberApi({ db }: BackendContext) {
  const getAllMembers: Route<Response.Ok<DbType<Member[]>>> = route.get("/members").handler(async () => {
    const members = await db.member.findMany({
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

      const member = await db.member.findUnique({
        where: {
          id,
        },
      });

      if (!member) {
        return Response.notFound("Member not found");
      }

      return Response.ok(member);
    });

  const createMember: Route<Response.Ok<DbType<Member>> | Response.BadRequest<string> | Response.NotFound<string>> =
    route
      .post("/members")
      .use(Parser.body(NewMember))
      .handler(async (request) => {
        const { name } = request.body;

        const member = await db.member.create({
          data: {
            name,
          },
        });

        return Response.ok(member);
      });

  const updateMember: Route<Response.Ok<DbType<void>> | Response.BadRequest<string> | Response.NotFound<string>> = route
    .put("/members/:id")
    .use(Parser.body(NewMember))
    .handler(async (request) => {
      const { id } = request.routeParams;
      const { name, email, phone } = request.body;

      await db.member.update({
        where: {
          id,
        },
        data: {
          name,
          email,
          phone,
        },
      });

      return Response.ok();
    });

  const membersApi = router(getAllMembers, getMember, createMember, updateMember);
  return membersApi;
}
