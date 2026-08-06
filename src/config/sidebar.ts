export interface SidebarItem {
  label: string;
  href: string;
}

export interface SidebarGroup {
  label: string;
  items: SidebarItem[];
}

export type ProductKey = 'unit' | 'blackbox';

export interface SidebarConfig {
  unit: SidebarGroup[];
  blackbox: SidebarGroup[];
}

// Top-level product tabs. Order in the header matches this order.
export const products: Array<{ key: ProductKey; label: string; href: string; badge?: string }> = [
  { key: 'unit',     label: 'Unit',     href: '/docs/get-started/' },
  { key: 'blackbox', label: 'Blackbox', href: '/docs/blackbox/overview/what-is-blackbox', badge: 'alpha' },
];

// Resolve the active product from a URL pathname.
export function productFromPath(pathname: string): ProductKey {
  return pathname.startsWith('/docs/blackbox/') ? 'blackbox' : 'unit';
}

// Labels are taken verbatim from each file's `title:` frontmatter.
// Items within each section are ordered by `sidebar_position`.
const sidebar: SidebarConfig = {
  unit: [
    {
      label: 'Get Started',
      items: [
        // sidebar_position: 1
        { label: 'Get Started', href: '/docs/get-started/' },
        // sidebar_position: 2
        { label: 'Why Suites?', href: '/docs/get-started/why-suites' },
        // sidebar_position: 3
        {
          label: 'Install Suites for NestJS, Inversify, Jest, Vitest, and Sinon',
          href: '/docs/get-started/installation',
        },
        // sidebar_position: 4
        {
          label: 'Suites Quick Start: Write Your First Unit Test in 5 Minutes',
          href: '/docs/get-started/quickstart',
        },
      ],
    },
    {
      label: 'Guides',
      items: [
        // sidebar_position: 2 (section index)
        { label: 'Guides', href: '/docs/guides/' },
        // sidebar_position: 1
        { label: 'Unit Testing Fundamentals', href: '/docs/guides/fundamentals' },
        // sidebar_position: 2
        {
          label: 'TypeScript Test Doubles: Auto-Generated Mocks, Stubs, Spies & Fakes',
          href: '/docs/guides/test-doubles',
        },
        // sidebar_position: 3
        { label: 'Testing in Isolation (Solitary)', href: '/docs/guides/solitary' },
        // sidebar_position: 4
        { label: 'Testing Components Together (Sociable)', href: '/docs/guides/sociable' },
        // sidebar_position: 7
        { label: 'Virtual Test Container Concept', href: '/docs/guides/virtual-test-container' },
      ],
    },
    {
      label: 'API Reference',
      items: [
        // sidebar_position: 3 (section index)
        { label: 'API Reference', href: '/docs/api-reference/' },
        // sidebar_position: 2
        { label: 'TestBed.solitary()', href: '/docs/api-reference/testbed-solitary' },
        // sidebar_position: 3
        { label: 'TestBed.sociable()', href: '/docs/api-reference/testbed-sociable' },
        // sidebar_position: 4
        { label: 'Mock Configuration', href: '/docs/api-reference/mock-configuration' },
        // sidebar_position: 5 (unit-reference)
        { label: 'UnitReference', href: '/docs/api-reference/unit-reference' },
        // sidebar_position: 5 (mock)
        { label: 'mock() and stub()', href: '/docs/api-reference/mock' },
        // sidebar_position: 6
        { label: 'Types', href: '/docs/api-reference/types' },
      ],
    },
    {
      label: 'Migration Guides',
      items: [
        // sidebar_position: 5 (section index)
        { label: 'Migration Guides', href: '/docs/migration-guides/' },
        // sidebar_position: 5
        { label: 'Migrating from Automock to Suites', href: '/docs/migration-guides/from-automock' },
      ],
    },
    {
      label: 'Changelog',
      items: [
        // sidebar_position: 6
        { label: 'Changelog', href: '/docs/changelog' },
      ],
    },
  ],

  // Blackbox sidebar shows the guided path. Deep reference, troubleshooting,
  // and use-case pages stay routable and are linked from the relevant hubs.
  blackbox: [
    {
      label: 'Overview',
      items: [
        { label: 'What is Blackbox?', href: '/docs/blackbox/overview/what-is-blackbox' },
        { label: 'The Runtime Evidence Gap', href: '/docs/blackbox/overview/runtime-evidence-gap' },
        { label: 'The Verification Loop', href: '/docs/blackbox/overview/verification-loop' },
        { label: 'When to Use Blackbox', href: '/docs/blackbox/overview/when-to-use-blackbox' },
      ],
    },
    {
      label: 'Quickstart',
      items: [
        { label: 'Prerequisites and Supported Systems', href: '/docs/blackbox/quickstart/prerequisites-and-supported-systems' },
        { label: 'Install Blackbox', href: '/docs/blackbox/quickstart/install' },
        { label: '5-Minute Quickstart', href: '/docs/blackbox/quickstart/first-proven-feature' },
        { label: 'Connect Specifications to Runtime Evidence', href: '/docs/blackbox/quickstart/connect-specifications-to-runtime-evidence' },
      ],
    },
    {
      label: 'Concepts',
      items: [
        { label: 'Testing Layers', href: '/docs/blackbox/concepts/testing-layers' },
        { label: 'Runtime Evidence', href: '/docs/blackbox/concepts/runtime-evidence' },
        { label: 'Effects, Catalogs, and Coverage', href: '/docs/blackbox/concepts/effects-and-catalogs' },
        { label: 'Specifications, Flows, and Verdicts', href: '/docs/blackbox/concepts/specifications-flows-and-verdicts' },
        { label: 'OMC/DC Coverage', href: '/docs/blackbox/concepts/omc-dc-coverage' },
      ],
    },
    {
      label: 'Guides',
      items: [
        { label: 'Testbed and Instrumentation', href: '/docs/blackbox/guides/set-up-the-testbed' },
        { label: 'Playwright Flows, Isolation, and Parallelism', href: '/docs/blackbox/guides/playwright-isolation-and-parallelism' },
        { label: 'Spec-Driven and Agentic Verification', href: '/docs/blackbox/guides/spec-driven-and-agentic-verification' },
        { label: 'Reports and CI Gates', href: '/docs/blackbox/guides/reports-and-ci-gates' },
      ],
    },
    {
      label: 'Use Cases',
      items: [
        { label: 'Use Cases', href: '/docs/blackbox/use-cases' },
      ],
    },
    {
      label: 'Reference',
      items: [
        { label: 'Reference', href: '/docs/blackbox/reference' },
      ],
    },
    {
      label: 'Troubleshooting',
      items: [
        { label: 'Troubleshooting', href: '/docs/blackbox/troubleshooting' },
      ],
    },
  ],
};

export default sidebar;
