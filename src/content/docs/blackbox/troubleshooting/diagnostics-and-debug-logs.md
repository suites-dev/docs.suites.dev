---
title: "Collect Diagnostics"
description: "Collect the static identity, runtime versions, sealed evidence, and analyzer findings needed to diagnose one Blackbox flow."
sidebar_position: 5
keywords: ["blackbox diagnostics", "sealed evidence", "capture integrity"]
---

Reduce the issue to one stable flow. Preserve evidence before changing implementation or accepted behavior.

## Confirm Static Identity

```bash
pnpm exec blackbox suites discover e2e/tests --json
pnpm exec blackbox suites check e2e/tests --json
```

When the flow uses requirements, also retain the output from `requirements validate`, `requirements check`, and `requirements drift`.

## Classify the Runtime Failure

| Failure class     | First evidence to inspect                                   |
| ----------------- | ----------------------------------------------------------- |
| Flow not selected | Runner-native tags and configured tag prefixes              |
| Cell not ready    | Provisioning, sidecar, SUT, and infrastructure lifecycle    |
| Capture empty     | Baggage identity, capture capabilities, and lifecycle close |
| Bundle rejected   | Protocol version and integrity findings                     |
| Effect failure    | Accepted contract and normalized observations               |
| ODC finding       | Exact sources, maps, decisions, and boundary signatures     |
| Report missing    | Analyzer result and reporter extension                      |

## Preserve One Diagnostic Package

Collect:

- Exact command and native runner output.
- Flow ID and accepted effect contract.
- Relevant Gherkin and EARS files, when used.
- Runner, capture, protocol, CLI, and reporter versions.
- Sidecar image digest and isolation scope.
- Sealed evidence bundle and integrity result.
- Structured analyzer output.

Redact secrets and sensitive payloads without changing the structure needed to reproduce the issue.

Run `pnpm exec blackbox doctor --json` for project and runtime readiness. Run `pnpm exec blackbox analyze --run <run-id>` to reproduce analysis from the preserved bundle without restarting the SUT.

Continue with [Report a Bug](/docs/blackbox/troubleshooting/reporting-a-bug) after reducing the issue to one flow.
