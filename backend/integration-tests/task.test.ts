import { expect, test, describe } from "vitest";
import request from "supertest";

import { createProject, registerUser, logMessage } from "./utils";

const api = request("http://localhost:3000");

describe("tasks tests", () => {
  test("can perform various task operations", async () => {
    const token = await registerUser(api);
    const project = await createProject(api, token, "books");

    logMessage("creating a new task");
    const response = await api
      .post("/tasks")
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "application/json")
      .send({ project_id: project.id, name: "First task" })
      .expect(201);

    expect(response.body.name).toBe("First task");
    expect(response.body.project_id).toBe(project.id);
    expect(response.body.section_id).toBe(null);
  });
});
