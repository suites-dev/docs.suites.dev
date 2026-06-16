---
title: "Feature Files, BDD, and Staleness"
description: "Relate BDD, Gherkin, Cucumber, stale feature files, and the Blackbox gates that keep behavior artifacts synchronized."
sidebar_position: 5
keywords: ["gherkin staleness", "bdd feature files", "living documentation", "feature-file drift"]
toc_min_heading_level: 2
seo:
  primary_keyword: "given when then"
  secondary_keywords: ["gherkin syntax", "bdd feature files", "living documentation", "feature-file drift"]
  search_intent: "BDD education intent from teams worried that Gherkin and feature files become stale"
  snippet_angle: "feature files stay useful when they are generated from test sources and checked by syntax, drift, and runtime gates"
---

BDD and Gherkin had the right ambition: make behavior visible, reviewable, and connected to executable checks. The failure mode was maintenance.

When `.feature` files become another hand-written artifact, they can drift from product intent, test source, and system behavior. A sentence can still read well while the service no longer calls the same dependency, emits the same event, writes the same record, or blocks the same forbidden action.

Blackbox does not ask every team to return to classic Cucumber-style BDD. It keeps the useful shape, then adds gates around it.

## Why Feature Files Go Stale

Feature files go stale when they are treated as the source of truth but are not continuously checked against what developers actually run.

Classic BDD often created three things that had to agree:

1. The `.feature` file.
2. The step definitions.
3. The implementation and test runner behavior.

That can work when the team has discipline and stable behavior. It breaks down when a system changes quickly, when tests are mostly written by engineers rather than product/QA, or when AI-assisted changes increase the amount of behavior reviewers must verify.

## Two Kinds Of Drift

Blackbox separates two drift problems that often get mixed together:

| Drift type | Question | Blackbox gate |
| --- | --- | --- |
| Feature-file drift | Does the `.feature` file still match the test source? | `blackbox features check` or `blackbox features drift` |
| Behavioral drift | Did the running system behavior change in a meaningful way? | Effect catalog, effect coverage, and optional observation comparison |

Feature-file drift is about synchronization between source tests and readable Gherkin. Behavioral drift is about runtime effects, assertions, outcomes, and system boundaries.

Do not use bare “drift” when writing docs or error messages. Say which kind.

## The Blackbox Direction

Blackbox starts from tests and evidence:

1. A system test exercises a behavior.
2. The feature analyzer derives an AAA/Given-When-Then trace from the test source.
3. The feature emitter writes a Gherkin `.feature` file from that trace.
4. The syntax and drift gate checks the `.feature` file against the source.
5. Runtime evidence and effect catalogs prove what the system did at its boundaries.

The feature file becomes a review surface over executable behavior, not a promise that must be trusted by itself.

## Relationship To BDD And Gherkin

Blackbox does not need to argue that BDD was wrong. BDD correctly focused teams on behavior. The problem was the direction and cost of synchronization.

Traditional flow:

1. Human writes feature file.
2. Automation binds steps to code.
3. People must maintain the feature file as the system evolves.

Blackbox flow:

1. Test source describes or exercises the behavior.
2. Blackbox analyzes the behavior grammar.
3. Blackbox emits or checks the feature file.
4. Runtime gates prove the behavior through effects and observations.
5. People review the artifact changes instead of manually maintaining every sentence.

Gherkin remains the human-readable format. Cucumber-compatible parsing is used for syntax validation. Cucumber-style step definitions are not required.

## The Behavior Grammar

The Blackbox feature pipeline is built around AAA:

```text
Given*  When+  Then+
```

`Given` describes setup and preconditions. `When` describes the action. `Then` is the concluder: the scenario must end in observable assertions. A feature file without a meaningful `Then` is documentation, not verification.

The linter enforces this shape and catches common failure modes:

1. `Then` before any `When`.
2. `Given` after the action.
3. `When` after assertions.
4. Missing action.
5. Missing assertion.
6. Opaque generated steps.
7. Repeated setup that should become a `Background`.

## The Cycle Of Gates

Blackbox connects feature files, system tests, and E2E suites in a cycle of gates:

1. `features lint` checks the behavior grammar.
2. `features emit` generates Gherkin from test source.
3. `features check` validates Gherkin syntax and catches feature-file drift.
4. The project system-test command runs the behavior.
5. Effect catalogs and effect coverage catch boundary behavior changes.
6. Observation comparison can catch meaningful runtime differences during migration or refactor.

This is the connection to verification gates: feature files are not just docs, and runtime evidence is not just debugging data. Each artifact has a gate that can run locally, in CI, or inside an SDD/agent workflow.

## How The REPL Should Teach This

The ideal REPL is not a marketing animation. It should load `@suites/blackbox-features`, accept a small test, and show the transformation in real time:

1. Source test.
2. Detected adapter: Playwright or BDD DSL.
3. Analyzed AAA/Given-When-Then trace.
4. Generated `.feature` file.
5. Lint findings, syntax result, and feature-file drift result.
6. Optional observation comparison when baseline and candidate runs exist.

That REPL would make the product promise concrete: you can see exactly what Blackbox inferred, where it was confident, where it fell back to generic text, and which gate will protect the artifact.

## What To Read Next

1. [Feature Files From Tests](/docs/blackbox/quickstart/feature-files-from-tests)
2. [Generating Feature Files](/docs/blackbox/guides/generating-feature-files)
3. [Configure CI Gates](/docs/blackbox/guides/ci-behavioral-gates)
4. [Scenario DSL](/docs/blackbox/reference/scenario-dsl)
