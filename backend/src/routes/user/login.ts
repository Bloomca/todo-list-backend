import { type FastifyInstance } from "fastify";

import { login } from "../../services/auth";
import {
  loginUserQuerySchema,
  type loginUserQuery,
} from "../../types/queries/user";
import {
  loginUserResponseSchema,
  type loginUserResponse,
} from "../../types/responses/user";

export function addLoginUserRoute(fastify: FastifyInstance) {
  fastify.post<{
    Body: loginUserQuery;
    Reply: loginUserResponse;
  }>(
    "/login",
    {
      schema: {
        body: loginUserQuerySchema,
        response: {
          200: loginUserResponseSchema,
        },
      },
    },
    async function handler(request, reply) {
      const token = await login(request.body);
      reply.code(200).send({ token });
    }
  );
}
