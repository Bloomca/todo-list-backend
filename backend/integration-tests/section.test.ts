import { expect, test, describe } from "vitest";
import request from "supertest";

import { createProject, registerUser, createTask, logMessage } from "./utils";

import type { Section } from "../src/types/entities/section";

const api = request("http://localhost:3000");

describe("sections tests", () => {
  test("can perform various section operations", async () => {
    const token = await registerUser(api);
    const project = await createProject(api, token, "books");

    logMessage("creating new sections");
    const section1 = await createSection({
      token,
      projectId: project.id,
      sectionName: "First section",
    });

    expect(section1.name).toBe("First section");
    expect(section1.project_id).toBe(project.id);

    const section2 = await createSection({
      token,
      projectId: project.id,
      sectionName: "Second section",
    });

    expect(section2.name).toBe("Second section");
    expect(section2.project_id).toBe(project.id);

    logMessage("getting all sections");
    const allSectionsResponse = await api
      .get("/sections")
      .query({ project_id: project.id })
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(allSectionsResponse.body.length).toBe(2);
    expect(allSectionsResponse.body).toContainEqual(section1);
    expect(allSectionsResponse.body).toContainEqual(section2);

    logMessage("getting individual sections");
    const firstSectionResponse = await api
      .get(`/sections/${section1.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(firstSectionResponse.body).toEqual(section1);

    const secondSectionResponse = await api
      .get(`/sections/${section2.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(secondSectionResponse.body).toEqual(section2);

    logMessage("can delete sections");
    // create a task to make sure it is deleted as well
    const firstTask = await createTask({
      api,
      token,
      projectId: project.id,
      sectionId: section2.id,
      taskName: "first task",
    });
    await api
      .delete(`/sections/${section2.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204);

    await api
      .get(`/sections/${section2.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(404);

    await api
      .get(`/tasks/${firstTask.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(404);

    logMessage("can update sections");
    // create a task to make sure it is archived as well
    const secondTask = await createTask({
      api,
      token,
      projectId: project.id,
      sectionId: section1.id,
      taskName: "first task",
    });
    await api
      .put(`/sections/${section1.id}`)
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "application/json")
      .send({
        name: "Updated section name",
        is_archived: true,
      })
      .expect(204);

    const updatedSectionResponse = await api
      .get(`/sections/${section1.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(updatedSectionResponse.body.name).toBe("Updated section name");
    expect(updatedSectionResponse.body.is_archived).toBe(true);

    const updatedTaskResponse = await api
      .get(`/tasks/${secondTask.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(updatedTaskResponse.body.is_archived).toBe(true);
  });
});

async function createSection({
  token,
  projectId,
  sectionName,
}: {
  token: string;
  projectId: number;
  sectionName: string;
}) {
  const response = await api
    .post("/sections")
    .set("Authorization", `Bearer ${token}`)
    .set("Content-Type", "application/json")
    .send({ project_id: projectId, name: sectionName })
    .expect(201);

  return response.body as Section;
}
