import { type FastifyInstance } from "fastify";

import { createTaskInDB } from "../../repositories/task";
import { getProjectFromDB } from "../../repositories/project";
import { getSectionById } from "../../repositories/section";
import { getUserIdFromRequest } from "../../middleware/auth";
import { BadRequestError, ConflictError } from "../../errors/errors";
import {
  type CreateTaskQuery,
  CreateTaskQuerySchema,
} from "../../types/queries/task";
import {
  type CreateTaskResponse,
  CreateTaskResponseSchema,
} from "../../types/responses/task";

export function addTaskCreateRoute(fastify: FastifyInstance) {
  fastify.post<{
    Body: CreateTaskQuery;
    Reply: { 201: CreateTaskResponse };
  }>(
    "/tasks",
    {
      schema: {
        body: CreateTaskQuerySchema,
        response: {
          201: CreateTaskResponseSchema,
        },
      },
    },
    async function handler(request, reply) {
      const userId = getUserIdFromRequest(request);
      const project = await getProjectFromDB(request.body.project_id);

      if (!project || project.creator_id !== userId) {
        throw new BadRequestError(
          "Project id either does not exist or you don't have access to it"
        );
      }

      if (project.is_archived) {
        throw new ConflictError("Cannot create tasks in archived projects");
      }

      if (request.body.section_id) {
        const section = await getSectionById(request.body.section_id);

        if (!section || section.creator_id !== userId) {
          throw new BadRequestError(
            "Section id either does not exist or you don't have access to it"
          );
        }

        if (section.is_archived) {
          throw new ConflictError("Cannot create tasks in archived sections");
        }
      }

      const task = await createTaskInDB({
        project_id: request.body.project_id,
        section_id: request.body.section_id,
        name: request.body.name,
        description: request.body.description,
        userId,
        display_order: request.body.display_order,
      });

      reply.code(201).send(task);
    }
  );
}
