import _ from "lodash";
import express from "express";
import { BackendContext, BackendConfig, createPrismaClient } from "./context.js";
import { createServer } from "./server.js";
import { execSync } from "node:child_process";
import { PrismaClient } from "../../db/generated/client/index.js";
import { Parser, Response, Route, route, router } from "typera-express";
import { TEST_SERVER_FIRST_PORT, TEST_SERVER_HEALTH_CHECK_PORT, TestApiCommand } from "./testCommon.js";
import { pino } from "pino";
import pretty from "pino-pretty";
import { mkdir } from "fs/promises";

const TEST_INSTANCES = parseInt(process.env.TEST_INSTANCES ?? "1", 10);
const BASE_DATABASE_URL = "postgresql://postgres:postgres@localhost:5499";

if (process.env.SAITURI_ENV !== "test") {
  console.error("This script is only meant to be run in test environment. Please set SAITURI_ENV to test.");
  process.exit(1);
}

async function recreateDatabase(db: PrismaClient, i: number) {
  await db.$executeRawUnsafe(`
    DROP DATABASE IF EXISTS saituri_test_${i};
  `);
  await db.$executeRawUnsafe(`CREATE DATABASE saituri_test_${i} TEMPLATE saituri_test;`);
}

// Returns a connection to the template database
async function prepareTestDatabase(): Promise<PrismaClient> {
  const databaseUrl = `${BASE_DATABASE_URL}/saituri_test`;

  const now = new Date();
  // Create / reset primary test database
  console.log("Preparing test database");
  execSync("yarn prisma migrate reset --force --skip-generate", {
    env: {
      ...process.env,
      DATABASE_URL: databaseUrl,
    },
    stdio: "inherit",
  });

  const templateDb = createPrismaClient(databaseUrl);
  // Set saituri_test as template
  await templateDb.$executeRaw`
      UPDATE pg_database SET datistemplate = true WHERE datname = 'saituri_test';
  `;

  // Create databases from template
  for (let i = 0; i < TEST_INSTANCES; i++) {
    await recreateDatabase(templateDb, i);
  }

  console.log(`Initialized ${TEST_INSTANCES} test databases in ${new Date().getTime() - now.getTime()}ms`);

  return templateDb;
}

async function createTestContext(index: number): Promise<BackendContext> {
  const config: BackendConfig = {
    port: TEST_SERVER_FIRST_PORT + index,
    databaseUrl: `${BASE_DATABASE_URL}/saituri_test_${index}`,
    assetPath: "dist-test",
  };

  const db = createPrismaClient(config.databaseUrl);

  const isCi = process.env.CI === "true";

  if (!isCi) {
    await mkdir("logs", { recursive: true });
  }

  const logger = pino(
    { name: `saituri-backend-test-${index}` },
    pino.multistream([
      // Don't log to file in CI
      ...(isCi ? [] : [{ stream: pino.destination({ dest: `logs/test-${index}.log`, append: false, sync: true }) }]),
      // For some reason TypeScript in VS Code and Typescript in a terminal do not agree on the type of pretty
      // VS Code says it's an object, tsc says it's a function (which is correct)
      // @ts-ignore
      { stream: pretty({ colorize: true, sync: true }) },
    ]),
  );

  return {
    env: "test",
    isCi,
    config,
    db,
    logger,
  };
}

async function startTestServers() {
  const templateDb = await prepareTestDatabase();

  // To avoid concurrently recreating databases, we'll implement concurrency control using a queue and a single worker
  // (Concurrent recreation is a problem, because Postgres only allows one connection to a template database at a time)
  const resetQueue: [number, () => void][] = [];

  (async () => {
    while (true) {
      if (resetQueue.length > 0) {
        // rome-ignore lint/style/noNonNullAssertion: guaranteed to succeed by length check
        const [index, callback] = resetQueue.shift()!;
        console.log(`Resetting database ${index}`);
        await recreateDatabase(templateDb, index);
        callback();
      } else {
        await new Promise((resolve) => setTimeout(resolve, 5));
      }
    }
  })();

  console.log(`Starting ${TEST_INSTANCES} test server instances`);

  for (let i = 0; i < TEST_INSTANCES; i++) {
    const context = await createTestContext(i);
    await createServer(context, (server) => {
      // Test API uses an RPC-like interface, with a single endpoint
      const testApiEndpoint: Route<Response.Ok<void | string> | Response.BadRequest<string>> = route
        .post("/")
        .use(Parser.body(TestApiCommand))
        .handler(async (req) => {
          switch (req.body.kind) {
            case "database-reset":
              // Disconnect from the database so that we can reset it
              await context.db.$disconnect();

              // Push a reset request to the queue and wait for it to be processed
              await new Promise<void>((resolve) => {
                resetQueue.push([i, resolve]);
              });

              return Response.ok();
            case "foo":
              console.log("foo");
              return Response.ok();
          }
        });

      const testRouter = router(testApiEndpoint);
      server.use("/test-api", testRouter.handler());
    });
  }

  console.log("Test servers started, starting health check server");

  // The health check server is used to signal to Playwright that the test servers are ready
  await new Promise((resolve) => {
    const server = express();
    server.get("/", (_, res) => {
      res.send("OK");
    });

    server.listen(TEST_SERVER_HEALTH_CHECK_PORT, () => {
      console.log(`Health check server listening on port ${TEST_SERVER_HEALTH_CHECK_PORT}`);
      resolve(undefined);
    });
  });
}

startTestServers().catch((err) => {
  console.error("Error starting test servers", err);
  process.exit(1);
});
