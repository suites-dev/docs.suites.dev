import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import expressiveCode from "astro-expressive-code";
import remarkGfm from "remark-gfm";

export default defineConfig({
  site: "https://suites.dev",
  // The live site is slash-canonical. Netlify Pretty URLs serves and
  // redirects to that form, so links, canonical tags and the sitemap have
  // to agree with it or every page redirects away from its own canonical URL.
  trailingSlash: "always",
  output: "static",
  vite: {
    optimizeDeps: { include: ["@docsearch/react"] },
    ssr: { noExternal: ["@docsearch/react"] },
    plugins: [{
      name: "suites-dependency-cache",
      // Builds must not replace dependency files used by a running dev server.
      config: (_config, { mode }) => ({ cacheDir: `node_modules/.vite-${mode}` }),
    }],
  },
  integrations: [
    expressiveCode(),
    mdx({
      remarkPlugins: [remarkGfm],
    }),
    react(),
    sitemap(),
  ],
});
