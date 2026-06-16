---
title: "Effects, Runtime, and Specs"
description: "Understand the Blackbox adoption model: runtime evidence is the source, effect catalogs are the core contract, and feature files are optional readable specs."
sidebar_position: 4
keywords: ["effect catalogs", "runtime evidence", "feature files", "BDD", "behavior specs"]
toc_min_heading_level: 2
seo:
  primary_keyword: "runtime evidence"
  secondary_keywords: ["effect catalogs", "feature files", "BDD", "behavior specs"]
  search_intent: "developers deciding whether Blackbox requires BDD, Gherkin, or feature files"
  snippet_angle: "Blackbox starts from runtime evidence and effect catalogs; feature files are an optional readable layer, not a requirement"
---

Blackbox does not require a team to adopt BDD before it can prove system behavior.

The core model is simpler:

1. Runtime evidence is the source.
2. Effect catalogs are the core behavior contract.
3. Feature files and behavior specs are optional readable projections.

That distinction matters because many teams already have runnable system or E2E tests, but they do not have current feature files. Other teams have feature files, but the files have drifted from the implementation. Blackbox should help both groups without pretending they are starting from the same place.

## The Core Path

The core Blackbox path starts with a real system run.

A test executes a workflow. Blackbox captures runtime evidence from that execution. The evidence is mapped into effects: database writes, queue messages, cache operations, HTTP calls, emitted events, email intents, and forbidden side effects.

Those effects become the reviewable contract. A future run can then ask:

1. Did the required effects happen?
2. Did forbidden effects stay absent?
3. Did the effect coverage change?
4. Did a decision produce a distinguishable system-level outcome?

This is the part of Blackbox that should be present in the first adoption story. Feature files can improve the story, but the effect catalog is where the verification gate lives.

## Why Specs Are Optional

Feature files, BDD scenarios, and spec-driven development documents are useful because they give teams a readable language for intent. They help product, QA, and engineering talk about behavior without reading traces or YAML catalogs.

They are not required for Blackbox to create value.

If a team already has system tests, Blackbox can start by observing those tests and creating effect catalogs. If the team later wants readable scenarios, Blackbox can generate or maintain behavior specs from the runtime-backed artifacts.

If a team already has feature files, Blackbox can help check whether the running system still matches them. The feature file remains the statement of intent. The runtime evidence shows what happened. The effect catalog becomes the executable behavior contract between the two.

## Common Adoption Shapes

| Starting point | What the team already has | How Blackbox fits |
| --- | --- | --- |
| Existing system tests | Runnable workflows with response assertions | Capture runtime evidence, review observed effects, create effect catalogs |
| Existing E2E tests | Full journeys, often with broad input/output checks | Add behavioral evidence for the effects between input and output |
| Existing feature files | Written scenarios that may drift | Connect readable intent to runtime evidence and effect catalogs |
| Refactor work | A system whose current behavior must be preserved | Record current effects before the change, then gate the refactor against them |
| AI-assisted development | Faster code changes and generated implementations | Give reviewers an external behavior artifact beyond model output and local assertions |

These paths are not equal product modes. They are entry points into the same model. The durable center is the effect catalog backed by runtime evidence.

## The E2E Blind Spot

Traditional E2E tests are often strongest at the edges of a workflow: send this input, expect this output. That is necessary, but it can miss the behavior in the middle.

A checkout, subscription, onboarding, or webhook flow might return the expected response while skipping an event, missing an audit write, calling a deprecated service, duplicating a notification, or mutating a cache incorrectly.

Blackbox adds the missing evidence layer. It does not discard the E2E assertion. It asks what the system actually did while satisfying that assertion.

## How To Think About The Artifacts

The artifacts have different jobs:

| Artifact | Job |
| --- | --- |
| Runtime evidence | The observed facts from a real execution |
| Effect catalog | The required, allowed, and forbidden behavior contract |
| Effect coverage report | The review surface for what behavior was exercised or missed |
| OMC/DC report | A system-level signal for whether decision changes are visible through effects |
| Feature file | An optional readable spec derived from, or checked against, runtime-backed behavior |

When the docs talk about Blackbox, they should lead with the first three. Feature files belong in the story when the reader cares about BDD, spec-driven development, living documentation, or behavior language for humans.

## What To Read Next

1. [System Effects](/docs/blackbox/concepts/system-effects)
2. [Runtime Evidence](/docs/blackbox/concepts/system-tests-and-runtime-evidence)
3. [Requires and Forbids](/docs/blackbox/concepts/requires-and-forbids)
4. [Feature Files, BDD, and Staleness](/docs/blackbox/concepts/feature-files-and-staleness)
