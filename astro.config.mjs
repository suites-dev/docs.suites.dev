import { defineConfig } from "astro/config";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import expressiveCode, { ExpressiveCodeTheme } from "astro-expressive-code";
import remarkGfm from "remark-gfm";

const suitesCodeTheme = ExpressiveCodeTheme.fromJSONString(
  fs.readFileSync(
    fileURLToPath(
      new URL("./src/styles/suites-code-theme.json", import.meta.url),
    ),
    "utf-8",
  ),
);

export default defineConfig({
  site: "https://suites.dev",
  // The live site is slash-canonical. Netlify Pretty URLs serves and
  // redirects to that form, so links, canonical tags and the sitemap have
  // to agree with it or every page redirects away from its own canonical URL.
  trailingSlash: "always",
  output: "static",
  vite: {
    server: {
      allowedHosts: ["7fcf-77-125-115-106.ngrok-free.app"],
    },
  },
  integrations: [
    expressiveCode({
      themes: [suitesCodeTheme],
      styleOverrides: {
        // intentionally empty; tokens live in src/styles/tokens.css.
      },
    }),
    mdx({
      remarkPlugins: [remarkGfm],
    }),
    react(),
    sitemap(),
  ],
});
