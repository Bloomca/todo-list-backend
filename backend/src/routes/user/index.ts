import { type FastifyInstance } from "fastify";

import { addSignupUserRoute } from "./signup";
import { addLoginUserRoute } from "./login";
import { addLogoutUserRoute } from "./logout";

export function addUserRoutes(fastify: FastifyInstance) {
  addSignupUserRoute(fastify);
  addLoginUserRoute(fastify);
  addLogoutUserRoute(fastify);
}
