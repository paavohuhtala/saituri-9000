import { createContext } from "./context.js";
import { createServer } from "./server.js";

(async () => {
  const context = await createContext();

  if (context.env === "test") {
    console.error(
      "Running regular server in test environment is not allowed. Use testServer.ts for testing, or set SAITURI_ENV to development or production to run the regular server.",
    );
    process.exit(1);
  }

  context.logger.info(`Starting server in ${context.env} environment`);
  createServer(context);
})();
