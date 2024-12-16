import Fastify, { type FastifyInstance } from "fastify";
import Ajv from "ajv";

import { checkAuthentication } from "./middleware/auth";
import { addUserRoutes } from "./routes/user";
import { addProjectRoutes } from "./routes/project";
import { addTaskRoutes } from "./routes/task";
import { addSectionRoutes } from "./routes/section";
import { addErrorHandlers } from "./errors/server-errors";

const schemaCompilers = {
  body: new Ajv({
    removeAdditional: false,
    // Disable coercion for request body so that `null` is not changed to `0`
    coerceTypes: false,
    allErrors: true,
  }),
  params: new Ajv({
    removeAdditional: false,
    coerceTypes: true,
    allErrors: true,
  }),
  querystring: new Ajv({
    removeAdditional: false,
    coerceTypes: true,
    allErrors: true,
  }),
  headers: new Ajv({
    removeAdditional: false,
    coerceTypes: true,
    allErrors: true,
  }),
};

export async function startServer() {
  const fastify = Fastify({ logger: true });

  fastify.setValidatorCompiler((request) => {
    if (!request.httpPart) {
      throw new Error("Missing httpPart");
    }
    // @ts-expect-error we throw an error if compiler is not defined
    const compiler = schemaCompilers[request.httpPart];
    if (!compiler) {
      throw new Error(`Missing compiler for ${request.httpPart}`);
    }
    return compiler.compile(request.schema);
  });

  fastify.get("/health", async function handler(_request, reply) {
    reply.status(200).send({ status: "ok" });
  });

  addErrorHandlers(fastify);

  addUserRoutes(fastify);

  /**
   * All routes which need authentication go here
   */
  fastify.register(function createScopedServer(scopedFastify: FastifyInstance) {
    // Add the middleware to all routes in this context
    scopedFastify.addHook("preHandler", checkAuthentication);
    addProjectRoutes(scopedFastify);
    addTaskRoutes(scopedFastify);
    addSectionRoutes(scopedFastify);
  });

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
