import crypto from "node:crypto";

import { redis } from "../../redis";

export async function createSession(userId: number, rememberMe = false) {
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
