import { AuthError } from "./errors";

import type { FastifyInstance } from "fastify";

export function addErrorHandlers(fastify: FastifyInstance) {
  fastify.setErrorHandler((error, request, reply) => {
    if (error instanceof AuthError) {
      return reply.status(error.statusCode).send({ error: error.message });
    }

    // Unexpected errors
    console.error(error);
    return reply.status(500).send({ error: "Internal server error" });
  });
}
