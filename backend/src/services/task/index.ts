import { getTaskById, updateTaskInDB } from "../../repositories/task";
import { getProjectFromDB } from "../../repositories/project";
import { getSectionById } from "../../repositories/section";
import {
  NotFoundError,
  ForbiddenError,
  ConflictError,
} from "../../errors/errors";

import type { Task, TaskUpdates } from "../../types/entities/task";
import type { Project } from "../../types/entities/project";
import type { Section } from "../../types/entities/section";

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
  let section: Section | null = null;
  const hasNewProjectId = taskUpdates.project_id !== task.project_id;
  const hasNewSectionId = taskUpdates.section_id !== task.section_id;
  if (taskUpdates.project_id && hasNewProjectId) {
    project = await getProjectFromDB(taskUpdates.project_id);

    if (!project || project.creator_id !== userId) {
      throw new ConflictError("Cannot move task to the new project id");
    }
  }

  if (taskUpdates.section_id && hasNewSectionId) {
    section = await getSectionById(taskUpdates.section_id);

    if (!section || section.creator_id !== userId) {
      throw new ConflictError("Cannot move task to the new section id");
    }
  }

  // otherwise we'd thrown an error "NotFound", so `project` should be available
  if (hasNewProjectId && project) {
    if (project.archived_at !== null) {
      throw new ConflictError("Cannot move task to the archived project");
    }
  }

  if (hasNewSectionId && taskUpdates.section_id !== null && section) {
    if (section.archived_at !== null) {
      throw new ConflictError("Cannot move task to the archived section");
    }
  }

  return updateTaskInDB(task.id, taskUpdates);
}
