---
title: "Environment Variables"
description: "Supported Blackbox environment variables for the testbed, instrumentation payload, artifacts, reporting, debugging, and advanced Node coverage."
sidebar_position: 6
keywords:
  [
    "Blackbox environment variables",
    "BLACKBOX_INSTR_IMAGE",
    "BLACKBOX_COVERAGE_DIR",
    "OpenTelemetry test config",
  ]
---

Prefer typed configuration and CLI flags. Use environment variables for environment-specific paths, CI behavior, and diagnostics.

## Testbed and Instrumentation

| Variable                              | Default                     | Purpose                                                          |
| ------------------------------------- | --------------------------- | ---------------------------------------------------------------- |
| `BLACKBOX_INSTR_IMAGE`                | `blackbox-instr-node:local` | Instrumentation payload image used by the Node overlay           |
| `BLACKBOX_NODE_BINARY_PATH`           | `/usr/local/bin/node`       | Node binary path to shadow in every configured SUT               |
| `BLACKBOX_NODE_BINARY_PATH_<SERVICE>` | global value                | Per-service Node path; service name becomes uppercase snake case |
| `BLACKBOX_KEEP_STACK=1`               | off                         | Leave worker containers running after teardown for diagnosis     |

For service `fraud-check`, the override is `BLACKBOX_NODE_BINARY_PATH_FRAUD_CHECK`.

## Artifact Locations

| Variable                         | Default                                | Purpose                                            |
| -------------------------------- | -------------------------------------- | -------------------------------------------------- |
| `BLACKBOX_COVERAGE_DIR`          | `.blackbox-coverage`                   | Coverage root in connect mode and report lifecycle |
| `BLACKBOX_COVERAGE_OUTPUT`       | `<coverage-dir>/catalog/coverage.json` | Override the catalog coverage JSON path            |
| `BLACKBOX_SHAPE_COVERAGE_OUTPUT` | `<coverage-dir>/shape/coverage.json`   | Override shape coverage output                     |
| `BLACKBOX_FEATURES_DIR`          | `features`                             | Runtime Scenario DSL feature output                |

Prefer `coverageDir` and `blackboxReporter({ outputDir })` over setting output variables directly.

## Reporting

| Variable             | Default                                   | Purpose                                   |
| -------------------- | ----------------------------------------- | ----------------------------------------- |
| `BLACKBOX_REPORTERS` | `effects-report`                          | Comma-separated registered reporter names |
| `BLACKBOX_SINKS`     | `file`, plus GitHub Actions when detected | Comma-separated registered sink names     |

Unknown reporter or sink names produce a warning and are skipped. The core registry exposes `effects-report`, `junit`, `file`, `stdout`, and `github-actions`; adapter-registered coverage modules produce their own artifacts.

## Diagnostics

| Variable                 | Purpose                                             |
| ------------------------ | --------------------------------------------------- |
| `BLACKBOX_DEBUG=1`       | Include raw span detail in matcher failure output   |
| `BLACKBOX_DEBUG_TRACE=1` | Print per-test trace and debug-endpoint diagnostics |
| `BLACKBOX_KEEP_STACK=1`  | Preserve the failing topology for manual inspection |

Do not enable verbose diagnostics by default in CI; they can expose URLs, query text, and other test data.

## Advanced Node Coverage

| Variable                       | Purpose                                                            |
| ------------------------------ | ------------------------------------------------------------------ | ---------------------------------------------------- |
| `BLACKBOX_FUNCTION_SPANS=1`    | Enable the advanced function-span coverage mode                    |
| `BLACKBOX_FN_SPANS_MODE=loader | build-time`                                                        | Select loader or build-time function instrumentation |
| `BLACKBOX_STRICT_AST_DRIFT=1`  | Fail instead of warning when source and coverage coordinates drift |

These are advanced alpha controls. Use the default Node adapter path first and inspect OMC/DC limits before enabling function-span instrumentation.

Variables such as internal registry keys, run timestamps, partial-retention flags, and testbed markers are implementation details and are intentionally omitted.
