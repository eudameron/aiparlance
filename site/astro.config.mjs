/**
 * Local development config (default).
 * MAMP: http://localhost:8888/dev/aiparlance.org/v1/site/dist/en/
 *
 * Production: use astro.config-sample.mjs → npm run build:prod
 */
import { defineConfig } from "astro/config";
import { fileURLToPath } from "node:url";

/** Must match the URL path under MAMP htdocs (trailing slash required). */
const LOCAL_BASE = "/dev/aiparlance.org/v1/site/dist/";

export default defineConfig({
  site: "http://localhost:8888",
  base: LOCAL_BASE,
  trailingSlash: "never",
  compressHTML: true,
  build: {
    format: "directory",
  },
  vite: {
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  },
});
