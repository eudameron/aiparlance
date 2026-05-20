/**
 * Production Astro config for aiparlance.org
 *
 * Usage:
 *   npm run build:prod
 *   # or: astro build --config astro.config-sample.mjs
 *
 * Deploy the contents of dist/ to the domain root (not a subfolder).
 */
import { defineConfig } from "astro/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  site: "https://aiparlance.org",
  base: "/",
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
