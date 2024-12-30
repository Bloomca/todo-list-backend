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
      display_order: 1,
    });

    expect(section1.name).toBe("First section");
    expect(section1.project_id).toBe(project.id);
    expect(section1.display_order).toBe(1);

    const section2 = await createSection({
      token,
      projectId: project.id,
      sectionName: "Second section",
      display_order: 3,
    });

    expect(section2.name).toBe("Second section");
    expect(section2.project_id).toBe(project.id);
    expect(section2.display_order).toBe(3);

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
    await api
      .put(`/sections/${section1.id}`)
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "application/json")
      .send({
        name: "Updated section name",
        is_archived: true,
        display_order: 5,
      })
      .expect(204);

    const updatedSectionResponse = await api
      .get(`/sections/${section1.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(updatedSectionResponse.body.name).toBe("Updated section name");
    expect(typeof updatedSectionResponse.body.archived_at).toBe("string");
    expect(updatedSectionResponse.body.display_order).toBe(5);
  });
});

async function createSection({
  token,
  projectId,
  sectionName,
  display_order,
}: {
  token: string;
  projectId: number;
  sectionName: string;
  display_order: number;
}) {
  const response = await api
    .post("/sections")
    .set("Authorization", `Bearer ${token}`)
    .set("Content-Type", "application/json")
    .send({ project_id: projectId, name: sectionName, display_order })
    .expect(201);

  return response.body as Section;
}
