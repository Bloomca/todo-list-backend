import Fastify from "fastify";

async function applyMigrations() {
  // pass
}

async function startServer() {
  const fastify = Fastify({ logger: true });

  fastify.get("/", async function handler(request, reply) {
    return { hello: "world" };
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
