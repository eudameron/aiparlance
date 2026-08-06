import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: [
      "packages/*/src/**/*.test.ts",
      "transpilers/*/src/**/*.test.ts",
      "scripts/**/*.test.ts",
    ],
  },
});
