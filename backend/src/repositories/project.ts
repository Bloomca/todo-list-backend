import { pool, prepareInsertQuery } from "../db";

import type {
  RowDataPacket,
  ResultSetHeader,
  PoolConnection,
} from "mysql2/promise";
import type { Project, ProjectUpdates } from "../types/entities/project";

export async function createProjectInDB({
  name,
  description = "",
  userId,
  displayOrder,
}: {
  name: string;
  description?: string;
  userId: number;
  displayOrder?: number;
}) {
  const { query, params } = prepareInsertQuery<Partial<Project>>("projects", {
    name,
    description,
    creator_id: userId,
    archived_at: null,
    display_order: displayOrder ?? 1,
  });
  const [results] = await pool.execute<ResultSetHeader>(query, params);
  const [projects] = await pool.execute<RowDataPacket[]>(
    "SELECT * FROM projects WHERE id=?",
    [results.insertId]
  );

  return projects[0] as Project;
}

export async function getUserProjects(userId: number): Promise<Project[]> {
  const [results] = await pool.execute<RowDataPacket[]>(
    "SELECT * FROM projects WHERE creator_id=?",
    [userId]
  );

  return results as Project[];
}

export async function getProjectFromDB(
  projectId: number
): Promise<null | Project> {
  const [results] = await pool.execute<RowDataPacket[]>(
    "SELECT * FROM projects WHERE id=?",
    [projectId]
  );

  if (!results[0]) {
    return null;
  }

  return results[0] as Project;
}

export async function deleteProject(
  projectId: number,
  trx?: PoolConnection
): Promise<void> {
  await (trx ?? pool).execute("DELETE FROM projects where id=?", [projectId]);
}

export async function updateProjectInDB(
  projectId: number,
  projectUpdates: ProjectUpdates,
  trx?: PoolConnection
): Promise<boolean> {
  const { is_archived, ...regularUpdates } = projectUpdates;
  // Build the SET part of query and params array
  const setClauseParts = Object.keys(regularUpdates).map((key) => `${key} = ?`);

  if (is_archived !== undefined) {
    setClauseParts.push(
      `archived_at = ${is_archived ? "CURRENT_TIMESTAMP()" : "NULL"}`
    );
  }

  const setClause = setClauseParts.join(", ");
  const params = [
    ...Object.values(regularUpdates).map((value) => value),
    projectId,
  ];

  const query = `
    UPDATE projects 
    SET ${setClause}
    WHERE id = ?
  `;

  const [result] = await (trx ?? pool).execute<ResultSetHeader>(query, params);

  return result.affectedRows !== 0;
}
