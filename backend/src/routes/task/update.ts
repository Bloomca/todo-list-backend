import { type FastifyInstance } from "fastify";
import { Type, Static } from "@sinclair/typebox";

import { getTaskAndVerify, updateTask } from "../../services/task";
import { getUserIdFromRequest } from "../../middleware/auth";
import { BadRequestError, NotFoundError } from "../../errors/errors";
import {
  type UpdateTaskQuery,
  UpdateTaskQuerySchema,
} from "../../types/queries/task";

const ParamsSchema = Type.Object({
  taskId: Type.Number(),
});

type Params = Static<typeof ParamsSchema>;

export function addTaskUpdateRoute(fastify: FastifyInstance) {
  fastify.put<{
    Params: Params;
    Body: UpdateTaskQuery;
    Reply: { 204: null };
  }>(
    "/tasks/:taskId",
    {
      schema: {
        params: ParamsSchema,
        body: UpdateTaskQuerySchema,
        response: { 204: { type: "null" } },
      },
    },
    async function handler(request, reply) {
      const userId = getUserIdFromRequest(request);
      const taskId = request.params.taskId;
      const task = await getTaskAndVerify(taskId, userId);

      const isEmpty = Object.keys(request.body).length === 0;
      if (isEmpty) {
        throw new BadRequestError("No updated task fields");
      }

      const wasUpdated = await updateTask({
        task,
        taskUpdates: request.body,
        userId,
      });

      if (!wasUpdated) {
        // this should be handled earlier, so just to be safe
        throw new NotFoundError();
      }

      reply.code(204).send();
    }
  );
}
