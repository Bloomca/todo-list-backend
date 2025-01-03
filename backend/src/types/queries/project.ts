import { Type, Static } from "@sinclair/typebox";
import { ProjectUpdatesSchema } from "../entities/project";

export const CreateProjectQuerySchema = Type.Object({
  name: Type.String({ minLength: 3, maxLength: 255 }),
  description: Type.Optional(Type.String({ maxLength: 255 })),
  display_order: Type.Optional(Type.Integer({ minimum: 1 })),
});

export type CreateProjectQuery = Static<typeof CreateProjectQuerySchema>;

export const UpdateProjectQuerySchema = ProjectUpdatesSchema;
export type UpdateProjectQuery = Static<typeof UpdateProjectQuerySchema>;
