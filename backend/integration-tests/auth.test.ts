import { expect, test, describe } from "vitest";
import request from "supertest";

const api = request("http://localhost:3000");

describe("auth tests", () => {
  test("health check", async () => {
    const response = await api.get("/health");
    expect(response.statusCode).toBe(200);
  });

  test("can create a new user and log in", async () => {
    const username = createRandomName();
    const password = createRandomName();
    const response = await api
      .post("/signup")
      .set("Content-Type", "application/json")
      .send({ username, password })
      .expect(201);

    expect(response.body).toHaveProperty("token");
    expect(typeof response.body.token).toBe("string");

    const loginResponse = await api
      .post("/login")
      .set("Content-Type", "application/json")
      .send({ username, password })
      .expect(200);

    expect(loginResponse.body).toHaveProperty("token");
    expect(typeof loginResponse.body.token).toBe("string");
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
