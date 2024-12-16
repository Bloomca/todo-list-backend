import {
  getProjectSectionsFromDB,
  getSectionById,
} from "../../repositories/section";
import { getProjectFromDB } from "../../repositories/project";
import {
  NotFoundError,
  ForbiddenError,
  BadRequestError,
} from "../../errors/errors";

import type { Section } from "../../types/entities/section";

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

export async function getProjectSections({
  projectId,
  userId,
}: {
  projectId: number;
  userId: number;
}) {
  const project = await getProjectFromDB(projectId);

  if (!project || project.creator_id !== userId) {
    throw new BadRequestError(
      "Project id either does not exist or you don't have access to it"
    );
  }

  return getProjectSectionsFromDB(projectId);
}
