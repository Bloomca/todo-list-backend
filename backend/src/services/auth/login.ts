import bcrypt from "bcrypt";

import { AuthError } from "../../errors/errors";
import { getUserByUsername } from "../../repositories/user";
import { createSession } from "./session";

export async function login({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  const userData = await getUserByUsername(username);

  if (userData === null) {
    throw new AuthError();
  }

  const hasCorrectPassword = await bcrypt.compare(
    password,
    userData.hashedPassword
  );

  if (!hasCorrectPassword) {
    throw new AuthError();
  }

  const token = await createSession(userData.id);
  return token;
}
