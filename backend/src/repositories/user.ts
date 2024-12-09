import { pool } from "../db";

import type { RowDataPacket, ResultSetHeader } from "mysql2/promise";

export async function isUsernameExists(username: string) {
  const [results] = await pool.execute<RowDataPacket[]>(
    "SELECT 1 FROM users WHERE username = ? LIMIT 1",
    [username]
  );
  return results.length === 1;
}

export async function createUserInDB(username: string, password: string) {
  const [results] = await pool.execute<ResultSetHeader>(
    "INSERT INTO users (username, password) VALUES (?, ?)",
    [username, password]
  );

  return results.insertId;
}
