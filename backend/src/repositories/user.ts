import { pool } from "../db";

import type { RowDataPacket, ResultSetHeader } from "mysql2/promise";

export async function isUsernameExists(username: string) {
  const [results] = await pool.execute<RowDataPacket[]>(
    "SELECT 1 FROM users WHERE username = ? LIMIT 1",
    [username]
  );
  return results.length === 1;
}

export async function getUserByUsername(
  username: string
): Promise<null | { id: number; hashedPassword: string }> {
  const [results] = await pool.execute<RowDataPacket[]>(
    "SELECT id, password FROM users WHERE username = ?",
    [username]
  );

  if (results.length === 0) {
    return null;
  }

  return {
    id: results[0].id,
    hashedPassword: results[0].password,
  };
}

export async function createUserInDB(username: string, password: string) {
  const [results] = await pool.execute<ResultSetHeader>(
    "INSERT INTO users (username, password) VALUES (?, ?)",
    [username, password]
  );

  return results.insertId;
}
