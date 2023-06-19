import { TestApiCommand, TestApiResponse } from "../src/backend/testCommon";
import { SERVER_URL } from "./url";
import axios from "axios";

async function postTestCommand<C extends TestApiCommand>(command: C): Promise<TestApiResponse<C["kind"]>> {
  const res = await axios.post(`${SERVER_URL}/test-api`, command);
  return res.data;
}

export async function resetDatabase() {
  await postTestCommand({ kind: "database-reset" });
}
