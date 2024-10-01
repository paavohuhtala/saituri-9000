import { Parser, Response, route, router, type Route } from "typera-express";
import type { CreateGroupResponse, GetGroupResponse } from "../../common/api.js";
import { NewGroup } from "../../common/domain.js";
import type { BackendContext } from "../context.js";
import { createGroupMiddleware } from "./groupMiddleware.js";
import { createAuthMiddleware } from "../auth/authMiddleware.js";
import { createGroup, getGroupWithDetailsAsUser } from "./groupQueries.js";

export function createGroupApi(ctx: BackendContext) {
  const authenticatedRoute = route.use(createAuthMiddleware(ctx));
  const groupMiddleware = createGroupMiddleware(ctx);

  const createGroupRoute: Route<
    Response.Ok<CreateGroupResponse> | Response.BadRequest<string> | Response.Unauthorized<string>
  > = authenticatedRoute
    .post("/group")
    .use(Parser.body(NewGroup))
    .handler(async (request) => {
      const id = await createGroup(ctx, request.body);
      return Response.ok({ id });
    });

  const getGroupRoute: Route<
    | Response.Ok<GetGroupResponse>
    | Response.NotFound<string>
    | Response.Unauthorized<string>
    | Response.Forbidden<string>
  > = authenticatedRoute
    .get("/group/:groupId")
    .use(groupMiddleware)
    .handler(async (request) => {
      const group = getGroupWithDetailsAsUser(ctx, { groupId: request.routeParams.groupId, userId: request.user.id });
      if (!group) {
        return Response.notFound("Group not found");
      }
      return Response.ok(group);
    });

  const groupApi = router(createGroupRoute, getGroupRoute);
  return groupApi;
}
