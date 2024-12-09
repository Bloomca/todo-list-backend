import { startServer } from "./server";

async function applyMigrations() {
  // pass
}

async function main() {
  await applyMigrations();
  await startServer();
}

main();
