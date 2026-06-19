---
title: "CLI Reference"
description: "Catalog all commands, arguments, output, safety level, scripting behavior, and exit codes."
sidebar_position: 1
keywords: ["blackbox cli", "cli reference", "blackbox commands"]
toc_min_heading_level: 2
seo:
  primary_keyword: "blackbox cli"
  secondary_keywords: ["cli reference", "feature files cli", "omcdc coverage replay"]
  search_intent: "reference intent from developers scripting Blackbox feature, coverage, and instrumentation commands"
  snippet_angle: "catalog the Blackbox CLI commands, what they read and write, JSON support, dry-run support, and CI safety"
---

## Abstract

This page is the machine-facing contract for the `blackbox` CLI. It answers three questions quickly: what command should I run, what does it change, and is it safe to script.

## Audience

Developers and automation authors wiring Blackbox into local scripts, CI gates, and agent workflows.

## Command Shape

The public binary is `blackbox`, provided by `@suites/blackbox-cli`. Commands use a space topic separator:

```bash
blackbox features emit ./tests --out ./features
blackbox coverage replay --coverage-dir .blackbox-coverage
```

Use `blackbox features emit`, not `blackbox features:emit`.

## Command Families

The CLI has three command families:

1. `features`: generate, lint, drift-check, reshape, and compare feature artifacts.
2. `coverage`: replay OMC/DC reports from saved runtime evidence.
3. `otel`: build-time static OpenTelemetry instrumentation utilities.

## Command Matrix

| Command | Job | Reads | Writes | JSON | Dry run | Stability |
| --- | --- | --- | --- | --- | --- | --- |
| `blackbox features emit [paths...]` | Decompile Playwright or BDD-DSL tests into `.feature` files. | Test source files; optional step library. | `.feature` files under `--out` or `./features`. | No | No | Alpha public |
| `blackbox features lint [paths...]` | Run structural rules against test sources. | Test source files. | Nothing. | Yes, `--json` | N/A | Alpha public |
| `blackbox features drift` | Detect generated feature files that drifted from source tests. | `--tests`, `--features`, optional steps. | Nothing. | No | N/A | Alpha public |
| `blackbox features check` | Validate `.feature` syntax and source/feature drift. | `--features`, `--tests`. | Nothing. | Yes, `--json` | N/A | Alpha public |
| `blackbox features reshape [paths...]` | Rewrite Playwright system tests into Blackbox closure-DSL shape. | Test source files. | `--write` writes reshaped tests under `--out`; otherwise prints source. | No | Yes, `--dry-run` | Alpha public, state-changing |
| `blackbox features compare-observations` | Compare observation-reporter outputs from two runs. | `--baseline`, `--candidate` directories with `.observation.json`. | Nothing. | Yes, `--json` | N/A | Experimental |
| `blackbox features experimental wrap [paths...]` | Annotate Playwright specs so the Gherkin reporter can emit feature files at runtime. | Test source files. | Only with `--write`; otherwise prints what would change. | No | Implicit preview without `--write` | Experimental |
| `blackbox features experimental scaffold [paths...]` | Generate starter closure-DSL tests from `.feature` files. | `.feature` files. | Only with `--write`; otherwise prints generated source. | No | Implicit preview without `--write` | Experimental |
| `blackbox coverage replay` | Recompute OMC/DC reports from saved `.blackbox-coverage` evidence. | `--coverage-dir`; optional service source map. | Report files under `--out` or coverage dir. | No | No | Alpha public, state-changing |
| `blackbox otel instrument` | Transform source files with static OpenTelemetry function-span instrumentation. | `--input` source tree; optional config. | Instrumented source tree under `--output`. | No | No | Advanced/experimental |

## Feature Commands

### `features emit`

```bash
blackbox features emit ./tests --out ./features
blackbox features emit ./tests --steps ./scripts/step-lib.json
blackbox features emit ./tests --no-steps
```

Defaults to reading `tests` and writing to `features` when no paths or `--out` are supplied. This command writes files and should be reviewed before committing generated feature changes.

### `features lint`

```bash
blackbox features lint ./tests
blackbox features lint ./tests --json
blackbox features lint ./tests --fail-on error --scope backend
```

Read-only. `--fail-on` accepts `error`, `warn`, or `info`. `--scope` accepts `backend`, `browser-only`, or `all`.

### `features drift`

```bash
blackbox features drift --tests ./tests --features ./features
blackbox features drift --no-steps
```

Read-only. Use it when feature files are generated artifacts that must stay synchronized with source tests.

### `features check`

```bash
blackbox features check
blackbox features check --features ./features --tests ./tests
blackbox features check --skip-drift --json
```

Read-only. Defaults to `--features ./features` and `--tests ./tests`. Use this as the durable CI gate for feature syntax plus drift.

### `features reshape`

```bash
blackbox features reshape ./tests/my.spec.ts --dry-run
blackbox features reshape ./tests/my.spec.ts --write
blackbox features reshape ./tests/my.spec.ts --out ./reshaped --testbed ./testbed.js
```

State-changing only with `--write`. `--dry-run` and `--write` are mutually exclusive.

## Coverage Commands

### `coverage replay`

```bash
blackbox coverage replay --coverage-dir .blackbox-coverage --out reports
blackbox coverage replay --no-html
blackbox coverage replay --service bff=/path/to/bff/src --service order=/path/to/order/src
```

Replays reports from saved runtime evidence. By default it writes OMC/DC JSON, Markdown, HTML, Istanbul `code-coverage/coverage.json`, and Istanbul HTML. With `--no-html`, it writes only `omcdc/verdict.json` and `omcdc/verdict.md`.

## Static Instrumentation Commands

### `otel instrument`

```bash
blackbox otel instrument --input ./src --output ./instrumented --config ./otel.json
blackbox otel instrument -i ./src -o ./instrumented --include 'services/**/*.ts' --verbose
```

This is a build-time instrumentation command. It walks `--input`, transforms matching files, and writes the output tree to `--output`. It is separate from the default testbed bootstrap path.

## Practical Defaults

1. Use `features check --json` in automation when you need structured feature syntax and drift output.
2. Run `features reshape --dry-run` before any `features reshape --write` flow.
3. Treat `coverage replay` as a report regeneration command over saved evidence, not as the command that runs the system test.
4. Use project scripts such as `pnpm test:system` to run the actual system test and collect evidence.

## Related Pages

1. [Exit Codes](/docs/blackbox/reference/exit-codes)
2. [Files and Artifacts](/docs/blackbox/reference/files-and-artifacts)
3. [Report Formats](/docs/blackbox/reference/report-formats)
