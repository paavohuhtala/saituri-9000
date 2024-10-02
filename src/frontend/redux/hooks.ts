import { useGetCurrentUserQuery, useLogoutMutation } from "./saituriApi";
import type { LoggedInUser } from "../../common/authApi";

type LoginStatus = "unknown" | "loggedIn" | "loggedOut";

export function useLoginStatus(): LoginStatus {
  const { data } = useGetCurrentUserQuery();

  if (data === undefined) {
    return "unknown";
  }

  return data.type === "user" ? "loggedIn" : "loggedOut";
}

export function useLoggedInUser(): LoggedInUser | undefined {
  const { data } = useGetCurrentUserQuery();

  if (data === undefined || data.type === "anonymous") {
    return undefined;
  }

  return data;
}

export function useLogout(): () => Promise<unknown> {
  const [logoutMutation] = useLogoutMutation();
  return logoutMutation;
}
