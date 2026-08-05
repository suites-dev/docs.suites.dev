---
title: Generating Feature Files
description: Generate Gherkin feature files from Playwright or Blackbox DSL tests, then gate syntax and feature-file drift.
sidebar_position: 5
---

## Why generate feature files?

A **feature file** is a generated `.feature` artifact that expresses tested behavior in Gherkin. Blackbox uses it as a review surface, not as the runtime source of truth.

That is the **No Cucumber Tax** approach. You keep the Playwright or Blackbox DSL test as the thing that runs, and Blackbox emits the readable artifact from that test. Reviewers can read `subscribe-flow.feature`, while the executable test still proves the behavior against the showcase stack.

Use this workflow when you want a readable file for product, QA, platform, or agent review:

1. Lint the test shape before generation.
2. Emit the feature file from the test source or the DSL trace.
3. Review the generated Gherkin beside the test.
4. Gate feature-file drift in CI.

If the generated text is vague, fix the source test. Blackbox can preserve structure from the [scenario-writing patterns](/docs/blackbox/guides/writing-scenarios), but it cannot invent intent that the test never names.

## Step 1: Lint the test shape

Run `blackbox features lint` before you treat generated Gherkin as review material:

```bash
pnpm exec blackbox features lint ./e2e/tests --fail-on error
```

Use JSON when CI, scripts, or agents need structured findings:

```bash
pnpm exec blackbox features lint ./e2e/tests --json --fail-on warn
```

The linter checks the behavior grammar:

```text
Given*  When+  Then+
```

That shape matters because the generated file should explain setup, action, and observable result. A `missing-then` finding means the scenario has no `Then` step, so it never reaches an assertion that reviewers can trust.

Common findings include:

| Rule | What it catches |
| --- | --- |
| `aaa-shape` | A `Then` before any `When`, a `Given` after the action, a `When` after assertions, or no action. |
| `missing-then` | A scenario with no observable assertion. |
| `opaque-step` | A decompiled step that is too generic to review. |
| `placeholder-token` | A placeholder such as `<user>` that does not resolve to an examples row. |
| `missing-background` | Repeated setup that should move into `Background`. |

A failing lint run looks like this:

```text
$ pnpm exec blackbox features lint ./e2e/tests --fail-on error
linting 4 source files...

ERROR  aaa-shape  e2e/tests/subscribe-flow.spec.ts
  scenario:   alice is an existing user with no active subscription
  issue:      `Then` appears before any `When` step
  fix:        move the assertion below the action that produced the response

ERROR  missing-then  e2e/tests/onboarding.spec.ts
  scenario:   carol completes onboarding
  issue:      no observable assertion in scenario body
  fix:        add a `Then` step that captures a reviewable response or effect

2 errors, 0 warnings.
exit 1
```

Fix lint errors before emitting. Warnings are still useful because they tell you where the generated feature file may be technically valid but weak as a review artifact.

## Step 2: Emit the features

Run `blackbox features emit` when you want a source-to-feature pass:

```bash
pnpm exec blackbox features emit ./e2e/tests --out ./e2e/features
```

The command reads tests from `./e2e/tests` and writes `.feature` files under `./e2e/features`. See the [CLI reference](/docs/blackbox/reference/cli) for the full command contract and flags.

For Blackbox DSL tests, the Playwright run can also write slug-named feature files from the runtime DSL trace. The showcase uses `BLACKBOX_FEATURES_DIR` to target `e2e/features`, so the `subscribe-flow` scenario writes `e2e/features/subscribe-flow.feature`.

Baseline or rewrite those DSL-generated files with Playwright's snapshot update mode:

```bash
npx playwright test --config ./e2e/playwright.config.ts --update-snapshots
```

Use the CLI emission path for static generation across a test directory. Use `--update-snapshots` when your project has wired Blackbox's DSL trace finalizer into the Playwright run.

## Step 3: Review the generated output

The generated showcase file is concrete enough for a reviewer to understand the behavior without opening the test source:

```gherkin
@flow:subscribe-flow
Feature: subscribing as a pro tier user

  Background:
    Given the system is reset

  Scenario: alice is an existing user with no active subscription
    When alice POSTs /subscriptions with a valid card
    Then the response status is 201
    And  the response describes a pro tier subscription
    And  the subscription is persisted in postgres
    And  the tier is cached in redis
    And  a subscribe order is queued in SQS
    And  the captured effects satisfy the subscribe-flow catalog entry

  Scenario Outline: <user> is an existing user (inline contract)
    When <user> POSTs /subscriptions with <card>
    Then the response status is 201
    And  read path: cache lookup then user lookup
    And  exactly one Stripe payment_intent is created
    And  write path: persist, cache tier, enqueue order
    And  no refund and no DELETE

    Examples:
      | user  | card         |
      | bob   | pm_card_visa |
      | carol | pm_card_visa |

  Scenario: ghost-user does not exist
    When ghost-user POSTs /subscriptions
    Then the response status is 404
    And  cache and users were consulted; Stripe and SQS were not
    And  the order queue stays empty
```

Read the mapping directly from the DSL:

| DSL shape | Generated Gherkin |
| --- | --- |
| `scenario('subscribe-flow', 'subscribing as a pro tier user', ...)` | `@flow:subscribe-flow` and the `Feature:` title. |
| `background('the system is reset', ...)` | The `Background:` block. |
| `given('alice is an existing user with no active subscription', ...)` | The first `Scenario:` title. |
| `when('alice POSTs /subscriptions with a valid card', ...)` | The `When` step. |
| `then('the response status is 201', ...)` and later `then(...)` calls | The `Then` step followed by `And` steps. |
| `given.each([{ user: 'bob' }, { user: 'carol' }])` | The `Scenario Outline:` and `Examples:` table. |

Review the feature file as generated output. If `ghost-user` should mention a different forbidden effect, change the source test or effect assertion, then regenerate.

## Step 4: Gate drift in CI

Run `blackbox features check` after generation:

```bash
pnpm exec blackbox features check --features ./e2e/features --tests ./e2e/tests
```

This gate performs two read-only checks:

1. It validates Gherkin syntax for every `.feature` file under `./e2e/features`.
2. It compares each generated feature file with the matching test source under `./e2e/tests`.

Use JSON output for automation:

```bash
pnpm exec blackbox features check --features ./e2e/features --tests ./e2e/tests --json
```

A failing `features check` reports both syntax and drift findings together:

```text
$ pnpm exec blackbox features check --features ./e2e/features --tests ./e2e/tests
syntax: 4/4 files parsed
drift:  3/4 files in sync

STALE    e2e/features/subscribe-flow.feature   (source updated 2026-06-16)
ORPHAN   e2e/features/legacy-checkout.feature  (no matching test under ./e2e/tests)

regenerate or delete the affected files, then rerun.
exit 1
```

Feature-file drift has four kinds:

| Kind | What it means |
| --- | --- |
| `missing` | A test source exists, but the expected feature file does not. |
| `stale` | A feature file exists, but it no longer matches the current test source. |
| `orphan` | A feature file exists without a matching test source. |
| `unparseable` | Blackbox cannot parse the feature file well enough to compare it. |

Treat a drift failure as a review signal. The system test may still pass, but the Gherkin artifact no longer matches the executable behavior.

For the deeper model, read [Code-First BDD](/docs/blackbox/concepts/code-first-bdd). In CI, keep `features lint` before `features check` so malformed scenario shape fails before stale files reach review.
