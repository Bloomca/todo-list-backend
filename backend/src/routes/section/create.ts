import { type FastifyInstance } from "fastify";

import { createSection } from "../../services/section";
import { getUserIdFromRequest } from "../../middleware/auth";
import {
  type CreateSectionQuery,
  CreateSectionQuerySchema,
} from "../../types/queries/section";
import {
  type CreateSectionResponse,
  CreateSectionResponseSchema,
} from "../../types/responses/section";

export function addSectionCreateRoute(fastify: FastifyInstance) {
  fastify.post<{
    Body: CreateSectionQuery;
    Reply: { 201: CreateSectionResponse };
  }>(
    "/sections",
    {
      schema: {
        body: CreateSectionQuerySchema,
        response: {
          201: CreateSectionResponseSchema,
        },
      },
    },
    async function handler(request, reply) {
      const section = await createSection({
        userId: getUserIdFromRequest(request),
        projectId: request.body.project_id,
        name: request.body.name,
        displayOrder: request.body.display_order,
      });

      reply.code(201).send(section);
    }
  );
}
