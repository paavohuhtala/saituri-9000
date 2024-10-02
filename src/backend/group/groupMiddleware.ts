import { Middleware, Response } from "typera-express";
import type { AuthMiddlewareOutput } from "../auth/authMiddleware.js";
import type { GroupWithUsers } from "../../common/domain.js";
import { getGroupAsUser } from "./groupQueries.js";
import type { BackendContext } from "../context.js";

export function createGroupMiddleware(ctx: BackendContext) {
  // Ensures that the user is in the group that they are trying to access
  // (and that the group exists)
  const groupMiddleware: Middleware.ChainedMiddleware<
    AuthMiddlewareOutput & { routeParams: { groupId: string } },
    { group: GroupWithUsers },
    Response.Forbidden<string> | Response.NotFound<string>
  > = async ({ user, routeParams }) => {
    const { groupId } = routeParams;
    const group = await getGroupAsUser(ctx, { groupId, userId: user.id });

    if (!group) {
      return Middleware.stop(Response.notFound("Group not found"));
    }

    const userInGroup = group.users.some((u) => u.id === user.id);

    if (!userInGroup) {
      return Middleware.stop(Response.forbidden("You are not in this group"));
    }

    return Middleware.next({ group });
  };

  return groupMiddleware;
}

export type GroupMiddlewareResponse = Response.Forbidden<string> | Response.NotFound<string>;
