---
title: "System Effects"
description: "Understand effects, effect catalogs, effect coverage, and how OMC/DC adds a separate decision-coverage view."
sidebar_position: 1
keywords: ["system effects", "effect catalog", "effect coverage", "behavioral evidence", "system test coverage"]
toc_min_heading_level: 2
seo:
  primary_keyword: "system effects"
  secondary_keywords: ["effect catalog", "effect coverage", "behavioral evidence", "system test coverage"]
  search_intent: "developers trying to understand the Blackbox behavior model for system and E2E tests"
  snippet_angle: "system effects are the observed behaviors behind Blackbox catalogs, matcher coverage, and enriched OMC/DC reports"
---

## Abstract

System effects are the behaviors a real system run leaves behind: a row written, an event published, a queue message sent, a downstream service called, a cache updated, an email intent emitted, or a forbidden dependency avoided.

Blackbox starts from those effects. The effect catalog records which effects matter. Matchers use that catalog to check whether the effects were covered during the run. OMC/DC coverage is a separate enriched coverage view that asks whether decisions in the system produced distinguishable observed effects.

## Audience

Read this page when you want the core Blackbox mental model before reading report files, matcher APIs, generated feature files, or OMC/DC details.

## The E2E Gap

Many E2E tests prove the edge of a workflow:

1. Send this input.
2. Expect this output.

That is necessary, but it can miss the behavior between the two. A request can return `201 Created` while the system skipped an audit write, failed to publish an event, called the wrong dependency, duplicated a notification, or silently missed a cache update.

Blackbox adds a behavior evidence layer to that run. It does not replace the input/output assertion. It records what the system did while satisfying the assertion.

## The Four Related Ideas

These terms are related, but they are not the same thing.

| Term | What it is | Main question |
| --- | --- | --- |
| System effect | One observed boundary behavior from a real run | What did the system do? |
| Effect catalog | The reviewed recording and contract for important effects | Which effects should future runs require or forbid? |
| Effect coverage | The matcher/report view over cataloged effects | Which required, forbidden, observed, or missing effects were covered? |
| OMC/DC coverage | Enriched decision coverage based on observed effects | Did decisions produce distinguishable system behavior? |

The catalog is the contract. Effect coverage is the covered-or-missing view of that contract. OMC/DC is another coverage layer, not another name for the catalog.

## What Counts As A System Effect

A useful effect is observable at a boundary and meaningful enough to review.

Common examples:

1. A database record was inserted or updated.
2. A domain event was published.
3. A queue message was enqueued.
4. A downstream HTTP call was made.
5. A cache entry was written or invalidated.
6. An email or notification intent was emitted.
7. A deprecated dependency was not called.

Not every span is an effect. Spans are often how Blackbox sees behavior. The effect is the behavior your team cares about.

## The Effect Catalog

The effect catalog is the reviewed behavior contract behind Blackbox.

The first useful run can observe what happened and produce a baseline. After review, the catalog separates important behavior from incidental noise:

1. `requires` entries describe effects that must appear.
2. `forbids` entries describe effects that must stay absent.
3. Matchers compare future runtime evidence against that catalog.
4. CI can fail when required effects disappear or forbidden effects appear.

The catalog is intentionally different from a mock, stub, spy, or fake. Test doubles control or inspect collaborators in lower-level tests. The effect catalog records behavior from a real system or E2E run.

## Effect Coverage

Effect coverage asks whether the effects in the catalog were covered by the run.

A report should help answer:

1. Which required effects were observed?
2. Which required effects were missing?
3. Which forbidden effects appeared?
4. Which observed effects are not yet part of the reviewed catalog?
5. Which behavior changed since the last accepted run?

This is different from line coverage. A test can execute code and still fail to prove that the system published the right event, wrote the right record, or avoided the wrong side effect.

## OMC/DC Is A Separate Enriched Coverage Layer

OMC/DC coverage uses runtime evidence and effect signatures to ask a different question: did a decision in the system produce distinguishable behavior at the system-test evidence layer?

For example, two branch arms might both execute and both return a passing response. If their observed effects are indistinguishable, the run may not prove that the decision mattered at the boundary.

That makes OMC/DC useful, but it is not the same as effect coverage:

1. Effect coverage checks cataloged effects.
2. OMC/DC checks decision evidence through observed effects.
3. Both depend on runtime evidence.
4. Both are stronger when the catalog is reviewed and the system test is intentional.

## How It Fits The Workflow

The core Blackbox workflow is:

1. Run a system or E2E flow.
2. Capture runtime evidence.
3. Derive observed system effects.
4. Review the effect catalog.
5. Assert future runs with matchers.
6. Inspect effect coverage and OMC/DC reports.
7. Optionally generate readable feature files or behavior specs.

Feature files are useful when teams want readable behavior language, BDD, or spec-driven development. They are not required for effect coverage.

## What To Read Next

1. [Runtime Evidence](/docs/blackbox/concepts/system-tests-and-runtime-evidence)
2. [Requires and Forbids](/docs/blackbox/concepts/requires-and-forbids)
3. [OMC/DC Coverage](/docs/blackbox/concepts/omc-dc-coverage)
4. [Effects, Runtime, and Specs](/docs/blackbox/concepts/bdd-runtime-and-effects)
