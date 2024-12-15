import { Type, Static } from "@sinclair/typebox";
import { TaskSchema, type Task } from "../entities/task";

export const CreateTaskResponseSchema = TaskSchema;
export type CreateTaskResponse = Task;

export const GetTasksResponseSchema = Type.Array(TaskSchema);
export type GetTasksResponse = Static<typeof GetTasksResponseSchema>;

export const GetTaskResponseSchema = TaskSchema;
export type GetTaskResponse = Static<typeof GetTaskResponseSchema>;
