import { type FastifyInstance } from "fastify";

import { createTaskInDB, getProjectTasks } from "../repositories/task";
import { getProject } from "../repositories/project";
import { getUserIdFromRequest } from "../middleware/auth";
import { BadRequestError } from "../errors/errors";
import {
  type CreateTaskQuery,
  CreateTaskQuerySchema,
  type GetTasksQuery,
  GetTasksQuerySchema,
} from "../types/queries/task";
import {
  type CreateTaskResponse,
  CreateTaskResponseSchema,
  type GetTasksResponse,
  GetTasksResponseSchema,
} from "../types/responses/task";

export function addTaskRoutes(fastify: FastifyInstance) {
  addTaskCreateRoute(fastify);
  addTasksGetRoute(fastify);
}

function addTaskCreateRoute(fastify: FastifyInstance) {
  fastify.post<{
    Body: CreateTaskQuery;
    Reply: { 201: CreateTaskResponse };
  }>(
    "/tasks",
    {
      schema: {
        body: CreateTaskQuerySchema,
        response: {
          201: CreateTaskResponseSchema,
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

      const task = await createTaskInDB({
        project_id: request.body.project_id,
        section_id: request.body.section_id,
        name: request.body.name,
        description: request.body.description,
        userId,
      });

      reply.code(201).send(task);
    }
  );
}

function addTasksGetRoute(fastify: FastifyInstance) {
  fastify.get<{
    Querystring: GetTasksQuery;
    Reply: { 200: GetTasksResponse };
  }>(
    "/tasks",
    {
      schema: {
        querystring: GetTasksQuerySchema,
        response: { 200: GetTasksResponseSchema },
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

      const tasks = await getProjectTasks(projectId);

      reply.code(200).send(tasks);
    }
  );
}
