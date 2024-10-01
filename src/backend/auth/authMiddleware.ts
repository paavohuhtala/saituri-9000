import { Middleware, Response } from "typera-express";
import type { LoggedInUser } from "../../common/authApi.js";
import { getUser } from "../user/userQueries.js";
import type { BackendContext } from "../context.js";

export interface AuthMiddlewareOutput {
  user: LoggedInUser;
}

export function createAuthMiddleware(ctx: BackendContext) {
  // Ensures that the user is logged in
  const authMiddleware: Middleware.Middleware<{ user: LoggedInUser }, Response.Unauthorized<string>> = async (
    request,
  ) => {
    const { userId } = request.req.session;

    if (!userId) {
      return Middleware.stop(Response.unauthorized("Authentication required"));
    }

    const user = await getUser(ctx, { id: userId });

    if (!user) {
      return Middleware.stop(Response.unauthorized("Invalid session"));
    }

    return Middleware.next({ user });
  };

  return authMiddleware;
}
