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
  display_order,
}: {
  project_id: number;
  section_id?: number | null;
  name: string;
  description?: string;
  userId: number;
  display_order?: number;
}) {
  const { query, params } = prepareInsertQuery<Partial<Task>>("tasks", {
    project_id,
    section_id,
    name,
    description,
    completed_at: null,
    creator_id: userId,
    display_order: display_order ?? 1,
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
  const { is_completed, ...regularUpdates } = taskUpdates;
  // Build the SET part of query and params array
  const setClauseParts = Object.keys(regularUpdates).map((key) => `${key} = ?`);

  if (is_completed !== undefined) {
    setClauseParts.push(
      `completed_at = ${is_completed ? "CURRENT_TIMESTAMP()" : "NULL"}`
    );
  }

  const setClause = setClauseParts.join(", ");
  const params = [
    ...Object.values(regularUpdates).map((value) => value),
    taskId,
  ];

  const query = `
    UPDATE tasks 
    SET ${setClause}
    WHERE id = ?
  `;

  const [result] = await pool.execute<ResultSetHeader>(query, params);

  return result.affectedRows !== 0;
}
