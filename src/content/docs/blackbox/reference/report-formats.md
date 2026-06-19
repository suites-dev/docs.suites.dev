---
title: "Report Formats"
description: "Describe coverage, shape coverage, and propagation outputs as machine-readable artifacts."
sidebar_position: 5
keywords: ["report formats", "coverage json", "shape coverage json"]
toc_min_heading_level: 2
seo:
  primary_keyword: "report formats"
  secondary_keywords: ["coverage json", "omcdc json", "shape coverage json", "junit coverage report"]
  search_intent: "reference intent from users and automation authors consuming Blackbox generated reports"
  snippet_angle: "explain each Blackbox report file, its producer, format, consumer, and stability expectation"
---

## Abstract

Blackbox writes several report formats from the same run. This page explains which file belongs to which stage, what each file is for, and how stable each output is.

## Audience

People who need to consume, parse, archive, or compare the artifacts Blackbox produces.

## Artifact Family

| Reporter token | Artifact | Format | Purpose |
| --- | --- | --- | --- |
| `json` | `omcdc-verdict.json` | JSON | Machine-readable OMC/DC propagation report. |
| `markdown` | `omcdc-verdict.md` | Markdown | Human-readable OMC/DC report for reviews and editor inspection. |
| `html` | `omcdc-verdict.html` | HTML | Interactive OMC/DC report with branch-level inspection. |
| `catalog-json` | `effects-coverage.json` | JSON | Effect catalog coverage summary. |
| `shape-json` | `effects-shape-coverage.json` | JSON | Boundary-shape coverage summary. |
| `junit` | `omcdc.junit.xml` | XML | CI-facing test-result view of OMC/DC verdicts. |

## Stability Notes

1. `effects-coverage.json` and `effects-shape-coverage.json` are compact summaries and are the safest starting point for automation.
2. `omcdc-verdict.json` is machine-readable but carries detailed branch and verdict data that may evolve while the alpha engine evolves.
3. Markdown and HTML reports are review artifacts. They are meant to be read, attached, and linked, not parsed as stable APIs.
4. `omcdc.junit.xml` is designed for CI systems that already understand JUnit XML.
5. Per-test span and V8 files are diagnostic inputs, not public report formats.

## What Each Artifact Is For

### `omcdc-verdict.json`

Contains endpoints, branch coordinates, true-arm test IDs, false-arm test IDs, not-observed test IDs, verdicts, hints, and observed effect shapes. Use it when an agent or tool needs to understand why a branch is propagating, masked, or still a gap.

### `omcdc-verdict.md`

Contains the same OMC/DC story in a reviewable form: endpoint sections, verdict counts, branch tables, hints, and oracle data per branch. Use it when a reviewer needs to understand the result without opening the interactive report.

### `omcdc-verdict.html`

The interactive OMC/DC report. Use it when a developer needs to inspect branches, hints, source snippets when available, and the relationship between decisions and observed effects.

### `effects-coverage.json`

Summarizes effect catalog entry coverage. It answers whether catalog entries were seen, satisfied, failed, or uncovered.

The shape is based on:

1. `catalog`: service name, entry count, and catalog API version.
2. `totals`: seen, satisfied, failed, and uncovered counts.
3. `perEntry`: per-catalog-entry state, run count, pass count, and failure count.

### `effects-shape-coverage.json`

Summarizes effect shapes, not whole catalog entries. It answers whether declared or inline boundary shapes were asserted and observed.

Shape states are:

1. `asserted`: declared in the catalog and named by a matcher.
2. `unasserted`: declared in the catalog but never named by a matcher.
3. `inline`: named by a matcher but not declared in the catalog.

### `omcdc.junit.xml`

Maps OMC/DC verdicts into CI test-result vocabulary:

| OMC/DC verdict | JUnit mapping |
| --- | --- |
| `propagating` | pass |
| `masking-candidate` | failure |
| `coverage-gap` | skipped |
| `undecidable` | pass with `system-out` |
| `multi-arm` | pass with `system-out` |
| `unsupported-mcdc` | pass with `system-out` |

## Artifact Delivery

Reporters render artifacts. Sinks deliver them.

That separation matters: the same proof can become files, stdout output, GitHub Actions annotations, or CI test results without changing the evidence or the coverage model.

The GitHub Actions sink reads `omcdc-verdict.json` and emits workflow annotations for actionable verdicts:

1. `masking-candidate` becomes a warning.
2. `coverage-gap` becomes a notice.
3. Other verdicts are silent.

## Practical Reading Order

1. Start with the filename.
2. Check whether the output is JSON, Markdown, HTML, or XML.
3. Check whether it is intended for humans or automation.
4. Use the related concept pages if you need the model behind it.

## Figure Placeholder

**Caption:** The artifact family Blackbox emits for review and automation.

**Slot:** `<!-- TODO: insert artifact gallery or report-format comparison image here -->`
