import { createContext } from "./context.js";
import { createServer } from "./server.js";

const context = createContext();

if (context.env === "test") {
  console.error(
    "Running regular server in test environment is not allowed. Use testServer.ts for testing, or set SAITURI_ENV to development or production to run the regular server.",
  );
  process.exit(1);
}

console.log(`Starting server in ${context.env} environment`);
createServer(context);
