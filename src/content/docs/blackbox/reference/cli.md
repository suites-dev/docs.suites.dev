---
title: "CLI Reference"
description: "Use Blackbox runtime, project, flow, specification, suite, and Skill commands."
sidebar_position: 1
keywords:
  ["blackbox CLI", "blackbox test", "blackbox analyze", "blackbox suites"]
toc_min_heading_level: 2
---

The `blackbox` CLI is the deterministic facade for running flows, analyzing evidence, and maintaining the behavioral harness.

```bash
pnpm exec blackbox <command> --help
```

## Run and Analyze

| Command                               | Purpose                                                                                                     |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `blackbox test`                       | Load configuration, run selected tests, own managed SUT lifecycle, seal evidence, and apply analysis policy |
| `blackbox analyze --run <id\|latest>` | Verify and analyze an existing sealed run without starting the SUT                                          |

```bash
pnpm exec blackbox test
pnpm exec blackbox test --flow subscribe-user
pnpm exec blackbox analyze --run latest
```

Capture is unconditional during `blackbox test`. There is no separate record mode. Accepted policy determines which effect and ODC results gate the command.

## Inspect a Project

```bash
pnpm exec blackbox init --mode auto --json
pnpm exec blackbox doctor --json
pnpm exec blackbox status --json
pnpm exec blackbox explain <finding-code> --json
```

Use `doctor` for prerequisites, configuration, lifecycle, capture, and analyzer readiness. Use `explain` for the reason and next action behind a finding code.

## Inspect Flows

```bash
pnpm exec blackbox flows list --json
pnpm exec blackbox flows show subscribe-user --json
```

## Install Agent Skills

```bash
pnpm exec blackbox skills install --host codex --json
pnpm exec blackbox skills install --host codex --write --json
```

## Validate Requirements

```bash
pnpm exec blackbox requirements validate ./requirements --json
pnpm exec blackbox requirements check ./requirements --tests ./e2e --json
pnpm exec blackbox requirements drift ./requirements --tests ./e2e --json
```

## Generate and Check Gherkin

```bash
pnpm exec blackbox features generate \
  requirements/subscriptions.ears \
  --flow subscribe-user \
  --description "subscribing a user" \
  --requirement REQ-004 \
  --out e2e/features \
  --write \
  --json

pnpm exec blackbox features emit ./e2e --out ./baseline --json
pnpm exec blackbox features check ./e2e/features --requirements ./requirements --json
```

`features generate` starts from approved intent. `features emit` recovers a baseline from executable tests. Review generated behavior before accepting it.

## Generate and Align Suites

```bash
pnpm exec blackbox suites discover ./e2e --json
pnpm exec blackbox suites generate \
  e2e/features/subscribe-user.feature \
  --out e2e \
  --write \
  --json

pnpm exec blackbox suites align \
  e2e/features/subscribe-user.feature \
  --suite e2e/subscribe-user.system.test.ts \
  --write \
  --json

pnpm exec blackbox suites check ./e2e --json
```

Omit `--write` to inspect a source transformation before applying it. A successful write may still require human approval.

## JSON and Exit Codes

Use `--json` for machine-readable envelopes. Source-changing commands distinguish an unwritten proposal from a written result awaiting review.

Read [Exit Codes](/docs/blackbox/reference/exit-codes) before adding commands to automation.
