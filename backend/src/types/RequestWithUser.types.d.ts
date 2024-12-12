import type { FastifyRequest } from "fastify";

export type FastifyRequestWithUser = FastifyRequest & { userId: number };
