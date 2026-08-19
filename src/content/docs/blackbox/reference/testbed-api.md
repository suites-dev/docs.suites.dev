---
title: "Testbed API"
description: "Reference SUT source strategies, isolation-cell ownership, readiness, reset, and custom provisioning."
sidebar_position: 3
keywords: ["Blackbox testbed", "isolation cell", "provisioning API"]
---

The testbed turns a SUT source declaration into isolation cells. Runner and language integrations remain independent from provisioning.

## Source Strategies

| Kind         | Testbed responsibility                                        |
| ------------ | ------------------------------------------------------------- |
| `command`    | Start, wait for, capture, and stop a host process             |
| `compose`    | Create cell-specific Compose projects and generated overrides |
| `dockerfile` | Build and run an ephemeral captured service image             |
| `artifacts`  | Assemble a runtime around prebuilt executable folders         |
| `external`   | Connect a capture session without owning SUT lifecycle        |
| `custom`     | Delegate environment creation to a provisioner callback       |

## Isolation Cell

A cell owns:

- Run, worker, and cell identity.
- SUT service instances and immutable service IDs.
- Mutable dependencies assigned to the cell.
- Capture configuration and capabilities.
- A private sidecar and evidence partition.
- Reset and teardown responsibility.

The scope is `flow`, `worker`, or `test`. See [Configure Isolation and Parallelism](/docs/blackbox/guides/playwright-isolation-and-parallelism) for lifecycle timing.

## Managed Lifecycle

When `lifecycle.ownership` is `blackbox`, the testbed:

1. Provisions the selected source.
2. Injects capture for each declared service.
3. Waits for every required service.
4. Returns endpoints to the runner adapter.
5. Resets or replaces state before independent attempts.
6. Settles capture and seals evidence.
7. Stops owned resources.

Setup fails when only part of the required topology becomes ready.

## External Lifecycle

When ownership is `user`, the testbed creates the evidence session and validates capture readiness without starting or stopping the SUT.

External readiness does not establish state isolation. Supply a reset provider or dedicated environment before relying on forbidden-effect claims.

## Custom Provisioner Contract

A custom provisioner receives immutable cell identity and returns:

- Service IDs and endpoints.
- Capture attachment details.
- Declared mutable resources.
- Reset or fresh-cell assurance.
- Idempotent teardown.
- Isolation assurance.

The provisioner does not depend on Playwright. It operates behind the runner-neutral cell contract.

## See Also

- [Choose How Blackbox Starts Your SUT](/docs/blackbox/guides/set-up-the-testbed)
- [Configuration](/docs/blackbox/reference/configuration)
