import { AuthError } from "../errors/errors";
import { getSessionUserId } from "../services/auth/session";

import type { FastifyRequest } from "fastify";

export async function checkAuthentication(request: FastifyRequest) {
  const token = getSessionToken(request);

  if (!token) {
    throw new AuthError(
      "Authentication is required to perform this operation."
    );
  }

  const userId = await getSessionUserId(token);

  if (!userId) {
    throw new AuthError("Your token is invalid or expired.");
  }

  // @ts-expect-error not sure how to type it properly
  request.userId = userId;
}

export function getSessionToken(request: FastifyRequest) {
  return request.headers.authorization?.replace("Bearer ", "");
}

export function getUserIdFromRequest(request: FastifyRequest) {
  // @ts-expect-error not sure how to type it properly
  return request.userId as number;
}
