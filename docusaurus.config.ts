import algoliaConfig from "./config/algolia-config";
import type { Config } from "@docusaurus/types";
import { draculaThemeConfig } from "./config/prisma-theme.config";

const config: Config = {
  title: "Suites Documentation",
  tagline:
    "A meta-framework that focuses on helping developers build solid test suites, eliminates boilerplate code, and improves their unit testing process",
  organizationName: "suites-dev",
  url: "https://suites.dev",
  baseUrl: "/",
  onBrokenLinks: "ignore",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.png",
  projectName: "suites",
  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],
  headTags: [
    {
      tagName: "link",
      attributes: {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
    },
  ],
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          path: "docs",
          routeBasePath: "docs",
          sidebarPath: require.resolve("./config/docs-sidebars.js"),
          remarkPlugins: [
            [require("@docusaurus/remark-plugin-npm2yarn"), { sync: true }],
          ],
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
        blog: false,
        gtag: {
          trackingID: "G-G7FJBNFPJJ",
          anonymizeIP: true,
        },
      },
    ],
  ],
  plugins: [
    [
      "@docusaurus/plugin-client-redirects",
      require("./config/redirects.config.js"),
    ],
  ],
  themeConfig: {
    metadata: [
      {
        name: "keywords",
        content:
          "auto mocking, meta framework, jest, sinon, vitest, dependency injection, inversion of control, nestjs, inversifyjs",
      },
      { name: "author", content: "Suites" },
      {
        property: "description",
        content:
          "A meta-framework that focuses on helping developers build solid test suites, eliminates boilerplate code, and improves their unit testing process.",
      },
      { property: "og:title", content: "Suites" },
      {
        property: "og:description",
        name: "description",
        content:
          "A meta-framework that focuses on helping developers build solid test suites, eliminates boilerplate code, and improves their unit testing process.",
      },
      {
        property: "og:image",
        name: "image",
        content: "https://suites.dev/img/banner.png",
      },
      { property: "og:url", content: "https://suites.dev" },
      { property: "og:type", content: "website" },
    ],
    colorMode: {
      disableSwitch: true,
      defaultMode: "dark",
    },
    algolia: algoliaConfig,
    navbar: {
      title: "Suites",
      logo: {
        alt: "Suites Logo",
        src: "img/logo.png",
      },
      items: [
        {
          to: "/docs/get-started/",
          position: "left",
          label: "Get Started",
        },
        {
          to: "/docs/guides/",
          position: "left",
          label: "Guides",
        },
        {
          to: "/docs/api-reference/",
          position: "left",
          label: "API Reference",
        },
        {
          to: "/docs/changelog",
          position: "left",
          label: "Changelog",
        },
        {
          href: "https://github.com/suites-dev/suites",
          position: "right",
          className: "header-github-link",
        },
      ],
    },
    prism: draculaThemeConfig,
  },
};

export default config;
