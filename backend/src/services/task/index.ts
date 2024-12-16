import { getTaskById, updateTaskInDB } from "../../repositories/task";
import { getProject } from "../../repositories/project";
import {
  NotFoundError,
  ForbiddenError,
  ConflictError,
} from "../../errors/errors";

import type { Task, TaskUpdates } from "../../types/entities/task";
import type { Project } from "../../types/entities/project";

/**
 * Get task by taskId, and check that:
 *
 * 1. It exists
 * 2. User is the creator, so they have permissions to use it
 *
 * This function will throw errors in case it is not available.
 */
export async function getTaskAndVerify(taskId: number, userId: number) {
  const task = await getTaskById(taskId);

  if (!task) {
    throw new NotFoundError();
  }

  if (task.creator_id !== userId) {
    throw new ForbiddenError();
  }

  return task;
}

export async function updateTask({
  task,
  taskUpdates,
  userId,
}: {
  task: Task;
  taskUpdates: TaskUpdates;
  userId: number;
}) {
  let project: Project | null = null;
  if (taskUpdates.project_id && taskUpdates.project_id !== task.project_id) {
    project = await getProject(taskUpdates.project_id);

    if (!project || project.creator_id !== userId) {
      throw new ConflictError("Cannot move task to the new project id");
    }
  }
  if (taskUpdates.is_archived === false && task.is_archived === true) {
    if (!project) {
      project = await getProject(task.project_id);
    }
    if (project?.is_archived) {
      throw new ConflictError("Cannot unarchive task when project is archived");
    }
  }
  return updateTaskInDB(task.id, taskUpdates);
}
