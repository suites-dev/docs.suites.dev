---
title: "Playwright Flow Tags"
description: "Declare Blackbox flows with native Playwright test.describe tags and map them to reviewed Gherkin and effect contracts."
sidebar_position: 4
keywords:
  [
    "Playwright flow tags",
    "Blackbox Playwright",
    "native Playwright API",
    "flow ID",
  ]
seo:
  primary_keyword: "Playwright flow tags"
  secondary_keywords: ["Blackbox Playwright", "flow ID"]
  search_intent: "developers looking for the supported way to declare Blackbox flows in Playwright"
  snippet_angle: "use native Playwright test.describe tags instead of a custom Scenario DSL"
---

Blackbox uses native Playwright APIs. A **flow ID** is declared with a `@flow:<id>` tag on `test.describe`.

```ts
import { expect, test } from "./blackbox-testbed";

test.describe(
  "Reject an unknown subscriber",
  { tag: "@flow:subscribe-unknown-user" },
  () => {
    test("request stops before payment", async ({ request, capture }) => {
      await test.step("submit the subscription request", async () => {
        const response = await request.post("/subscriptions", {
          data: { userId: "ghost-user", tier: "pro" },
        });

        expect(response.status()).toBe(404);
      });

      await test.step("verify the response and captured effects", async () => {
        await expect(capture).toMatchCatalog();
      });
    });
  },
);
```

## Mapping Rules

| Playwright surface               | Blackbox meaning                      |
| -------------------------------- | ------------------------------------- |
| `test.describe` tag `@flow:<id>` | Stable flow ID.                       |
| `test.describe` title            | Flow description.                     |
| `test` title                     | Scenario title.                       |
| `test.step` title                | Reviewable action or assertion label. |
| `capture` assertions             | Runtime effect verification.          |

The flow ID must match the reviewed Gherkin `@flow:<id>` tag and the `flow` field in `features/<flow>.effects.yaml`.

## Supported Shape

Use one feature-level flow per feature file:

```gherkin
@flow:subscribe-unknown-user
@requirement:REQ-004
@requirement:REQ-005
Feature: Reject an unknown subscriber

  Scenario: request stops before payment
    When the unknown user posts a subscription request
    Then the response status is 404
    And no payment request is sent
```

One feature can contain multiple scenarios, but the feature owns one flow ID. The CLI checks basename, Gherkin tag, Playwright tag, and effect YAML consistency.

## Prohibited Public Surfaces

Do not use a Blackbox TypeScript Scenario DSL in alpha docs or new suites:

- no `scenario(...)`;
- no `given(...)`, `when(...)`, or `then(...)` TypeScript helpers;
- no `test.system(...)`;
- no generated suite changes without human approval.

Gherkin `Scenario`, `Given`, `When`, and `Then` belong only in `.feature` files.

## Summary

- **Declare flows with native Playwright `test.describe` tags.**
- **Use `test.step` for readable structure.**
- **Keep Gherkin in `.feature` files.**
- **Review suite patches before applying them.**
