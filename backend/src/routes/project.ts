import { type FastifyInstance } from "fastify";
import { Type, Static } from "@sinclair/typebox";

import { getUserIdFromRequest } from "../middleware/auth";
import { NotFoundError, ForbiddenError } from "../errors/errors";
import {
  createProjectInDB,
  getUserProjects,
  getProject,
  deleteProject,
} from "../repositories/project";
import {
  type CreateProjectQuery,
  CreateProjectQuerySchema,
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
}

function addProjectCreateRoute(fastify: FastifyInstance) {
  fastify.post<{
    Body: CreateProjectQuery;
    Reply: CreateProjectResponse;
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
    Reply: GetProjectsResponse;
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

// URL parameters schema
const ParamsSchema = Type.Object({
  projectId: Type.Number(),
});

type Params = Static<typeof ParamsSchema>;

function addProjectGetRoute(fastify: FastifyInstance) {
  fastify.get<{
    Params: Params;
    Reply: GetProjectResponse;
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
      const project = await getProject(projectId);

      if (!project) {
        throw new NotFoundError();
      }

      if (project.creator_id !== userId) {
        throw new ForbiddenError();
      }

      reply.code(200).send(project);
    }
  );
}

function addProjectDeleteRoute(fastify: FastifyInstance) {
  fastify.delete<{
    Params: Params;
  }>(
    "/projects/:projectId",
    {
      schema: {
        params: ParamsSchema,
      },
    },
    async function handler(request, reply) {
      const userId = getUserIdFromRequest(request);
      const projectId = request.params.projectId;
      const project = await getProject(projectId);

      if (!project) {
        throw new NotFoundError();
      }

      if (project.creator_id !== userId) {
        throw new ForbiddenError();
      }

      await deleteProject(projectId);

      reply.code(204).send();
    }
  );
}
