---
title: "Writing Scenarios"
description: "Write scenarios and effect assertions that connect system tests to observability testing, span assertions, and Blackbox behavior proof."
sidebar_position: 1
keywords: ["observability testing", "span assertions", "trace assertions", "otel testing", "given when then"]
toc_min_heading_level: 2
seo:
  primary_keyword: "observability testing"
  secondary_keywords: ["span assertions", "trace assertions", "otel testing", "otel test coverage", "given when then"]
  search_intent: "practical intent from teams turning observed traces and spans into test assertions"
  snippet_angle: "observability testing becomes useful when spans and effects are tied to required and forbidden behavior"
---

## Abstract

A Blackbox scenario is the bridge between a system test and behavioral proof. It names the workflow, exercises the boundary, and gives Blackbox enough structure to compare observed effects against what the team expects.

This page also owns the material that used to sit in a separate asserting-effects guide: how scenarios, span assertions, trace assertions, and required or forbidden effects work together.

## Audience

Developers writing Blackbox scenarios against system tests, Playwright flows, Docker Compose stacks, Testcontainers setups, or other controlled runtime environments.

## Scenario Shape

A useful scenario has three jobs:

1. Establish the starting state.
2. Exercise a real workflow.
3. Assert the effects that must or must not appear.

The exact DSL can vary by runner and API surface, but the mental model stays close to Given, When, Then:

1. **Given** the system starts from a known state.
2. **When** the workflow runs.
3. **Then** required effects appear and forbidden effects stay absent.

Do not start with every workflow. Start with one behavior whose boundary effects matter.

## Observability Testing Vs Effect Assertions

Observability testing is useful when traces, spans, logs, and runtime facts help explain what happened during a test. By itself, observability does not decide whether the behavior is acceptable.

Blackbox adds the assertion layer:

| Evidence | Useful question | Blackbox layer |
| --- | --- | --- |
| Span | Did this operation happen? | Span assertion or effect builder |
| Trace | Did the workflow cross expected boundaries? | Trace assertion or runtime evidence review |
| Effect | Did the externally visible behavior happen? | Required effect |
| Missing effect | Did expected behavior disappear? | Catalog failure |
| Extra effect | Did forbidden behavior appear? | Forbidden effect |

The goal is not to assert every span. The goal is to assert the effects that represent product or system behavior.

## Requires And Forbids In A Scenario

Required effects are positive assertions. They describe what must happen if the scenario is correct.

Forbidden effects are negative assertions. They describe what must not happen, even if the main path succeeds.

Good examples:

1. Require an event publication after a successful order.
2. Require a database write after a user update.
3. Forbid a deprecated downstream API call.
4. Forbid duplicate queue messages during retry.

Weak examples:

1. Assert every internal helper span.
2. Assert private implementation details that do not matter to the boundary.
3. Treat every observed span as a required behavior without review.

## Working With OpenTelemetry

OpenTelemetry gives Blackbox the runtime facts. The scenario gives those facts meaning.

A practical OTEL testing workflow is:

1. Instrument the system under test.
2. Run one system or E2E scenario.
3. Capture spans and related runtime evidence.
4. Map the evidence into effects.
5. Promote important effects into required or forbidden behavior.
6. Let future runs fail when the behavior drifts.

This is where span assertions and trace assertions become behavior assertions. They are not only debugging tools; they become part of the verification gate.

## What To Read Next

1. [Requires and Forbids](/docs/blackbox/concepts/requires-and-forbids)
2. [Runtime Evidence](/docs/blackbox/concepts/system-tests-and-runtime-evidence)
3. [System Effects](/docs/blackbox/concepts/system-effects)
4. [Scenario DSL](/docs/blackbox/reference/scenario-dsl)
