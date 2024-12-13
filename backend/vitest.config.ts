import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: ["./integration-tests/setup.ts"],
    environment: "node",
  },
});
