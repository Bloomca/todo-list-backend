import { type FastifyInstance } from "fastify";

import { getUserIdFromRequest } from "../../middleware/auth";
import { getUserProjects } from "../../repositories/project";
import {
  type GetProjectsResponse,
  GetProjectsResponseSchema,
} from "../../types/responses/project";

export function addProjectsGetRoute(fastify: FastifyInstance) {
  fastify.get<{
    Reply: { 200: GetProjectsResponse };
  }>(
    "/projects",
    {
      schema: {
        response: {
          200: GetProjectsResponseSchema,
        },
      },
    },
    async function handler(request, reply) {
      const userId = getUserIdFromRequest(request);
      const projects = await getUserProjects(userId);
      reply.code(200).send(projects);
    }
  );
}
