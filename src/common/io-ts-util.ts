import { isLeft } from "fp-ts/lib/Either";
import type * as t from "io-ts";
import { PathReporter } from "io-ts/PathReporter";

export function decodeOrThrow<A, O, I>(codec: t.Type<A, O, I>, value: I): A {
  const result = codec.decode(value);

  if (isLeft(result)) {
    throw new Error(`Invalid value: ${JSON.stringify(value)}\n${PathReporter.report(result).join("\n")}`);
  }

  return result.right;
}
