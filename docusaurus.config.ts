import algoliaConfig from './config/algolia-config';
import type { Config } from '@docusaurus/types';
import { draculaThemeConfig } from './config/prisma-theme.config';

const config: Config = {
  title: 'Suites Documentation',
  tagline: 'A meta-framework that focuses on helping developers build solid test suites, eliminates boilerplate code, and improves their unit testing process',
  organizationName: 'suites-dev',
  url: 'https://suites.dev',
  baseUrl: '/',
  trailingSlash: false,
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.png',
  projectName: 'suites',
  headTags: [
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'stylesheet',
        href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css',
      },
    },
  ],
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          id: 'default',
          path: 'docs',
          routeBasePath: 'docs',
          sidebarPath: require.resolve('./config/docs-sidebars.js'),
          remarkPlugins: [
            [require('@docusaurus/remark-plugin-npm2yarn'), { sync: true }],
          ],
        },
        theme: {
          customCss: [
            require.resolve('./src/css/custom.css'),
            require.resolve('./src/css/academy-doc-layout.css'),
            require.resolve('./src/css/academy-doc-content.css'),
          ],
        },
        blog: false,
        gtag: {
          trackingID: 'G-G7FJBNFPJJ',
          anonymizeIP: true,
        },
      },
    ],
  ],
  plugins: [
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects: [
          // Core redirects from old automock.dev structure
          {
            from: '/docs/api-reference',
            to: '/docs/developer-guide/unit-tests/suites-api',
          },
          {
            from: '/docs/extras/deep-mocking',
            to: '/docs/developer-guide/unit-tests/test-doubles',
          },
          {
            from: '/docs/guides',
            to: '/docs/developer-guide',
          },
          {
            from: '/docs/unit-tests',
            to: '/docs/developer-guide/unit-tests',
          },
          {
            from: '/docs/sociable-unit-tests',
            to: '/docs/developer-guide/unit-tests/sociable',
          },
          {
            from: '/docs/get-started/installation',
            to: '/docs/overview/installation',
          },
          {
            from: '/docs/adapters/identifiers',
            to: '/docs/developer-guide/adapters/identifiers',
          },
          {
            from: '/docs/adapters/intro',
            to: '/docs/developer-guide/adapters',
          },
          {
            from: '/docs/migrating',
            to: '/docs/overview/migrating-from-automock',
          },
          {
            from: '/api-reference/api/testbedbuilder-api',
            to: '/docs/developer-guide/unit-tests/suites-api',
          },
          // Additional likely redirects from automock.dev
          {
            from: '/docs/overview/depdency-injection-and-automock',
            to: '/docs/overview/what-is-suites',
          },
          {
            from: '/docs/fundamentals',
            to: '/docs/developer-guide/unit-tests/fundamentals',
          },
          {
            from: '/docs/mocking',
            to: '/docs/developer-guide/unit-tests/test-doubles',
          },
        ],
        createRedirects(existingPath) {
          // Handle trailing slash variations
          if (existingPath.includes('/docs/')) {
            return [
              existingPath.endsWith('/') ? existingPath.slice(0, -1) : existingPath + '/',
            ];
          }
          return undefined;
        },
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'academy',
        path: 'academy',
        routeBasePath: 'academy',
        sidebarPath: require.resolve('./config/sidebarsAcademy.js'),
      },
    ],
  ],
  themeConfig: {
    metadata: [
      {
        name: 'keywords',
        content: 'auto mocking, meta framework, jest, sinon, vitest, dependency injection, inversion of control, nestjs, inversifyjs'
      },
      { name: 'author', content: 'Suites' },
      {
        property: 'description',
        content: 'A meta-framework that focuses on helping developers build solid test suites, eliminates boilerplate code, and improves their unit testing process.'
      },
      { property: 'og:title', content: 'Suites' },
      {
        property: 'og:description',
        name: 'description',
        content: 'A meta-framework that focuses on helping developers build solid test suites, eliminates boilerplate code, and improves their unit testing process.'
      },
      { property: 'og:image', name: 'image', content: 'https://suites.dev/img/banner.png' },
      { property: 'og:url', content: 'https://suites.dev' },
      { property: 'og:type', content: 'website' }
    ],
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    algolia: algoliaConfig,
    navbar: {
      title: 'Suites',
      logo: {
        alt: 'Suites Logo',
        src: 'img/logo.png',
      },
      items: [
        {
          to: '/docs',
          position: 'left',
          label: 'Docs',
        },
        {
          to: '/docs/overview/installation',
          position: 'left',
          label: 'Installation',
        },
        {
          to: '/docs/overview/quickstart',
          position: 'left',
          label: 'Quick Start',
        },
        {
          to: '/docs/developer-guide/unit-tests/',
          position: 'left',
          label: 'Unit Testing',
        },
        {
          to: '/academy',
          position: 'right',
          html: '<i class="fas fa-graduation-cap"></i> Suites Academy',
          className: 'header-academy-link',
        },
        {
          href: 'https://github.com/suites-dev/suites',
          position: 'right',
          className: 'header-github-link',
        },
      ],
    },
    prism: draculaThemeConfig,
  },
};

export default config; 