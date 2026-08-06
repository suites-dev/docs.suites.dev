---
title: "CLI Reference"
description: "Reference for Blackbox feature, requirement, coverage, and instrumentation commands, including structured output and write behavior."
sidebar_position: 1
keywords: ["blackbox cli", "cli reference", "blackbox commands"]
toc_min_heading_level: 2
seo:
  primary_keyword: "blackbox cli"
  secondary_keywords:
    ["cli reference", "feature files cli", "omcdc coverage replay"]
  search_intent: "reference intent from developers scripting Blackbox feature, coverage, and instrumentation commands"
  snippet_angle: "catalog the Blackbox CLI commands, what they read and write, JSON support, dry-run support, and CI safety"
---

The `blackbox` binary is provided by `@suites/blackbox-cli`. It manages generated behavior specs, EARS requirement bindings, saved OMC/DC evidence, and advanced static instrumentation. Playwright remains the command that runs the system tests.

## Command Shape

The public binary is `blackbox`, provided by `@suites/blackbox-cli`. Commands use a space topic separator:

```bash
blackbox features emit ./tests --out ./features
blackbox coverage replay --coverage-dir .blackbox-coverage
```

Use `blackbox features emit`, not `blackbox features:emit`.

## Command Families

The CLI has four command families:

1. `features`: generate, lint, drift-check, reshape, and compare feature artifacts.
2. `requirements`: validate EARS sources and bindings, detect drift, and join requirements to runtime verdicts.
3. `coverage`: replay OMC/DC reports from saved runtime evidence.
4. `otel`: build-time static OpenTelemetry instrumentation utilities.

## Command Matrix

| Command                                              | Job                                                                                  | Reads                                                             | Writes                                                                  | JSON          | Dry run                                                  | Stability                    |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------ | ----------------------------------------------------------------- | ----------------------------------------------------------------------- | ------------- | -------------------------------------------------------- | ---------------------------- |
| `blackbox features emit [paths...]`                  | Decompile Playwright or BDD-DSL tests into `.feature` files.                         | Test source files; optional step library.                         | `.feature` files under `--out` or `./features`.                         | Yes, `--json` | Yes, `--dry-run`                                         | Alpha public                 |
| `blackbox features lint [paths...]`                  | Run structural rules against test sources.                                           | Test source files.                                                | Nothing.                                                                | Yes, `--json` | N/A                                                      | Alpha public                 |
| `blackbox features drift`                            | Detect generated feature files that drifted from source tests.                       | `--tests`, `--features`, optional steps.                          | Nothing.                                                                | Yes, `--json` | N/A                                                      | Alpha public                 |
| `blackbox features check`                            | Validate `.feature` syntax and source/feature drift.                                 | `--features`, `--tests`.                                          | Nothing.                                                                | Yes, `--json` | N/A                                                      | Alpha public                 |
| `blackbox features reshape [paths...]`               | Rewrite Playwright system tests into Blackbox closure-DSL shape.                     | Test source files.                                                | `--write` writes reshaped tests under `--out`; otherwise prints source. | Yes, `--json` | Yes, `--dry-run`                                         | Alpha public, state-changing |
| `blackbox features compare-observations`             | Compare observation-reporter outputs from two runs.                                  | `--baseline`, `--candidate` directories with `.observation.json`. | Nothing.                                                                | Yes, `--json` | N/A                                                      | Experimental                 |
| `blackbox features experimental wrap [paths...]`     | Annotate Playwright specs so the Gherkin reporter can emit feature files at runtime. | Test source files.                                                | Only with `--write`; otherwise prints what would change.                | Yes, `--json` | Implicit preview without `--write`; `--diff` shows edits | Experimental                 |
| `blackbox features experimental scaffold [paths...]` | Generate starter closure-DSL tests from `.feature` files.                            | `.feature` files.                                                 | Only with `--write`; otherwise prints generated source.                 | Yes, `--json` | Implicit preview without `--write`                       | Experimental                 |
| `blackbox requirements check`                        | Validate EARS syntax, unique IDs, sidecar shape, and binding references.             | EARS sources and `__requirements__` sidecars.                     | Nothing.                                                                | Yes, `--json` | N/A                                                      | Alpha public                 |
| `blackbox requirements drift`                        | Find unbound requirements, unbound or unknown flows, and invalid sidecars.           | EARS sources, `__requirements__`, and `__effects__` sidecars.     | Nothing.                                                                | Yes, `--json` | N/A                                                      | Alpha public                 |
| `blackbox requirements coverage`                     | Join flow bindings to `catalog/coverage.json`.                                       | EARS sources, requirement sidecars, and effect coverage.          | `requirements/coverage.json`.                                           | Yes, `--json` | No                                                       | Alpha public, state-changing |
| `blackbox coverage replay`                           | Recompute OMC/DC reports from saved `.blackbox-coverage` evidence.                   | `--coverage-dir`; optional service source map.                    | Report files under `--out` or the coverage directory.                   | Yes, `--json` | No                                                       | Alpha public, state-changing |
| `blackbox otel instrument`                           | Transform source files with static OpenTelemetry function-span instrumentation.      | `--input` source tree; optional config.                           | Instrumented source tree under `--output`.                              | Yes, `--json` | No                                                       | Advanced                     |

