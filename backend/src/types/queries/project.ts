import { Type, Static } from "@sinclair/typebox";

export const CreateProjectQuerySchema = Type.Object({
  name: Type.String({ minLength: 3, maxLength: 255 }),
  description: Type.Optional(Type.String({ maxLength: 255 })),
});

export type CreateProjectQuery = Static<typeof CreateProjectQuerySchema>;
