---
title: "The Blackbox Lifecycle"
description: "Show the full cycle from intent to system scenario, runtime effects, feature file, catalog, report, and CI gate."
sidebar_position: 1
keywords: ["continuous verification", "blackbox lifecycle", "verification at runtime", "behavioral verification loop"]
toc_min_heading_level: 2
seo:
  primary_keyword: "continuous verification"
  secondary_keywords: ["verification at runtime", "blackbox lifecycle", "behavioral verification loop"]
  search_intent: "teams looking for a repeatable verification loop across local development, CI, and release decisions"
  snippet_angle: "continuous verification is useful when every change can produce runtime evidence before it is trusted"
---

## Abstract

Show the full cycle from intent to system scenario, runtime effects, feature file, catalog, report, verification, and decision.

This page should be the map for the whole workflow: what happens, what artifacts appear, and where humans, scripts, CI, and agents each enter.

## Audience

Readers who need the whole mental model before choosing a guide or reference page.

## The Cycle

1. Intent: the team names the behavior they care about.
2. Scenario: the system test or feature describes the run.
3. Run: the boundary is exercised.
4. Capture: runtime evidence is collected.
5. Shape: Blackbox turns evidence into effects, catalog entries, and reports.
6. Verify: the evidence is compared to required and forbidden behavior.
7. Decide: the result becomes a local fix, a review artifact, or a CI gate.

## Why This Loop Exists

The loop exists so specs, tests, and runtime behavior do not drift apart without anyone noticing. The point is not to create more artifacts. The point is to make behavior visible enough to trust.

This is Blackbox's version of continuous verification: verification at runtime, attached to the development loop, CI gate, and release decision. It is not a replacement for observability or deployment monitoring. It is a way to turn selected system-test runs into repeatable behavioral evidence.

## Who Uses The Loop

1. Developers, in the editor and terminal.
2. Scripts, in CI or local automation.
3. Agents, as one consumer of the same artifacts.
4. Reviewers, who read the report before trusting the change.

## What Each Actor Does

1. Developers shape the scenario and interpret the result.
2. Scripts move the proof through the pipeline.
3. Agents can propose or update changes, but they do not become the source of truth.
4. Reviewers decide whether the observed behavior is good enough to accept.

## The Operational Loop

1. Initialize or load configuration.
2. Run the scenario or system test.
3. Collect and normalize spans.
4. Generate or compare the effect catalog.
5. Emit reports and exit codes.
6. Route the artifacts to files, stdout, or CI systems.

This is the material that used to live in separate lifecycle pages. Keeping it here makes the workflow easier to scan.

## What Belongs Later

1. Exact command syntax belongs in Reference.
2. Artifact destination details belong in Files and Artifacts.
3. Testbed setup details belong in Guides and Quickstart.

## Evidence To Add

- A simple lifecycle diagram.
- A concrete example of one run moving through the loop.
- Links to developer workflow, AI-assisted workflow, and CI gate lifecycle.

## Figure Placeholder

**Caption:** The Blackbox lifecycle from intent to proof to decision.

**Slot:** `<!-- TODO: insert lifecycle diagram or step-through animation here -->`
