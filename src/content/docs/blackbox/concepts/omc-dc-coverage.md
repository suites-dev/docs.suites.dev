---
title: "OMC/DC Coverage"
description: "Deep decision coverage for system tests: proving that code changes produce distinguishable behavioral effects."
sidebar_position: 4
---

## What is OMC/DC?

**OMC/DC coverage** is Blackbox's Deep Coverage layer for system tests. It asks whether a decision in the running system produced behavior that the test could distinguish at the boundary.

Line coverage can tell you that a branch ran. Branch coverage can tell you that both arms ran. OMC/DC asks a stronger question: did either arm change the observed effects of the system?

That question matters because a passing system test can still hide a weak proof. A `subscribe-flow` test might return the expected response while two internal decisions leave the same observable behavior behind. In that case, the test did run code, but it did not prove that the decision mattered.

Blackbox builds this view from the same runtime evidence described in [System Effects](/docs/blackbox/concepts/effects-and-catalogs). The effect catalog records the behavior you require or forbid. OMC/DC uses observed effects as evidence for decision proof.

**Decision proof** means that Blackbox can connect a decision arm to a distinguishable boundary effect. It is not a formal proof of every possible execution. It is proof about the real Playwright system-test run and the evidence captured from that run.

## Decision Proof: Did it Matter at the Boundary?

OMC/DC treats a system test as evidence, not as a coverage percentage to admire. Passing a test proves the code ran. OMC/DC checks whether the code mattered.

The core comparison is between decision arms and effect signatures. An **effect signature** is the set of observed boundary effects Blackbox can associate with a test or branch arm. Distinguishable signatures create stronger proof. Indistinguishable effects point to masking.

Use the five-service showcase topology as the mental model. In `subscribe-flow`, a known user such as `alice` posts to `/subscriptions` and the system crosses the expected subscription boundaries. In `subscribe-unknown-user`, `ghost-user` posts to the same endpoint and the flow should stop much earlier. Those paths should not look identical at the boundary.

If the known-user and unknown-user paths leave different observed effects, OMC/DC can use that difference as decision proof. The branch did more than execute. Its outcome changed what the system did.

If both paths return different status codes but leave the same effect signature, the report has weaker evidence. The endpoint assertion may still pass, but the runtime behavior did not prove the decision at the boundary.

This is why OMC/DC is stronger than simple line coverage. Line coverage can mark both arms as covered even when their effects are indistinguishable. OMC/DC keeps asking whether the observed system behavior changed.

It is also why OMC/DC is not the same thing as effect coverage. Effect coverage asks whether required and forbidden effects were observed correctly. OMC/DC asks whether decisions produced distinguishable effects.

## The Verdict Hierarchy

Read OMC/DC verdicts as a hierarchy of proof strength. They are not a replacement for the test result, and they are not all bugs. They tell you how much decision proof the current run can support.

| Verdict | Proof strength | What it means |
| --- | --- | --- |
| `propagating` | Strongest | The branch arms produced distinguishable observed effects. |
| `masking-candidate` | Exercised but weak | Both arms ran, but their effect signatures were indistinguishable. |
| `coverage-gap` | Missing evidence | The run did not observe enough arm coverage to prove the decision. |
| `undecidable` | Evidence could not be classified | Blackbox could not make a useful decision from the available evidence. |
| `multi-arm` | Needs manual review | The decision shape is more complex than a simple two-arm comparison. |
| `unsupported-mcdc` | Alpha limitation | The current engine does not support this decision shape yet. |

The hierarchy starts with `propagating` because the report can show a meaningful behavioral difference. `masking-candidate` is weaker because the test may have exercised both arms without proving a behavioral distinction. Gaps and undecidable states sit lower because the run did not provide enough usable evidence.

Use the hierarchy to choose the right action. A `masking-candidate` often calls for a better scenario or more precise effect evidence. A `coverage-gap` often calls for another case. An `undecidable` row usually means you need to inspect instrumentation, source mapping, or the decision shape.

### Propagating vs. Masking

`propagating` is the verdict you want on important decisions. It means the decision outcome propagated into observable behavior. The report can point to branch arms whose observed effects are different enough to prove that the decision mattered.

For the subscription showcase, that means `subscribe-flow` and `subscribe-unknown-user` should leave different evidence. The known-user path and the `ghost-user` path do not have the same behavioral meaning, so the boundary evidence should not collapse into the same signature.

`masking-candidate` means Blackbox saw both arms, but the effects looked the same from the evidence it had. This is not automatically an application bug. It is a proof problem.

Masking can happen when both arms intentionally perform the same boundary work. It can also happen when the important difference stays inside local computation and never becomes an observed effect.

If the decision matters, improve the evidence. Add a scenario that reaches a more distinctive outcome, promote the relevant behavior into the effect catalog, or enable more detailed spans when boundary effects alone are not enough.

### Coverage Gaps and Undecidable States

`coverage-gap` means Blackbox does not have enough observed arm evidence. The branch may have one arm covered, no useful false-arm test, or a not-observed set that prevents decision proof.

Do not read a gap as proof of wrong behavior. Read it as missing proof. The system may be correct, but the current test suite did not exercise enough of the decision to show it.

`undecidable` is different. It means Blackbox had evidence, but could not classify it into a useful verdict. That can happen when source coordinates are missing or the branch shape does not map cleanly.

`multi-arm` and `unsupported-mcdc` are also honest limits. They preserve the distinction between "proved" and "not proved yet." Blackbox should not present a complex or unsupported decision as passing just because the surrounding test passed.

The current alpha engine reports what the captured Playwright run can support. It does not claim complete decision coverage for inputs that never ran, code that executed before instrumentation, or detached work that escaped attribution.

## Reading the OMC/DC Report

Start with the human report, then drill down only where needed.

1. Open `omcdc/verdict.md` for endpoint summaries, verdict counts, branch rows, and hints.
2. Open `omcdc/verdict.html` when you need source snippets, branch-level inspection, or a faster way to compare rows.
3. Use `omcdc/verdict.json` when automation or an agent needs the full structured result.
4. Read `catalog/coverage.json` and `shape/coverage.json` after the OMC/DC verdicts, because those files answer catalog and shape questions.

For each important endpoint, ask:

1. Which decisions are `propagating`?
2. Which decisions are `masking-candidate` and therefore exercised but not proven at the boundary?
3. Which decisions are gaps, undecidable, multi-arm, or unsupported?

For the showcase, inspect the rows around `subscribe-flow` and `subscribe-unknown-user`. You are looking for proof that the known-user path and the `ghost-user` path produce distinguishable behavior, not only proof that `/subscriptions` returned a value.

Use the OMC/DC report before you argue from a coverage number. A high line-coverage result can still miss a masked decision.

For the practical artifact workflow, continue to [Reading Coverage Reports](/docs/blackbox/guides/reading-coverage-reports).
