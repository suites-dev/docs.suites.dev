---
title: "Configuration"
description: "Reference for Playwright, testbed, reporter, EARS requirements, feature, and coverage configuration."
sidebar_position: 5
keywords:
  [
    "Blackbox configuration",
    "Playwright Blackbox config",
    "requirements config",
    "coverage configuration",
  ]
---

Blackbox configuration is split by ownership. There is no single global configuration file.

## Playwright Configuration

```ts
export default defineConfig({
  ...defineBlackboxConfig({ mode: "testbed", testbed }),
  testDir: "./e2e",
  testMatch: ["tests/**/*.system.test.ts"],
  fullyParallel: true,
  workers: 4,
  updateSnapshots: process.env.CI ? "none" : "missing",
  reporter: [
    ["list"],
    blackboxReporter({
      outputDir: "./e2e/.blackbox-coverage",
      failOnUncovered: true,
      failOnAlwaysFailing: true,
      keyNormalization: "aggressive",
    }),
  ],
});
```

`defineBlackboxConfig()` supports:

- `{ mode: 'testbed', testbed }` for kit-managed Compose or Testcontainers lifecycle;
- `{ mode: 'connect', coverageDir?, featuresDir? }` when the test suite connects to an environment started elsewhere.

## Testbed Configuration

`createBlackboxTestbed()` owns topology source, service overrides, grouping, reset, artifact directory, project names, and ambient-span policy. See [Testbed API](/docs/blackbox/reference/testbed-api).

## Reporter Configuration

`blackboxReporter()` accepts:

| Option                | Default                           |
| --------------------- | --------------------------------- |
| `catalog`             | empty; use per-test-file sidecars |
| `outputDir`           | empty; use `.blackbox-coverage`   |
| `failOnUncovered`     | `false`                           |
| `failOnAlwaysFailing` | `false`                           |
| `keyNormalization`    | `aggressive`                      |

## Requirements Configuration

Optional `requirements/config.yaml`:

```yaml
profile: ears-x
sources:
  - requirements/**/*.ears
tests: e2e
coverage: e2e/.blackbox-coverage/catalog/coverage.json
```

CLI flags override file values. Defaults are profile `ears-x`, source `requirements/**/*.ears`, tests `.`, and coverage `.blackbox-coverage/catalog/coverage.json`.

Requirement sidecars are strict. Unknown or malformed binding fields are findings. The convenience config is more tolerant; verify the resolved paths with `requirements check` before relying on defaults.

## Feature Commands

Feature paths are CLI flags:

- `features emit <paths...> --out <dir>`;
- `features check --tests <dir> --features <dir>`;
- `features drift --tests <dir> --features <dir>`.

`BLACKBOX_FEATURES_DIR` controls runtime Scenario DSL feature output when Playwright finalizes feature traces.

## Precedence

Precedence is subsystem-specific:

1. explicit CLI flags override requirements config and command defaults;
2. explicit JavaScript/TypeScript config overrides API defaults;
3. documented environment variables override selected testbed and reporting fields;
4. internal environment variables are not a supported configuration API.

See [Environment Variables](/docs/blackbox/reference/environment-variables) for the public overrides.
