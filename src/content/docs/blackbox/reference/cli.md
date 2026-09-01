---
title: "CLI and Exit Behavior"
description: "Reference the canonical Blackbox validation commands, deterministic output rules, and process exits."
sidebar_position: 5
keywords:
  [
    "Blackbox CLI",
    "features check",
    "scenarios check",
    "suites typecheck",
    "Blackbox exit codes",
  ]
---

Use the primary Blackbox commands to validate authored behavior, compiled closure, and the generated TypeScript surface before runtime allocation.

## Primary Commands

| Command                     | Responsibility                                      |
| --------------------------- | --------------------------------------------------- |
| `blackbox features check`   | Validate authored Gherkin                           |
| `blackbox scenarios check`  | Validate compiled semantic and executable closure   |
| `blackbox suites typecheck` | Type-check the generated TypeScript binding surface |

These names are canonical. Compatibility aliases do not replace them, and Blackbox has no EARS command.

## Process Exits

| Exit | Meaning                                                                                             |
| ---- | --------------------------------------------------------------------------------------------------- |
| `0`  | Eligible ordinary assurance succeeded                                                               |
| `1`  | An assurance outcome exists and contains a non-success verdict or finding                           |
| `2`  | Invocation, configuration, project-root, or unreadable-input failure prevented an assurance outcome |

Exit `1` includes violated, inconclusive, unsupported, and integrity-failure outcomes. Optional Decision Coverage can be unavailable without changing an otherwise successful ordinary assurance exit.

## Deterministic Output

Human and JSON modes agree on the exit. Given unchanged canonical inputs, `--no-color` output remains byte-identical across isolated processes.

Human findings expose the outcome, case, evidence sufficiency, finding, verdict, repair owner, permitted actions, and earliest required rerun gate. The CLI preserves producer-owned truth. It does not invent missing repair routing.

Handled JSON output contains one deterministic envelope followed by one line feed. It uses `schemaVersion` value `1` and begins with `schemaVersion`, `command`, and `status`. Nested keys are ordered deterministically, while findings preserve producer order.

## Output Streams

- Human exits `0` and `1` write the report to stdout and leave stderr empty.
- Human exit `2` writes one concise diagnostic to stderr and leaves stdout empty.
- Handled JSON output writes one envelope to stdout and leaves stderr empty, including exits `1` and `2`.

## See Also

- [Effects and Claim Evaluation](/docs/blackbox/reference/effects-and-claims)
- [Add Blackbox to CI](/docs/blackbox/guides/reports-and-ci-gates)
