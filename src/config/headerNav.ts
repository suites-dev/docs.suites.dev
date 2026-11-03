import type { ProductKey } from "@/config/sidebar";

export interface HeaderNavLink {
  label: string;
  href: string;
  external?: boolean;
  product?: ProductKey;
}

export const headerNavLinks: HeaderNavLink[] = [
  { label: "Unit docs", href: "/docs/get-started/", product: "unit" },
  {
    label: "Examples",
    href: "https://github.com/suites-dev/examples",
    external: true,
  },
  {
    label: "GitHub",
    href: "https://github.com/suites-dev",
    external: true,
  },
];
