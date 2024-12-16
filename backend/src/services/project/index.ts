import { getProjectFromDB } from "../../repositories/project";
import { NotFoundError, ForbiddenError } from "../../errors/errors";
import {
  deleteProjectTasks,
  archiveProjectTasks,
} from "../../repositories/task";
import {
  deleteProjectSectionsFromDB,
  archiveProjectSectionsInDB,
} from "../../repositories/section";
import { deleteProject, updateProject } from "../../repositories/project";
import { executeTransaction } from "../../db";

import { Project, ProjectUpdates } from "../../types/entities/project";

/**
 * Delete a project and all associated entities.
 * This function DOES NOT check permissions, you
 * need to make that check before calling it.
 */
export async function deleteProjectWithData(projectId: number) {
  await executeTransaction(async function deleteProjectAndData(trx) {
    await deleteProjectTasks(projectId, trx);
    await deleteProjectSectionsFromDB(projectId, trx);
    await deleteProject(projectId, trx);
  });
}

/**
 * Update project and correctly archive all associated entities
 * if the project is being archived.
 */
export async function updateProjectWithData(
  project: Project,
  projectUpdates: ProjectUpdates
): Promise<boolean> {
  // when we are archiving a project, we need to archive its tasks
  if (!project.is_archived && projectUpdates.is_archived === true) {
    return executeTransaction(async function archiveProjectAndData(trx) {
      await archiveProjectTasks(project.id, trx);
      await archiveProjectSectionsInDB(project.id, trx);
      return updateProject(project.id, projectUpdates, trx);
    });
  } else {
    return updateProject(project.id, projectUpdates);
  }
}

/**
 * Get project by projectId, and check that:
 *
 * 1. It exists
 * 2. User is the creator, so they have permissions to use it
 *
 * This function will throw errors in case it is not available.
 */
export async function getProjectAndVerify(projectId: number, userId: number) {
  const project = await getProjectFromDB(projectId);

  if (!project) {
    throw new NotFoundError();
  }

  if (project.creator_id !== userId) {
    throw new ForbiddenError();
  }

  return project;
}
