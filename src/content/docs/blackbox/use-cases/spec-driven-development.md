---
title: "Spec-Driven Development"
description: "Explain why spec-driven development needs a runtime verification gate, and how Blackbox adds proof after implementation."
sidebar_position: 6
keywords: ["spec driven development", "spec driven development tools", "github spec kit", "sdd verification"]
toc_min_heading_level: 2
seo:
  primary_keyword: "spec driven development"
  secondary_keywords: ["spec driven development tools", "github spec kit", "sdd verification"]
  search_intent: "educational and tool-comparison intent from teams adopting SDD or Spec Kit-style workflows"
  snippet_angle: "spec-driven development defines intent, but Blackbox verifies the implemented system with runtime evidence"
---

## Abstract

Spec-driven development helps teams write intent before code. It turns product decisions into specs, plans, tasks, and implementation work. That improves the front half of development, especially when humans and AI coding agents share the same written context.

Blackbox belongs in the verification half. It does not replace the spec, the plan, or the task list. It runs after implementation, observes the system at runtime, and turns the observed effects into proof a reviewer or CI gate can inspect.

## Audience

Teams using Spec Kit-style workflows, internal RFC/spec processes, AI coding agents, or task-driven implementation loops where "done" needs more than an accepted diff.

## What Is Spec-Driven Development?

Spec-driven development is a workflow where the team writes an explicit behavioral or product spec before implementation. The spec becomes the source for clarification, planning, task breakdown, implementation, and review.

That is valuable because it gives humans and agents a shared intent artifact. The failure mode is that the spec can still drift from the system. A checked task does not prove behavior. A generated implementation does not prove behavior. A green low-level test suite does not prove the system produced the right external effects.

## The Verification Gap

Most SDD workflows are strong at organizing intent and weak at proving runtime behavior. They answer questions like:

1. What did we mean to build?
2. What tasks should implement it?
3. Which files probably need to change?
4. Did the implementation satisfy the written checklist?

Blackbox adds a different question:

> When the implemented system actually ran, which externally visible effects were observed, missing, forbidden, or newly introduced?

That question matters because the system boundary is where many regressions appear: database writes, queues, HTTP calls, emitted events, emails, side effects, and downstream service behavior.

## Where Blackbox Fits

A spec-driven workflow can use Blackbox as a runtime verification gate:

1. A spec captures intended behavior.
2. A human or agent implements the change.
3. A system or E2E test exercises the behavior.
4. Blackbox collects runtime evidence from the run.
5. Blackbox maps evidence into effects, catalogs, feature files, and coverage reports.
6. Reviewers or CI decide whether the observed behavior matches the intended behavior.

This makes Blackbox a companion to SDD tools, not another spec generator.

## Planning Specs And Runtime-Backed Feature Files

In a spec-driven workflow, the written spec and the Blackbox feature file do different jobs. A Spec Kit-style spec explains intended behavior, decisions, constraints, and implementation work. A Blackbox feature file is a runtime-backed behavior spec: it summarizes what the system actually did when a scenario ran.

They should live side by side. The planning spec guides implementation. The Blackbox feature file helps verify that the implemented system produced the expected effects.

That distinction is important because Blackbox is not trying to become the product spec, task plan, or design doc. It adds the missing verification step after the implementation exists:

1. Runtime evidence is collected from a system or E2E run.
2. Effects are derived from that evidence.
3. Feature files, catalogs, and reports make the observed behavior reviewable.
4. CI or human review decides whether the observed behavior satisfies the intended spec.

## Spec Tools Vs Blackbox

| Artifact | Job |
| --- | --- |
| Product or Spec Kit-style spec | Defines intended behavior, constraints, decisions, and implementation context |
| Plan and task list | Organizes the implementation work |
| System or E2E test | Exercises the implemented system |
| Blackbox feature file | Captures runtime-backed behavior in readable form |
| Effect catalog and report | Verify required, forbidden, missing, and newly observed effects |
| CI or review gate | Blocks drift before merge or release |

Blackbox should not claim to prove a written spec automatically. The alpha value is narrower and stronger: given a real run, it makes the observed behavior reviewable.

## Why This Matters In The AI Era

AI coding agents make SDD more attractive because agents need explicit instructions. They also make verification more important because agents can produce plausible implementations quickly. The bottleneck moves from "can we generate code" to "can we trust the behavior."

A useful agent loop needs an external stop condition. Blackbox can provide one:

1. Implement the task.
2. Run the system test.
3. Compare observed effects against required and forbidden behavior.
4. Fix drift.
5. Stop only when the runtime evidence supports the claim.

That keeps the agent from being both the author and the only judge of success.

## External Signals

The Spec Kit ecosystem already shows demand for a verification phase:

1. [github/spec-kit#1745](https://github.com/github/spec-kit/issues/1745) asks for a verification command after implementation.
2. [github/spec-kit#1862](https://github.com/github/spec-kit/issues/1862) asks for a structured verification spec so agents can run implement, verify, and fix loops.
3. [github/spec-kit#2967](https://github.com/github/spec-kit/issues/2967) proposes a lifecycle extension with sync verification and release readiness gates.
4. [github/spec-kit#2977](https://github.com/github/spec-kit/issues/2977) proposes bounded maker/checker loops, external state, and human signoff.

These issues are research signals, not shipped Blackbox integrations. The point is that SDD is standardizing intent faster than the industry is standardizing proof.

## What Success Looks Like

A good SDD plus Blackbox workflow has three properties:

1. The planning spec still explains the intended behavior.
2. The system test exercises the implemented behavior.
3. The Blackbox feature file summarizes the runtime-backed behavior in a readable form.
4. The effect catalog and report show what runtime effects were observed, required, missing, or forbidden.

The gate is not "a spec exists." The gate is "the running system produced the behavior the team intended."

## FAQ

### Does Blackbox replace Spec Kit or SDD tools?

No. SDD tools organize intent and implementation work. Blackbox verifies observed behavior after the system runs.

### Does Blackbox read a spec and prove it automatically?

No. Blackbox works from runtime evidence. A direct integration with a specific SDD tool would be a separate integration layer.

### Why not just trust the generated tests?

Generated tests can still miss boundary behavior. Blackbox checks the effects that appeared when the system actually ran.

## What To Read Next

1. [Runtime Evidence](/docs/blackbox/concepts/system-tests-and-runtime-evidence)
2. [Feature Files and Staleness](/docs/blackbox/concepts/feature-files-and-staleness)
3. [The Blackbox Lifecycle](/docs/blackbox/lifecycle/the-blackbox-lifecycle)
4. [Configure CI Gates](/docs/blackbox/guides/ci-behavioral-gates)

## Figure Placeholder

**Caption:** SDD intent flowing into implementation, then Blackbox runtime proof before merge.

**Slot:** `<!-- TODO: insert SDD-to-proof workflow diagram or screenshot here -->`
