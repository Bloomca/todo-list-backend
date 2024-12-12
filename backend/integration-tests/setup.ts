import { beforeAll } from "vitest";
import request from "supertest";

const api = request("http://localhost:3000");

const MAX_ATTEMPTS = 10;
const INTERVAL_BETWEEN_ATTEMPTS = 1000;

async function waitForServer(attempts = 1) {
  if (attempts > MAX_ATTEMPTS) return Promise.reject();
  return new Promise<void>(async (resolve, reject) => {
    try {
      await api.get("/health").expect(200);
      resolve();
    } catch (error: unknown) {
      await new Promise((r) => setTimeout(r, INTERVAL_BETWEEN_ATTEMPTS));
      waitForServer(attempts + 1)
        .then(resolve)
        .catch(reject);
    }
  });
}

beforeAll(async () => {
  try {
    await waitForServer();
  } catch (error: unknown) {
    console.error("Server is not available, terminating tests");
    process.exit(1); // Exit with error code 1
  }
});
