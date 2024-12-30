import { expect, test, describe } from "vitest";
import request from "supertest";

import { createProject, registerUser, logMessage } from "./utils";

import type { Task } from "../src/types/entities/task";

const api = request("http://localhost:3000");

describe("tasks tests", () => {
  test("can perform various task operations", async () => {
    const token = await registerUser(api);
    const project = await createProject(api, token, "books");

    logMessage("creating new tasks");
    const task1 = await createTask({
      token,
      projectId: project.id,
      taskName: "First task",
      display_order: 1,
    });

    expect(task1.name).toBe("First task");
    expect(task1.project_id).toBe(project.id);
    expect(task1.section_id).toBe(null);
    expect(task1.display_order).toBe(1);

    const task2 = await createTask({
      token,
      projectId: project.id,
      taskName: "Second task",
      display_order: 3,
    });

    expect(task2.name).toBe("Second task");
    expect(task2.project_id).toBe(project.id);
    expect(task2.section_id).toBe(null);
    expect(task2.display_order).toBe(3);

    logMessage("getting all tasks");
    const allTasksResponse = await api
      .get("/tasks")
      .query({ project_id: project.id })
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(allTasksResponse.body.length).toBe(2);
    expect(allTasksResponse.body).toContainEqual(task1);
    expect(allTasksResponse.body).toContainEqual(task2);

    logMessage("getting individual tasks");
    const firstTaskResponse = await api
      .get(`/tasks/${task1.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(firstTaskResponse.body).toEqual(task1);

    const secondTaskResponse = await api
      .get(`/tasks/${task2.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(secondTaskResponse.body).toEqual(task2);

    logMessage("can delete tasks");
    await api
      .delete(`/tasks/${task2.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204);

    await api
      .get(`/tasks/${task2.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(404);

    logMessage("can update tasks");
    await api
      .put(`/tasks/${task1.id}`)
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "application/json")
      .send({
        name: "Updated task name",
        description: "New description",
        display_order: 4,
      })
      .expect(204);

    const updatedTaskResponse = await api
      .get(`/tasks/${task1.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(updatedTaskResponse.body.name).toBe("Updated task name");
    expect(updatedTaskResponse.body.description).toBe("New description");
    expect(updatedTaskResponse.body.display_order).toBe(4);
  });
});

async function createTask({
  token,
  projectId,
  taskName,
  display_order,
}: {
  token: string;
  projectId: number;
  taskName: string;
  display_order: number;
}) {
  const response = await api
    .post("/tasks")
    .set("Authorization", `Bearer ${token}`)
    .set("Content-Type", "application/json")
    .send({ project_id: projectId, name: taskName, display_order })
    .expect(201);

  return response.body as Task;
}
