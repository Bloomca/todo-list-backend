import bcrypt from "bcrypt";

import { isUsernameExists, createUserInDB } from "../../repositories/user";

const SALT_ROUNDS = 10; // work factor, higher = slower but more secure

export async function signup({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  /**
   * 1. check that there is no user with this username
   * 2. hash password
   * 3. insert it into DB
   * 4. create a session token
   * 5. insert into redis
   * 6. respond with it
   */

  const exists = await isUsernameExists(username);

  if (exists) {
    throw new Error("username_exists");
  }

  const hashedPassword = await hashPassword(password);

  createUserInDB(username, hashedPassword);
}

function hashPassword(password: string) {
  return bcrypt.hash(password, SALT_ROUNDS);
}
