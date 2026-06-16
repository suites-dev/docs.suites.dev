---
title: "Reading Coverage Reports"
description: "Explain coverage.json, shape-coverage.json, and how to read proven versus unasserted behavior."
sidebar_position: 4
keywords: ["coverage reports", "coverage json", "shape coverage"]
toc_min_heading_level: 2
seo:
  primary_keyword: "reading coverage reports"
  secondary_keywords: ["coverage reports", "coverage json", "omcdc report", "shape coverage"]
  search_intent: "practical troubleshooting and review intent after a user has generated Blackbox report files"
  snippet_angle: "teach the reading order for OMC/DC, catalog coverage, shape coverage, HTML reports, and CI annotations"
---

## Abstract

This page teaches the reading order for Blackbox reports: start with the human summary, inspect the OMC/DC verdicts, then use catalog and shape summaries to decide whether the run is acceptable.

## Audience

These pages are practical workflows for writing scenarios, asserting effects, generating artifacts, and gating behavior.

## Start With The Question

Before opening raw JSON, decide what you are trying to answer:

1. Did a required effect disappear?
2. Did a forbidden effect happen?
3. Did a catalog entry remain uncovered?
4. Did a branch exercise both arms but produce indistinguishable effects?
5. Did a test run produce no useful runtime evidence?

## Recommended Reading Order

1. Open `omcdc-propagation.md` for a quick human-readable overview.
2. Open `omcdc.html` when you need branch-level inspection or source snippets.
3. Check `coverage.json` to see catalog entries that were satisfied, failed, or uncovered.
4. Check `shape-coverage.json` to see asserted, unasserted, and inline boundary shapes.
5. Use `omcdc-propagation.json` when automation or an agent needs the full structured result.
6. Use span and V8 files only when debugging the evidence path itself.

## Example: Subscription Flow

The showcase report includes a `POST /subscriptions` section from the subscription workflow. In one saved run, 7 tests exercised that endpoint.

The report showed:

1. 4 `propagating` branches.
2. 0 `masking-candidate` branches.
3. 9 `coverage-gap` branches.

That is a useful first report because it teaches two things at once. Some decisions are already proven by distinguishable runtime effects, while other decisions still need better scenarios before the report can claim stronger proof.

For the same workflow, the effect contract requires the important cross-boundary behavior: Redis read, Postgres user lookup, payment intent HTTP call, subscription insert, Redis cache write, order-service call, and SQS message. It also forbids destructive or wrong effects such as Postgres `DELETE`, `TRUNCATE`, Redis `DEL`, Redis `FLUSHDB`, and refund creation.

Read the report against that contract. The question is not only whether `POST /subscriptions` returned `201`. The question is whether the run produced the behavior the system promised at the boundary.

## Reading OMC/DC Verdicts

The OMC/DC report groups branches by endpoint. Each branch row has a source coordinate, counts for true-arm tests, false-arm tests, not-observed tests, and a verdict.

| Verdict | Meaning | Typical action |
| --- | --- | --- |
| `propagating` | The branch arms produced distinguishable observed effects. | Usually good; review whether the effects are the intended ones. |
| `masking-candidate` | Both arms ran, but their observed effect signatures looked identical. | Add better tests, more distinguishing effects, or enable function spans when appropriate. |
| `coverage-gap` | One or more arms were not observed enough to make the decision useful. | Add or adjust a scenario. |
| `undecidable` | The engine could not make a useful decision from the available evidence. | Inspect instrumentation and source mapping. |
| `multi-arm` | The decision shape is more complex than the simple two-arm case. | Review manually and simplify or split if needed. |
| `unsupported-mcdc` | The current engine does not support this decision shape. | Treat as an alpha limitation, not a pass. |

## Reading Catalog Coverage

`coverage.json` works at the catalog-entry level. It answers whether each named behavior contract was satisfied by at least one run.

The most important states are:

1. `satisfied`: at least one run matched the entry without missing required effects or observing forbidden effects.
2. `failed`: the entry was exercised, but required or forbidden behavior failed.
3. `uncovered`: no passing run satisfied the entry.

Use this file for CI summaries and for tracking whether critical behavior contracts are still exercised.

## Reading Shape Coverage

`shape-coverage.json` works below the catalog-entry level. It tracks individual boundary shapes such as a Redis read, Postgres insert, HTTP call, or SQS message.

The most useful review signal is the difference between:

1. `unasserted`: the catalog declares the shape, but no matcher named it.
2. `inline`: a test asserted the shape inline, but the catalog does not yet own it.

Those states help teams decide whether the catalog is too large, too stale, or missing behavior that tests already depend on.

## Practical Guidance

1. Start with Markdown or HTML, not raw JSON.
2. Treat `masking-candidate` as a design smell in the evidence, not automatically as an application bug.
3. Treat `coverage-gap` as missing proof, not as proof of wrong behavior.
4. Review catalog and feature changes together when behavior intentionally changes.
5. Archive the full `.blackbox-coverage/` directory for failed CI runs so the evidence path can be inspected later.

For the subscription example, a reviewer should usually open artifacts in this order:

1. `e2e/features/subscribe-flow.feature` to understand the behavior in product terms.
2. `e2e/tests/__effects__/00-baseline-subscribe.system.effects.yaml` to see the required and forbidden effects.
3. `.blackbox-coverage/omcdc-propagation.md` to see branch verdicts and hints.
4. `.blackbox-coverage/omcdc.html` when the Markdown summary is not enough.

## Figure Placeholder

**Caption:** Reading the subscription-flow report from feature file to effects YAML to OMC/DC verdicts.

**Slot:** `<!-- TODO: insert annotated screenshot of POST /subscriptions in omcdc.html with the matching effects YAML beside it -->`
