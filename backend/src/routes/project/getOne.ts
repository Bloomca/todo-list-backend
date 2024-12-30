import { type FastifyInstance } from "fastify";
import { Type, Static } from "@sinclair/typebox";

import { getUserIdFromRequest } from "../../middleware/auth";
import { getProjectAndVerify } from "../../services/project/index";
import {
  type GetProjectResponse,
  GetProjectResponseSchema,
} from "../../types/responses/project";

const ParamsSchema = Type.Object({
  projectId: Type.Number(),
});

type Params = Static<typeof ParamsSchema>;

export function addProjectGetRoute(fastify: FastifyInstance) {
  fastify.get<{
    Params: Params;
    Reply: { 200: GetProjectResponse };
  }>(
    "/projects/:projectId",
    {
      schema: {
        params: ParamsSchema,
        response: {
          200: GetProjectResponseSchema,
        },
      },
    },
    async function handler(request, reply) {
      const userId = getUserIdFromRequest(request);
      const projectId = request.params.projectId;
      const project = await getProjectAndVerify(projectId, userId);

      reply.code(200).send(project);
    }
  );
}
