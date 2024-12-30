import { Type, Static } from "@sinclair/typebox";

export const SectionSchema = Type.Object({
  id: Type.Number(),
  project_id: Type.Number(),
  name: Type.String(),
  archived_at: Type.Union([Type.String(), Type.Null()]),
  display_order: Type.Number(),
  created_at: Type.String(),
  creator_id: Type.Number(),
});

export type Section = Static<typeof SectionSchema>;

export const SectionUpdatesSchema = Type.Object({
  project_id: Type.Optional(Type.Number()),
  name: Type.Optional(Type.String()),
  is_archived: Type.Optional(Type.Boolean()),
  display_order: Type.Optional(Type.Integer({ minimum: 1 })),
});

export type SectionUpdates = Static<typeof SectionUpdatesSchema>;
