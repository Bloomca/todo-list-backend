import { type FastifyInstance } from "fastify";
import { Type, Static } from "@sinclair/typebox";

import {
  createTaskInDB,
  getProjectTasks,
  deleteTask,
} from "../repositories/task";
import { getTaskAndVerify, updateTask } from "../services/task";
import { getProject } from "../repositories/project";
import { getUserIdFromRequest } from "../middleware/auth";
import {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} from "../errors/errors";
import {
  type CreateTaskQuery,
  CreateTaskQuerySchema,
  type GetTasksQuery,
  GetTasksQuerySchema,
  type UpdateTaskQuery,
  UpdateTaskQuerySchema,
} from "../types/queries/task";
import {
  type CreateTaskResponse,
  CreateTaskResponseSchema,
  type GetTasksResponse,
  GetTasksResponseSchema,
  type GetTaskResponse,
  GetTaskResponseSchema,
} from "../types/responses/task";

export function addTaskRoutes(fastify: FastifyInstance) {
  addTaskCreateRoute(fastify);
  addTasksGetRoute(fastify);
  addTaskGetRoute(fastify);
  addTaskDeleteRoute(fastify);
  addTaskUpdateRoute(fastify);
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

const ParamsSchema = Type.Object({
  taskId: Type.Number(),
});

type Params = Static<typeof ParamsSchema>;

function addTaskGetRoute(fastify: FastifyInstance) {
  fastify.get<{
    Params: Params;
    Reply: { 200: GetTaskResponse };
  }>(
    "/tasks/:taskId",
    {
      schema: {
        params: ParamsSchema,
        response: { 200: GetTaskResponseSchema },
      },
    },
    async function handler(request, reply) {
      const taskId = request.params.taskId;
      const userId = getUserIdFromRequest(request);
      const task = await getTaskAndVerify(taskId, userId);

      reply.code(200).send(task);
    }
  );
}

function addTaskDeleteRoute(fastify: FastifyInstance) {
  fastify.delete<{
    Params: Params;
    Reply: { 204: null };
  }>(
    "/tasks/:taskId",
    { schema: { params: ParamsSchema, response: { 204: { type: "null" } } } },
    async function handler(request, reply) {
      const taskId = request.params.taskId;
      const userId = getUserIdFromRequest(request);
      await getTaskAndVerify(taskId, userId);

      await deleteTask(taskId);

      reply.code(204).send();
    }
  );
}

function addTaskUpdateRoute(fastify: FastifyInstance) {
  fastify.put<{
    Params: Params;
    Body: UpdateTaskQuery;
    Reply: { 204: null };
  }>(
    "/tasks/:taskId",
    {
      schema: {
        params: ParamsSchema,
        body: UpdateTaskQuerySchema,
        response: { 204: { type: "null" } },
      },
    },
    async function handler(request, reply) {
      const userId = getUserIdFromRequest(request);
      const taskId = request.params.taskId;
      const task = await getTaskAndVerify(taskId, userId);

      const isEmpty = Object.keys(request.body).length === 0;
      if (isEmpty) {
        throw new BadRequestError("No updated task fields");
      }

      const wasUpdated = await updateTask({
        task,
        taskUpdates: request.body,
        userId,
      });

      if (!wasUpdated) {
        // this should be handled earlier, so just to be safe
        throw new NotFoundError();
      }

      reply.code(204).send();
    }
  );
}
