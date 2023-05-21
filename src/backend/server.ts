import bodyParser from "body-parser";
import express from "express";
import { expenseGroupApi } from "./expenseGroupApi.js";
import { membersApi } from "./memberApi.js";

const port = process.env.BACKEND_PORT ?? 3001;

const server = express();

server.use(bodyParser.json());

server.get("/", (_, res) => {
  res.send("OK");
});

server.use("/api", expenseGroupApi.handler());
server.use("/api", membersApi.handler());

server.listen(port, () => {
  console.log(`Server is running in port http://localhost:${port}`);
});
