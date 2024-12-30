import { type FastifyInstance } from "fastify";

import { getProjectSections } from "../../services/section";
import { getUserIdFromRequest } from "../../middleware/auth";
import {
  type GetProjectSectionsQuery,
  GetProjectSectionsQuerySchema,
} from "../../types/queries/section";
import {
  type GetProjectSectionsResponse,
  GetProjectSectionsResponseSchema,
} from "../../types/responses/section";

export function addSectionsGetRoute(fastify: FastifyInstance) {
  fastify.get<{
    Querystring: GetProjectSectionsQuery;
    Reply: { 200: GetProjectSectionsResponse };
  }>(
    "/sections",
    {
      schema: {
        querystring: GetProjectSectionsQuerySchema,
        response: { 200: GetProjectSectionsResponseSchema },
      },
    },
    async function handler(request, reply) {
      const projectId = request.query.project_id;
      const userId = getUserIdFromRequest(request);
      const sections = await getProjectSections({ projectId, userId });

      reply.code(200).send(sections);
    }
  );
}
