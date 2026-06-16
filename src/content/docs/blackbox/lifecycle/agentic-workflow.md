---
title: "AI-Assisted Workflow"
description: "Explain how Blackbox gives coding agents an external behavioral checker without making the docs depend on AI."
sidebar_position: 3
keywords: ["agentic workflow", "agentic output verification", "ai behavioral testing", "verification gate"]
toc_min_heading_level: 2
seo:
  primary_keyword: "agentic workflow"
  secondary_keywords: ["agentic output verification", "ai behavioral testing", "ai coding agents"]
  search_intent: "teams designing agentic development loops with deterministic verification gates"
  snippet_angle: "an agentic workflow needs a checker outside the agent, based on runtime behavior rather than prose"
---

## Abstract

Blackbox gives AI-assisted development a stable verification loop: implement, exercise the system, observe runtime effects, compare them to the catalog, and hand evidence back to the developer for review.

The same loop also helps ordinary scripts, CI jobs, and human developers. Keep this page AI-aware, but not AI-dependent.

## Audience

Teams using coding agents or automation while keeping a deterministic behavioral gate outside the implementation loop.

## The Agent Problem

Agents need stop conditions. If the only stop condition is "tests are green" or "the task list is checked," the agent can miss behavior the tests did not assert, drift from the spec, or declare completion without runtime proof.

Blackbox does not make the agent trustworthy by itself. It gives the workflow an external checker that is tied to observed behavior.

## Recommended Loop

1. The agent reads the task, existing tests, catalog, and reports.
2. The agent makes one reviewable implementation change.
3. The system test or E2E suite runs against the real boundary.
4. Blackbox collects spans and produces effect coverage artifacts.
5. The agent reads the report and fixes missing or forbidden effects.
6. The agent hands the diff, report, and remaining uncertainty to a human reviewer.

## Agent Command Loop

Agents should prefer read-only checks before state-changing commands:

```bash
pnpm exec blackbox features check --features ./features --tests ./tests --json
pnpm test:system
pnpm exec blackbox coverage replay --coverage-dir .blackbox-coverage --no-html
```

When an agent needs to reshape tests, it should run the dry-run path first:

```bash
pnpm exec blackbox features reshape ./tests/my.spec.ts --dry-run
```

State-changing commands such as `features emit`, `features reshape --write`, `features experimental wrap --write`, and `features experimental scaffold --write` should produce a reviewable diff. They should not be treated as automatic truth.

## Agentic Output Verification

Agentic output verification means the agent's work is checked against evidence outside the agent. In Blackbox, that evidence comes from runtime effects, catalogs, reports, and exit codes.

The workflow should not ask the same agent to be the sole author and final judge. It should give the agent a behavioral report it can react to, then leave merge decisions to a human or CI policy.

## Maker And Checker Split

For higher-risk work, separate the implementation role from the verification role:

1. The maker changes code.
2. The checker runs Blackbox and reads artifacts from disk.
3. The checker reports pass, fail, or uncertain against explicit criteria.
4. The human decides whether the behavioral evidence is enough to merge.

This matches the direction shown by loop-engineering discussions in the Spec Kit ecosystem, but the page should not depend on any specific agent, model, IDE, or prompt system.

## What Blackbox Provides

1. Stable artifacts an agent can parse: reports, catalogs, generated feature files, and exit codes.
2. A behavioral signal outside the agent's prose reasoning.
3. A way to detect missing required effects and forbidden effects.
4. A review artifact that humans can inspect without trusting the agent's summary.

## Useful Structured Outputs

1. `features check --json` reports feature syntax and source/feature drift.
2. `features lint --json` reports structural findings.
3. `features compare-observations --json` reports experimental observation drift.
4. `omcdc-propagation.json`, `coverage.json`, and `shape-coverage.json` report runtime coverage evidence.

## What This Loop Does Not Prove

1. It does not replace a human owner for product intent.
2. It does not prove every requirement in a written spec.
3. It does not remove the need for instrumentation, scenario design, or system tests.
4. It should not be documented as a direct Spec Kit command until that integration exists.

## Command Safety

Agents should treat exit code `1` from drift, check, lint, or compare commands as a useful finding, not a crash. Exit code `2` usually means the command could not produce a trustworthy result because inputs, directories, or transforms failed.
