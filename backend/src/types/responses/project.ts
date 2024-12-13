import { Type, Static } from "@sinclair/typebox";
import { ProjectSchema, type Project } from "../entities/project";

export const CreateProjectResponseSchema = ProjectSchema;
export type CreateProjectResponse = Project;

export const GetProjectsResponseSchema = Type.Array(ProjectSchema);
export type GetProjectsResponse = Static<typeof GetProjectsResponseSchema>;

export const GetProjectResponseSchema = ProjectSchema;
export type GetProjectResponse = Project;
