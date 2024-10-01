import type { LoggedInUser } from "../../common/authApi.js";
import type { BackendContext } from "../context.js";

export async function getUser({ db }: BackendContext, { id }: { id: string }): Promise<LoggedInUser | null> {
  const user = await db.user.findUnique({ where: { id } });

  if (!user) {
    return null;
  }

  return { type: "user", ...user };
}
