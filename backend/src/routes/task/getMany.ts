import { type FastifyInstance } from "fastify";

import { getProjectTasks } from "../../repositories/task";
import { getProjectFromDB } from "../../repositories/project";
import { getUserIdFromRequest } from "../../middleware/auth";
import { BadRequestError } from "../../errors/errors";
import {
  type GetTasksQuery,
  GetTasksQuerySchema,
} from "../../types/queries/task";
import {
  type GetTasksResponse,
  GetTasksResponseSchema,
} from "../../types/responses/task";

export function addTasksGetRoute(fastify: FastifyInstance) {
  fastify.get<{
    Querystring: GetTasksQuery;
    Reply: { 200: GetTasksResponse };
  }>(
    "/tasks",
    {
      schema: {
        querystring: GetTasksQuerySchema,
        response: { 200: GetTasksResponseSchema },
      },
    },
    async function handler(request, reply) {
      const projectId = request.query.project_id;
      const userId = getUserIdFromRequest(request);
      const project = await getProjectFromDB(projectId);

      if (!project || project.creator_id !== userId) {
        throw new BadRequestError(
          "Project id either does not exist or you don't have access to it"
        );
      }

      const tasks = await getProjectTasks(projectId);

      reply.code(200).send(tasks);
    }
  );
}
