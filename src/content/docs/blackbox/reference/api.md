---
title: "API Reference"
description: "Public package entry points for Blackbox core effects, Playwright fixtures, testbeds, diagnostics, mocks, and extensibility."
sidebar_position: 2
keywords:
  [
    "Blackbox API reference",
    "@suites/blackbox exports",
    "Playwright Blackbox API",
    "effect coverage API",
  ]
---

Blackbox is alpha. Treat documented package exports as the public surface and deep `dist/` imports as internal.

## Package Entry Points

| Import                                | Purpose                                                                       |
| ------------------------------------- | ----------------------------------------------------------------------------- |
| `@suites/blackbox`                    | Main convenience exports                                                      |
| `@suites/blackbox/core`               | Effect builders, catalog model, evaluator, and predicates                     |
| `@suites/blackbox/runners/playwright` | Playwright fixtures, matchers, captures, and trace helpers                    |
| `@suites/blackbox/playwright`         | `defineBlackboxConfig` and `blackboxReporter` config helpers                  |
| `@suites/blackbox/testbed`            | `createBlackboxTestbed`, testbed types, connect helpers, and disposal helpers |
| `@suites/blackbox/diagnostics`        | Topology and sequence diagnostics                                             |
| `@suites/blackbox/mocks`              | Test-environment boundary mocks                                               |
| `@suites/blackbox/extensibility`      | Runtime adapter, coverage producer, reporter, and sink contracts              |

Packaged Playwright global setup and teardown subpaths are implementation-facing config targets returned by `defineBlackboxConfig()`. Prefer the helper instead of importing those subpaths directly.

## Minimal Runtime Use

```ts
import { effect } from "@suites/blackbox/core";
import { expect, test } from "./blackbox-testbed";

test.describe("Customer checkout", { tag: "@flow:checkout-flow" }, () => {
  test("creates an order", async ({ capture }) => {
    await expect(capture).toObserveEffects([
      effect.postgres("INSERT", { table: "orders" }),
      effect.forbid(effect.http("POST", { path: "/refunds" })),
    ]);
  });
});
```

The `effect.forbid()` wrapper is for the single or array matcher form. In `{ requires, forbids }`, put bare effect shapes in `forbids`.

## Configuration Use

```ts
import { defineConfig } from "@playwright/test";
import {
  blackboxReporter,
  defineBlackboxConfig,
} from "@suites/blackbox/playwright";
import { testbed } from "./blackbox-testbed.js";

export default defineConfig({
  ...defineBlackboxConfig({ mode: "testbed", testbed }),
  reporter: [
    ["list"],
    blackboxReporter({ outputDir: "./e2e/.blackbox-coverage" }),
  ],
});
```

## Error Model

Runtime APIs reject with normal JavaScript errors. Playwright matchers return matcher failures that Playwright reports against the active test. CLI commands use a separate JSON envelope and exit-code contract documented in [CLI Reference](/docs/blackbox/reference/cli) and [Exit Codes](/docs/blackbox/reference/exit-codes).

## Stability

No stable-major compatibility guarantee applies during alpha. Pin versions through the lockfile and update the runtime, CLI, Node adapter, and instrumentation payload together.

For detailed signatures, continue to [Testbed API](/docs/blackbox/reference/testbed-api), [Playwright Flow Tags](/docs/blackbox/reference/scenario-dsl), and [Matchers and Effect Builders](/docs/blackbox/reference/matchers-and-effect-builders).
