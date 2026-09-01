---
draft: true
title: "Effect Claim Evaluation"
description: "Reference how proof strength, cardinality, evidence completeness, and integrity determine an effect finding."
sidebar_position: 6
keywords:
  [
    "effect claim evaluation",
    "effect cardinality",
    "required effect",
    "forbidden effect",
    "effect verdict",
  ]
---

A completed checkout has two eligible `payment-charge-request` effects. The accepted claim allows at most one, so the Analyzer can report **violated** immediately. It does not need complete capture to know that two is greater than one.

Effect evaluation compares one accepted claim with eligible, matching effect facts from one sealed attempt.

:::info Committed Behavior
These proof-burden and verdict rules are part of the committed effects core. Alpha execution support remains limited to certified capability cells.
:::

## Match the Requested Proof Strength

| Requested proof | Matching evidence                                                     |
| --------------- | --------------------------------------------------------------------- |
| **Observed**    | An admitted, attributable operation was recorded.                     |
| **Succeeded**   | The operation also completed successfully under its capability rules. |
| **Committed**   | Separate state evidence confirms the change was committed.            |

A successful operation can produce both observed and succeeded facts. A successful SQL span alone does not produce committed proof.

## Evaluate Cardinality With the Right Proof Burden

Let `N` be the accepted count and `M` the number of eligible matching facts.

| Claim                | Satisfied when                   | Violated when                    | Inconclusive when                  |
| -------------------- | -------------------------------- | -------------------------------- | ---------------------------------- |
| **At least N**       | `M >= N`                         | Capture is complete and `M < N`  | `M < N` and capture is incomplete  |
| **At most N**        | Capture is complete and `M <= N` | `M > N`                          | `M <= N` and capture is incomplete |
| **Exactly N**        | Capture is complete and `M == N` | `M > N`, or complete and `M < N` | `M <= N` and capture is incomplete |
| **Forbidden/absent** | Capture is complete and `M == 0` | `M > 0`                          | `M == 0` and capture is incomplete |

Positive counterexamples are monotonic. Once Blackbox observes more than an upper bound or any forbidden effect, later evidence cannot erase that violation.

## Apply Eligibility Before Cardinality

The Analyzer evaluates evidence eligibility before it counts matches:

1. Plan, realization, case, attempt, and evidence identities agree.
2. The required participant and capability were admitted.
3. Matching facts have the requested proof strength.
4. Lifecycle and integrity facts establish the proof burden required by the claim.
5. Cardinality is evaluated over the eligible matching facts.

Evidence from another attempt, retry, sequence member, service instance, or undeclared realization never enters the count.

## Keep Unlisted Effects as Evidence

A valid normalized effect that no accepted claim references remains recorded evidence. It does not become required, forbidden, or a product defect automatically.

A person may review that evidence and approve a new catalog entry or claim for a later plan revision.

## Map Limitations to Distinct Verdicts

| Condition                                                         | Verdict               |
| ----------------------------------------------------------------- | --------------------- |
| Eligible evidence meets the complete proof burden                 | **Satisfied**         |
| Eligible evidence establishes a counterexample                    | **Violated**          |
| Execution occurred but completeness is insufficient               | **Inconclusive**      |
| Required capability or claim kind is outside declared support     | **Unsupported**       |
| Identity, participation, protocol, loss, or seal invariant failed | **Integrity failure** |

Only **satisfied** passes a required claim gate. Native test results, other effect findings, and optional ODC findings remain separate.

## See Also

- [Effects Catalog Contract](/docs/blackbox/reference/catalog-schema): See what catalog vocabulary and normalization must preserve.
- [Runtime Evidence and Integrity](/docs/blackbox/concepts/runtime-evidence): Understand the evidence conditions behind completeness.
- [OpenTelemetry and Effects](/docs/blackbox/concepts/effects-and-catalogs): Return to the complete observation-to-finding explanation.
