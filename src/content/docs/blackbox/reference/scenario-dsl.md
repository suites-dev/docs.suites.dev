---
title: "Scenario DSL"
description: "Reference the Blackbox BDD scenario DSL, including scenario, scenario.chain, background, given, when, then, given.each, and outline."
sidebar_position: 2
keywords: ["scenario dsl", "scenario api", "bdd dsl reference", "given when then"]
toc_min_heading_level: 2
seo:
  primary_keyword: "Scenario DSL"
  secondary_keywords: ["scenario dsl", "scenario api", "given when then", "bdd dsl reference"]
  search_intent: "developers who want the public Blackbox scenario DSL surface and its mapping to generated feature files"
  snippet_angle: "document the Blackbox scenario DSL verbs and how they map to AAA, Gherkin, isolation, shared state, outlines, and feature generation"
---

The Scenario DSL is Blackbox's explicit BDD authoring surface.

Use it when plain Playwright tests are not structured enough for faithful feature generation, or when the team wants scenarios to be readable in code before they become Gherkin.

The DSL gives Blackbox stronger intent than decompiling arbitrary test code because the author names the behavior grammar directly:

```text
Given*  When+  Then+
```

`Then` is the conclusion of the behavior. A scenario without a `Then` may execute code, but it does not express an observable claim.

## Minimal Scenario

```ts
import { expect, scenario } from './testbed.js';
import { postJson } from './_http.js';

scenario('subscribe-flow', 'subscribing to the pro tier', ({ given, background }) => {
  background('the system is reset', async ({ system }) => {
    await system.reset();
  });

  given('alice is an existing user with no active subscription', async ({ system, when }) => {
    await when('alice POSTs /subscriptions with a valid card', async ({ then }) => {
      const response = await postJson(`${system.bff.hostBaseUrl}/subscriptions`, {
        userId: 'alice',
        paymentMethodId: 'pm_card_visa',
      });

      await then('the response status is 201', async () => {
        expect(response.status).toBe(201);
      });
    });
  });
});
```

This maps to:

```gherkin
@flow:subscribe-flow
Feature: subscribing to the pro tier

  Background:
    Given the system is reset

  Scenario: alice is an existing user with no active subscription
    When alice POSTs /subscriptions with a valid card
    Then the response status is 201
```

## Verbs

| Verb | Purpose | Gherkin mapping |
| --- | --- | --- |
| `scenario(slug, description, body)` | Define an independent behavior flow with a stable slug and human description | `@flow:<slug>` and `Feature: <description>` |
| `scenario.chain(slug, description, register)` | Define an ordered set of scenarios that share one isolation group and run serially on one worker | Outer grouping with per-scenario `@flow:<slug>` tags |
| `background(label, fn)` | Shared setup that runs before each scenario inside the scenario body | `Background: Given <label>` |
| `given(precondition, fn)` | Define the scenario precondition and arrangement frame | `Scenario: <precondition>` plus arrangement lines |
| `when(action, fn)` | Define the action being exercised | `When <action>` |
| `then(expectation, fn)` | Define an observable assertion | `Then <expectation>` or `And <expectation>` |
| `given.each(rows)(precondition, fn)` | Define a scenario outline from row data | `Scenario Outline` and `Examples` |
| `outline(slug, description, rows, body)` | Define a parameterized flow directly | `Scenario Outline` and `Examples` |

## Runtime Mapping

The DSL is not only a feature-file writer. It registers Playwright tests with runtime metadata.

| DSL element | Runtime mapping |
| --- | --- |
| `scenario(slug, description, body)` | `test.describe(description, { tag: ['@flow:<slug>', '@isolation-group:bdd:<slug>'] }, body)` |
| `scenario.chain(slug, description, register)` | One serial outer `test.describe(...)` carrying a shared isolation group; each nested scenario carries its own `@flow:<slug>` |
| `background(label, fn)` | `test.beforeEach(...)` inside the scenario describe |
| `given(label, fn)` | `test('GIVEN <label>', ...)` |
| `when(label, fn)` | `test.step('WHEN <label>', ...)` |
| `then(label, fn)` | `test.step('THEN <label>', ...)` |
| `given.each(rows)` | Multiple row tests plus one examples table in the feature trace |
| `outline(slug, description, rows, body)` | One parameterized behavior shape under one scenario group |

