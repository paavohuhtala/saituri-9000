import { Parser, Response, route, router, type Route } from "typera-express";
import type {
  AcceptGroupInviteErrorResponse,
  AcceptGroupInviteResponse,
  CreateGroupInviteResponse,
  CreateGroupResponse,
  GetGroupInviteResponse,
  GetGroupResponse,
  GetGroupsResponse,
} from "../../common/api.js";
import { NewGroup } from "../../common/domain.js";
import type { BackendContext } from "../context.js";
import { createGroupMiddleware, type GroupMiddlewareResponse } from "./groupMiddleware.js";
import { type AuthMiddlewareResponse, createAuthMiddleware } from "../auth/authMiddleware.js";
import {
  acceptGroupInvite,
  createGroup,
  createGroupInvite,
  getGroupInvite,
  getGroupsAsUser,
  getGroupWithDetailsAsUser,
} from "./groupQueries.js";

export function createGroupApi(ctx: BackendContext) {
  const authenticatedRoute = route.use(createAuthMiddleware(ctx));
  const groupMiddleware = createGroupMiddleware(ctx);

  const getGroupsForUser: Route<Response.Ok<GetGroupsResponse> | AuthMiddlewareResponse> = authenticatedRoute
    .get("/group")
    .handler(async (request) => {
      const groups = await getGroupsAsUser(ctx, { userId: request.user.id });
      return Response.ok(groups);
    });

  const createGroupRoute: Route<
    Response.Ok<CreateGroupResponse> | Response.BadRequest<string> | Response.Unauthorized<string>
  > = authenticatedRoute
    .post("/group")
    .use(Parser.body(NewGroup))
    .handler(async (request) => {
      const id = await createGroup(ctx, request.body);
      return Response.ok({ id });
    });

  const getGroupRoute: Route<Response.Ok<GetGroupResponse> | AuthMiddlewareResponse | GroupMiddlewareResponse> =
    authenticatedRoute
      .get("/group/:groupId")
      .use(groupMiddleware)
      .handler(async (request) => {
        const group = getGroupWithDetailsAsUser(ctx, { groupId: request.routeParams.groupId, userId: request.user.id });
        if (!group) {
          return Response.notFound("Group not found");
        }
        return Response.ok(group);
      });

  const createGroupInviteRoute: Route<
    | Response.Ok<CreateGroupInviteResponse>
    | Response.BadRequest<string>
    | AuthMiddlewareResponse
    | GroupMiddlewareResponse
  > = authenticatedRoute
    .post("/group/:groupId/invite")
    .use(groupMiddleware)
    .handler(async (request) => {
      const invite = await createGroupInvite(ctx, {
        groupId: request.routeParams.groupId,
        creatorUserId: request.user.id,
      });

      if (!invite) {
        return Response.badRequest("Failed to create invite");
      }

      const response: CreateGroupInviteResponse = {
        id: invite.id,
        groupId: invite.groupId,
        expiresAt: invite.expiresAt.toISOString(),
      };

      return Response.ok(response);
    });

  const getGroupInviteRoute: Route<
    Response.Ok<GetGroupInviteResponse> | Response.NotFound<string> | AuthMiddlewareResponse
  > = authenticatedRoute.get("/group/invite/:inviteId").handler(async (request) => {
    const invite = await getGroupInvite(ctx, { inviteId: request.routeParams.inviteId });

    if (!invite) {
      return Response.notFound("Invite not found");
    }

    const response: GetGroupInviteResponse = {
      id: invite.id,
      groupId: invite.groupId,
      expiresAt: invite.expiresAt.toISOString(),
      groupName: invite.groupName,
      inviterName: invite.inviterName,
    };

    return Response.ok(response);
  });

  const acceptGroupInviteRoute: Route<
    | Response.Ok<AcceptGroupInviteResponse>
    | Response.BadRequest<AcceptGroupInviteErrorResponse>
    | Response.InternalServerError
    | AuthMiddlewareResponse
    | GroupMiddlewareResponse
  > = authenticatedRoute.post("/group/invite/:inviteId/accept").handler(async (request) => {
    const { inviteId } = request.routeParams;
    const result = await acceptGroupInvite(ctx, { inviteId, userId: request.user.id });

    if (result.type === "ok") {
      return Response.ok({ groupId: result.value.groupId });
    }

    switch (result.error) {
      case "invite-not-found":
      case "invite-expired":
        return Response.badRequest({ error: result.error });
      case "unknown-error":
        return Response.internalServerError();
    }
  });

  const groupApi = router(
    createGroupRoute,
    getGroupRoute,
    createGroupInviteRoute,
    getGroupInviteRoute,
    acceptGroupInviteRoute,
    getGroupsForUser,
  );
  return groupApi;
}
