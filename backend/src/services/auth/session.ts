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

export function destroySession(token: string) {
  return redis.del(`session:${token}`);
}

export async function getSessionUserId(token: string): Promise<null | number> {
  const sessionData = await redis.get(`session:${token}`);

  // Session not found or expired
  if (!sessionData) {
    return null;
  }

  const { userId } = JSON.parse(sessionData) as { userId: number };
  return userId;
}
