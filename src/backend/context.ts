import { PrismaClient } from "../../db/generated/client/index.js";

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
  config: BackendConfig;
  db: PrismaClient;
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

export function createContext(): BackendContext {
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

  const config = getConfig(env);
  const db = createPrismaClient(config.databaseUrl);

  return {
    env,
    config,
    db,
  };
}
