import { type FastifyInstance } from "fastify";
import { Type, Static } from "@sinclair/typebox";

import {
  getSectionAndVerify,
  deleteSectionWithData,
} from "../../services/section";
import { getUserIdFromRequest } from "../../middleware/auth";

const ParamsSchema = Type.Object({
  sectionId: Type.Number(),
});

type Params = Static<typeof ParamsSchema>;

export function addSectionDeleteRoute(fastify: FastifyInstance) {
  fastify.delete<{
    Params: Params;
    Reply: { 204: null };
  }>(
    "/sections/:sectionId",
    { schema: { params: ParamsSchema, response: { 204: { type: "null" } } } },
    async function handler(request, reply) {
      const sectionId = request.params.sectionId;
      const userId = getUserIdFromRequest(request);
      await getSectionAndVerify(sectionId, userId);

      await deleteSectionWithData(sectionId);

      reply.code(204).send();
    }
  );
}
