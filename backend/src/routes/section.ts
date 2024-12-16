import { type FastifyInstance } from "fastify";
import { Type, Static } from "@sinclair/typebox";

import { createSectionInDB, getProjectSections } from "../repositories/section";
import {
  getSectionAndVerify,
  deleteSectionWithData,
  updateSection,
} from "../services/section";
import { getProject } from "../repositories/project";
import { getUserIdFromRequest } from "../middleware/auth";
import { BadRequestError, NotFoundError } from "../errors/errors";
import {
  type CreateSectionQuery,
  CreateSectionQuerySchema,
  type GetProjectSectionsQuery,
  GetProjectSectionsQuerySchema,
  type UpdateSectionQuery,
  UpdateSectionQuerySchema,
} from "../types/queries/section";
import {
  type CreateSectionResponse,
  CreateSectionResponseSchema,
  type GetProjectSectionsResponse,
  GetProjectSectionsResponseSchema,
  type GetSectionResponse,
  GetSectionResponseSchema,
} from "../types/responses/section";

export function addSectionRoutes(fastify: FastifyInstance) {
  addSectionCreateRoute(fastify);
  addSectionsGetRoute(fastify);
  addSectionGetRoute(fastify);
  addSectionDeleteRoute(fastify);
  addSectionUpdateRoute(fastify);
}

function addSectionCreateRoute(fastify: FastifyInstance) {
  fastify.post<{
    Body: CreateSectionQuery;
    Reply: { 201: CreateSectionResponse };
  }>(
    "/sections",
    {
      schema: {
        body: CreateSectionQuerySchema,
        response: {
          201: CreateSectionResponseSchema,
        },
      },
    },
    async function handler(request, reply) {
      const userId = getUserIdFromRequest(request);
      const project = await getProject(request.body.project_id);

      if (!project || project.creator_id !== userId) {
        throw new BadRequestError(
          "Project id either does not exist or you don't have access to it"
        );
      }

      const section = await createSectionInDB({
        project_id: request.body.project_id,
        name: request.body.name,
        userId,
      });

      reply.code(201).send(section);
    }
  );
}

function addSectionsGetRoute(fastify: FastifyInstance) {
  fastify.get<{
    Querystring: GetProjectSectionsQuery;
    Reply: { 200: GetProjectSectionsResponse };
  }>(
    "/sections",
    {
      schema: {
        querystring: GetProjectSectionsQuerySchema,
        response: { 200: GetProjectSectionsResponseSchema },
      },
    },
    async function handler(request, reply) {
      const projectId = request.query.project_id;
      const userId = getUserIdFromRequest(request);
      const project = await getProject(projectId);

      if (!project || project.creator_id !== userId) {
        throw new BadRequestError(
          "Project id either does not exist or you don't have access to it"
        );
      }

      const sections = await getProjectSections(projectId);

      reply.code(200).send(sections);
    }
  );
}

const ParamsSchema = Type.Object({
  sectionId: Type.Number(),
});

type Params = Static<typeof ParamsSchema>;

function addSectionGetRoute(fastify: FastifyInstance) {
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

function addSectionDeleteRoute(fastify: FastifyInstance) {
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

function addSectionUpdateRoute(fastify: FastifyInstance) {
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
