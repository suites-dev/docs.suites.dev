---
title: "Project Conventions"
description: "Reference for Blackbox convention-based discovery, Playwright ownership, effect YAML, artifacts, and environment overrides."
sidebar_position: 5
keywords:
  [
    "Blackbox conventions",
    "Playwright Blackbox config",
    "requirements files",
    "effect YAML",
  ]
---

Blackbox discovers the behavioral harness from repository conventions. This wave does not define a root Blackbox manifest.

Run `blackbox init` first during onboarding, then use `blackbox doctor` to validate the environment. The `init` flow is intentionally not documented here yet.

## Discovery Conventions

| Convention                     | Purpose                                                              |
| ------------------------------ | -------------------------------------------------------------------- |
| `requirements/**/*.ears`       | Reviewed EARS requirement sources.                                   |
| `features/**/*.feature`        | Reviewed Gherkin features.                                           |
| `features/<flow>.effects.yaml` | Reviewed required and forbidden effects for one flow.                |
| `playwright.config.*`          | Playwright owns scheduling, projects, reporters, and test selection. |
| `.blackbox-coverage/`          | Runtime evidence, coverage, and report artifacts.                    |

The stable flow ID connects those files. Blackbox validates that the feature basename, Gherkin `@flow:<id>` tag, effect YAML `flow`, and Playwright flow tag agree.

## Playwright Configuration

Playwright remains the test runner. Use normal Playwright configuration and native test APIs.

```ts
import { defineConfig } from "@playwright/test";
import {
  blackboxReporter,
  defineBlackboxConfig,
} from "@suites/blackbox/playwright";
import { testbed } from "./blackbox-testbed";

export default defineConfig({
  ...defineBlackboxConfig({ mode: "testbed", testbed }),
  testDir: "./e2e",
  testMatch: ["**/*.system.test.ts"],
  fullyParallel: true,
  reporter: [["list"], blackboxReporter({ outputDir: ".blackbox-coverage" })],
});
```

`defineBlackboxConfig()` supports:

- `{ mode: "testbed", testbed }` for a managed Compose or Testcontainers lifecycle;
- `{ mode: "connect", coverageDir? }` when the suite connects to an environment started elsewhere.

## Testbed Configuration

`createBlackboxTestbed()` owns topology source, service overrides, grouping, reset, artifact directory, project names, and ambient-span policy. See [Testbed API](/docs/blackbox/reference/testbed-api).

Docker Compose and other topology files remain external project infrastructure. They are not Blackbox-owned YAML.

## Effect YAML

The only Blackbox-owned public YAML artifact is the effect contract:

```yaml
specVersion: "0.1"
flow: subscribe-unknown-user
requires:
  - { boundary: postgres, op: SELECT, key: users, service: bff }
forbids:
  - { boundary: http, op: POST, key: /v1/payment_intents, service: bff }
```

The file lives beside the feature file as `features/subscribe-unknown-user.effects.yaml`.

## Environment Overrides

Use environment variables for runtime-only overrides such as the instrumentation image, artifact directory, and diagnostic logging. Do not use environment variables to redefine accepted requirements, features, or effect contracts.

See [Environment Variables](/docs/blackbox/reference/environment-variables) for the public overrides.

## Practical Defaults

1. Keep requirements in `requirements/**/*.ears`.
2. Keep Gherkin and effect YAML under `features/`.
3. Declare flows with native Playwright `test.describe(..., { tag: "@flow:<id>" })`.
4. Ignore `.blackbox-coverage/` by default.
5. Run `blackbox doctor` after changing the testbed, Playwright config, or artifact layout.

## Summary

- **Playwright owns execution configuration.**
- **Blackbox discovers behavioral artifacts by convention.**
- **Effects are the only Blackbox-owned YAML contract.**
- **`doctor` is the documented readiness check for this wave.**
