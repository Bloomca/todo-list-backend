import Fastify from "fastify";

import { addUserRoutes } from "./routes/user";
import { addErrorHandlers } from "./errors/server-errors";

export async function startServer() {
  const fastify = Fastify({ logger: true });

  fastify.get("/health", async function handler(_request, reply) {
    reply.status(200).send({ status: "ok" });
  });

  addUserRoutes(fastify);
  addErrorHandlers(fastify);

  try {
    await fastify.listen({
      port: 3000,
      /**
       * Because we run this app in the Docker, we need to enable all connections.
       * By default, Fastify only allows localhost/IPv6 connections.
       * In Docker, as an isolated environment, that should be secure.
       */
      host: "0.0.0.0",
    });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}
