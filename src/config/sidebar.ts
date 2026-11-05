export interface SidebarItem {
  label: string;
  href: string;
  previous?: string | null;
  next?: string | null;
}

export interface SidebarGroup {
  label: string;
  items: SidebarItem[];
  collapsible?: boolean;
  sequential?: boolean;
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
        { label: "Supported stacks", href: "/docs/get-started/" },
        // sidebar_position: 2
        { label: "Why Suites?", href: "/docs/get-started/why-suites/" },
        // sidebar_position: 3
        {
          label: "Installation",
          href: "/docs/get-started/installation/",
          next: "/docs/get-started/quickstart/",
        },
      ],
    },
    {
      label: "Quick Start",
      sequential: false,
      items: [
        {
          label: "Choose your framework",
          href: "/docs/get-started/quickstart/",
          previous: "/docs/get-started/installation/",
        },
        {
          label: "NestJS",
          href: "/docs/guides/nestjs/",
          previous: "/docs/get-started/quickstart/",
          next: "/docs/guides/solitary/",
        },
        {
          label: "InversifyJS",
          href: "/docs/guides/inversify/",
          previous: "/docs/get-started/quickstart/",
          next: "/docs/guides/solitary/",
        },
        {
          label: "InjectionJS",
          href: "/docs/guides/injectionjs/",
          previous: "/docs/get-started/quickstart/",
          next: "/docs/guides/solitary/",
        },
      ],
    },
    {
      label: "Guides",
      items: [
        // sidebar_position: 2 (section index)
        {
          label: "Overview",
          href: "/docs/guides/",
        },
        // sidebar_position: 1
        {
          label: "Unit Testing Fundamentals",
          href: "/docs/guides/fundamentals/",
        },
        // sidebar_position: 2
        {
          label:
            "Test Doubles",
          href: "/docs/guides/test-doubles/",
        },
        // sidebar_position: 3
        {
          label: "Solitary tests",
          href: "/docs/guides/solitary/",
        },
        // sidebar_position: 4
        {
          label: "Sociable tests",
          href: "/docs/guides/sociable/",
        },
        {
          label: "How Suites works",
          href: "/docs/guides/how-suites-works/",
        },
      ],
    },
    {
      label: "API Reference",
      items: [
        // sidebar_position: 3 (section index)
        { label: "Overview", href: "/docs/api-reference/" },
        // sidebar_position: 2
        {
          label: "TestBed.solitary()",
          href: "/docs/api-reference/testbed-solitary/",
        },
        // sidebar_position: 3
        {
          label: "TestBed.sociable()",
          href: "/docs/api-reference/testbed-sociable/",
        },
        // sidebar_position: 4
        {
          label: "Mock Configuration",
          href: "/docs/api-reference/mock-configuration/",
        },
        // sidebar_position: 5 (unit-reference)
        { label: "UnitReference", href: "/docs/api-reference/unit-reference/" },
        // sidebar_position: 5 (mock)
        { label: "Standalone mocks and stubs", href: "/docs/api-reference/mock/" },
        // sidebar_position: 6
        { label: "Types", href: "/docs/api-reference/types/" },
      ],
    },
    {
      label: "Migration Guides",
      sequential: false,
      items: [
        // sidebar_position: 5 (section index)
        { label: "Overview", href: "/docs/migration-guides/" },
        {
          label: "Suites 3 to 4",
          href: "/docs/migration-guides/from-v3/",
          previous: "/docs/migration-guides/",
          next: "/docs/get-started/quickstart/",
        },
        // sidebar_position: 5
        {
          label: "From Automock",
          href: "/docs/migration-guides/from-automock/",
          previous: "/docs/migration-guides/",
          next: "/docs/get-started/quickstart/",
        },
      ],
    },
    {
      label: "Changelog",
      collapsible: false,
      items: [
        // sidebar_position: 6
        { label: "Changelog", href: "/docs/changelog/" },
      ],
    },
  ],
};

export default sidebar;
