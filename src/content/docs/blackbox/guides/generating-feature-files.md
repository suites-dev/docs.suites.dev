---
title: "Generating Feature Files"
description: "Generate Gherkin feature files from Playwright or Blackbox BDD-DSL tests, then gate syntax and feature-file drift."
sidebar_position: 3
keywords: ["playwright bdd", "given when then", "gherkin syntax", "feature file generation"]
toc_min_heading_level: 2
seo:
  primary_keyword: "playwright bdd"
  secondary_keywords: ["given when then", "gherkin syntax", "feature file generation", "feature-file drift"]
  search_intent: "practical BDD workflow for Playwright users who want readable behavior artifacts without Cucumber-style maintenance cost"
  snippet_angle: "generate Given/When/Then feature files from Playwright tests, validate Gherkin syntax, and gate feature-file drift"
---

Blackbox can generate reviewable `.feature` files from Playwright tests and Blackbox BDD-DSL tests. That gives teams a BDD-style artifact without forcing Cucumber-style step definitions to become the main workflow.

This guide is the practical path: check the test grammar, emit Gherkin, verify syntax, and gate feature-file drift.

## Why Generate Feature Files?

Feature files are useful because they give behavior a shared language. A reviewer can read a scenario without understanding every test helper, fixture, span, or assertion. The failure mode is that hand-written feature files can drift from what the system actually does.

Blackbox uses the opposite flow:

1. Start from a system or E2E test.
2. Analyze the test into a behavior trace.
3. Generate or check the `.feature` file.
4. Review feature-file drift when the artifact changes.
5. Use runtime evidence and effect coverage for stronger behavior proof.

That keeps the artifact closer to executable behavior.

This is the core shift: Blackbox uses BDD as a readable system-test artifact, not as a feature-file-first runtime. The feature file helps people review behavior, while the system test and runtime effects remain the proof loop.

## Playwright BDD Without The Cucumber Tax

Traditional Playwright BDD often starts with a feature file, binds each step to code, then asks the team to keep the step definitions and feature text synchronized forever.

Blackbox does not require that flow. You can keep Playwright as the runner and use Blackbox to produce BDD-shaped output after the run. The generated feature file helps people read and review behavior, but the runtime evidence remains the source of proof.

| Approach | Source of truth | Maintenance cost | Best fit |
| --- | --- | --- | --- |
| Hand-written Gherkin | Feature file and step bindings | High if behavior changes often | Teams committed to BDD as the primary workflow |
| Plain Playwright | Test code | Lower, but less product-readable | Engineering-only test suites |
| Blackbox-generated feature files | Test source, plus runtime evidence when effects are enabled | Review feature-file drift instead of maintaining every sentence by hand | System and E2E behavior proof |

## Given, When, Then

Given/When/Then is still a useful shape:

1. **Given** describes the starting state or context.
2. **When** describes the action or workflow.
3. **Then** describes the expected externally visible behavior.

Blackbox uses that shape as a readable representation of executable behavior. The difference is that the feature text is checked against test source and can be paired with runtime effects, instead of being trusted as a standalone promise.

The linter enforces the core grammar:

```text
Given*  When+  Then+
```

`Then` matters. A scenario that never concludes in an observable assertion is not a useful behavior spec.

## Step 1: Lint The Test Shape

Run `features lint` before treating generated Gherkin as review material:

```bash
pnpm exec blackbox features lint ./tests --fail-on error
```

For CI or agent workflows:

```bash
pnpm exec blackbox features lint ./tests --json --fail-on warn
```

Important findings include:

| Rule | What it catches |
| --- | --- |
| `aaa-shape` | `Then` before `When`, `Given` after the action, multiple act blocks after assertions, or no action |
| `missing-then` | A scenario with no observable assertion |
| `opaque-step` | A decompiled step that became too generic to review |
| `placeholder-token` | A generated placeholder that does not resolve to example data |
| `missing-background` | Repeated setup that should move to `Background` |

## Step 2: Emit Feature Files

Generate feature files from a test directory:

```bash
pnpm exec blackbox features emit ./tests --out ./features
```

For the showcase layout:

```bash
pnpm exec blackbox features emit ./e2e/tests --out ./e2e/features
```

If you have a step library:

```bash
pnpm exec blackbox features emit ./tests --steps ./scripts/step-lib.json
```

Or skip step resolution:

```bash
pnpm exec blackbox features emit ./tests --no-steps
```

The command prints the detected style and scope for each source file, then writes one `.feature` file per source file.

## Step 3: Gate Syntax And Feature-File Drift

Run `features check` after emitting:

```bash
pnpm exec blackbox features check --features ./features --tests ./tests
```

This performs two checks:

1. Gherkin syntax validation using the Cucumber parser.
2. Source-vs-feature drift detection.

Use JSON in automation:

```bash
pnpm exec blackbox features check --features ./features --tests ./tests --json
```

Use `features drift` when you only want the synchronization check:

```bash
pnpm exec blackbox features drift --tests ./tests --features ./features
```

Feature-file drift kinds are `missing`, `stale`, `orphan`, and `unparseable`.

## Step 4: Compare Runtime Observations When Migrating

When reshaping tests or moving from plain Playwright into the BDD DSL, feature-file drift is not enough. You also need to know whether the rewritten test still produces the same meaningful runtime behavior.

The experimental observation comparison gate reads `.observation.json` files from two runs:

```bash
pnpm exec blackbox features compare-observations --baseline ./baseline-observations --candidate ./candidate-observations --json
```

It treats step-boundary differences as benign and flags meaningful changes such as missing network calls, changed payloads, changed assertions, missing tests, or different outcomes.

## What Changes In The Project

A generation workflow should make these changes visible:

1. A feature file is created or updated.
2. Lint findings may point to weak scenario structure.
3. `features check` can fail when feature files are missing, stale, orphaned, or unparseable.
4. Runtime effect artifacts may also change if effects are enabled.
5. Feature-file drift becomes a review event instead of an invisible mismatch.

The exact filenames depend on the configured commands and output paths. The important rule is that generated artifacts should be treated as reviewable outputs, not as decorative documentation.

## Reviewing Feature-File Drift

A feature file change can mean several different things:

1. The product behavior intentionally changed.
2. The test source was renamed or restructured.
3. The analyzer recovered clearer or weaker behavior text.
4. Runtime behavior changed and the tests now express a new outcome.

Do not auto-accept every generated change. Review the feature file beside the effect catalog and coverage report. If the behavior changed intentionally, update the catalog and accept the artifact. If it changed accidentally, fix the system or the test.

## FAQ

### Is this still BDD?

It keeps the readable Given/When/Then artifact, but it does not require feature files to be the primary source of truth.

### Do I need Cucumber?

No. Blackbox uses Gherkin as a format and the Cucumber parser for syntax validation. You do not need Cucumber step definitions to use this workflow.

### Should I write tests in the BDD DSL?

Use the BDD DSL when you want faithful feature generation and explicit `scenario`, `given`, `when`, `then`, `background`, and `given.each` structure. Plain Playwright can work, but decompilation is best-effort.

### Should generated feature files be committed?

Commit them only when your team wants them as durable review artifacts. If they are temporary diagnostics, keep them out of version control.

## What To Read Next

1. [Feature Files, BDD, and Staleness](/docs/blackbox/concepts/feature-files-and-staleness)
2. [Effects, Runtime, and Specs](/docs/blackbox/concepts/bdd-runtime-and-effects)
3. [Writing Scenarios](/docs/blackbox/guides/writing-scenarios)
4. [Files and Artifacts](/docs/blackbox/reference/files-and-artifacts)
