import { type FastifyInstance } from "fastify";
import { Type, Static } from "@sinclair/typebox";

import { deleteProjectWithData } from "../../services/project";
import { getUserIdFromRequest } from "../../middleware/auth";
import { getProjectAndVerify } from "../../services/project/index";

const ParamsSchema = Type.Object({
  projectId: Type.Number(),
});

type Params = Static<typeof ParamsSchema>;

export function addProjectDeleteRoute(fastify: FastifyInstance) {
  fastify.delete<{
    Params: Params;
    Reply: { 204: null };
  }>(
    "/projects/:projectId",
    {
      schema: {
        params: ParamsSchema,
        response: { 204: { type: "null" } },
      },
    },
    async function handler(request, reply) {
      const userId = getUserIdFromRequest(request);
      const projectId = request.params.projectId;
      await getProjectAndVerify(projectId, userId);
      await deleteProjectWithData(projectId);

      reply.code(204).send();
    }
  );
}
