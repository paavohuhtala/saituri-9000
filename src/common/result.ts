export type Result<T, Err> = { type: "ok"; value: T } | { type: "error"; error: Err };

export const Result = {
  ok<T, Err>(value: T): Result<T, Err> {
    return { type: "ok", value };
  },

  error<T, Err>(error: Err): Result<T, Err> {
    return { type: "error", error };
  },

  match<T, Err, R>(
    result: Result<T, Err>,
    handlers: {
      ok: (value: T) => R;
      error: (error: Err) => R;
    },
  ): R {
    return result.type === "ok" ? handlers.ok(result.value) : handlers.error(result.error);
  },

  async matchAsync<T, Err, R>(
    result: Promise<Result<T, Err>>,
    handlers: {
      ok: (value: T) => R;
      error: (error: Err) => R;
    },
  ): Promise<R> {
    const res = await result;
    return Result.match(res, handlers);
  },
};
