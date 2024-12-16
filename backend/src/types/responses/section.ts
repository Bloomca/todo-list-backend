import { Type, Static } from "@sinclair/typebox";
import { SectionSchema, type Section } from "../entities/section";

export const CreateSectionResponseSchema = SectionSchema;
export type CreateSectionResponse = Section;

export const GetProjectSectionsResponseSchema = Type.Array(SectionSchema);
export type GetProjectSectionsResponse = Static<
  typeof GetProjectSectionsResponseSchema
>;

export const GetSectionResponseSchema = SectionSchema;
export type GetSectionResponse = Static<typeof GetSectionResponseSchema>;
