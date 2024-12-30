import { type FastifyInstance } from "fastify";

import { addTaskCreateRoute } from "./create";
import { addTasksGetRoute } from "./getMany";
import { addTaskGetRoute } from "./getOne";
import { addTaskDeleteRoute } from "./delete";
import { addTaskUpdateRoute } from "./update";

export function addTaskRoutes(fastify: FastifyInstance) {
  addTaskCreateRoute(fastify);
  addTasksGetRoute(fastify);
  addTaskGetRoute(fastify);
  addTaskDeleteRoute(fastify);
  addTaskUpdateRoute(fastify);
}
