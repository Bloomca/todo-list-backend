import { type FastifyInstance } from "fastify";
import { Type, Static } from "@sinclair/typebox";

import { deleteProjectWithData } from "../services/project";
import { getUserIdFromRequest } from "../middleware/auth";
import { NotFoundError, BadRequestError } from "../errors/errors";
import {
  getProjectAndVerify,
  updateProjectWithData,
} from "../services/project/index";
import {
  createProjectInDB,
  getUserProjects,
  updateProject,
} from "../repositories/project";
import {
  type CreateProjectQuery,
  CreateProjectQuerySchema,
  type UpdateProjectQuery,
  UpdateProjectQuerySchema,
} from "../types/queries/project";
import {
  type CreateProjectResponse,
  CreateProjectResponseSchema,
  type GetProjectsResponse,
  GetProjectsResponseSchema,
  type GetProjectResponse,
  GetProjectResponseSchema,
} from "../types/responses/project";

export function addProjectRoutes(fastify: FastifyInstance) {
  addProjectCreateRoute(fastify);
  addProjectsGetRoute(fastify);
  addProjectGetRoute(fastify);
  addProjectDeleteRoute(fastify);
  addProjectUpdateRoute(fastify);
}

function addProjectCreateRoute(fastify: FastifyInstance) {
  fastify.post<{
    Body: CreateProjectQuery;
    Reply: { 201: CreateProjectResponse };
  }>(
    "/projects",
    {
      schema: {
        body: CreateProjectQuerySchema,
        response: {
          201: CreateProjectResponseSchema,
        },
      },
    },
    async function handler(request, reply) {
      const userId = getUserIdFromRequest(request);

      const project = await createProjectInDB({
        name: request.body.name,
        description: request.body.description,
        userId,
      });

      reply.code(201).send(project);
    }
  );
}

function addProjectsGetRoute(fastify: FastifyInstance) {
  fastify.get<{
    Reply: { 200: GetProjectsResponse };
  }>(
    "/projects",
    {
      schema: {
        response: {
          200: GetProjectsResponseSchema,
        },
      },
    },
    async function handler(request, reply) {
      const userId = getUserIdFromRequest(request);
      const projects = await getUserProjects(userId);
      reply.code(200).send(projects);
    }
  );
}

const ParamsSchema = Type.Object({
  projectId: Type.Number(),
});

type Params = Static<typeof ParamsSchema>;

function addProjectGetRoute(fastify: FastifyInstance) {
  fastify.get<{
    Params: Params;
    Reply: { 200: GetProjectResponse };
  }>(
    "/projects/:projectId",
    {
      schema: {
        params: ParamsSchema,
        response: {
          200: GetProjectResponseSchema,
        },
      },
    },
    async function handler(request, reply) {
      const userId = getUserIdFromRequest(request);
      const projectId = request.params.projectId;
      const project = await getProjectAndVerify(projectId, userId);

      reply.code(200).send(project);
    }
  );
}

function addProjectDeleteRoute(fastify: FastifyInstance) {
  fastify.delete<{
    Params: Params;
    Reply: { 204: null };
  }>(
    "/projects/:projectId",
    {
      schema: {
        params: ParamsSchema,
        response: { 204: { type: "null" } },
      },
    },
    async function handler(request, reply) {
      const userId = getUserIdFromRequest(request);
      const projectId = request.params.projectId;
      await getProjectAndVerify(projectId, userId);
      await deleteProjectWithData(projectId);

      reply.code(204).send();
    }
  );
}

function addProjectUpdateRoute(fastify: FastifyInstance) {
  fastify.put<{
    Params: Params;
    Body: UpdateProjectQuery;
    Reply: { 204: null };
  }>(
    "/projects/:projectId",
    {
      schema: {
        params: ParamsSchema,
        body: UpdateProjectQuerySchema,
        response: { 204: { type: "null" } },
      },
    },
    async function handler(request, reply) {
      const userId = getUserIdFromRequest(request);
      const projectId = request.params.projectId;
      const project = await getProjectAndVerify(projectId, userId);
      const isEmpty = Object.keys(request.body).length === 0;
      if (isEmpty) {
        throw new BadRequestError("No updated project fields");
      }
      const wasUpdated = await updateProjectWithData(project, request.body);

      if (!wasUpdated) {
        // this should be handled earlier, so just to be safe
        throw new NotFoundError();
      }

      reply.code(204).send();
    }
  );
}
