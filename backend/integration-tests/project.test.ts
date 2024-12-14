import { expect, test, describe } from "vitest";
import request from "supertest";

import { registerUser, logMessage } from "./utils";

import type { Project } from "../src/types/entities/project";

const api = request("http://localhost:3000");

describe("project tests", () => {
  test("can perform various project operations", async () => {
    const token = await registerUser(api);

    logMessage("can create projects");
    const project1 = await createProject(token, "My project");
    const project2 = await createProject(token, "Movies");
    const project3 = await createProject(token, "Books");

    logMessage("can get all projects");
    const projectsResponse = await api
      .get("/projects")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(projectsResponse.body).toContainEqual(project1);
    expect(projectsResponse.body).toContainEqual(project2);
    expect(projectsResponse.body).toContainEqual(project3);

    logMessage("can get projects by id");
    const projectResponse = await api
      .get(`/projects/${project2.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(projectResponse.body).toEqual(project2);

    logMessage("can delete projects");
    await api
      .delete(`/projects/${project3.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204);

    await api
      .get(`/projects/${project3.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(404);

    logMessage("can update projects");
    await api
      .put(`/projects/${project2.id}`)
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "application/json")
      .send({
        name: "Updated project name",
        description: "New description",
        is_archived: true,
      })
      .expect(204);

    const updatedProjectResponse = await api
      .get(`/projects/${project2.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(updatedProjectResponse.body.name).toBe("Updated project name");
    expect(updatedProjectResponse.body.description).toBe("New description");
    expect(updatedProjectResponse.body.is_archived).toBe(true);
  });
});

async function createProject(
  token: string,
  projectName: string
): Promise<Project> {
  const response = await api
    .post("/projects")
    .set("Authorization", `Bearer ${token}`)
    .set("Content-Type", "application/json")
    .send({ name: projectName })
    .expect(201);

  expect(response.body).toHaveProperty("name");
  expect(response.body.name).toBe(projectName);
  return response.body as Project;
}
