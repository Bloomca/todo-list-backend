import { type FastifyInstance } from "fastify";
import { Type, Static } from "@sinclair/typebox";

import { getUserIdFromRequest } from "../../middleware/auth";
import { NotFoundError, BadRequestError } from "../../errors/errors";
import {
  getProjectAndVerify,
  updateProject,
} from "../../services/project/index";
import {
  type UpdateProjectQuery,
  UpdateProjectQuerySchema,
} from "../../types/queries/project";

const ParamsSchema = Type.Object({
  projectId: Type.Number(),
});

type Params = Static<typeof ParamsSchema>;

export function addProjectUpdateRoute(fastify: FastifyInstance) {
  fastify.put<{
    Params: Params;
    Body: UpdateProjectQuery;
    Reply: { 204: null };
  }>(
    "/projects/:projectId",
    {
      schema: {
        params: ParamsSchema,
        body: UpdateProjectQuerySchema,
        response: { 204: { type: "null" } },
      },
    },
    async function handler(request, reply) {
      const userId = getUserIdFromRequest(request);
      const projectId = request.params.projectId;
      const project = await getProjectAndVerify(projectId, userId);
      const isEmpty = Object.keys(request.body).length === 0;
      if (isEmpty) {
        throw new BadRequestError("No updated project fields");
      }
      const wasUpdated = await updateProject(project, request.body);

      if (!wasUpdated) {
        // this should be handled earlier, so just to be safe
        throw new NotFoundError();
      }

      reply.code(204).send();
    }
  );
}
