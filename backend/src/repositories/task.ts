import { pool, prepareInsertQuery } from "../db";

import type {
  RowDataPacket,
  ResultSetHeader,
  PoolConnection,
} from "mysql2/promise";
import type { Task, TaskUpdates } from "../types/entities/task";

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

export async function getTaskById(taskId: number): Promise<null | Task> {
  const [tasks] = await pool.execute<RowDataPacket[]>(
    "SELECT * FROM tasks WHERE id=?",
    [taskId]
  );

  if (!tasks[0]) {
    return null;
  }

  return tasks[0] as Task;
}

export async function deleteTask(taskId: number): Promise<void> {
  await pool.execute("DELETE FROM tasks WHERE id=?", [taskId]);
}

export async function deleteProjectTasks(
  projectId: number,
  trx?: PoolConnection
): Promise<void> {
  await (trx || pool).execute("DELETE FROM tasks WHERE project_id=?", [
    projectId,
  ]);
}

export async function deleteSectionTasks(
  sectionId: number,
  trx?: PoolConnection
): Promise<void> {
  await (trx || pool).execute("DELETE FROM tasks WHERE section_id=?", [
    sectionId,
  ]);
}

export async function moveSectionTasks(
  sectionId: number,
  newProjectId: number,
  trx: PoolConnection
) {
  await trx.execute("UPDATE tasks SET project_id=? WHERE section_id=?", [
    newProjectId,
    sectionId,
  ]);
}

export async function updateTaskInDB(
  taskId: number,
  taskUpdates: TaskUpdates
): Promise<boolean> {
  // Build the SET part of query and params array
  const setClause = Object.keys(taskUpdates)
    .map((key) => `${key} = ?`)
    .join(", ");
  const params = [...Object.values(taskUpdates).map((value) => value), taskId];

  const query = `
    UPDATE tasks 
    SET ${setClause}
    WHERE id = ?
  `;

  const [result] = await pool.execute<ResultSetHeader>(query, params);

  return result.affectedRows !== 0;
}

export async function archiveProjectTasks(
  projectId: number,
  trx: PoolConnection
) {
  await trx.execute("UPDATE tasks SET is_archived=? WHERE project_id=?", [
    true,
    projectId,
  ]);
}

export async function archiveSectionTasks(
  sectionId: number,
  trx: PoolConnection
) {
  await trx.execute("UPDATE tasks SET is_archived=? WHERE section_id=?", [
    true,
    sectionId,
  ]);
}
