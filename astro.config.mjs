import { defineConfig } from 'astro/config';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import expressiveCode, { ExpressiveCodeTheme } from 'astro-expressive-code';
import remarkGfm from 'remark-gfm';

const suitesCodeTheme = ExpressiveCodeTheme.fromJSONString(
  fs.readFileSync(
    fileURLToPath(new URL('./src/styles/suites-code-theme.json', import.meta.url)),
    'utf-8'
  )
);

export default defineConfig({
  site: 'https://suites.dev',
  trailingSlash: 'ignore',
  output: 'static',
  vite: {
    server: {
      allowedHosts: ['7fcf-77-125-115-106.ngrok-free.app'],
    },
  },
  adapter: vercel({
    webAnalytics: { enabled: true },
    imageService: true,
  }),
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
  redirects: {
    // ============================================================
    // BLACKBOX DOCUMENTATION
    // ============================================================

    '/docs/blackbox': { status: 301, destination: '/docs/blackbox/overview/what-is-blackbox' },
    '/docs/blackbox/overview': { status: 301, destination: '/docs/blackbox/overview/what-is-blackbox' },
    '/docs/blackbox/concepts': { status: 301, destination: '/docs/blackbox/concepts/testing-layers' },
    '/docs/blackbox/overview/alpha-status-and-limits': { status: 301, destination: '/docs/blackbox/quickstart/runtime-prerequisites' },
    '/docs/blackbox/overview/specs-tests-runtime-evidence': { status: 301, destination: '/docs/blackbox/overview/runtime-evidence-gap' },
    '/docs/blackbox/overview/tests-effects-and-feature-files': { status: 301, destination: '/docs/blackbox/overview/verification-loop' },
    '/docs/blackbox/overview/system-test-effect-coverage': { status: 301, destination: '/docs/blackbox/concepts/effects-and-catalogs' },
    '/docs/blackbox/quickstart/requirements': { status: 301, destination: '/docs/blackbox/quickstart/runtime-prerequisites' },
    '/docs/blackbox/quickstart/prerequisites-and-supported-systems': { status: 301, destination: '/docs/blackbox/quickstart/runtime-prerequisites' },
    '/docs/blackbox/quickstart/feature-files-from-tests': { status: 301, destination: '/docs/blackbox/quickstart/adopt-existing-suite' },
    '/docs/blackbox/quickstart/connect-specifications-to-runtime-evidence': { status: 301, destination: '/docs/blackbox/quickstart/define-new-behavior' },
    '/docs/blackbox/quickstart/first-proven-feature': { status: 301, destination: '/docs/blackbox/quickstart/add-runtime-evidence' },
    '/docs/blackbox/guides': { status: 301, destination: '/docs/blackbox/guides/set-up-the-testbed' },
    '/docs/blackbox/guides/reading-coverage-reports': { status: 301, destination: '/docs/blackbox/guides/reports-and-ci-gates' },
    '/docs/blackbox/guides/ci-behavioral-gates': { status: 301, destination: '/docs/blackbox/guides/reports-and-ci-gates' },

    // ============================================================
    // CRITICAL REDIRECTS (High Traffic Pages)
    // ============================================================

    // Quick Start
    '/docs/overview/quickstart': { status: 301, destination: '/docs/get-started/quickstart' },
    '/docs/learn/get-started/quickstart': { status: 301, destination: '/docs/get-started/quickstart' },
    '/docs/introduction/quick-example': { status: 301, destination: '/docs/get-started/quickstart' },

    // Installation
    '/docs/overview/installation': { status: 301, destination: '/docs/get-started/installation' },
    '/docs/learn/get-started/installation': { status: 301, destination: '/docs/get-started/installation' },

    // API Reference
    '/docs/developer-guide/unit-tests/suites-api': { status: 301, destination: '/docs/api-reference/' },
    '/docs/learn/unit-tests/suites-api': { status: 301, destination: '/docs/api-reference/' },
    '/docs/api-reference/testbed-api': { status: 301, destination: '/docs/api-reference/' },
    '/docs/api-reference/fail-fast': { status: 301, destination: '/docs/api-reference/' },
    '/api-reference': { status: 301, destination: '/docs/api-reference/' },

    // Solitary Tests
    '/docs/developer-guide/unit-tests/solitary': { status: 301, destination: '/docs/guides/solitary' },
    '/docs/learn/unit-tests/solitary': { status: 301, destination: '/docs/guides/solitary' },

    // Sociable Tests
    '/docs/developer-guide/unit-tests/sociable': { status: 301, destination: '/docs/guides/sociable' },
    '/docs/learn/unit-tests/sociable': { status: 301, destination: '/docs/guides/sociable' },

    // Test Doubles
    '/docs/developer-guide/unit-tests/test-doubles': { status: 301, destination: '/docs/guides/test-doubles' },
    '/docs/learn/unit-tests/test-doubles': { status: 301, destination: '/docs/guides/test-doubles' },

    // Fundamentals
    '/docs/developer-guide/unit-tests/fundamentals': { status: 301, destination: '/docs/guides/fundamentals' },
    '/docs/learn/unit-tests/fundamentals': { status: 301, destination: '/docs/guides/fundamentals' },

    // ============================================================
    // MIGRATION GUIDES
    // ============================================================

    '/docs/migrating-from-automock': { status: 301, destination: '/docs/migration-guides/from-automock' },
    '/docs/resources/migrating-from-automock': { status: 301, destination: '/docs/migration-guides/from-automock' },
    '/docs/overview/migrating-from-automock': { status: 301, destination: '/docs/migration-guides/from-automock' },
    '/docs/getting-started/change-log': { status: 301, destination: '/docs/migration-guides/from-automock' },

    // ============================================================
    // OVERVIEW SECTION
    // ============================================================

    '/docs/overview': { status: 301, destination: '/docs/get-started/' },
    '/docs/overview/what-is-suites': { status: 301, destination: '/docs/get-started/' },
    '/docs/overview/problems-solved': { status: 301, destination: '/docs/get-started/why-suites' },
    '/docs/resources/problems-solved': { status: 301, destination: '/docs/get-started/why-suites' },
    '/docs/overview/comparisons': { status: 301, destination: '/docs/get-started/why-suites' },
    '/docs/overview/motivation': { status: 301, destination: '/docs/get-started/why-suites' },
    '/docs/overview/depdency-injection-and-automock': { status: 301, destination: '/docs/get-started/why-suites' },
    '/docs/overview/dependency-injection-and-automock': { status: 301, destination: '/docs/get-started/why-suites' },
    '/docs/core-concepts/dependency-injection': { status: 301, destination: '/docs/get-started/why-suites' },

    // ============================================================
    // DEVELOPER GUIDE
    // (wildcard variants for remaining old paths live in vercel.json)
    // ============================================================

    '/docs/developer-guide/unit-tests': { status: 301, destination: '/docs/guides/' },

    // ============================================================
    // DOCS BASE PATH
    // ============================================================

    '/docs': { status: 301, destination: '/docs/get-started/' },

    // ============================================================
    // CATEGORY PAGES
    // ============================================================

    '/docs/category/extras': { status: 301, destination: '/docs/guides/' },
    '/docs/category/getting-started': { status: 301, destination: '/docs/get-started/' },
    '/docs/category/di-framework-adapters': { status: 301, destination: '/docs/get-started/' },

    // ============================================================
    // EXTRAS (removed pages)
    // ============================================================

    '/docs/extras/identical-injections': { status: 301, destination: '/docs/guides/' },

    // ============================================================
    // ADAPTERS (restructured - bundled into core)
    // ============================================================

    '/docs/adapters/inversify': { status: 301, destination: '/docs/get-started/' },
    '/docs/adapters/identifiers': { status: 301, destination: '/docs/get-started/' },
    '/docs/developer-guide/adapters/inversifyjs': { status: 301, destination: '/docs/get-started/' },
    '/docs/developer-guide/adapters/identifiers': { status: 301, destination: '/docs/get-started/' },
    '/docs/guides/adapters/inversifyjs': { status: 301, destination: '/docs/get-started/' },
    // wildcard /docs/adapters/[...slug] lives in vercel.json
  },
});
