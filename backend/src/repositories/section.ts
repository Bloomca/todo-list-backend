import { pool, prepareInsertQuery } from "../db";

import type {
  RowDataPacket,
  ResultSetHeader,
  PoolConnection,
} from "mysql2/promise";
import type { Section, SectionUpdates } from "../types/entities/section";

export async function createSectionInDB({
  project_id,
  name,
  userId,
  display_order,
}: {
  project_id: number;
  name: string;
  userId: number;
  display_order: number;
}) {
  const { query, params } = prepareInsertQuery("sections", {
    project_id,
    name,
    is_archived: false,
    creator_id: userId,
    display_order,
  });
  const [results] = await pool.execute<ResultSetHeader>(query, params);
  const [sections] = await pool.execute<RowDataPacket[]>(
    "SELECT * FROM sections WHERE id=?",
    [results.insertId]
  );

  return sections[0] as Section;
}

export async function getProjectSectionsFromDB(projectId: number) {
  const [sections] = await pool.execute<RowDataPacket[]>(
    "SELECT * FROM sections WHERE project_id=?",
    [projectId]
  );

  return sections as Section[];
}

export async function getSectionById(
  sectionId: number
): Promise<null | Section> {
  const [sections] = await pool.execute<RowDataPacket[]>(
    "SELECT * FROM sections WHERE id=?",
    [sectionId]
  );

  if (!sections[0]) {
    return null;
  }

  return sections[0] as Section;
}

export async function deleteSectionFromDB(
  sectionId: number,
  trx?: PoolConnection
): Promise<void> {
  await (trx ?? pool).execute("DELETE FROM sections WHERE id=?", [sectionId]);
}

export async function updateSectionInDB(
  sectionId: number,
  sectionUpdates: SectionUpdates,
  trx?: PoolConnection
): Promise<boolean> {
  // Build the SET part of query and params array
  const setClause = Object.keys(sectionUpdates)
    .map((key) => `${key} = ?`)
    .join(", ");
  const params = [
    ...Object.values(sectionUpdates).map((value) => value),
    sectionId,
  ];

  const query = `
    UPDATE sections 
    SET ${setClause}
    WHERE id = ?
  `;

  const [result] = await (trx ?? pool).execute<ResultSetHeader>(query, params);

  return result.affectedRows !== 0;
}

export async function deleteProjectSectionsFromDB(
  projectId: number,
  trx: PoolConnection
): Promise<void> {
  await trx.execute("DELETE FROM sections WHERE project_id=?", [projectId]);
}

export async function archiveProjectSectionsInDB(
  projectId: number,
  trx: PoolConnection
) {
  await trx.execute("UPDATE sections SET is_archived=? WHERE project_id=?", [
    true,
    projectId,
  ]);
}
