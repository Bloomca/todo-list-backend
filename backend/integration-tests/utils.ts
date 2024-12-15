import request from "supertest";

import type { Project } from "../src/types/entities/project";
import type { Task } from "../src/types/entities/task";

const username = createRandomName();
const password = createRandomName();

/**
 * Registers a new user and returns token
 */
export async function registerUser(
  api: ReturnType<typeof request>
): Promise<string> {
  const response = await api
    .post("/signup")
    .set("Content-Type", "application/json")
    .send({ username, password })
    .expect(201);

  return response.body.token as string;
}

export async function createProject(
  api: ReturnType<typeof request>,
  token: string,
  projectName: string
): Promise<Project> {
  const response = await api
    .post("/projects")
    .set("Authorization", `Bearer ${token}`)
    .set("Content-Type", "application/json")
    .send({ name: projectName })
    .expect(201);

  return response.body as Project;
}

export async function createTask({
  api,
  token,
  projectId,
  taskName,
}: {
  api: ReturnType<typeof request>;
  token: string;
  projectId: number;
  taskName: string;
}) {
  const response = await api
    .post("/tasks")
    .set("Authorization", `Bearer ${token}`)
    .set("Content-Type", "application/json")
    .send({ project_id: projectId, name: taskName })
    .expect(201);

  return response.body as Task;
}

// create 16 random characters, should be good enough for unique names
function createRandomName() {
  const randomOffset = () => Math.floor(Math.random() * 26);

  let result = "";
  for (let i = 0; i < 16; i++) {
    result += String.fromCharCode(97 + randomOffset());
  }

  return result;
}

export function logMessage(message: string) {
  console.log("");
  console.log("==========================");
  console.log(message);
}
