---
title: "Extract Gherkin From Existing Suites"
description: "Use deterministic suite AST extraction to create baseline Gherkin, then review and sharpen its behavior language."
sidebar_position: 2
keywords:
  ["Blackbox features extract", "Gherkin from tests", "existing suite adoption"]
---

Use `features extract` when an existing system-test suite is the starting point for Blackbox adoption.

The CLI derives a literal baseline from native suite structure. It does not claim that test titles express complete product intent.

## Discover the Suite First

```bash
pnpm exec blackbox suites discover ./e2e --json
```

Resolve ambiguous suite roots or conflicting flow IDs before writing feature files.

## Preview the Extraction

```bash
pnpm exec blackbox features extract ./e2e/checkout.spec.ts --json
```

Without `--write`, the command returns a plan and findings.

## Write Baseline Gherkin

```bash
pnpm exec blackbox features extract \
  ./e2e/checkout.spec.ts \
  --write \
  --json
```

The result includes the written paths and an `awaiting-review` status. Review the `.feature` diff before accepting it.

## Sharpen Meaning Inferentially

Use `$blackbox-gherkin` to:

- replace vague test titles with reviewable behavior language;
- choose durable flow IDs;
- split or combine scenarios at meaningful boundaries;
- identify claims the existing suite does not prove.

The Skill may change the proposed feature. It must not edit the native suite.

## Check and Align

```bash
pnpm exec blackbox features check \
  --feature features/checkout-payment.feature \
  --json

pnpm exec blackbox suites align \
  --feature features/checkout-payment.feature \
  --suite ./e2e/checkout.spec.ts \
  --write \
  --json
```

Review the actual TypeScript diff created by `suites align`, then run `blackbox suites check --flow checkout-payment --json`.

`features emit` may remain temporarily as a compatibility alias in some builds. New documentation and automation should use `features extract`.

## Summary

- `features extract` recovers literal baseline behavior from existing suite structure.
- `$blackbox-gherkin` may propose clearer meaning but cannot edit suite source.
- `suites align` writes the reviewed behavior back to the native suite deterministically.
