---
draft: true
title: "Exit Codes"
description: "Distinguish successful verification, behavioral findings, invalid configuration, and untrusted runtime evidence."
sidebar_position: 2
---

Blackbox uses four process exit codes.

| Code | Meaning                                                     | CI action                                             |
| ---- | ----------------------------------------------------------- | ----------------------------------------------------- |
| `0`  | Runner, integrity, and configured analysis policies passed  | Continue                                              |
| `1`  | Native test or behavioral findings                          | Fail the gate and repair against the accepted harness |
| `2`  | Usage or configuration error                                | Fix invocation or project configuration               |
| `3`  | Provisioning, capture, infrastructure, or integrity failure | Restore a trustworthy execution environment           |

## Findings Versus Integrity Failures

Exit `1` means Blackbox produced a trusted negative result. The implementation can usually be repaired against the fixed harness.

Exit `3` means Blackbox cannot support a conclusive behavior result. Do not ask an agent to repair application behavior until capture, isolation, artifacts, and integrity are trustworthy.

## Source-Change States

Source-generating commands can exit `0` while reporting:

- `preview`: Blackbox calculated a change but wrote nothing.
- `awaiting-review`: Blackbox wrote the deterministic change, but a person has not approved it.

Neither state grants behavioral authority.

## Read Structured Findings

Use `--json` in automation. The exit code controls the job; the result envelope identifies the flow, layer, finding code, evidence reference, and next action.
