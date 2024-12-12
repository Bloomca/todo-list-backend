import { pool } from "../db";

import type { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import type { CreateProjectResponse } from "../types/responses/project";

export async function createProjectInDB({
  name,
  description = "",
  userId,
}: {
  name: string;
  description?: string;
  userId: number;
}) {
  const [results] = await pool.execute<ResultSetHeader>(
    "INSERT INTO projects (name, description, creator_id, is_archived) VALUES (?, ?, ?, ?)",
    [name, description, userId, false]
  );

  const [projects] = await pool.execute<RowDataPacket[]>(
    "SELECT id, name, description, is_archived, created_at, creator_id FROM projects WHERE id=?",
    [results.insertId]
  );

  return projects[0] as CreateProjectResponse;
}
