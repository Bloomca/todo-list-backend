import { type FastifyInstance } from "fastify";

import { signup } from "../services/auth/index";
import {
  CreateUserQuerySchema,
  type CreateUserQuery,
} from "../types/queries/user";
import {
  CreateUserResponseSchema,
  type CreateUserResponse,
} from "../types/responses/user";

export function addUserRoutes(fastify: FastifyInstance) {
  addCreateUserRoute(fastify);
}

function addCreateUserRoute(fastify: FastifyInstance) {
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
      try {
        const token = await signup(request.body);
        reply.code(201).send({ token });
      } catch (e) {
        console.error("error during signing up:", e);
        reply.status(500);
      }
    }
  );
}
