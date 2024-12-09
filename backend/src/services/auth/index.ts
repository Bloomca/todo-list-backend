import bcrypt from "bcrypt";
import crypto from "node:crypto";

import { redis } from "../../redis";
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

async function createSession(userId: number, rememberMe = false) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + (rememberMe ? 7 : 1) * 86400000);

  await redis.set(
    `session:${token}`,
    JSON.stringify({ userId }),
    "EX",
    Math.floor((Number(expiresAt) - Date.now()) / 1000)
  );

  return token;
}

function hashPassword(password: string) {
  return bcrypt.hash(password, SALT_ROUNDS);
}
