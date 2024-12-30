import { updateSectionInDB } from "../../repositories/section";
import { moveSectionTasks } from "../../repositories/task";
import { getProjectFromDB } from "../../repositories/project";
import { ConflictError } from "../../errors/errors";
import { executeTransaction } from "../../db";

import type { Section, SectionUpdates } from "../../types/entities/section";
import type { PoolConnection } from "mysql2/promise";

export async function updateSection(
  section: Section,
  sectionUpdates: SectionUpdates,
  userId: number
) {
  /**
   * 1. Check if project_id changed
   *   - if yes, check the new project existence and permissions
   *   - check that the new project is not archived
   *   - change project_id for all section tasks
   *   - update section
   * 2. Check if the archiving status is being changed
   *   - check that the current project is not archived
   * 3. Otherwise, just update the section
   */

  if (
    sectionUpdates.project_id &&
    sectionUpdates.project_id !== section.project_id
  ) {
    const newProject = await getProjectFromDB(sectionUpdates.project_id);

    if (
      !newProject ||
      newProject.creator_id !== userId ||
      newProject.archived_at !== null
    ) {
      throw new ConflictError("Cannot move section to the new project id");
    }

    if (
      sectionUpdates.is_archived !== undefined &&
      sectionUpdates.is_archived !== Boolean(section.archived_at)
    ) {
      if (newProject.archived_at !== null) {
        throw new ConflictError(
          "Cannot unarchive section in an archived project"
        );
      }
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
  if (sectionUpdates.is_archived === false && section.archived_at !== null) {
    // different `project_id` was handled before
    const project = await getProjectFromDB(section.project_id);
    if (project?.archived_at !== null) {
      throw new ConflictError(
        "Cannot unarchive section in an archived project"
      );
    }
  }

  return updateSectionInDB(section.id, sectionUpdates, trx);
}
