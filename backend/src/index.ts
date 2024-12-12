import { applyMigrations } from "./migrations";
import { startServer } from "./server";

async function main() {
  await applyMigrations();
  await startServer();
}

main();
