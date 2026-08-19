---
title: "Package Responsibilities"
description: "Understand the stable user facade, extension packages, language integrations, and private runtime boundary."
sidebar_position: 2
keywords:
  [
    "Blackbox packages",
    "runner adapter",
    "capture package",
    "evidence protocol",
  ]
---

Normal projects configure Blackbox through `@suites/blackbox` and `@suites/blackbox/playwright`. Extension packages expose runner, provisioning, capture, protocol, and analysis contracts without leaking private runtime internals.

## User-Facing Packages

| Package                       | Responsibility                                                                   |
| ----------------------------- | -------------------------------------------------------------------------------- |
| `@suites/blackbox`            | Configuration, effects, and analysis facade                                      |
| `@suites/blackbox/playwright` | `blackboxPlaywright()` and `createBlackboxTest()`                                |
| `@suites/blackbox/effects`    | Effect-contract types and helpers                                                |
| `@suites/blackbox-cli`        | `test`, `analyze`, static specifications, flows, project diagnostics, and Skills |

Most users do not import any lower-level package.

## Extension Packages

| Package                              | Responsibility                                                                                          |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| `@suites/blackbox-protocol`          | Versioned language-neutral identities, capabilities, messages, integrity failures, and evidence schemas |
| `@suites/blackbox-testbed`           | SUT source declarations, environment resolution, cells, and custom provisioning contracts               |
| `@suites/blackbox-runner`            | Framework-neutral flow, attempt, retry, and correlation lifecycle                                       |
| `@suites/blackbox-runner-playwright` | Native Playwright adapter                                                                               |
| `@suites/blackbox-capture-node`      | Small in-process Node effect and native-artifact capture payload                                        |
| `@suites/blackbox-analyzer-node`     | Offline V8 and source-map decoding into neutral decision evidence                                       |
| `@suites/blackbox-effects`           | Language-neutral sealed-evidence effect checking                                                        |
| `@suites/blackbox-coverage-odc`      | Language-neutral ODC engine and renderers                                                               |

Capture and analysis remain separate. A SUT-side language package does not carry AST analysis, report rendering, or CLI code into the application process.

## Add Another Language

A language integration normally has two packages:

```text
@suites/blackbox-capture-<language>
@suites/blackbox-analyzer-<language>
```

The capture package emits normalized effects or native artifacts during execution. The analyzer converts those artifacts into language-neutral decisions offline. Both bind to published JSON Schemas from `@suites/blackbox-protocol`.

## Private Runtime Boundary

`@suites/blackbox-runtime` owns the sidecar, control transport, artifact store, and evidence sealing. It is private and is not a user import.

The CLI and public facade configure the runtime. Runner adapters, provisioners, capture packages, and analyzers communicate through published contracts.

## See Also

- [Configuration](/docs/blackbox/reference/configuration)
- [Runtime Evidence](/docs/blackbox/concepts/runtime-evidence)
