import bodyParser from "body-parser";
import express from "express";
import { expenseGroupApi } from "./expenseGroupApi.js";
import { membersApi } from "./memberApi.js";
import basicAuth from "express-basic-auth";

const port = process.env.BACKEND_PORT ?? 3001;

const basicAuthUser = process.env.BASIC_AUTH_USER;
const basicAuthPassword = process.env.BASIC_AUTH_PASSWORD;

const server = express();
server.use(bodyParser.json());

if (basicAuthUser && basicAuthPassword) {
  console.log(`Basic auth enabled for user ${basicAuthUser}`);
  server.use(
    basicAuth({
      users: { [basicAuthUser]: basicAuthPassword },
      challenge: Boolean(basicAuthUser && basicAuthPassword),
    }),
  );
} else {
  if (process.env.NODE_ENV === "production") {
    console.warn(
      "Basic auth is not enabled. Please set BASIC_AUTH_USER and BASIC_AUTH_PASSWORD environment variables.",
    );
  }
}

server.get("/api/health", (_, res) => {
  res.send("OK");
});

server.use("/api", expenseGroupApi.handler());
server.use("/api", membersApi.handler());

server.listen(port, () => {
  console.log(`Server is running in port http://localhost:${port}`);
});
