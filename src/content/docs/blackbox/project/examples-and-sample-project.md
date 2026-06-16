---
title: "Examples and Sample Project"
description: "Point users to runnable examples that show the fastest path from install to observed effects."
sidebar_position: 1
keywords: ["blackbox examples", "blackbox sample project", "effect coverage example"]
toc_min_heading_level: 2
seo:
  primary_keyword: "blackbox examples"
  secondary_keywords: ["blackbox sample project", "effect coverage example", "playwright opentelemetry example"]
  search_intent: "example-seeking intent from developers who want a runnable Blackbox project before wiring their own system"
  snippet_angle: "use the subscription-service showcase to see Playwright, Docker Compose, OpenTelemetry spans, feature files, effects YAML, and OMC/DC reports together"
---

## Abstract

The showcase system is the safest place to learn Blackbox before adapting it to a real system. It demonstrates a subscription workflow that crosses HTTP, Postgres, Redis, a Stripe-like downstream API, an order service, SQS, and a fraud-check service.

## Audience

New users, evaluators, and contributors who want a known-good project before wiring Blackbox into their own stack.

## What The Sample Project Teaches

1. How to run one useful system-test workflow.
2. How a feature file, effect contract, runtime evidence, and OMC/DC report relate to each other.
3. Which artifacts appear after a successful run.
4. What a reviewer should inspect before trusting the result.

## The Showcase Story

The canonical story is `subscribe-flow`: an existing user subscribes to the pro tier.

The test does more than assert an HTTP response. It verifies that the system:

1. Reads the user tier from Redis.
2. Reads user data from Postgres.
3. Creates a payment intent through a Stripe-like HTTP boundary.
4. Inserts the subscription into Postgres.
5. Writes the new tier to Redis.
6. Calls the order service.
7. Sends a subscription message to SQS.
8. Avoids forbidden effects such as refunds, deletes, truncates, and Redis flushes.

## Source Files

| File | What it demonstrates |
| --- | --- |
| `e2e/tests/00-baseline-subscribe.system.test.ts` | The baseline Playwright system test using Blackbox matchers and capture fixtures. |
| `e2e/features/subscribe-flow.feature` | The readable feature artifact for the subscription workflow. |
| `e2e/tests/__effects__/00-baseline-subscribe.system.effects.yaml` | Required and forbidden runtime effects for the same workflow. |
| `e2e/services/compose.user.yml` | The production-shaped Docker Compose topology used by the testbed. |
| `e2e/.blackbox-coverage/` | Existing generated evidence and reports from a run. |

## Run The Example

From the Blackbox repository root:

```bash
pnpm test:system
```

That project script delegates to the e2e package, builds Blackbox, builds or selects the local OpenTelemetry bootstrap image, starts the testbed through Playwright, and writes coverage artifacts.

To regenerate reports from existing saved evidence:

```bash
pnpm exec blackbox coverage replay --coverage-dir e2e/.blackbox-coverage --out reports
```

## What Makes A Good Sample

1. It is runnable on the supported alpha stack.
2. It produces real proof artifacts.
3. It is small enough to inspect without a long setup.
4. It matches the docs wording closely enough to serve as a sanity check.

## Expected Artifacts

After a successful run, inspect:

1. `.blackbox-coverage/omcdc-propagation.md`
2. `.blackbox-coverage/omcdc-propagation.json`
3. `.blackbox-coverage/omcdc.html`
4. `.blackbox-coverage/coverage-final.json`
5. `.blackbox-coverage/html/index.html`
6. `.blackbox-coverage/spans/*.json`
7. `.blackbox-coverage/v8-per-test/*.json`

Start with the Markdown or HTML OMC/DC report. Use raw spans and V8 files only when debugging the evidence path.

## What To Read Next

1. [Prove Your First Feature](/docs/blackbox/quickstart/first-proven-feature)
2. [Run with the Testbed](/docs/blackbox/guides/using-the-testbed)
3. [Reading Coverage Reports](/docs/blackbox/guides/reading-coverage-reports)
4. [Files and Artifacts](/docs/blackbox/reference/files-and-artifacts)

## Figure Placeholder

**Caption:** The subscription-service showcase: test file, feature file, effects YAML, Docker Compose topology, and OMC/DC report.

**Slot:** `<!-- TODO: insert interactive sample-project file map linked to the subscription flow -->`
