---
title: "Empty or Incomplete Capture"
description: "Diagnose a tagged flow that produced no evidence or a bundle that cannot support trusted analysis."
sidebar_position: 1
keywords:
  ["empty Blackbox evidence", "capture integrity", "missing runtime effects"]
---

An empty report does not prove that the system did nothing. It means the requested analysis did not receive enough trusted evidence.

## Check the Lifecycle in Order

1. Confirm the runner selected a tag with the configured prefix. The default is `@flow:`.
2. Confirm the flow received the intended `flow`, `worker`, or `test` capture cell.
3. Confirm the SUT used the expected language capture implementation.
4. Confirm W3C baggage carried the test identity to the relevant service.
5. Confirm the cell closed cleanly and sealed a bundle.
6. Confirm the bundle declares the capability required by the analyzer.

## Read Integrity Before Behavior

Inspect the evidence manifest before the effect verdict:

| Check                    | Failure meaning                                  |
| ------------------------ | ------------------------------------------------ |
| Flow identity            | Evidence cannot be assigned to the selected flow |
| Capture capability       | The requested boundary was not observable        |
| Source and map integrity | ODC cannot locate or compare decisions soundly   |
| Lifecycle close          | Buffered evidence may be incomplete              |
| Protocol compatibility   | The analyzer cannot safely read the bundle       |

An integrity failure must not become a passing effect result.

## Common Causes

- The test did not carry a recognized flow tag.
- The flow never crossed a supported captured boundary.
- Test identity did not propagate to the service that emitted the effect.
- The wrong SUT image or capture implementation entered the cell.
- The process ended before evidence was flushed and sealed.
- The analyzer requested a capability the bundle does not contain.

## Do Not Add Unrelated Instrumentation

Blackbox does not require an application-owned OpenTelemetry provider, debug HTTP endpoint, Node binary replacement, AST wrapping, or host-to-container source prefixes. Adding those mechanisms will not repair capture identity or evidence integrity.

## What to Collect

- Flow ID and runner adapter version.
- Isolation scope and test identity.
- Capture implementation and sidecar identity.
- Bundle manifest and integrity findings.
- Expected boundary and smallest reproducing flow.
