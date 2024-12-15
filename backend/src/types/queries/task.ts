import { Type, Static } from "@sinclair/typebox";

export const CreateTaskQuerySchema = Type.Object({
  project_id: Type.Number(),
  section_id: Type.Optional(Type.Union([Type.Number(), Type.Null()])),
  name: Type.String({ minLength: 1, maxLength: 255 }),
  description: Type.Optional(Type.String({ maxLength: 255 })),
});

export type CreateTaskQuery = Static<typeof CreateTaskQuerySchema>;
