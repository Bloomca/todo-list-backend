import { getProject } from "../../repositories/project";
import { NotFoundError, ForbiddenError } from "../../errors/errors";
import { deleteProjectTasks } from "../../repositories/task";
import { deleteProject } from "../../repositories/project";
import { executeTransaction } from "../../db";

/**
 * Delete a project and all associated entities.
 * This function DOES NOT check permissions, you
 * need to make that check before calling it.
 */
export async function deleteProjectWithData(projectId: number) {
  await executeTransaction(async function deleteProjectAndData(trx) {
    await deleteProjectTasks(projectId, trx);
    await deleteProject(projectId, trx);
  });
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
  const project = await getProject(projectId);

  if (!project) {
    throw new NotFoundError();
  }

  if (project.creator_id !== userId) {
    throw new ForbiddenError();
  }

  return project;
}
