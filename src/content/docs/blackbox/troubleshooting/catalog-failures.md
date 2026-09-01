---
draft: true
title: "Effect Claim Failures"
description: "Diagnose violated, inconclusive, unsupported, and integrity findings for one accepted effect claim."
sidebar_position: 3
keywords:
  [
    "effect claim failure",
    "forbidden effect",
    "incomplete evidence",
    "effect finding",
  ]
---

An unknown-user case returns `404`, but one eligible `payment-charge-request` effect appears. The forbidden claim is **violated** even though the native test passed.

Start from the exact claim, sealed attempt, and finding. Do not change the accepted target merely to make the result pass.

## Classify the Finding First

| Finding               | What it establishes                                                                               | First check                                                  |
| --------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| **Violated**          | Eligible evidence establishes a counterexample or complete evidence proves a missing lower bound. | Compare the implementation with the accepted claim.          |
| **Inconclusive**      | Execution occurred, but completeness is insufficient for the requested conclusion.                | Inspect lifecycle, isolation, and loss facts.                |
| **Unsupported**       | The required capability or claim kind is outside the declared support cell.                       | Check capability admission and the certified support matrix. |
| **Integrity failure** | Identity, participation, protocol, loss, or sealing invariants failed.                            | Repair the earliest failed evidence boundary.                |

A valid normalized effect that no accepted claim references remains evidence. It is not a failure by itself.

## Check Eligibility Before Matching

1. Confirm plan, realization, case, attempt, and evidence identities agree.
2. Confirm the required participant and capability were admitted.
3. Confirm observations reached the requested proof strength.
4. Confirm lifecycle and integrity facts support the claim's proof burden.
5. Compare only eligible matching facts with the accepted cardinality.

Evidence from another retry, sequence member, service instance, or undeclared realization cannot complete the claim.

## Repair the Right Owner

- Repair implementation when the accepted claim is still correct and eligible evidence contradicts it.
- Repair capture or lifecycle when evidence cannot support the requested conclusion.
- Return a proposed catalog, claim, or policy change to a person for approval.
- Run a fresh managed-capture attempt after implementation, alignment, or runtime repair.

Reanalysis may reproduce a finding from unchanged accepted inputs and sealed evidence. It cannot prove a repaired execution happened.

## See Also

- [Effects Catalog Contract](/docs/blackbox/reference/catalog-schema)
- [Effect Claim Evaluation](/docs/blackbox/reference/matchers-and-effect-builders)
- [Capture Lifecycle and Correlation](/docs/blackbox/reference/capture-lifecycle-and-correlation)
