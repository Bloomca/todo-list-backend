import { Type, Static } from "@sinclair/typebox";
import { SectionUpdatesSchema } from "../entities/section";

export const CreateSectionQuerySchema = Type.Object({
  project_id: Type.Number(),
  name: Type.String({ minLength: 1, maxLength: 255 }),
  display_order: Type.Optional(Type.Integer({ minimum: 1 })),
});

export type CreateSectionQuery = Static<typeof CreateSectionQuerySchema>;

export const GetProjectSectionsQuerySchema = Type.Object({
  project_id: Type.Number(),
});

export type GetProjectSectionsQuery = Static<
  typeof GetProjectSectionsQuerySchema
>;

export const UpdateSectionQuerySchema = SectionUpdatesSchema;
export type UpdateSectionQuery = Static<typeof UpdateSectionQuerySchema>;
