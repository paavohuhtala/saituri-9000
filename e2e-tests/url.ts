import { TEST_SERVER_FIRST_PORT } from "../src/backend/testCommon";

const workerIndex = parseInt(process.env.TEST_PARALLEL_INDEX || "0", 10);
const SERVER_PORT = TEST_SERVER_FIRST_PORT + workerIndex;

export const SERVER_URL = `http://localhost:${SERVER_PORT}`;
