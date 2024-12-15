import { expect, test, describe } from "vitest";
import request from "supertest";

import { logMessage } from "./utils";

const api = request("http://localhost:3000");

describe("auth tests", () => {
  test("health check", async () => {
    const response = await api.get("/health");
    expect(response.statusCode).toBe(200);
  });

  test("can create a new user and log in", async () => {
    logMessage("signing up");
    const username = createRandomName();
    const password = createRandomName();
    const response = await api
      .post("/signup")
      .set("Content-Type", "application/json")
      .send({ username, password })
      .expect(201);

    expect(response.body).toHaveProperty("token");
    expect(typeof response.body.token).toBe("string");

    logMessage("logging in");
    const loginResponse = await api
      .post("/login")
      .set("Content-Type", "application/json")
      .send({ username, password })
      .expect(200);

    expect(loginResponse.body).toHaveProperty("token");
    expect(typeof loginResponse.body.token).toBe("string");

    logMessage("logging out");
    await api
      .post("/logout")
      .set("Authorization", `Bearer ${loginResponse.body.token}`)
      .expect(204);

    await api
      .get("/projects")
      .set("Authorization", `Bearer ${loginResponse.body.token}`)
      .expect(401);
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
