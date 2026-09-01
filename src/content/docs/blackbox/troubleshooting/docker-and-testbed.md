---
draft: true
title: "Capture Cell and Testbed"
description: "Diagnose source provisioning, readiness, capture attachment, isolation, reset, and teardown failures."
sidebar_position: 4
keywords:
  ["capture cell troubleshooting", "Blackbox testbed", "SUT provisioning"]
---

A capture-cell failure happens before Blackbox can trust runtime evidence. Fix provisioning and integrity before changing assertions or effect policy.

## Identify the Source Strategy

| Source       | First checks                                                                                   |
| ------------ | ---------------------------------------------------------------------------------------------- |
| `command`    | Executable, arguments, working directory, environment, and readiness URL                       |
| `compose`    | File layering, service binding, health checks, dynamic ports, and complete dependency topology |
| `dockerfile` | Build context, target, executable artifacts, application port, and architecture                |
| `artifacts`  | Artifact root, runtime executable, source maps, and application port                           |
| `external`   | Endpoint reachability, user-owned capture attachment, and isolation assurance                  |
| `custom`     | Provisioner failure, partial resources, reset, and idempotent teardown                         |

## Run Project Diagnostics

```bash
pnpm exec blackbox doctor --json
```

Use the finding code with:

```bash
pnpm exec blackbox explain <finding-code> --json
```

## Check the Cell Boundary

Confirm that the cell contains or controls:

- Every declared SUT service.
- The mutable databases, caches, queues, stores, and workers used by the flow.
- One unambiguous capture identity per service instance.
- Network access between the runner, SUT, sidecar, and dependencies.
- A reset or replacement boundary before independent attempts.

Starting a fresh API while sharing stale mutable dependencies does not satisfy flow isolation.

## Check Readiness and Capture

The service must become application-ready and send its capture capability declaration before Playwright begins the attempt.

Look for:

- A health endpoint that answers before dependencies are usable.
- A wrong host or container port.
- Multiple services sharing one service ID.
- Capture attached after application modules loaded.
- A process that exits during readiness.

## Check Teardown Order

Blackbox settles correlated work, flushes capture, seals cell evidence, and only then stops owned resources. A process killed before settle produces a partial or integrity-failed attempt.

## Recovery

1. Reduce the run to one selected case and declared realization.
2. Use `isolation.scope: "flow"`.
3. Confirm every service and dependency becomes ready.
4. Confirm service identity and capture capabilities in the cell manifest.
5. Confirm the attempt settles before teardown.
6. Run `blackbox analyze` only after integrity passes.

## What to Collect

- `blackbox.config.ts` with secrets removed.
- Source strategy and selected isolation scope.
- `blackbox doctor --json` output.
- SUT build or launch logs.
- Cell and attempt manifests.
- Integrity findings and referenced artifact digests.