## Feature Commands

### `features emit`

```bash
blackbox features emit ./tests --out ./features
blackbox features emit ./tests --steps ./scripts/step-lib.json
blackbox features emit ./tests --no-steps
blackbox features emit ./tests --dry-run --json
```

The output directory defaults to `./features`. Use `--dry-run --json` to inspect the planned files without writing them, and `--watch` to regenerate after source changes.

### `features lint`

```bash
blackbox features lint ./tests
blackbox features lint ./tests --json
blackbox features lint ./tests --fail-on error --scope backend
```

Read-only. `--scope` accepts `backend`, `browser-only`, or `all`. `--fail-on` still accepts `error`, `warn`, or `info` for compatibility, but the unified CLI exit code is severity-driven: only error findings exit `1`.

### `features drift`

```bash
blackbox features drift --tests ./tests --features ./features
blackbox features drift --no-steps
blackbox features drift --json
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

## Requirement Commands

The requirements commands use [`@earsyntax/cli`](https://www.npmjs.com/package/@earsyntax/cli) to parse EARS sources. Install it in the project or pass `--earsyntax-bin`.

### `requirements check`

```bash
blackbox requirements check
blackbox requirements check --profile ears-x --tests ./e2e --json
blackbox requirements check --source 'requirements/**/*.ears'
```

Read-only. It validates EARS grammar, requirement ID uniqueness, strict binding-sidecar shape, and referential integrity.

### `requirements drift`

```bash
blackbox requirements drift --tests ./e2e
blackbox requirements drift --tests ./e2e --json
```

Read-only. The scan reports requirements without flows, effect flows without requirement bindings, bindings to unknown flows, and sidecars that cannot be parsed. Point `--tests` at the intended suite; a repository-wide scan can legitimately find infrastructure flows that are outside your requirement set.

### `requirements coverage`

```bash
blackbox requirements coverage --tests ./e2e
blackbox requirements coverage --fail-on unproven --json
blackbox requirements coverage --coverage ./artifacts/catalog/coverage.json --out ./artifacts
```

The command writes `requirements/coverage.json` below `--out`. Its four verdicts are `proven`, `violated`, `unproven`, and `unbound`. `--fail-on` accepts `violated`, `unproven`, or `unbound` and defaults to `violated`.

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

1. Use `requirements check --json` before running requirement coverage.
2. Use `features check --json` when generated Gherkin is part of the review contract.
3. Run `features reshape --dry-run` before any `features reshape --write` flow.
4. Treat `coverage replay` as report regeneration over saved evidence, not as the command that runs the system test.
5. Use the project's Playwright command to run the system tests and collect evidence.

## Related Pages

1. [Exit Codes](/docs/blackbox/reference/exit-codes)
2. [Files and Artifacts](/docs/blackbox/reference/files-and-artifacts)
3. [Report Formats](/docs/blackbox/reference/report-formats)
