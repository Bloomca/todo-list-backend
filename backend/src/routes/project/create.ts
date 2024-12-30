import { type FastifyInstance } from "fastify";

import { getUserIdFromRequest } from "../../middleware/auth";
import { createProjectInDB } from "../../repositories/project";
import {
  type CreateProjectQuery,
  CreateProjectQuerySchema,
} from "../../types/queries/project";
import {
  type CreateProjectResponse,
  CreateProjectResponseSchema,
} from "../../types/responses/project";

export function addProjectCreateRoute(fastify: FastifyInstance) {
  fastify.post<{
    Body: CreateProjectQuery;
    Reply: { 201: CreateProjectResponse };
  }>(
    "/projects",
    {
      schema: {
        body: CreateProjectQuerySchema,
        response: {
          201: CreateProjectResponseSchema,
        },
      },
    },
    async function handler(request, reply) {
      const userId = getUserIdFromRequest(request);

      const project = await createProjectInDB({
        name: request.body.name,
        description: request.body.description,
        userId,
        displayOrder: request.body.display_order,
      });

      reply.code(201).send(project);
    }
  );
}
