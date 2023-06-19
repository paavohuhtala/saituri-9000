import * as t from "io-ts";

export const TEST_SERVER_HEALTH_CHECK_PORT = 3003;
export const TEST_SERVER_FIRST_PORT = 3004;

export const TestApiCommand = t.union([
  t.type({
    kind: t.literal("database-reset"),
  }),
  t.type({
    kind: t.literal("foo"),
  }),
]);

export type TestApiCommand = t.TypeOf<typeof TestApiCommand>;
export type TestApiCommandKind = TestApiCommand["kind"];

export type TestApiResponse<K extends TestApiCommandKind> = {
  "database-reset": void;
  foo: "bar";
}[K];
