import { getProjectFromDB } from "../../repositories/project";
import { createSectionInDB } from "../../repositories/section";
import { BadRequestError, ConflictError } from "../../errors/errors";

export async function createSection({
  projectId,
  displayOrder,
  userId,
  name,
}: {
  projectId: number;
  displayOrder?: number;
  userId: number;
  name: string;
}) {
  const project = await getProjectFromDB(projectId);

  if (!project || project.creator_id !== userId) {
    throw new BadRequestError(
      "Project id either does not exist or you don't have access to it"
    );
  }

  if (project.archived_at !== null) {
    throw new ConflictError("Cannot create section in archived projects");
  }

  return createSectionInDB({
    project_id: projectId,
    name,
    userId,
    display_order: displayOrder ?? 1,
  });
}
