import { type FastifyInstance } from "fastify";
import { Type, Static } from "@sinclair/typebox";

import { getSectionAndVerify, updateSection } from "../../services/section";
import { getUserIdFromRequest } from "../../middleware/auth";
import { BadRequestError, NotFoundError } from "../../errors/errors";
import {
  type UpdateSectionQuery,
  UpdateSectionQuerySchema,
} from "../../types/queries/section";

const ParamsSchema = Type.Object({
  sectionId: Type.Number(),
});

type Params = Static<typeof ParamsSchema>;

export function addSectionUpdateRoute(fastify: FastifyInstance) {
  fastify.put<{
    Params: Params;
    Body: UpdateSectionQuery;
    Reply: { 204: null };
  }>(
    "/sections/:sectionId",
    {
      schema: {
        params: ParamsSchema,
        body: UpdateSectionQuerySchema,
        response: { 204: { type: "null" } },
      },
    },
    async function handler(request, reply) {
      const userId = getUserIdFromRequest(request);
      const sectionId = request.params.sectionId;
      const section = await getSectionAndVerify(sectionId, userId);

      const isEmpty = Object.keys(request.body).length === 0;
      if (isEmpty) {
        throw new BadRequestError("No updated task fields");
      }

      const wasUpdated = await updateSection(section, request.body, userId);

      if (!wasUpdated) {
        // this should be handled earlier, so just to be safe
        throw new NotFoundError();
      }

      reply.code(204).send();
    }
  );
}
