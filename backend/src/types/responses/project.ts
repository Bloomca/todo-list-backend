import { Type, Static } from "@sinclair/typebox";

export const CreateProjectResponseSchema = Type.Object({
  id: Type.Number(),
  name: Type.String(),
  description: Type.Optional(Type.String()),
  is_archived: Type.Boolean(),
  created_at: Type.String(),
  creator_id: Type.Number(),
});

export type CreateProjectResponse = Static<typeof CreateProjectResponseSchema>;
