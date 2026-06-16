---
title: "Runtime Evidence"
description: "Explain how system tests, E2E tests, characterization testing, and trace-based evidence become Blackbox proof artifacts."
sidebar_position: 6
keywords: ["characterization testing", "runtime verification", "what is system testing", "trace based testing", "golden master testing"]
toc_min_heading_level: 2
seo:
  primary_keyword: "characterization testing"
  secondary_keywords: ["runtime verification", "what is system testing", "golden master testing", "trace based testing", "runtime evidence"]
  search_intent: "educational intent from teams trying to understand system tests, legacy characterization, and evidence-based regression checks"
  snippet_angle: "characterization testing captures existing behavior; Blackbox updates that idea with system-test runtime evidence and effect coverage"
---

## Abstract

Runtime evidence is what Blackbox trusts from a real run: traces, spans, generated artifacts, test output, and other observable facts produced while the system executed.

In older testing language, this is close to characterization testing or golden master testing: capture what the system does before you change it, then compare future behavior against that baseline. Blackbox makes that idea more specific for modern backend systems by using runtime evidence, effects, catalogs, and coverage reports.

## Audience

Readers who want to understand why a real run can become a behavior report, and why Blackbox treats observed runtime evidence as more trustworthy than stale written intent.

## What Is Runtime Evidence?

Runtime evidence is the observed record of a system test or E2E run. It can include:

1. OpenTelemetry spans.
2. Playwright or runner output.
3. Logs, traces, and request records.
4. Generated effect catalogs and feature files.
5. Coverage artifacts such as OMC/DC reports.

Blackbox uses this evidence to answer a practical question: what did the system actually do at the boundary during this run?

## What Is System Testing?

In these docs, a system test runs a composed system under controlled conditions. The test may include managed dependencies such as databases, queues, caches, local services, Docker Compose services, Testcontainers, and an OpenTelemetry collector.

System tests usually replace, stub, sandbox, or omit unmanaged dependencies such as real auth providers, email delivery, payment processors, vendor APIs, and shared remote environments. That control makes the result more repeatable and usually better suited for CI gates.

E2E tests are different. They often run a complete journey against a remote or production-like environment and may involve unmanaged dependencies. Blackbox can observe both, but system tests usually produce cleaner evidence for repeated verification.

## Characterization Testing For Modern Systems

Characterization testing is the practice of capturing existing behavior before changing a system. It is useful when the system is valuable but poorly understood, especially before a refactor or modernization project.

Blackbox applies that idea at the system boundary:

1. Run a workflow before the change.
2. Capture runtime evidence.
3. Derive effects from the run.
4. Save the behavior as a reviewable contract.
5. Run the workflow again after the change.
6. Compare what changed.

This is similar in spirit to golden master testing, but the artifact is not only a raw snapshot. Blackbox separates observed effects, required effects, forbidden effects, and coverage reports so the team can review behavior instead of accepting an opaque blob.

## Runtime Verification And Trace-Based Testing

Runtime verification checks behavior from facts produced while the system runs. In Blackbox, that means system tests and E2E runs produce evidence that can be compared with required and forbidden behavior.

Trace-based testing checks behavior through traces and spans. Blackbox uses traces as one evidence source, but the product goal is broader than asserting on a trace shape.

| Practice | Main artifact | What it proves |
| --- | --- | --- |
| Trace-based testing | Trace assertions | A trace contained expected spans or attributes |
| Runtime verification | Runtime facts compared to expected behavior | The running system satisfied a verification rule |
| Characterization testing | Captured baseline | Existing behavior stayed stable or changed visibly |
| Blackbox runtime evidence | Effects, catalog, feature files, coverage reports | Runtime behavior matched required and forbidden effects |

The difference is the review layer. Blackbox turns evidence into artifacts that humans and CI can reason about.

## What Blackbox Trusts

Blackbox trusts evidence tied to an actual run. It does not trust a feature file, task list, or spec by itself.

A strong Blackbox run has:

1. A real system or E2E workflow.
2. Clear runtime boundaries.
3. Enough instrumentation to observe relevant effects.
4. Artifacts that can be inspected after the run.
5. A catalog or assertion layer that marks what was required and forbidden.

If any of those are missing, Blackbox may still produce useful diagnostics, but the proof is weaker.

## Why This Matters

System behavior often fails outside the unit under edit. A refactor can keep unit tests green and still stop publishing an event. A generated agent patch can satisfy a task and still skip a downstream call. A spec can stay readable while the system drifts.

Runtime evidence is the correction. It gives the team something observed, current, and reviewable. It is also the basis for behavior trace testing and runtime behavior testing: not only whether code ran, but whether the observed behavior matched the model the team cares about.

## What To Read Next

1. [Unit, Integration, System, and E2E Testing](/docs/blackbox/concepts/unit-integration-system-e2e-blackbox-testing)
2. [System Effects](/docs/blackbox/concepts/system-effects)
3. [OMC/DC Coverage](/docs/blackbox/concepts/omc-dc-coverage)
4. [Covering Before Refactor](/docs/blackbox/use-cases/covering-before-refactor)

## Figure Placeholder

**Caption:** A system test run becoming runtime evidence, effects, and a reviewable report.

**Slot:** `<!-- TODO: insert evidence pipeline screenshot or GIF here -->`
