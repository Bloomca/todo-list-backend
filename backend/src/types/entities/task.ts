import { Type, Static } from "@sinclair/typebox";

export const TaskSchema = Type.Object({
  id: Type.Number(),
  project_id: Type.Number(),
  section_id: Type.Union([Type.Number(), Type.Null()]),
  name: Type.String(),
  description: Type.Optional(Type.String()),
  completed_at: Type.Union([Type.String(), Type.Null()]),
  display_order: Type.Number(),
  created_at: Type.String(),
  creator_id: Type.Number(),
});

export type Task = Static<typeof TaskSchema>;

export const TaskUpdatesSchema = Type.Object({
  project_id: Type.Optional(Type.Number()),
  section_id: Type.Optional(Type.Union([Type.Number(), Type.Null()])),
  name: Type.Optional(Type.String()),
  description: Type.Optional(Type.Optional(Type.String())),
  display_order: Type.Optional(Type.Integer({ minimum: 1 })),
  is_completed: Type.Optional(Type.Boolean()),
});

export type TaskUpdates = Static<typeof TaskUpdatesSchema>;
