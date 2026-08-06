---
title: "Generate Gherkin From Playwright Tests"
description: "Emit readable Gherkin feature files from executable Playwright or Blackbox DSL tests, then detect syntax and source drift in CI."
sidebar_position: 5
keywords:
  [
    "generate Gherkin from Playwright",
    "feature files from tests",
    "Gherkin drift",
    "code-first BDD",
  ]
toc_min_heading_level: 2
---

Blackbox can project executable Playwright behavior into Gherkin. The test remains the code that runs; the generated `.feature` file becomes an optional review surface for people and agents.

This reverses the usual feature-first BDD direction:

```text
Playwright flow -> named Given/When/Then behavior -> generated .feature -> drift gate
```

Runtime effects are independent. You can generate feature files without effect contracts, or verify effects without generating Gherkin. Together, the test explains how behavior is exercised, the feature file explains it in readable form, and runtime evidence shows what the system did.

## 1. Make The Behavior Legible In Code

Generation is strongest when the source names setup, action, and conclusion. Blackbox recognizes ordinary Playwright and its explicit Scenario DSL, but it cannot recover intent from vague helper names.

Lint the source before emitting:

```bash
pnpm exec blackbox features lint ./e2e/tests --fail-on error
```

Use structured output in CI or agent workflows:

```bash
pnpm exec blackbox features lint ./e2e/tests --json
```

The core grammar is:

```text
Given*  When+  Then+
```

`Then` is important. A flow that performs actions but reaches no observable conclusion may run, yet still produce a weak behavior spec.

## 2. Preview The Generated Files

Start without writing:

```bash
pnpm exec blackbox features emit ./e2e/tests \
  --out ./e2e/features \
  --dry-run \
  --json
```

The JSON envelope is suitable for automation. Remove `--json` for a terminal-oriented preview.

When the projection is readable, write it:

```bash
pnpm exec blackbox features emit ./e2e/tests --out ./e2e/features
```

`--watch` keeps the output synchronized during local editing. `--steps` accepts a step-library JSON file when project vocabulary needs explicit mappings; `--no-steps` disables that lookup.

## 3. Review Behavior, Not Test Plumbing

A generated flow can look like this:

```gherkin
@flow:subscribe-unknown-user
Feature: Rejecting an unknown subscriber

  Scenario: the requested user does not exist
    Given the subscription system is ready
    When the client requests a pro subscription for an unknown user
    Then the response status is 404
    And no payment is created
    And no subscription is persisted
    And no order message is published
```

The feature file should communicate behavior without reproducing low-level fixtures, container setup, or every HTTP option. If the text is opaque, improve the source test or use the Scenario DSL to make the phases explicit, then emit again.

Generated Gherkin is not independent proof. Its value comes from staying attached to the executable flow that produced it.

## 4. Gate Syntax And Drift

Commit generated feature files only when they are part of the team's review contract. Then check them in CI:

```bash
pnpm exec blackbox features check \
  --features ./e2e/features \
  --tests ./e2e/tests \
  --json
```

`features check` performs two read-only checks:

1. Parse every `.feature` file as Gherkin.
2. Compare generated features with their current source tests.

Use `--skip-syntax` or `--skip-drift` only when another job owns that check. `features drift` is also available when the workflow needs drift detection without syntax validation.

Drift findings distinguish four situations:

| Finding       | Meaning                                                   |
| ------------- | --------------------------------------------------------- |
| `missing`     | A source test has no generated feature file.              |
| `stale`       | The generated feature no longer matches its source test.  |
| `orphan`      | A feature file no longer has a corresponding source test. |
| `unparseable` | Blackbox cannot compare the feature safely.               |

A drift failure does not say the running system is wrong. It says the readable projection is no longer trustworthy and must be regenerated or deliberately removed.

## EARS Is A Different Layer

Do not use generated Gherkin as a substitute for normative requirements.

- **EARS** states what the system is required to do and binds requirement IDs to flow IDs.
- **Gherkin** projects executable behavior into a readable scenario.
- **Effect contracts** state which boundary effects are required or forbidden.
- **Runtime reports** provide the verdict from the running system.

Use whichever layers solve the team's problem. Blackbox does not require either specification format to observe and verify effects.

## Reverse Generation Is Experimental

The supported direction is test to feature file. Blackbox also exposes an experimental scaffold command for generating starter Scenario DSL tests from `.feature` files:

```bash
pnpm exec blackbox features experimental scaffold ./e2e/features \
  --write \
  --out ./e2e/tests/scaffolded
```

Treat the result as a draft to review and implement, not as a complete executable test. `features experimental wrap` is another migration helper for annotating existing Playwright specs so runtime Gherkin reporting can discover them. Both commands may change faster than `features emit`, `lint`, `check`, and `drift`.

Read [Scenario DSL](/docs/blackbox/reference/scenario-dsl) for explicit code-first authoring and [Specifications, Flows, and Verdicts](/docs/blackbox/concepts/specifications-flows-and-verdicts) for the relationship between EARS, Gherkin, effects, and runtime evidence.
