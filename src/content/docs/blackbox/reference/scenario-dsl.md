---
title: "Case and Execution Identity"
description: "Distinguish accepted case identity from runner selection, physical attempts, evidence windows, and findings."
sidebar_position: 7
keywords:
  [
    "Blackbox case identity",
    "attempt identity",
    "runner binding",
    "evidence identity",
  ]
---

Two scenarios can share a title, and one scenario can run more than once. Blackbox therefore uses explicit identities instead of filenames, display names, or timing to connect accepted intent with runtime evidence.

:::info Public Syntax Not Frozen
The identity responsibilities and fail-closed relationships are accepted for Alpha 3. Public tag syntax, generated fields, and serialized shapes are not defined by this page.
:::

## Keep the Identity Chain Directional

```text
approved Gherkin case
  -> SuitePlan case
  -> RunnerBundle binding
  -> RunPlan selection
  -> assignment and physical attempt
  -> evidence window and sealed evidence
  -> finding
```

Every link refers backward to an identity already declared by its owner. A runner cannot create an accepted case, and runtime evidence cannot attach itself to a case by resemblance.

## Separate Semantic and Physical Identity

| Identity class      | Distinguishes                                                                 |
| ------------------- | ----------------------------------------------------------------------------- |
| **Accepted case**   | One concrete approved scenario or Examples row and its claims.                |
| **Realization**     | The exact runner target and oracle bindings that implement the accepted case. |
| **Selection**       | The declared cases and realization chosen for one run.                        |
| **Assignment**      | The runner scheduling decision for a selected case.                           |
| **Attempt**         | One physical execution, including a runner retry.                             |
| **Evidence window** | The capture boundary that admits observations for that attempt.               |
| **Finding**         | The Analyzer result derived from the pinned inputs and sealed evidence.       |

An application-internal retry can remain inside one physical case attempt. A runner retry creates a new attempt and fresh evidence window.

## Reject Implicit Substitution

These values can help a person navigate diagnostics, but they do not establish identity:

- Scenario or test title.
- File path or source order.
- Worker or shard position.
- Timestamp overlap.
- OpenTelemetry trace or span ID by itself.

A missing, duplicate, redirected, stale, or foreign identity blocks the chain. Blackbox does not select the nearest test or merge evidence from a similar attempt.

## Preserve Identity Through Change

Presentation-only changes should preserve accepted case identity when the semantic case, claims, bindings, and topology remain equal. A changed accepted outcome or claim creates new accepted meaning. A changed runner implementation can create a new realization without changing that meaning.

After either change, repeat alignment and execute a fresh attempt. Reanalysis can reproduce findings from existing sealed evidence, but it cannot rebind that evidence to a different case or realization.

## See Also

- [Plans and Realizations](/docs/blackbox/reference/plans-and-realizations)
- [Alignment Checks and Blocking Conditions](/docs/blackbox/reference/alignment-checks)
- [Capture Lifecycle and Correlation](/docs/blackbox/reference/capture-lifecycle-and-correlation)
