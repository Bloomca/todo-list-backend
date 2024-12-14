import { Type, Static } from "@sinclair/typebox";

export const ProjectSchema = Type.Object({
  id: Type.Number(),
  name: Type.String(),
  description: Type.Optional(Type.String()),
  is_archived: Type.Boolean(),
  created_at: Type.String(),
  creator_id: Type.Number(),
});

export const ProjectUpdatesSchema = Type.Object({
  name: Type.Optional(Type.String()),
  description: Type.Optional(Type.Optional(Type.String())),
  is_archived: Type.Optional(Type.Boolean()),
});

export type Project = Static<typeof ProjectSchema>;
export type ProjectUpdates = Static<typeof ProjectUpdatesSchema>;
