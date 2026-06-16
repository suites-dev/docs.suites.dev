---
title: "OMC/DC Coverage"
description: "Explain how Blackbox turns real system runs into decision coverage artifacts."
sidebar_position: 4
keywords: ["omc dc coverage", "decision coverage", "system test coverage"]
toc_min_heading_level: 2
seo:
  primary_keyword: "omc dc coverage"
  secondary_keywords: ["decision coverage", "system test coverage", "mcdc coverage"]
  search_intent: "educational intent from developers comparing decision coverage with system-test behavior coverage"
  snippet_angle: "explain OMC/DC as system-test decision coverage based on observed effects, not unit-test line coverage"
---

## Abstract

OMC/DC coverage is Blackbox's decision-coverage view of a real system run. It answers a different question from unit-test coverage: not "which lines ran in a small function test," but "which decisions changed the observable behavior of the system test?"

It is related to MCDC, but Blackbox applies the idea at the system-test evidence layer. The engine looks at branches, the tests that exercised their arms, and the runtime effects observed for those tests.

## Audience

Readers who want to understand what Blackbox means by coverage before they look at the report files.

## What It Covers

1. Branch and decision behavior observed during a system test.
2. Whether the run exercised the expected boundary effects.
3. Whether the run left gaps, masking candidates, or uncovered behavior.
4. Whether those runs came from serial chains or parallel siblings in the BDD DSL.

## How It Relates To System Effects

OMC/DC coverage is not the effect catalog, and it is not another name for effect coverage.

The effect catalog records the effects that matter for a flow. Matchers use that catalog to check whether the run covered required effects and avoided forbidden effects. OMC/DC uses the observed effects as evidence for a different question: did a decision in the system produce behavior that the system test could distinguish?

That distinction keeps the artifacts readable:

| Artifact | Job |
| --- | --- |
| Effect catalog | Records required and forbidden effects for a flow |
| Effect coverage | Reports whether cataloged effects were observed, missing, forbidden, or newly seen |
| OMC/DC coverage | Reports whether decisions produced distinguishable observed behavior |

## What OMC/DC Means Here

In classic MCDC, the useful question is whether each condition can independently affect a decision outcome. In Blackbox, the useful system-test question is whether a decision arm affected the observable runtime behavior that the system test can prove.

That is why the report compares branch arms against effect signatures. If both arms ran but produced the same boundary evidence, the system test may still be passing, but the evidence is not strong enough to prove that the decision mattered at the boundary.

## How It Differs From Unit-Test Coverage

1. Unit-test coverage asks what code paths a small test suite hit inside isolated logic.
2. OMC/DC coverage asks what decision behavior and boundary effects a full system run actually exercised.
3. Unit coverage is often local and implementation-shaped.
4. OMC/DC coverage is behavioral and run-shaped.

## What Blackbox Does With It

1. Collect runtime evidence from the real run.
2. Propagate that evidence through the coverage engine.
3. Render propagation artifacts and summaries.
4. Use the result as proof, not as a replacement for the run itself.

## How To Read The Result

The important question is not only "did the test pass?" It is "did the run exercise the decision behavior and boundary effects we expected?"

That is why the report family matters:

1. The propagation artifact shows how the engine arrived at the verdict.
2. The markdown and HTML versions make the result easier for humans to read.
3. The summary artifacts make it easier to compare runs over time.

## Verdicts

| Verdict | What it tells you |
| --- | --- |
| `propagating` | The observed evidence distinguishes the branch arms. |
| `masking-candidate` | Both arms were exercised, but their observed effect signatures were indistinguishable. |
| `coverage-gap` | The run did not observe enough arm coverage to prove the decision. |
| `undecidable` | The engine could not decide from the evidence it had. |
| `multi-arm` | The decision shape is more complex than a simple two-arm comparison. |
| `unsupported-mcdc` | The current alpha engine does not support this decision shape yet. |

These verdicts are about proof strength. A `coverage-gap` does not mean the application is wrong. It means the current evidence does not prove enough. A `masking-candidate` does not automatically mean a bug. It means the test ran both arms but the effects looked the same from the evidence Blackbox could see.

## Parallel And Serial Shapes

Blackbox's BDD DSL supports both ordered and concurrent execution shapes.

1. `scenario.shared(...)` preserves state across an ordered chain.
2. `scenario.isolated(...)` gives concurrent siblings separate isolation groups.
3. `outline(...)` expands into repeated cases that can be read and executed like the rest of the suite.
4. The showcase file demonstrates that parallelism is part of the model, not an edge case.

This matters because the coverage model is about the run, not the shape of the prose. The same verification story can be exercised by a serial chain, a parallel sibling set, or an outline table, as long as the testbed keeps the evidence path intact.

## What The Artifacts Mean

1. `omcdc-propagation.json` is the machine-readable propagation artifact.
2. `omcdc-propagation.md` is the reviewable markdown form.
3. `omcdc.html` is the interactive report.
4. `coverage.json` and `shape-coverage.json` summarize catalog and shape coverage.
5. `omcdc.junit.xml` is the CI-facing test-result form when JUnit is enabled.

The detailed propagation artifacts include endpoint groups, branch coordinates, true-arm and false-arm test IDs, not-observed test IDs, verdicts, hints, and observed effect shapes. That is why they are useful for review after a refactor or an AI-assisted change: they show not only that a test passed, but what behavior the run actually distinguished.

## Gaps And Limits

1. It proves exercised behavior for the run, not formal proof of all behavior.
2. It depends on instrumentation and a runnable system test.
3. Parallel and concurrent execution are supported; attribution still depends on the testbed preserving a clean path from each run to its evidence.
4. Coverage before instrumentation starts is invisible by design.
5. Detached continuations can escape trace attribution.
6. The coverage output is only useful if the evidence and artifact story are preserved.
7. Function-level spans can help distinguish internal decisions whose boundary effects look identical, but they are an opt-in evidence layer rather than a requirement for basic effect coverage.

## What The Engine Does Not Try To Solve

1. Formal proof of all behavior.
2. Exhaustive concurrency correctness.
3. Coverage of code that never reaches the monitored boundary.
4. Coverage of arbitrary native or dynamic code unless the instrumentation path can see it.
5. A replacement for the test runner or the runtime evidence layer.

## Figure Placeholder

**Caption:** OMC/DC coverage turning one real system test into decision-coverage artifacts.

**Slot:** `<!-- TODO: insert OMC/DC report screenshot, animated flow, or interactive branch view here -->`
