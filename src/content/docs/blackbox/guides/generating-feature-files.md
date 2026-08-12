---
title: "Generate Gherkin From Existing Tests"
description: "Use feature emission as a secondary migration path for existing Playwright tests, then review the generated Gherkin before accepting it."
sidebar_position: 21
keywords:
  [
    "generate Gherkin",
    "Playwright feature files",
    "Blackbox features emit",
    "feature drift",
  ]
---

The primary Blackbox workflow is spec-first: approved EARS, accepted Gherkin, approved native Playwright, runtime evidence, and verdicts.

Use `features emit` only when you already have Playwright tests and want a starter `.feature` file for review.

## Emit a Draft

```bash
pnpm exec blackbox features emit ./e2e/tests --out ./features --dry-run --json
```

Inspect the planned files first. When the draft is useful, write it intentionally:

```bash
pnpm exec blackbox features emit ./e2e/tests --out ./features
```

## Review the Result

Generated Gherkin is not accepted behavior until a human reviews it. Check:

- the `@flow:<id>` tag matches the Playwright flow tag;
- `@requirement:<id>` tags reference approved EARS requirements;
- the scenario title names behavior, not implementation plumbing;
- steps do not invent product decisions;
- the feature basename matches the flow ID.

## Check Drift

```bash
pnpm exec blackbox features check --features ./features --tests ./e2e --json
```

Use the check in CI only after the feature file is part of the review contract.

## Summary

- **`features emit` is a migration helper.**
- **Generated Gherkin needs human review.**
- **Native Playwright remains the executable suite.**
- **Runtime evidence still decides behavior.**
