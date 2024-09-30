import * as t from "io-ts";

interface NonEmptyStringBrand {
  readonly NonEmptyString: unique symbol;
}

export const NonEmptyString = t.brand(
  t.string,
  (s): s is t.Branded<string, NonEmptyStringBrand> => s.length > 0,
  "NonEmptyString",
);
export type NonEmptyString = t.TypeOf<typeof NonEmptyString>;

interface ValidEmailBrand {
  readonly ValidEmail: unique symbol;
}

export const ValidEmail = t.brand(
  t.string,
  // Basic email validation: not empty, contains @
  (s): s is t.Branded<string, ValidEmailBrand> => s.length > 0 && s.includes("@"),
  "ValidEmail",
);
export type ValidEmail = t.TypeOf<typeof ValidEmail>;

export const RegisterRequest = t.type({
  name: NonEmptyString,
  email: ValidEmail,
  password: NonEmptyString,
});
export type RegisterRequest = t.TypeOf<typeof RegisterRequest>;

export interface CreatedUser {
  id: string;
}

export type RegisterError = { type: "email-already-exists" } | { type: "unknown" } | string;

export const LoginRequest = t.type({
  email: ValidEmail,
  password: NonEmptyString,
});
export type LoginRequest = t.TypeOf<typeof LoginRequest>;

export type LoginError = { type: "invalid-credentials" } | { type: "unknown" } | string;

export interface LoggedInUser {
  type: "user";
  id: string;
  name: string;
  email: string;
}

export interface AnonymousUser {
  type: "anonymous";
}

export type User = LoggedInUser | AnonymousUser;
