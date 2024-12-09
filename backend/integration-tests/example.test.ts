import { expect, test, beforeAll, describe } from "vitest";
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

describe("sample tests", () => {
  test("health check", async () => {
    const response = await api.get("/health");
    expect(response.statusCode).toBe(200);
  });

  test("can create a new user", async () => {
    const username = createRandomName();
    const password = createRandomName();
    const response = await api
      .post("/signup")
      .set("Content-Type", "application/json")
      .send({ username, password })
      .expect(201);

    expect(response.body).toHaveProperty("token");
    expect(typeof response.body.token).toBe("string");
  });
});

// create 16 random characters, should be good enough for unique names
function createRandomName() {
  const randomOffset = () => Math.floor(Math.random() * 26);

  let result = "";
  for (let i = 0; i < 16; i++) {
    result += String.fromCharCode(97 + randomOffset());
  }

  return result;
}
