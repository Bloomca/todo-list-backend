import { expect, test, describe } from "vitest";
import request from "supertest";

import { registerUser } from "./utils";

const api = request("http://localhost:3000");

describe("project tests", () => {
  test("can create a new project", async () => {
    const token = await registerUser(api);

    const response = await api
      .post("/projects")
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "application/json")
      .send({ name: "My project" })
      .expect(201);

    expect(response.body).toHaveProperty("name");
    expect(response.body.name).toBe("My project");
  });
});
