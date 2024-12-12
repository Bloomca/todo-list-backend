import { AuthError } from "../errors/errors";
import { getSessionUserId } from "../services/auth/session";

import type { FastifyRequest } from "fastify";

export async function checkAuthentication(request: FastifyRequest) {
  const token = request.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    throw new AuthError(
      "Authentication is required to perform this operation."
    );
  }

  const userId = await getSessionUserId(token);

  if (!userId) {
    throw new AuthError("Your token is invalid or expired.");
  }

  // @ts-expect-error all other handlers will use correct request type
  request.userId = userId;
}
