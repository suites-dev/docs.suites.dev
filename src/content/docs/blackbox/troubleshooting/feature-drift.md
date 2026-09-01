---
draft: true
title: "Gherkin and Suite Alignment Failures"
description: "Diagnose invalid, stale, missing, duplicate, redirected, or incomplete relationships between approved Gherkin and the executable suite."
sidebar_position: 2
keywords:
  [
    "Gherkin drift",
    "suite alignment failure",
    "stale binding",
    "Blackbox compilation error",
  ]
---

Start with the first alignment phase that failed. Do not change approved intent until you know whether the problem belongs to Gherkin, generated contracts, the project-owned suite, runner binding, or run selection.

## Match the Symptom to Its Owner

| Symptom                                         | Likely boundary                         | First action                                                                     |
| ----------------------------------------------- | --------------------------------------- | -------------------------------------------------------------------------------- |
| Gherkin cannot produce one concrete case        | Source or semantic compilation          | Resolve invalid, missing, duplicate, or ambiguous accepted declarations.         |
| Generated types reject a case or instruction    | Stale projection or project-owned suite | Regenerate from accepted inputs, then repair the suite against the new contract. |
| Expected test is missing during collection      | Suite registration or runner target     | Restore the declared runnable test or correct the selected target.               |
| An extra or duplicate test appears              | Suite registration                      | Remove the foreign registration or give the accepted case one exact binding.     |
| A case points to the wrong test or oracle       | Runner lowering                         | Repair the redirected binding. Do not match by title or source order.            |
| A sequence cannot be selected                   | Accepted topology or run selection      | Select the complete declared sequence or return the topology change to a person. |
| Runtime reports a different plan or realization | Stale execution                         | Rebuild the chain and start a fresh runtime attempt.                             |

## Repair the Earliest Invalid Stage

1. Read the phase and affected identities from the deterministic diagnostic.
2. Compare the accepted case with the generated type contract and project-owned test.
3. Decide whether the mismatch changes human intent or only its realization.
4. Return intent and policy changes to a person.
5. Repair generated or executable artifacts at their canonical owner.
6. Repeat every downstream alignment check.
7. Start a fresh runtime execution when any pinned plan or realization changed.

Do not copy an old identifier into every artifact to silence the error. A consistent foreign identity is still foreign to the accepted plan.

## Handle Common Blocking Shapes

### Missing or Ambiguous Gherkin Meaning

Compilation stops when a scenario, Examples row, step binding, claim, contract, or topology relationship resolves zero times or more than once.

Make the accepted relationship explicit. If more than one interpretation is plausible, return the choice to a person.

### Stale Generated Contract

A changed accepted case, instruction, claim, fixture, or contract makes the previous type projection stale.

Regenerate from the accepted source. Do not edit generated output into a competing source of meaning.

### Empty, Skipped, or Incomplete Suite

An accepted case needs executable actions, required native assertions, and complete effect-claim bindings. Empty bodies, unresolved actions, skipped accepted cases, and placeholder-only tests cannot enter runtime assurance.

Repair the project-owned suite, then repeat typecheck and runner collection.

### Missing, Extra, Duplicate, or Redirected Binding

Every selected case must bind to one declared runnable target. Similar titles and nearby source locations do not authorize substitution.

Repair the exact case-to-target relationship, then lower a new RunnerBundle.

### Stale Runtime Execution

Evidence remains bound to the SuitePlan, RunnerBundle, and RunPlan that created the attempt. Reanalysis cannot attach old evidence to a repaired alignment chain.

Run the repaired realization again with fresh managed capture.

## Escalate an Unexpected Semantic Change

Formatting, comments, source order, and display-title changes should not alter accepted meaning when all semantic relationships remain equal.

If such a change produces different SuitePlan meaning, retain both inputs and the deterministic diagnostics as a compiler defect report. Do not approve the unexpected difference as new intent.

## Continue

- [Alignment Checks and Blocking Conditions](/docs/blackbox/reference/alignment-checks): Look up every alignment gate.
- [Align Gherkin and the Executable Suite](/docs/blackbox/guides/recover-behavior-from-existing-tests): Repeat the complete workflow.
- [Case and Execution Identity](/docs/blackbox/reference/scenario-dsl): Check the identities that join accepted cases to execution.
