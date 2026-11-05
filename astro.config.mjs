import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import expressiveCode from "astro-expressive-code";
import remarkGfm from "remark-gfm";
import { readFileSync } from "node:fs";
import { esmDependencies } from "./scripts/esm-dependencies.mjs";

const outputDirectory = new URL("./dist/", import.meta.url);

export default defineConfig({
  site: "https://suites.dev",
  // The live site is slash-canonical. Netlify Pretty URLs serves and
  // redirects to that form, so links, canonical tags and the sitemap have
  // to agree with it or every page redirects away from its own canonical URL.
  trailingSlash: "always",
  output: "static",
  outDir: "./dist",
  vite: {
    optimizeDeps: { include: ["@docsearch/react"] },
    ssr: {
      // Bundle the renderer's ESM graph so legacy host dependencies cannot
      // shadow it. Native CommonJS dependencies keep their normal loader.
      noExternal: ["@docsearch/react", ...esmDependencies("astro-expressive-code", import.meta.url)],
    },
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
    sitemap({
      // Read the rendered directive so content-level no_index and previews agree
      // with the sitemap. Status pages are already excluded by the integration.
      filter: (page) => {
        const pathname = new URL(page).pathname;
        const route = pathname.endsWith('/') ? pathname : `${pathname}/`;
        const html = readFileSync(new URL(`.${route}index.html`, outputDirectory), "utf8");
        const head = html.split("</head>")[0];
        return !/<meta\b[^>]*name="robots"[^>]*content="[^"]*noindex/i.test(head);
      },
    }),
  ],
});
