import bcrypt from "bcrypt";

import { createSession } from "./session";
import { isUsernameExists, createUserInDB } from "../../repositories/user";

const SALT_ROUNDS = 10; // work factor, higher = slower but more secure

export async function signup({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  const exists = await isUsernameExists(username);

  if (exists) {
    throw new Error("username_exists");
  }

  const hashedPassword = await hashPassword(password);
  const userId = await createUserInDB(username, hashedPassword);

  const token = await createSession(userId);
  return token;
}

function hashPassword(password: string) {
  return bcrypt.hash(password, SALT_ROUNDS);
}