The `@isolation-group` tag is what lets the testbed decide whether to reset state or keep state for the next test in the group.

## Isolation And Chains

Use plain `scenario(...)` for normal independent behavior. It mints a fresh isolation group from the scenario slug.

Use `scenario.chain(...)` when a later scenario intentionally depends on state created by an earlier scenario. The chain creates one shared isolation group and co-locates the nested scenarios on one worker in serial order.

Use `outline` or `given.each` when the same behavior should run over rows of examples.

```ts
scenario.chain('subscription-admin-chain', 'subscription admin workflow', ({ scenario }) => {
  scenario('create-subscription', 'create subscription', ({ given }) => {
    given('alice is ready to subscribe', async ({ when }) => {
      await when('alice subscribes', async ({ then }) => {
        await then('the subscription is created', async () => {
          // assertions
        });
      });
    });
  });

  scenario('cancel-subscription', 'cancel subscription', ({ given }) => {
    given('alice has an active subscription from the previous scenario', async ({ when }) => {
      await when('the subscription is cancelled', async ({ then }) => {
        await then('the subscription is inactive', async () => {
          // assertions
        });
      });
    });
  });
});
```

For the full Playwright worker model, read [Playwright, Isolation, and Parallelism](/docs/blackbox/guides/playwright-isolation-and-parallelism).

## How The Analyzer Reads The DSL

The `blackbox-features` analyzer detects BDD-DSL files by looking for `scenario(...)` plus BDD verbs such as `given`, `when`, `then`, or `background`.

From there it builds an analyzed feature:

| DSL element | Analyzed feature field |
| --- | --- |
| `scenario(slug, description, ...)` | feature description and `@<slug>` tag |
| `background(label, ...)` | background step with `given` phase |
| `given(label, ...)` | scenario and first `given` step |
| `when(label, ...)` | `when` step |
| `then(label, ...)` | `then` step |
| `given.each([...])` | scenario examples table |

This is more reliable than decompiling arbitrary Playwright because the behavior phases are explicit.

## Lint Rules That Apply

`features lint` applies to DSL-authored and decompiled scenarios.

The most important rules are:

| Rule | Why it matters |
| --- | --- |
| `aaa-shape` | Enforces `Given* When+ Then+` in that order |
| `missing-then` | Prevents scenarios with no observable conclusion |
| `opaque-step` | Warns when decompiled text is too generic to review |
| `placeholder-token` | Warns when generated placeholders are unresolved |
| `missing-background` | Suggests `Background` when setup repeats |
| `imperative-scenario` | Flags overly low-level UI action lists |
| `empty-scenario` | Blocks scenarios with no steps |

## Relationship To Feature Files

The DSL is not a replacement for `.feature` files. It is the source shape that makes feature files more faithful.

The normal path is:

1. Author or reshape a test into the Scenario DSL.
2. Run `blackbox features lint`.
3. Run `blackbox features emit`.
4. Commit the generated `.feature` file if it is part of the review surface.
5. Run `blackbox features check` in CI to catch syntax failure and feature-file drift.

## Relationship To Runtime Effects

The Scenario DSL names behavior. Effects prove boundary behavior.

A `then(...)` block may contain ordinary response assertions, effect catalog matchers, or both. Feature files remain readable; effect catalogs and coverage reports carry the runtime proof.

## Stability

The DSL surface is alpha. The core grammar is stable enough to document: scenarios should arrange, act, and conclude. Migration helpers such as reshape, scaffold, and wrap may change faster than the hand-authored DSL.

## What To Read Next

1. [Writing Scenarios](/docs/blackbox/guides/writing-scenarios)
2. [Generating Feature Files](/docs/blackbox/guides/generating-feature-files)
3. [Code-First BDD](/docs/blackbox/concepts/code-first-bdd)
4. [CLI Reference](/docs/blackbox/reference/cli)
