import { Type, Static } from "@sinclair/typebox";

export const TaskSchema = Type.Object({
  id: Type.Number(),
  project_id: Type.Number(),
  section_id: Type.Union([Type.Number(), Type.Null()]),
  name: Type.String(),
  description: Type.Optional(Type.String()),
  is_completed: Type.Boolean(),
  is_archived: Type.Boolean(),
  created_at: Type.String(),
  creator_id: Type.Number(),
});

export type Task = Static<typeof TaskSchema>;

export const TaskUpdatesSchema = Type.Object({
  project_id: Type.Optional(Type.Number()),
  section_id: Type.Optional(Type.Union([Type.Number(), Type.Null()])),
  name: Type.Optional(Type.String()),
  description: Type.Optional(Type.Optional(Type.String())),
  is_completed: Type.Optional(Type.Boolean()),
  is_archived: Type.Optional(Type.Boolean()),
});

export type TaskUpdates = Static<typeof TaskUpdatesSchema>;
