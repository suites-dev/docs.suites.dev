/**
 * URL Redirects Configuration
 *
 * Handles redirects for documentation reorganization (v4.0.0 docs restructure)
 * Preserves external links from Google, blogs, Stack Overflow, etc.
 *
 * Based on analytics showing:
 * - Quick Start: 2,971 views
 * - Installation: 1,580 views
 * - API Reference: 1,700 views
 * - Solitary Tests: 1,251 views
 */

module.exports = {
  redirects: [
    // ============================================
    // CRITICAL REDIRECTS (High Traffic Pages)
    // ============================================

    // Quick Start (2,971 views)
    {
      from: '/docs/overview/quickstart',
      to: '/docs/get-started/quickstart',
    },
    {
      from: '/docs/learn/get-started/quickstart',
      to: '/docs/get-started/quickstart',
    },

    // Installation (1,580 views)
    {
      from: '/docs/overview/installation',
      to: '/docs/get-started/installation',
    },
    {
      from: '/docs/learn/get-started/installation',
      to: '/docs/get-started/installation',
    },

    // API Reference (1,700 views)
    {
      from: '/docs/developer-guide/unit-tests/suites-api',
      to: '/docs/api-reference/',
    },
    {
      from: '/docs/learn/unit-tests/suites-api',
      to: '/docs/api-reference/',
    },

    // Solitary Tests (1,251 views)
    {
      from: '/docs/developer-guide/unit-tests/solitary',
      to: '/docs/guides/solitary',
    },
    {
      from: '/docs/learn/unit-tests/solitary',
      to: '/docs/guides/solitary',
    },

    // Sociable Tests (1,104 views)
    {
      from: '/docs/developer-guide/unit-tests/sociable',
      to: '/docs/guides/sociable',
    },
    {
      from: '/docs/learn/unit-tests/sociable',
      to: '/docs/guides/sociable',
    },

    // Identifiers (1,365 views)
    {
      from: '/docs/developer-guide/adapters/identifiers',
      to: '/docs/guides/adapters/identifiers',
    },
    {
      from: '/docs/learn/adapters/identifiers',
      to: '/docs/guides/adapters/identifiers',
    },
    {
      from: '/docs/adapters/identifiers',
      to: '/docs/guides/adapters/identifiers',
    },

    // InversifyJS (367 views)
    {
      from: '/docs/developer-guide/adapters/inversifyjs',
      to: '/docs/guides/adapters/inversifyjs',
    },
    {
      from: '/docs/learn/adapters/inversifyjs',
      to: '/docs/guides/adapters/inversifyjs',
    },
    {
      from: '/docs/adapters/inversifyjs',
      to: '/docs/guides/adapters/inversifyjs',
    },

    // ============================================
    // HIGH PRIORITY REDIRECTS
    // ============================================

    // Test Doubles (651 views, 72.7s engagement)
    {
      from: '/docs/developer-guide/unit-tests/test-doubles',
      to: '/docs/guides/test-doubles',
    },
    {
      from: '/docs/learn/unit-tests/test-doubles',
      to: '/docs/guides/test-doubles',
    },

    // Fundamentals (1,389 views)
    {
      from: '/docs/developer-guide/unit-tests/fundamentals',
      to: '/docs/guides/fundamentals',
    },
    {
      from: '/docs/learn/unit-tests/fundamentals',
      to: '/docs/guides/fundamentals',
    },

    // Migrating from Automock (1,082 views)
    {
      from: '/docs/migrating-from-automock',
      to: '/docs/migration-guides/from-automock',
    },
    {
      from: '/docs/resources/migrating-from-automock',
      to: '/docs/migration-guides/from-automock',
    },

    // What is Suites (567 views) - redirect to get-started
    {
      from: '/docs/overview/what-is-suites',
      to: '/docs/get-started/',
    },

    // Problems Solved (933 views) - consolidated into why-suites
    {
      from: '/docs/overview/problems-solved',
      to: '/docs/get-started/why-suites',
    },
    {
      from: '/docs/resources/problems-solved',
      to: '/docs/get-started/why-suites',
    },

    // Comparisons (new page, but redirect just in case)
    {
      from: '/docs/overview/comparisons',
      to: '/docs/get-started/why-suites',
    },

    // ============================================
    // GOOGLE SEARCH CONSOLE 404s (Found Nov 2025)
    // ============================================

    // Old examples page
    {
      from: '/docs/overview/examples',
      to: '/docs/get-started/quickstart',
    },

    // Extras/identical-injections (old advanced topic)
    {
      from: ['/docs/extras/identical-injections', '/docs/extras/identical-injections/'],
      to: '/docs/guides/adapters/identifiers',
    },

    // Old category page
    {
      from: '/docs/category/di-framework-adapters',
      to: '/docs/guides/adapters/',
    },

  ],
};
