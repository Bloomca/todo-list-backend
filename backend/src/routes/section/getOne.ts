import { type FastifyInstance } from "fastify";
import { Type, Static } from "@sinclair/typebox";

import { getSectionAndVerify } from "../../services/section";
import { getUserIdFromRequest } from "../../middleware/auth";
import {
  type GetSectionResponse,
  GetSectionResponseSchema,
} from "../../types/responses/section";

const ParamsSchema = Type.Object({
  sectionId: Type.Number(),
});

type Params = Static<typeof ParamsSchema>;

export function addSectionGetRoute(fastify: FastifyInstance) {
  fastify.get<{
    Params: Params;
    Reply: { 200: GetSectionResponse };
  }>(
    "/sections/:sectionId",
    {
      schema: {
        params: ParamsSchema,
        response: { 200: GetSectionResponseSchema },
      },
    },
    async function handler(request, reply) {
      const sectionId = request.params.sectionId;
      const userId = getUserIdFromRequest(request);
      const section = await getSectionAndVerify(sectionId, userId);

      reply.code(200).send(section);
    }
  );
}
