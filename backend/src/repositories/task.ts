import { pool, prepareInsertQuery } from "../db";

import type { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import type { Task } from "../types/entities/task";

export async function createTaskInDB({
  project_id,
  section_id = null,
  name,
  description = "",
  userId,
}: {
  project_id: number;
  section_id?: number | null;
  name: string;
  description?: string;
  userId: number;
}) {
  const { query, params } = prepareInsertQuery("tasks", {
    project_id,
    section_id,
    name,
    description,
    is_completed: false,
    is_archived: false,
    creator_id: userId,
  });
  const [results] = await pool.execute<ResultSetHeader>(query, params);
  const [tasks] = await pool.execute<RowDataPacket[]>(
    "SELECT * FROM tasks WHERE id=?",
    [results.insertId]
  );

  return tasks[0] as Task;
}

export async function getProjectTasks(projectId: number) {
  const [tasks] = await pool.execute<RowDataPacket[]>(
    "SELECT * FROM tasks WHERE project_id=?",
    [projectId]
  );

  return tasks as Task[];
}
