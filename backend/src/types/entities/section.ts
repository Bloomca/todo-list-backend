import { Type, Static } from "@sinclair/typebox";

export const SectionSchema = Type.Object({
  id: Type.Number(),
  project_id: Type.Number(),
  name: Type.String(),
  is_archived: Type.Boolean(),
  created_at: Type.String(),
  creator_id: Type.Number(),
});

export type Section = Static<typeof SectionSchema>;

export const SectionUpdatesSchema = Type.Object({
  project_id: Type.Optional(Type.Number()),
  name: Type.Optional(Type.String()),
  is_archived: Type.Optional(Type.Boolean()),
});

export type SectionUpdates = Static<typeof SectionUpdatesSchema>;
