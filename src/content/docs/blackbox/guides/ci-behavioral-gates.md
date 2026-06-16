---
title: "Configure CI Gates"
description: "Show how to gate feature drift, catalog changes, forbidden effects, and coverage reports in CI."
sidebar_position: 7
keywords: ["ci integration", "behavioral verification gate", "feature drift ci"]
toc_min_heading_level: 2
seo:
  primary_keyword: "behavioral verification gate"
  secondary_keywords: ["ci integration", "feature drift ci", "blackbox ci"]
  search_intent: "CI setup intent from teams gating feature drift, effect coverage, and runtime evidence in pull requests"
  snippet_angle: "show a practical CI gate using feature checks, project system tests, report artifacts, and Blackbox exit codes"
---

Developers and platform teams use this page to turn Blackbox from a local proof run into a repeatable pull-request gate.

There are two families of gates:

| Gate family | What it protects |
| --- | --- |
| Feature and BDD gates | Scenario grammar, Gherkin syntax, and feature-file drift |
| Runtime behavior gates | System-test execution, effect catalogs, forbidden effects, effect coverage, OMC/DC, and optional observation comparison |

Use both when feature files are part of the workflow. Use only the runtime gates when the team does not want Gherkin.

## Minimal Gate

A practical first CI gate has two parts:

```bash
pnpm exec blackbox features lint ./tests --fail-on error
pnpm exec blackbox features check --features ./features --tests ./tests --json
pnpm test:system
```

The first command checks the AAA/Given-When-Then grammar. The second command is read-only and checks Gherkin syntax plus feature-file drift. The third command is your project-owned system-test command. In the showcase repository, `pnpm test:system` runs Playwright through the Blackbox testbed and writes `.blackbox-coverage/` artifacts.

If you do not use feature files, skip the first two commands and start with the system-test command plus effect coverage.

## Feature Gates

Feature gates answer: is the readable behavior artifact still valid and synchronized?

| Command | Blocks on |
| --- | --- |
| `blackbox features lint` | Bad behavior grammar: no action, no assertion, `Given` after `When`, opaque generated steps, unresolved placeholders |
| `blackbox features check` | Gherkin syntax failure or feature-file drift |
| `blackbox features drift` | Missing, stale, orphaned, or unparseable `.feature` files |

`features check` uses the Cucumber Gherkin parser for syntax validation. It does not require Cucumber step definitions.

## Runtime Behavior Gates

Runtime behavior gates answer: did the running system still do the required things and avoid forbidden things?

The normal project command is still the center:

```bash
pnpm test:system
```

That command should run the controlled system or E2E suite and fail when matchers, catalogs, or required/forbidden effects fail.

When you are migrating tests or reshaping Playwright into the BDD DSL, add the experimental observation comparison gate:

```bash
pnpm exec blackbox features compare-observations --baseline ./baseline-observations --candidate ./candidate-observations --json
```

This is a behavioral drift gate over `.observation.json` files. It treats step-boundary changes as benign, but fails on meaningful changes such as missing network calls, changed payloads, changed assertions, missing tests, or different outcomes.

## Optional Report Replay

If CI saves `.blackbox-coverage/`, reports can be regenerated without rerunning the system:

```bash
pnpm exec blackbox coverage replay --coverage-dir .blackbox-coverage --out reports
```

Use `--no-html` when an agent or script only needs the JSON and Markdown propagation reports:

```bash
pnpm exec blackbox coverage replay --coverage-dir .blackbox-coverage --out reports --no-html
```

## What Should Block A Merge

Block on:

1. `features lint` errors when feature files are part of the workflow.
2. Feature syntax failure or feature-file drift from `features check`.
3. System-test failure from the project test command.
4. Missing required effects or observed forbidden effects in the effect coverage gate.
5. Meaningful observation differences during migration or reshape validation.
6. OMC/DC findings that your team has decided are blocking, such as `masking-candidate` in critical paths.

Report but do not automatically block on every generated artifact change. Intentional behavior changes should update feature files and effect catalogs through review.

## Artifacts To Upload

Upload `.blackbox-coverage/` when a run fails or when reviewers need evidence.

Useful artifacts include:

1. `omcdc-propagation.md`
2. `omcdc-propagation.json`
3. `omcdc.html`
4. `coverage.json`
5. `shape-coverage.json`
6. `html/index.html`
7. `features/*.feature` diffs when feature files are generated artifacts
8. `observations/**/*.observation.json` when using observation comparison

## GitHub Actions Sink

When `GITHUB_ACTIONS=true`, the default sink expands to file output plus GitHub Actions annotations. The GitHub Actions sink reads `omcdc-propagation.json` and emits annotations for actionable verdicts:

1. `masking-candidate` becomes a warning.
2. `coverage-gap` becomes a notice.

## Exit-Code Policy

1. Treat exit `0` as pass.
2. Treat exit `1` from `features check`, `features drift`, `features lint`, and `features compare-observations` as a useful gate finding.
3. Treat exit `2` as setup, input, or transform failure that needs investigation.

See [Exit Codes](/docs/blackbox/reference/exit-codes) for command-specific behavior.
