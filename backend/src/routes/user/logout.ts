import { type FastifyInstance } from "fastify";

import { destroySession } from "../../services/auth";
import { getSessionToken } from "../../middleware/auth";

export function addLogoutUserRoute(fastify: FastifyInstance) {
  fastify.post<{
    Reply: { 204: null };
  }>(
    "/logout",
    {
      schema: {
        response: { 204: { type: "null" } },
      },
    },
    async function handler(request, reply) {
      const token = getSessionToken(request);
      if (token) {
        await destroySession(token);
      }
      reply.code(204).send();
    }
  );
}
