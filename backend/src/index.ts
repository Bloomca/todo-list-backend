import Fastify from "fastify";

import { signup } from "./services/auth/index";

async function applyMigrations() {
  // pass
}

// Define the JSON schema for request body validation
const userSchema = {
  type: "object",
  required: ["username", "password"],
  properties: {
    username: { type: "string", minLength: 3 },
    password: { type: "string", minLength: 3 },
  },
};

// Route configuration with schema validation
const opts = {
  schema: {
    body: userSchema,
    response: {
      201: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          id: { type: "string" },
          message: { type: "string" },
        },
      },
    },
  },
};

async function startServer() {
  const fastify = Fastify({ logger: true });

  fastify.get("/health", async function handler(request, reply) {
    reply.status(200).send({ status: "ok" });
  });

  fastify.post("/signup", opts, async function handler(request, reply) {
    try {
      await signup(request.body as { username: string; password: string });
      reply.code(201);
    } catch (e) {
      reply.status(500);
    }
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

async function main() {
  await applyMigrations();
  await startServer();
}

main();
