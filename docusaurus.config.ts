import algoliaConfig from './config/algolia-config';
import type { Config } from '@docusaurus/types';
import { draculaThemeConfig } from './config/prisma-theme.config';

const config: Config = {
  title: 'Suites',
  tagline: 'A meta-framework that focuses on helping developers build solid test suites, eliminates boilerplate code, and improves their unit testing process',
  organizationName: 'suites-dev',
  url: 'https://suites.dev',
  baseUrl: '/',
  onBrokenLinks: 'ignore',
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
          path: 'docs',
          routeBasePath: 'docs',
          sidebarPath: require.resolve('./config/docs-sidebars.js'),
          remarkPlugins: [
            [require('@docusaurus/remark-plugin-npm2yarn'), { sync: true }],
          ],
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        blog: false,
        gtag: {
          trackingID: 'G-G7FJBNFPJJ',
          anonymizeIP: true,
        },
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
      { property: 'description', content: 'A meta-framework that focuses on helping developers build solid test suites, eliminates boilerplate code, and improves their unit testing process.' },
      { property: 'og:title', content: 'Suites' },
      { property: 'og:description', content: 'A meta-framework that focuses on helping developers build solid test suites, eliminates boilerplate code, and improves their unit testing process.' },
      { property: 'og:image', name: 'image', content: 'https://suites.dev/img/banner.png' },
      { property: 'og:url', content: 'https://suites.dev' },
      { property: 'og:type', content: 'website' }
    ],
    colorMode: {
      disableSwitch: true,
      respectPrefersColorScheme: true,
      defaultMode: 'dark',
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