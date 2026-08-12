---
title: "Report Formats"
description: "Reference for Blackbox effect, requirement, shape, observable decision, JUnit, Markdown, and HTML report artifacts."
sidebar_position: 5
keywords: ["report formats", "coverage json", "shape coverage json"]
toc_min_heading_level: 2
seo:
  primary_keyword: "report formats"
  secondary_keywords:
    [
      "coverage json",
      "omcdc json",
      "shape coverage json",
      "junit coverage report",
    ]
  search_intent: "reference intent from users and automation authors consuming Blackbox generated reports"
  snippet_angle: "explain each Blackbox report file, its producer, format, consumer, and stability expectation"
---

Blackbox produces machine-readable verdicts and human-readable reports from the same test run. Use JSON for gates and repair loops; use Markdown or HTML to understand why a gate failed.

## Artifact Family

| Producer or setting           | Artifact                     | Format   | Purpose                                                             |
| ----------------------------- | ---------------------------- | -------- | ------------------------------------------------------------------- |
| Catalog coverage module       | `catalog/coverage.json`      | JSON     | Per-flow effect contract verdicts and totals.                       |
| Shape coverage module         | `shape/coverage.json`        | JSON     | Declared, asserted, and observed boundary shapes.                   |
| `effects-report` reporter     | `effects-report.md`          | Markdown | Reviewable effect and shape coverage summary.                       |
| `effects-report` reporter     | `effects-report.html`        | HTML     | Browser view of the same summary.                                   |
| Node decision producer        | `omcdc/verdict.json`         | JSON     | Machine-readable observable decision report.                        |
| Node decision producer        | `omcdc/verdict.md`           | Markdown | Human-readable observable decision report.                          |
| Node decision producer        | `omcdc/verdict.html`         | HTML     | Interactive branch-arm evidence report.                             |
| Facade or requirements engine | `requirements/coverage.json` | JSON     | EARS requirement verdicts joined through feature tags and flow IDs. |
| `junit`                       | `omcdc.junit.xml`            | XML      | CI-facing test-result view of decision verdicts.                    |

## Stability Notes

1. `catalog/coverage.json` and `requirements/coverage.json` are the direct inputs for CI and agent repair loops.
2. `shape/coverage.json` explains whether catalog shapes were actually named by matchers.
3. `omcdc/verdict.json` carries detailed branch evidence and may evolve while the engine is alpha.
4. Markdown and HTML are presentation artifacts; do not parse them as APIs.
5. Raw span and `node/v8` files are producer inputs, not public report contracts.

## What Each Artifact Is For

### `omcdc/verdict.json`

Contains endpoints, branch coordinates, true-arm test IDs, false-arm test IDs, not-observed test IDs, verdicts, hints, and observed effect shapes. Use it when an agent or tool needs to understand why a branch is propagating, masked, or still a gap.

### `omcdc/verdict.md`

Contains the same observable decision story in a reviewable form: endpoint sections, verdict counts, branch tables, hints, and branch evidence. Use it when a reviewer needs to understand the result without opening the interactive report.

### `omcdc/verdict.html`

The interactive observable decision report. Use it when a developer needs to inspect branch arms, hints, source snippets when available, and the relationship between decisions and captured evidence.

### `catalog/coverage.json`

Summarizes effect contract coverage. It answers whether accepted contracts were seen, satisfied, failed, or uncovered.

The shape is based on:

1. `catalog`: service name, entry count, and catalog API version.
2. `totals`: seen, satisfied, failed, uncovered, and forbidden-entry counts.
3. `perEntry`: state, run/pass/failure counts, and `forbidViolations` with the matched shape and last observed location.

Entry states are `satisfied`, `failed`, or `uncovered`. A flow can fail because a required effect is missing, a forbidden effect appeared, or a count constraint did not match.

### `shape/coverage.json`

Summarizes effect shapes, not whole catalog entries. It answers whether declared or inline boundary shapes were asserted and observed.

Shape states are:

1. `asserted`: declared in the catalog and named by a matcher.
2. `unasserted`: declared in the catalog but never named by a matcher.
3. `inline`: named by a matcher but not declared in the catalog.

### `requirements/coverage.json`

Joins EARS requirement IDs to the runtime result of their bound flows. A requirement is:

1. `proven` when every bound flow is satisfied.
2. `violated` when at least one bound flow failed.
3. `unproven` when no bound flow failed but at least one was not exercised.
4. `unbound` when the requirement has no accepted flow connection.

When multiple flows bind to one requirement, the worst verdict wins.

### `omcdc.junit.xml`

Maps observable decision verdicts into CI test-result vocabulary:

| Decision verdict    | JUnit mapping          |
| ------------------- | ---------------------- |
| `propagating`       | pass                   |
| `masking-candidate` | failure                |
| `coverage-gap`      | skipped                |
| `undecidable`       | pass with `system-out` |
| `multi-arm`         | pass with `system-out` |
| `unsupported-mcdc`  | pass with `system-out` |

## Artifact Delivery

Coverage modules and reporters render artifacts. Sinks deliver them.

That separation matters: the same proof can become files, stdout output, GitHub Actions annotations, or CI test results without changing the evidence or the coverage model.

The default file sink writes below the configured coverage directory. When `GITHUB_ACTIONS=true`, the default also includes the GitHub Actions sink. That sink reads `omcdc/verdict.json` and emits workflow annotations for actionable verdicts:

1. `masking-candidate` becomes a warning.
2. `coverage-gap` becomes a notice.
3. Other verdicts are silent.

## Practical Reading Order

1. Start with the filename.
2. Check whether the output is JSON, Markdown, HTML, or XML.
3. Check whether it is intended for humans or automation.
4. Use the related concept pages if you need the model behind it.
