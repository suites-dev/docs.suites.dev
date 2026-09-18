export interface SidebarItem {
  label: string;
  href: string;
}

export interface SidebarGroup {
  label: string;
  items: SidebarItem[];
}

export type ProductKey = "unit" | "blackbox";

export interface SidebarConfig {
  unit: SidebarGroup[];
  blackbox: SidebarGroup[];
}

// Top-level product tabs. Order in the header matches this order.
export const products: Array<{
  key: ProductKey;
  label: string;
  href: string;
  badge?: string;
}> = [
  { key: "unit", label: "Unit", href: "/docs/get-started/" },
  {
    key: "blackbox",
    label: "Blackbox",
    href: "/docs/blackbox/overview/what-is-blackbox",
  },
];

// Resolve the active product from a URL pathname.
export function productFromPath(pathname: string): ProductKey {
  return pathname.startsWith("/docs/blackbox/") ? "blackbox" : "unit";
}

// Sidebar labels are deliberately shorter than some page titles. Keep the
// guided path here; page frontmatter remains the source for page headings.
const sidebar: SidebarConfig = {
  unit: [
    {
      label: "Get Started",
      items: [
        // sidebar_position: 1
        { label: "Get Started", href: "/docs/get-started/" },
        // sidebar_position: 2
        { label: "Why Suites?", href: "/docs/get-started/why-suites" },
        // sidebar_position: 3
        {
          label:
            "Install Suites for NestJS, Inversify, Jest, Vitest, and Sinon",
          href: "/docs/get-started/installation",
        },
        // sidebar_position: 4
        {
          label: "Suites Quick Start: Write Your First Unit Test in 5 Minutes",
          href: "/docs/get-started/quickstart",
        },
      ],
    },
    {
      label: "Guides",
      items: [
        // sidebar_position: 2 (section index)
        { label: "Guides", href: "/docs/guides/" },
        // sidebar_position: 1
        {
          label: "Unit Testing Fundamentals",
          href: "/docs/guides/fundamentals",
        },
        // sidebar_position: 2
        {
          label:
            "TypeScript Test Doubles: Auto-Generated Mocks, Stubs, Spies & Fakes",
          href: "/docs/guides/test-doubles",
        },
        // sidebar_position: 3
        {
          label: "Testing in Isolation (Solitary)",
          href: "/docs/guides/solitary",
        },
        // sidebar_position: 4
        {
          label: "Testing Components Together (Sociable)",
          href: "/docs/guides/sociable",
        },
        // sidebar_position: 7
        {
          label: "Virtual Test Container Concept",
          href: "/docs/guides/virtual-test-container",
        },
      ],
    },
    {
      label: "API Reference",
      items: [
        // sidebar_position: 3 (section index)
        { label: "API Reference", href: "/docs/api-reference/" },
        // sidebar_position: 2
        {
          label: "TestBed.solitary()",
          href: "/docs/api-reference/testbed-solitary",
        },
        // sidebar_position: 3
        {
          label: "TestBed.sociable()",
          href: "/docs/api-reference/testbed-sociable",
        },
        // sidebar_position: 4
        {
          label: "Mock Configuration",
          href: "/docs/api-reference/mock-configuration",
        },
        // sidebar_position: 5 (unit-reference)
        { label: "UnitReference", href: "/docs/api-reference/unit-reference" },
        // sidebar_position: 5 (mock)
        { label: "mock() and stub()", href: "/docs/api-reference/mock" },
        // sidebar_position: 6
        { label: "Types", href: "/docs/api-reference/types" },
      ],
    },
    {
      label: "Migration Guides",
      items: [
        // sidebar_position: 5 (section index)
        { label: "Migration Guides", href: "/docs/migration-guides/" },
        // sidebar_position: 5
        {
          label: "Migrating from Automock to Suites",
          href: "/docs/migration-guides/from-automock",
        },
      ],
    },
    {
      label: "Changelog",
      items: [
        // sidebar_position: 6
        { label: "Changelog", href: "/docs/changelog" },
      ],
    },
  ],

  // Blackbox sidebar is the complete public information architecture.
  blackbox: [
    {
      label: "Overview",
      items: [
        {
          label: "What is Blackbox?",
          href: "/docs/blackbox/overview/what-is-blackbox",
        },
        {
          label: "How Blackbox Works",
          href: "/docs/blackbox/overview/how-blackbox-works",
        },
      ],
    },
    {
      label: "Get Started",
      items: [
        {
          label: "Installation",
          href: "/docs/blackbox/quickstart/installation",
        },
        {
          label: "Get Started",
          href: "/docs/blackbox/quickstart/",
        },
      ],
    },
    {
      label: "Concepts",
      items: [
        {
          label: "System and E2E Verification",
          href: "/docs/blackbox/concepts/testing-layers",
        },
        {
          label: "Human-Agent Verification Loop",
          href: "/docs/blackbox/concepts/human-agent-verification-loop",
        },
        {
          label: "OpenTelemetry and Effects",
          href: "/docs/blackbox/concepts/effects-and-catalogs",
        },
        {
          label: "Runtime Evidence Boundaries",
          href: "/docs/blackbox/concepts/runtime-evidence",
        },
        {
          label: "Test Topologies and Evidence Boundaries",
          href: "/docs/blackbox/guides/playwright-isolation-and-parallelism",
        },
        {
          label: "Observable Decision Coverage",
          href: "/docs/blackbox/concepts/omc-dc-coverage",
        },
      ],
    },
    {
      label: "Guides",
      items: [
        {
          label: "Start From an Existing System or E2E Test",
          href: "/docs/blackbox/quickstart/build-behavioral-harness",
        },
        {
          label: "Choose How Blackbox Runs Your Application",
          href: "/docs/blackbox/guides/set-up-the-testbed",
        },
        {
          label: "Use an Existing Compose Project",
          href: "/docs/blackbox/guides/use-existing-compose",
        },
        {
          label: "Use Testcontainers",
          href: "/docs/blackbox/guides/use-custom-provisioner",
        },
        {
          label: "Build From a Dockerfile",
          href: "/docs/blackbox/guides/build-from-dockerfile",
        },
        {
          label: "Run Distribution Artifacts",
          href: "/docs/blackbox/guides/run-compiled-artifacts",
        },
        {
          label: "Repair a Blackbox Finding With a Coding Agent",
          href: "/docs/blackbox/guides/agent-skills",
        },
        {
          label: "Add Blackbox to CI",
          href: "/docs/blackbox/guides/reports-and-ci-gates",
        },
      ],
    },
    {
      label: "Reference",
      items: [
        { label: "Reference", href: "/docs/blackbox/reference" },
        {
          label: "Plans, Alignment, and Identity",
          href: "/docs/blackbox/reference/plans-and-realizations",
        },
        {
          label: "Capture Lifecycle and Evidence",
          href: "/docs/blackbox/reference/capture-lifecycle-and-correlation",
        },
        {
          label: "Effects and Claim Evaluation",
          href: "/docs/blackbox/reference/effects-and-claims",
        },
        {
          label: "Observable Decision Coverage Results",
          href: "/docs/blackbox/reference/observable-decision-coverage",
        },
        {
          label: "CLI and Exit Behavior",
          href: "/docs/blackbox/reference/cli",
        },
        {
          label: "Source Maps and Service Layouts",
          href: "/docs/blackbox/guides/source-maps-and-service-layouts",
        },
        {
          label: "Security and Data Handling",
          href: "/docs/blackbox/operations/security-and-data-handling",
        },
      ],
    },
    {
      label: "Status",
      items: [
        {
          label: "Alpha Support Status",
          href: "/docs/blackbox/status/alpha-status",
        },
      ],
    },
  ],
};

export default sidebar;
