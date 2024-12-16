import {
  getSectionById,
  deleteSection,
  updateSectionInDB,
} from "../../repositories/section";
import {
  deleteSectionTasks,
  moveSectionTasks,
  archiveSectionTasks,
} from "../../repositories/task";
import { getProject } from "../../repositories/project";
import {
  NotFoundError,
  ForbiddenError,
  ConflictError,
} from "../../errors/errors";
import { executeTransaction } from "../../db";

import type { Section, SectionUpdates } from "../../types/entities/section";
import type { PoolConnection } from "mysql2/promise";

/**
 * Get section by sectionId, and check that:
 *
 * 1. It exists
 * 2. User is the creator, so they have permissions to use it
 *
 * This function will throw errors in case it is not available.
 */
export async function getSectionAndVerify(
  sectionId: number,
  userId: number
): Promise<Section> {
  const section = await getSectionById(sectionId);

  if (!section) {
    throw new NotFoundError();
  }

  if (section.creator_id !== userId) {
    throw new ForbiddenError();
  }

  return section;
}

export async function deleteSectionWithData(sectionId: number) {
  await executeTransaction(async (trx) => {
    await deleteSectionTasks(sectionId, trx);
    await deleteSection(sectionId, trx);
  });
}

export async function updateSection(
  section: Section,
  sectionUpdates: SectionUpdates,
  userId: number
) {
  /**
   * 1. Check if project_id changed
   *   - if yes, check the new project existence and permissions
   *   - change project_id for all section tasks
   *   - update section
   * 2. Check if it was archived
   *   - if yes, archive all section tasks
   *   - update section
   * 3. Otherwise, just update the section
   */

  if (
    sectionUpdates.project_id &&
    sectionUpdates.project_id !== section.project_id
  ) {
    const newProject = await getProject(sectionUpdates.project_id);

    if (
      !newProject ||
      newProject.creator_id !== userId ||
      newProject.is_archived
    ) {
      throw new ConflictError("Cannot move section to the new project id");
    }

    return executeTransaction(async (trx) => {
      await moveSectionTasks(section.id, newProject.id, trx);
      return updateSectionWithArchiving(section, sectionUpdates, trx);
    });
  }

  return executeTransaction(async (trx) =>
    updateSectionWithArchiving(section, sectionUpdates, trx)
  );
}

async function updateSectionWithArchiving(
  section: Section,
  sectionUpdates: SectionUpdates,
  trx: PoolConnection
) {
  if (sectionUpdates.is_archived && !section.is_archived) {
    await archiveSectionTasks(section.id, trx);
  }

  return updateSectionInDB(section.id, sectionUpdates, trx);
}
