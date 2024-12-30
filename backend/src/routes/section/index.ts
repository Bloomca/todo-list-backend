import { type FastifyInstance } from "fastify";

import { addSectionCreateRoute } from "./create";
import { addSectionsGetRoute } from "./getMany";
import { addSectionGetRoute } from "./getOne";
import { addSectionDeleteRoute } from "./delete";
import { addSectionUpdateRoute } from "./update";

export function addSectionRoutes(fastify: FastifyInstance) {
  addSectionCreateRoute(fastify);
  addSectionsGetRoute(fastify);
  addSectionGetRoute(fastify);
  addSectionDeleteRoute(fastify);
  addSectionUpdateRoute(fastify);
}
