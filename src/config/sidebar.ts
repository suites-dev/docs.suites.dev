export interface SidebarItem {
  label: string;
  href: string;
}

export interface SidebarGroup {
  label: string;
  items: SidebarItem[];
}

export type ProductKey = "unit";

export interface SidebarConfig {
  unit: SidebarGroup[];
}

// Top-level product tabs. Order in the header matches this order.
export const products: Array<{
  key: ProductKey;
  label: string;
  href: string;
  badge?: string;
}> = [
  { key: "unit", label: "Unit", href: "/docs/get-started/" },
];

// Resolve the active product from a URL pathname. Unit is the only product
// on this site; the shape stays in place for whatever ships next.
export function productFromPath(_pathname: string): ProductKey {
  return "unit";
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
};

export default sidebar;
