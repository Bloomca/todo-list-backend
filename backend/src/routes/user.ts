import { type FastifyInstance } from "fastify";

import { signup, login, destroySession } from "../services/auth";
import { getSessionToken } from "../middleware/auth";
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
  addLoginUserRoute(fastify);
  addLogoutUserRoute(fastify);
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

function addLoginUserRoute(fastify: FastifyInstance) {
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

function addLogoutUserRoute(fastify: FastifyInstance) {
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
