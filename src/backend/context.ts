import { pino } from "pino";
import pretty from "pino-pretty";
import { PrismaClient } from "../../db/generated/client/index.js";
import { mkdir } from "fs/promises";

export type Environment = "development" | "production" | "test";

export interface BackendConfig {
  databaseUrl?: string;
  port: number;
  basicAuth?: {
    user: string;
    password: string;
  };
  assetPath: string;
}

export interface BackendContext {
  env: Environment;
  isCi?: boolean;
  config: BackendConfig;
  db: PrismaClient;
  logger: pino.Logger;
}

function getConfig(env: "development" | "production"): BackendConfig {
  const basicAuthUser = process.env.BASIC_AUTH_USER;
  const basicAuthPassword = process.env.BASIC_AUTH_PASSWORD;

  if (Boolean(basicAuthUser) !== Boolean(basicAuthPassword)) {
    throw new Error("BASIC_AUTH_USER and BASIC_AUTH_PASSWORD must be both set or unset");
  }

  let basicAuth: BackendConfig["basicAuth"];

  if (basicAuthUser && basicAuthPassword) {
    basicAuth = {
      user: basicAuthUser,
      password: basicAuthPassword,
    };
  }

  return {
    port: Number(process.env.PORT ?? 3001),
    basicAuth,
    assetPath: env === "production" ? "dist" : "dist-dev",
  };
}

export function createPrismaClient(databaseUrl?: string): PrismaClient {
  const client = new PrismaClient(
    databaseUrl
      ? {
          datasources: {
            db: {
              url: databaseUrl,
            },
          },
        }
      : undefined,
  );

  return client;
}

export async function createContext(): Promise<BackendContext> {
  const maybeEnv = process.env.SAITURI_ENV;
  let env: Environment;

  switch (maybeEnv) {
    case "development":
    case "production": {
      env = maybeEnv;
      break;
    }
    case "test": {
      console.error("Please use createTestContext for test environment");
      process.exit(1);
    }
    default: {
      console.error(`Invalid environment ${maybeEnv}`);
      process.exit(1);
    }
  }

  await mkdir("logs", { recursive: true });

  const config = getConfig(env);
  const db = createPrismaClient(config.databaseUrl);
  const logger = pino(
    { name: "saituri" },
    pino.multistream([
      { stream: pino.destination({ dest: `logs/${env}.log`, append: true, sync: true }) },
      // For some reason TypeScript in VS Code and Typescript in a terminal do not agree on the type of pretty
      // VS Code says it's an object, tsc says it's a function (which is correct)
      // @ts-ignore
      { stream: pretty({ colorize: true, sync: true }) },
    ]),
  );

  return {
    env,
    config,
    db,
    logger,
  };
}
