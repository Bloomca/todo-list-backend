import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

import { pool } from "./db";

import type { RowDataPacket } from "mysql2/promise";

export async function applyMigrations() {
  try {
    console.log();
    console.log("=====");
    console.log("starting migrations");
    await _applyMigrations();
    console.log("=====");
    console.log();
  } catch (error: unknown) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

export async function _applyMigrations() {
  console.log("reading migrations directory");
  const directoryPath = path.join(__dirname, "..", "db", "migrations");
  const migrationFiles = await readdir(directoryPath);

  if (migrationFiles.length === 0) {
    console.log("no migration files found");
    return;
  }

  const [appliedMigrations] = await pool.query<RowDataPacket[]>(
    "SELECT name FROM migrations"
  );

  const newMigrations = migrationFiles
    .filter((fileName) => fileName.endsWith(".sql"))
    .filter((fileName) => {
      const nameWithoutExtension = fileName.slice(0, -4);
      const isAlreadyApplied = appliedMigrations.some(
        ({ name }) => name === nameWithoutExtension
      );
      return !isAlreadyApplied;
    });

  if (newMigrations.length === 0) {
    console.log("no new migration files found");
    return;
  }

  for (const fileName of newMigrations) {
    console.log();
    const nameWithoutExtension = fileName.slice(0, -4);
    console.log("applying migration: ", nameWithoutExtension);
    const sql = await readFile(path.join(directoryPath, fileName), "utf8");
    await runMigration(sql, nameWithoutExtension);
    console.log("migration successful");
  }

  console.log("migrations applied successfully");
}

async function runMigration(migrationSQL: string, migrationName: string) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    await connection.query(migrationSQL);
    await connection.query("INSERT INTO migrations (name) VALUES (?)", [
      migrationName,
    ]);
    await connection.commit();
  } catch (error: unknown) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
