import { Type, Static } from "@sinclair/typebox";

export const CreateUserQuerySchema = Type.Object({
  username: Type.String({ minLength: 3 }),
  password: Type.String({ minLength: 3 }),
});

export type CreateUserQuery = Static<typeof CreateUserQuerySchema>;

export const loginUserQuerySchema = CreateUserQuerySchema;
export type loginUserQuery = CreateUserQuery;
