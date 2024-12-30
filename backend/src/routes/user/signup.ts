import { type FastifyInstance } from "fastify";

import { signup } from "../../services/auth";
import {
  CreateUserQuerySchema,
  type CreateUserQuery,
} from "../../types/queries/user";
import {
  CreateUserResponseSchema,
  type CreateUserResponse,
} from "../../types/responses/user";

export function addSignupUserRoute(fastify: FastifyInstance) {
  fastify.post<{
    Body: CreateUserQuery;
    Reply: CreateUserResponse;
  }>(
    "/signup",
    {
      schema: {
        body: CreateUserQuerySchema,
        response: {
          201: CreateUserResponseSchema,
        },
      },
    },
    async function handler(request, reply) {
      const token = await signup(request.body);
      reply.code(201).send({ token });
    }
  );
}
