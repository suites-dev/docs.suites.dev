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

  // Blackbox sidebar is organized around the first-visit path first,
  // then concepts, lifecycle, workflows, reference, recovery, trust, use cases, and project info.
  blackbox: [
    {
      label: 'Overview',
      items: [
        { label: 'What is Blackbox?', href: '/docs/blackbox/overview/what-is-blackbox' },
        { label: 'Tests, Effects, and Feature Files', href: '/docs/blackbox/overview/tests-effects-and-feature-files' },
        { label: 'Where Blackbox Fits', href: '/docs/blackbox/overview/where-blackbox-fits' },
        { label: 'System Test Effect Coverage', href: '/docs/blackbox/overview/system-test-effect-coverage' },
        { label: 'When to Use Blackbox', href: '/docs/blackbox/overview/when-to-use-blackbox' },
      ],
    },
    {
      label: 'Quickstart',
      items: [
        { label: 'Requirements and Supported Stacks', href: '/docs/blackbox/quickstart/requirements' },
        { label: 'Install Blackbox', href: '/docs/blackbox/quickstart/install' },
        { label: '5-Minute Quickstart', href: '/docs/blackbox/quickstart/first-proven-feature' },
        { label: 'Feature Files From Tests', href: '/docs/blackbox/quickstart/feature-files-from-tests' },
      ],
    },
    {
      label: 'Concepts',
      items: [
        { label: 'System Effects', href: '/docs/blackbox/concepts/system-effects' },
        { label: 'Unit, Integration, System, and E2E', href: '/docs/blackbox/concepts/unit-integration-system-e2e-blackbox-testing' },
        { label: 'Runtime Evidence', href: '/docs/blackbox/concepts/system-tests-and-runtime-evidence' },
        { label: 'Effects, Runtime, and Specs', href: '/docs/blackbox/concepts/bdd-runtime-and-effects' },
        { label: 'OMC/DC Coverage', href: '/docs/blackbox/concepts/omc-dc-coverage' },
        { label: 'Requires and Forbids', href: '/docs/blackbox/concepts/requires-and-forbids' },
        { label: 'Feature Files, BDD, and Staleness', href: '/docs/blackbox/concepts/feature-files-and-staleness' },
      ],
    },
    {
      label: 'Guides',
      items: [
        { label: 'Writing Scenarios', href: '/docs/blackbox/guides/writing-scenarios' },
        { label: 'Playwright, Isolation, and Parallelism', href: '/docs/blackbox/guides/playwright-isolation-and-parallelism' },
        { label: 'Generating Feature Files', href: '/docs/blackbox/guides/generating-feature-files' },
        { label: 'Spec-Driven Development', href: '/docs/blackbox/guides/spec-driven-development' },
        { label: 'AI-Assisted Development', href: '/docs/blackbox/guides/ai-assisted-development' },
        { label: 'Reading Coverage Reports', href: '/docs/blackbox/guides/reading-coverage-reports' },
        { label: 'Run with the Testbed', href: '/docs/blackbox/guides/using-the-testbed' },
        { label: 'Configure CI Gates', href: '/docs/blackbox/guides/ci-behavioral-gates' },
      ],
    },
    {
      label: 'Use Cases',
      items: [
        { label: 'Covering Before Refactor', href: '/docs/blackbox/use-cases/covering-before-refactor' },
        { label: 'Legacy Modernization', href: '/docs/blackbox/use-cases/legacy-modernization' },
        { label: 'Microservices Regression', href: '/docs/blackbox/use-cases/microservices-regression' },
        { label: 'Incident Regression', href: '/docs/blackbox/use-cases/incident-regression' },
      ],
    },
    {
      label: 'Reference',
      items: [
        { label: 'CLI Reference', href: '/docs/blackbox/reference/cli' },
        { label: 'API Reference', href: '/docs/blackbox/reference/api' },
        { label: 'Testbed API', href: '/docs/blackbox/reference/testbed-api' },
        { label: 'Scenario DSL', href: '/docs/blackbox/reference/scenario-dsl' },
        { label: 'Matchers and Effect Builders', href: '/docs/blackbox/reference/matchers-and-effect-builders' },
        { label: 'Catalog Schema', href: '/docs/blackbox/reference/catalog-schema' },
        { label: 'Report Formats', href: '/docs/blackbox/reference/report-formats' },
        { label: 'Configuration', href: '/docs/blackbox/reference/configuration' },
        { label: 'Environment Variables', href: '/docs/blackbox/reference/environment-variables' },
        { label: 'Files and Artifacts', href: '/docs/blackbox/reference/files-and-artifacts' },
        { label: 'Exit Codes', href: '/docs/blackbox/reference/exit-codes' },
      ],
    },
    {
      label: 'Troubleshooting',
      items: [
        { label: 'No Spans Captured', href: '/docs/blackbox/troubleshooting/no-spans-captured' },
        { label: 'Feature Drift', href: '/docs/blackbox/troubleshooting/feature-drift' },
        { label: 'Catalog Failures', href: '/docs/blackbox/troubleshooting/catalog-failures' },
        { label: 'Docker and Testbed', href: '/docs/blackbox/troubleshooting/docker-and-testbed' },
        { label: 'Diagnostics and Debug Logs', href: '/docs/blackbox/troubleshooting/diagnostics-and-debug-logs' },
        { label: 'Reporting a Bug', href: '/docs/blackbox/troubleshooting/reporting-a-bug' },
      ],
    },
  ],
};

export default sidebar;
