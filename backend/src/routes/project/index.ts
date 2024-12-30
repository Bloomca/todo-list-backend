import { type FastifyInstance } from "fastify";

import { addProjectCreateRoute } from "./create";
import { addProjectsGetRoute } from "./getMany";
import { addProjectGetRoute } from "./getOne";
import { addProjectDeleteRoute } from "./delete";
import { addProjectUpdateRoute } from "./update";

export function addProjectRoutes(fastify: FastifyInstance) {
  addProjectCreateRoute(fastify);
  addProjectsGetRoute(fastify);
  addProjectGetRoute(fastify);
  addProjectDeleteRoute(fastify);
  addProjectUpdateRoute(fastify);
}
