import { type FastifyInstance } from "fastify";
import { Type, Static } from "@sinclair/typebox";

import { getTaskAndVerify } from "../../services/task";
import { getUserIdFromRequest } from "../../middleware/auth";
import {
  type GetTaskResponse,
  GetTaskResponseSchema,
} from "../../types/responses/task";

const ParamsSchema = Type.Object({
  taskId: Type.Number(),
});

type Params = Static<typeof ParamsSchema>;

export function addTaskGetRoute(fastify: FastifyInstance) {
  fastify.get<{
    Params: Params;
    Reply: { 200: GetTaskResponse };
  }>(
    "/tasks/:taskId",
    {
      schema: {
        params: ParamsSchema,
        response: { 200: GetTaskResponseSchema },
      },
    },
    async function handler(request, reply) {
      const taskId = request.params.taskId;
      const userId = getUserIdFromRequest(request);
      const task = await getTaskAndVerify(taskId, userId);

      reply.code(200).send(task);
    }
  );
}
