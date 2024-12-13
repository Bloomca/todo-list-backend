import { type FastifyInstance } from "fastify";

import { signup, login } from "../services/auth";
import {
  CreateUserQuerySchema,
  loginUserQuerySchema,
  type CreateUserQuery,
  type loginUserQuery,
} from "../types/queries/user";
import {
  CreateUserResponseSchema,
  loginUserResponseSchema,
  type CreateUserResponse,
  type loginUserResponse,
} from "../types/responses/user";

export function addUserRoutes(fastify: FastifyInstance) {
  addSignupUserRoute(fastify);
  aadLoginUserRoute(fastify);
}

function addSignupUserRoute(fastify: FastifyInstance) {
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

function aadLoginUserRoute(fastify: FastifyInstance) {
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
