import { type SessionData, Store } from "express-session";
import type { BackendContext } from "./context.js";
import type { JsonObject } from "../../db/generated/client/runtime/library.js";
import { DateTime, Duration } from "luxon";

declare module "express-session" {
  interface SessionData {
    userId?: string;
  }
}

export class DbSessionStore extends Store {
  constructor(private readonly context: BackendContext) {
    super();
  }

  get(sid: string, callback: (err: unknown, session?: SessionData | null) => void): void {
    this.context.db.session
      .findUnique({
        where: {
          id: sid,
        },
      })
      .then((session) => {
        if (session && !isSessionExpired(session.expiresAt)) {
          callback(null, session.data as unknown as SessionData);
        } else {
          callback(null, null);
        }
      })
      .catch(callback);
  }

  set(sid: string, session: SessionData, callback?: (err?: unknown) => void): void {
    const expiresAt = getNewExpiresAt(session);

    this.context.db.session
      .upsert({
        where: {
          id: sid,
        },
        create: {
          id: sid,
          data: session as unknown as JsonObject,
          expiresAt,
        },
        update: {
          data: session as unknown as JsonObject,
          expiresAt,
        },
      })
      .then(() => {
        callback?.();
      })
      .catch(callback);
  }

  destroy(sid: string, callback?: (err?: unknown) => void): void {
    this.context.db.session
      .delete({
        where: {
          id: sid,
        },
      })
      .then(() => {
        callback?.();
      })
      .catch(callback);
  }

  all(callback: (err: unknown, obj?: SessionData[]) => void): void {
    this.context.db.session
      .findMany({
        select: { data: true },
      })
      .then((sessions) => {
        callback(
          null,
          sessions.map((session) => session.data as unknown as SessionData),
        );
      })
      .catch(callback);
  }

  clear(callback?: (err?: unknown) => void): void {
    this.context.db.session
      .deleteMany()
      .then(() => {
        callback?.();
      })
      .catch(callback);
  }

  length(callback: (err: unknown, length?: number) => void): void {
    this.context.db.session
      .count()
      .then((count) => {
        callback(null, count);
      })
      .catch(callback);
  }

  touch(sid: string, session: SessionData, callback?: () => void): void {
    const expiresAt = getNewExpiresAt(session);

    this.context.db.session
      .update({
        where: {
          id: sid,
        },
        data: {
          expiresAt,
        },
      })
      .then(() => {
        callback?.();
      })
      .catch(callback);
  }
}

function getNewExpiresAt(session: SessionData): string {
  const maxAge = session.cookie.maxAge;
  const timeToExpiration = maxAge ? Duration.fromMillis(maxAge) : Duration.fromObject({ days: 7 });
  const expiresAt = DateTime.now().plus(timeToExpiration);
  return expiresAt.toISO();
}

function isSessionExpired(expiresAt: Date): boolean {
  return DateTime.fromJSDate(expiresAt).diffNow("milliseconds").milliseconds < 0;
}
