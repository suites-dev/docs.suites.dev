---
title: "Configuration"
description: "Configure the SUT source, services, lifecycle, isolation, runner, evidence, and analysis policy."
sidebar_position: 5
keywords: ["Blackbox configuration", "blackbox.config.ts", "SUT source"]
---

`blackbox.config.ts` is the project-level runtime contract. It keeps SUT provisioning independent from runner, capture, evidence, and analysis choices.

## Complete Shape

```ts title="blackbox.config.ts"
import { defineBlackboxConfig } from "@suites/blackbox";

export default defineBlackboxConfig({
  sut: {
    source: {
      kind: "command",
      command: "node",
      args: ["dist/server.js"],
      cwd: ".",
    },
    services: {
      api: {
        endpoint: "http://127.0.0.1:3000",
        readiness: {
          kind: "http",
          url: "http://127.0.0.1:3000/health",
        },
        environment: {
          files: [".env.blackbox"],
          passthrough: [],
          values: { NODE_ENV: "test" },
        },
        capture: { language: "node" },
        layout: {
          artifactRoot: "dist",
          sourceMaps: "discover",
        },
      },
    },
  },
  lifecycle: { ownership: "blackbox" },
  isolation: { scope: "flow" },
  runner: { kind: "playwright", config: "playwright.config.ts" },
  evidence: { dir: ".blackbox/evidence" },
  analysis: { effects: "check" },
});
```

This fixed-port command example assumes one Playwright worker, no retries, and dedicated test data seeded or reset before the selected flow. Independent fixture keys keep this tutorial's attempts from depending on one another. For retries or tests that require clean database state per attempt, run the reset provider before every attempt or recreate the cell. Use a managed Compose or custom topology for parallel cells.

## Top-Level Fields

| Field       | Purpose                                               |
| ----------- | ----------------------------------------------------- |
| `sut`       | Source strategy and per-service runtime description   |
| `lifecycle` | Whether Blackbox or the user starts and stops the SUT |
| `isolation` | `flow`, `worker`, or `test` cell scope                |
| `runner`    | Native runner adapter and its configuration file      |
| `evidence`  | Sealed run directory                                  |
| `analysis`  | Effect and ODC policy                                 |

ODC runs as a report when `odc` is absent. Set `odc: "check"` only after the repository adopts an explicit ODC gate.

## SUT Source Kinds

| Kind         | Required starting point                           |
| ------------ | ------------------------------------------------- |
| `command`    | Host executable, arguments, and working directory |
| `compose`    | One or more Compose files                         |
| `dockerfile` | Dockerfile and build context                      |
| `artifacts`  | Prebuilt executable folders such as `dist/`       |
| `external`   | Already-running service endpoints                 |
| `custom`     | A typed provisioner implementation                |

[Choose How Blackbox Runs Your Application](/docs/blackbox/guides/set-up-the-testbed) compares the strategies.

## Service Fields

Each service has one stable ID and may declare:

- Its binding to the selected source.
- Application endpoint and readiness.
- Dotenv files, selected passthrough variables, and explicit environment values.
- Capture language and language-specific options.
- Executable artifact root and source-map strategy.
- Application or container ports.

Use one layout per service. Do not use global path prefixes to reconcile unrelated services.

## Source-Controlled Harness

The runtime configuration does not replace accepted behavior:

- Approved Gherkin and stable case identities.
- The project-owned system or E2E suite.
- Reviewed effects-catalog vocabulary and effect claims.
- SUT, isolation, capture, and analysis policy.

Commit reviewed source according to project policy. Keep generated alignment contracts reproducible, and retain complete sealed evidence when a CI finding needs investigation.

The public catalog syntax and generated artifact layout are not frozen. [See the current artifact ownership boundary](/docs/blackbox/reference/files-and-artifacts).
