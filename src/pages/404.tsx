import React from "react";
import Link from "@docusaurus/Link";
import Layout from "@theme/Layout";
import styles from "./404.module.css";

const SUGGESTIONS: Array<{ label: string; description: string; to: string }> = [
  {
    label: "Get Started",
    description: "Install Suites and write your first test.",
    to: "/docs/get-started/",
  },
  {
    label: "Quickstart",
    description: "A minimal end-to-end example.",
    to: "/docs/get-started/quickstart",
  },
  {
    label: "Guides",
    description: "Solitary, sociable, test doubles, and fundamentals.",
    to: "/docs/guides/",
  },
  {
    label: "API Reference",
    description: "TestBed, Mock, and configuration APIs.",
    to: "/docs/api-reference/",
  },
  {
    label: "Migrating from Automock",
    description: "Move an existing Automock setup to Suites.",
    to: "/docs/migration-guides/from-automock",
  },
];

export default function NotFound(): React.ReactElement {
  return (
    <Layout
      title="Page not found"
      description="The page you are looking for does not exist."
    >
      <main className={styles.container}>
        <div className={styles.inner}>
          <p className={styles.code}>404</p>
          <h1 className={styles.title}>This page took an early return.</h1>
          <p className={styles.subtitle}>
            We may have moved or renamed it during the recent docs refresh.
            Try one of these instead:
          </p>

          <ul className={styles.list}>
            {SUGGESTIONS.map((item) => (
              <li key={item.to} className={styles.item}>
                <Link to={item.to} className={styles.itemLink}>
                  <span className={styles.itemLabel}>{item.label}</span>
                  <span className={styles.itemDescription}>{item.description}</span>
                </Link>
              </li>
            ))}
          </ul>

          <p className={styles.footer}>
            Still stuck? <Link to="/">Go to the homepage</Link> or{" "}
            <Link href="https://github.com/suites-dev/suites/issues">
              open an issue on GitHub
            </Link>
            .
          </p>
        </div>
      </main>
    </Layout>
  );
}
