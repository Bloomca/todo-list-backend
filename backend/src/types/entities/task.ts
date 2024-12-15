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
