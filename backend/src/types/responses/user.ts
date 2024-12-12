import { Type, Static } from "@sinclair/typebox";

export const CreateUserResponseSchema = Type.Object({
  token: Type.String(),
});

export type CreateUserResponse = Static<typeof CreateUserResponseSchema>;

export const loginUserResponseSchema = CreateUserResponseSchema;
export type loginUserResponse = CreateUserResponse;
