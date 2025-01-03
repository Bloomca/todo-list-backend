import { Type, Static } from "@sinclair/typebox";
import { TaskUpdatesSchema } from "../entities/task";

export const CreateTaskQuerySchema = Type.Object({
  project_id: Type.Number(),
  section_id: Type.Optional(Type.Union([Type.Number(), Type.Null()])),
  name: Type.String({ minLength: 1, maxLength: 255 }),
  description: Type.Optional(Type.String({ maxLength: 255 })),
  display_order: Type.Optional(Type.Integer({ minimum: 1 })),
});

export type CreateTaskQuery = Static<typeof CreateTaskQuerySchema>;

export const GetTasksQuerySchema = Type.Object({
  project_id: Type.Number(),
});

export type GetTasksQuery = Static<typeof GetTasksQuerySchema>;

export const UpdateTaskQuerySchema = TaskUpdatesSchema;
export type UpdateTaskQuery = Static<typeof UpdateTaskQuerySchema>;
