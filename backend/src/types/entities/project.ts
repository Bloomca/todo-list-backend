import { Type, Static } from "@sinclair/typebox";

export const ProjectSchema = Type.Object({
  id: Type.Number(),
  name: Type.String(),
  description: Type.Optional(Type.String()),
  archived_at: Type.Union([Type.String(), Type.Null()]),
  display_order: Type.Integer(),
  created_at: Type.String(),
  creator_id: Type.Number(),
});

export const ProjectUpdatesSchema = Type.Object({
  name: Type.Optional(Type.String()),
  description: Type.Optional(Type.Optional(Type.String())),
  is_archived: Type.Optional(Type.Boolean()),
  display_order: Type.Optional(Type.Integer({ minimum: 1 })),
});

export type Project = Static<typeof ProjectSchema>;
export type ProjectUpdates = Static<typeof ProjectUpdatesSchema>;
