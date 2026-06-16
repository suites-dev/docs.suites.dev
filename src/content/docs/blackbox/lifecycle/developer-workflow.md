---
title: "Developer Workflow"
description: "Explain the human workflow: edit a scenario, run Playwright, inspect evidence, update the catalog, commit, and gate CI."
sidebar_position: 2
keywords: ["developer workflow", "playwright system tests", "blackbox developer lifecycle"]
toc_min_heading_level: 2
seo:
  primary_keyword: "developer workflow"
  secondary_keywords: ["playwright system tests", "blackbox developer lifecycle", "feature drift"]
  search_intent: "workflow intent from developers using Blackbox during local implementation and review"
  snippet_angle: "show the local loop: edit, emit/check feature files, run system tests, read reports, and review catalog changes"
---

## Abstract

This page focuses on the person doing the work locally: edit a scenario, run the system test, inspect evidence, update the catalog when behavior intentionally changes, and decide whether the change is ready.

## Audience

Developers adding Blackbox to daily local work without changing their main runner or editor habits.

## The Human Loop

1. Edit a scenario, system test, or effect catalog entry.
2. Generate or check feature files when they are part of the workflow.
3. Run the project-owned system-test command.
4. Inspect the OMC/DC, catalog, shape, and feature artifacts.
5. Decide whether implementation, tests, feature files, or effect contracts should change.
6. Commit only the durable artifacts that belong in review.

## Local Commands

```bash
pnpm exec blackbox features emit ./tests --out ./features
pnpm exec blackbox features check --features ./features --tests ./tests
pnpm test:system
```

Use `features emit` when executable tests changed and feature artifacts should be refreshed. Use `features check` when you want a read-only syntax and drift gate. Use the project script, such as `pnpm test:system`, to actually run the system and produce runtime evidence.

For reshaping existing Playwright tests into the Blackbox closure DSL, preview first:

```bash
pnpm exec blackbox features reshape ./tests/my.spec.ts --dry-run
```

Only write after reviewing the preview:

```bash
pnpm exec blackbox features reshape ./tests/my.spec.ts --write
```

## What The Developer Reviews

1. The behavior that was observed.
2. The required and forbidden effects.
3. Whether the feature file still matches the run.
4. Whether the catalog should change or the implementation should change.

Generated reports usually stay out of git. Feature files and effect catalogs are committed only when they are part of the durable behavior contract.

## Workflow Boundaries

1. CI gate policy belongs in The Blackbox Lifecycle.
2. Agent-specific workflows belong in AI-Assisted Workflow.
3. CLI syntax belongs in Reference.

## Figure Placeholder

**Caption:** A developer using Blackbox to verify a change before merge.

**Slot:** `<!-- TODO: insert editor-to-report workflow screenshot or GIF here -->`
