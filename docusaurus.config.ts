import algoliaConfig from "./config/algolia-config";
import type { Config } from "@docusaurus/types";
import { draculaThemeConfig } from "./config/prisma-theme.config";

const config: Config = {
  title: "Suites Documentation",
  tagline: "A unit testing framework for TypeScript backends working with inversion of control and dependency injection",
  organizationName: "suites-dev",
  url: "https://suites.dev",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "throw",
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
          "auto mocking, unit testing framework, jest, sinon, vitest, dependency injection, inversion of control, nestjs, inversifyjs, unit testing, test doubles, typescript testing, mock generation, test automation, solitary testing, sociable testing",
      },
      { name: "author", content: "Suites" },
      { name: "robots", content: "index, follow" },
      { name: "googlebot", content: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" },
      {
        name: "description",
        content: "A unit testing framework for TypeScript backends working with inversion of control and dependency injection",
      },
      { property: "og:title", content: "Suites - A Modern Unit Testing Framework" },
      {
        property: "og:description",
        content: "A unit testing framework for TypeScript backends working with inversion of control and dependency injection",
      },
      {
        property: "og:image",
        content: "https://suites.dev/img/banner.png",
      },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Suites - A Modern Unit Testing Framework" },
      { property: "og:url", content: "https://suites.dev" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Suites" },
      { property: "og:locale", content: "en_US" },
      // Twitter Card
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Suites - A Modern Unit Testing Framework" },
      {
        name: "twitter:description",
        content: "A unit testing framework for TypeScript backends working with inversion of control and dependency injection",
      },
      { name: "twitter:image", content: "https://suites.dev/img/banner.png" },
      { name: "twitter:image:alt", content: "A unit testing framework for TypeScript backends working with inversion of control and dependency injection" },
      // Additional SEO
      { name: "theme-color", content: "#1a1a1a" },
      { name: "application-name", content: "Suites" },
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
          href: "https://buymeacoffee.com/omermoradd",
          position: "right",
          label: "Sponsor",
          className: "header-sponsor-link",
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
