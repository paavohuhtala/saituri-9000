import { Parser, Response, type Route, route, router } from "typera-express";
import type { BackendContext } from "./context.js";
import {
  RegisterRequest,
  LoginRequest,
  type RegisterError,
  type CreatedUser,
  type LoginError,
  type LoggedInUser,
  type User,
} from "../common/authApi.js";
import argon2 from "argon2";
import { PrismaClientKnownRequestError } from "../../db/generated/client/runtime/library.js";
import { PrismaErrorCode } from "./prismaUtils.js";

export function createUserApi({ db, logger }: BackendContext) {
  const registerUser: Route<
    Response.Ok<CreatedUser> | Response.BadRequest<RegisterError> | Response.InternalServerError
  > = route
    .post("/register")
    .use(Parser.body(RegisterRequest))
    .handler(async (request) => {
      const { name, email, password: rawPassword } = request.body;
      const password = await argon2.hash(rawPassword);

      try {
        const user = await db.user.create({
          data: {
            name,
            email,
            password,
          },
        });

        request.req.session.userId = user.id;
        return Response.ok({ id: user.id });
      } catch (err) {
        if (err instanceof PrismaClientKnownRequestError) {
          if (err.code === PrismaErrorCode.UniqueConstraintViolation) {
            return Response.badRequest({ type: "email-already-exists" } as const);
          }
        }

        logger.error({ err, name, email }, "Failed to create user");
        return Response.internalServerError();
      }
    });

  const loginUser: Route<Response.Ok<CreatedUser> | Response.BadRequest<LoginError> | Response.InternalServerError> =
    route
      .post("/login")
      .use(Parser.body(LoginRequest))
      .handler(async (request) => {
        const { email, password } = request.body;

        const user = await db.user.findUnique({
          where: {
            email,
          },
          omit: {
            password: false,
          },
        });

        if (!user || !(await argon2.verify(user.password, password))) {
          return Response.badRequest({ type: "invalid-credentials" } as const);
        }

        request.req.session.userId = user.id;
        return Response.ok({ id: user.id });
      });

  const getCurrentUser: Route<Response.Ok<User> | Response.InternalServerError> = route
    .get("/me")
    .handler(async (request) => {
      const userId = request.req.session.userId;
      if (!userId) {
        return Response.ok({ type: "anonymous" } as const);
      }

      const user = await db.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user) {
        return Response.internalServerError();
      }

      return Response.ok({ type: "user", id: user.id, name: user.name, email: user.email } as const);
    });

  const userApi = router(registerUser, loginUser, getCurrentUser);
  return userApi;
}
