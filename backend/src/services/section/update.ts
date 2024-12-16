import { updateSectionInDB } from "../../repositories/section";
import { moveSectionTasks, archiveSectionTasks } from "../../repositories/task";
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
   *   - change project_id for all section tasks
   *   - update section
   * 2. Check if it was archived
   *   - if yes, archive all section tasks
   *   - update section
   * 3. Check if it was unarchived
   * 4. Otherwise, just update the section
   */

  if (
    sectionUpdates.project_id &&
    sectionUpdates.project_id !== section.project_id
  ) {
    const newProject = await getProjectFromDB(sectionUpdates.project_id);

    if (
      !newProject ||
      newProject.creator_id !== userId ||
      newProject.is_archived
    ) {
      throw new ConflictError("Cannot move section to the new project id");
    }

    if (sectionUpdates.is_archived === false && section.is_archived === true) {
      if (newProject.is_archived) {
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
  if (sectionUpdates.is_archived && !section.is_archived) {
    await archiveSectionTasks(section.id, trx);
  }

  if (sectionUpdates.is_archived === false && section.is_archived === true) {
    // different `project_id` was handled before
    const project = await getProjectFromDB(section.project_id);
    if (project?.is_archived) {
      throw new ConflictError(
        "Cannot unarchive section in an archived project"
      );
    }
  }

  return updateSectionInDB(section.id, sectionUpdates, trx);
}
