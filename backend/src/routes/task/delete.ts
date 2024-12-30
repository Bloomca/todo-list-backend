import { type FastifyInstance } from "fastify";
import { Type, Static } from "@sinclair/typebox";

import { deleteTask } from "../../repositories/task";
import { getTaskAndVerify } from "../../services/task";
import { getUserIdFromRequest } from "../../middleware/auth";

const ParamsSchema = Type.Object({
  taskId: Type.Number(),
});

type Params = Static<typeof ParamsSchema>;

export function addTaskDeleteRoute(fastify: FastifyInstance) {
  fastify.delete<{
    Params: Params;
    Reply: { 204: null };
  }>(
    "/tasks/:taskId",
    { schema: { params: ParamsSchema, response: { 204: { type: "null" } } } },
    async function handler(request, reply) {
      const taskId = request.params.taskId;
      const userId = getUserIdFromRequest(request);
      await getTaskAndVerify(taskId, userId);

      await deleteTask(taskId);

      reply.code(204).send();
    }
  );
}
