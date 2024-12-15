import { pool, prepareInsertQuery } from "../db";

import type { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import type { Project, ProjectUpdates } from "../types/entities/project";

export async function createProjectInDB({
  name,
  description = "",
  userId,
}: {
  name: string;
  description?: string;
  userId: number;
}) {
  const { query, params } = prepareInsertQuery("projects", {
    name,
    description,
    creator_id: userId,
    is_archived: false,
  });
  const [results] = await pool.execute<ResultSetHeader>(query, params);
  const [projects] = await pool.execute<RowDataPacket[]>(
    "SELECT id, name, description, is_archived, created_at, creator_id FROM projects WHERE id=?",
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

export async function getProject(projectId: number): Promise<null | Project> {
  const [results] = await pool.execute<RowDataPacket[]>(
    "SELECT * FROM projects WHERE id=?",
    [projectId]
  );

  if (!results[0]) {
    return null;
  }

  return results[0] as Project;
}

export async function deleteProject(projectId: number): Promise<void> {
  await pool.execute("DELETE FROM projects where id=?", [projectId]);
}

export async function updateProject(
  projectId: number,
  projectUpdates: ProjectUpdates
): Promise<boolean> {
  // Build the SET part of query and params array
  const setClause = Object.keys(projectUpdates)
    .map((key) => `${key} = ?`)
    .join(", ");
  const params = [
    ...Object.values(projectUpdates).map((value) => value),
    projectId,
  ];

  const query = `
    UPDATE projects 
    SET ${setClause}
    WHERE id = ?
  `;

  const [result] = await pool.execute<ResultSetHeader>(query, params);

  return result.affectedRows !== 0;
}
