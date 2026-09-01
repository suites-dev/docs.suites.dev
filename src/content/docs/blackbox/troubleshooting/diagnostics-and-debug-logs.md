---
draft: true
title: "Collect Diagnostics"
description: "Collect the static identity, runtime versions, sealed evidence, and analyzer findings needed to diagnose one Blackbox flow."
sidebar_position: 5
keywords: ["blackbox diagnostics", "sealed evidence", "capture integrity"]
---

Reduce the issue to one stable flow. Preserve evidence before changing implementation or accepted behavior.

## Confirm Static Identity

Retain the Gherkin compilation, generated-contract, typecheck, collection, and runner-lowering diagnostics for the affected case.

The final public alignment commands are not frozen. Preserve the diagnostics produced by the supported Alpha workflow instead of relying on experimental Stage 05 command names.

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
- Approved Gherkin, effect claims, and generated alignment contracts.
- Selected plan, realization, case, attempt, retry, and evidence-window identities.
- Runner, capture, protocol, analyzer, and renderer versions.
- Admitted capabilities, participating services, and isolation scope.
- Sealed evidence bundle and integrity result.
- Structured analyzer output.

Redact secrets and sensitive payloads without changing the structure needed to reproduce the issue.

Run `pnpm exec blackbox doctor --json` for project and runtime readiness. Run `pnpm exec blackbox analyze --run <run-id>` to reproduce analysis from the preserved bundle without restarting the SUT.

Continue with [Report a Bug](/docs/blackbox/troubleshooting/reporting-a-bug) after reducing the issue to one flow.
