---
title: "Exit Codes"
description: "Define CLI exit codes for clean runs, findings, usage errors, fatal errors, and CI scripts."
sidebar_position: 9
keywords: ["exit codes", "ci scripting", "blackbox cli errors"]
toc_min_heading_level: 2
seo:
  primary_keyword: "exit codes"
  secondary_keywords:
    ["ci scripting", "blackbox cli errors", "feature drift exit code"]
  search_intent: "automation reference intent from users wiring Blackbox commands into CI scripts"
  snippet_angle: "document command-specific Blackbox exit codes for clean runs, drift, findings, write safety, and fatal errors"
---

Use exit codes to distinguish a behavioral finding from a command that could not produce a trustworthy result. Use `--json` when the command supports it; the exit code remains the gate signal.

## General Rule

The shared CLI contract defines `0` as clean, `1` as error-severity findings or a gate breach, and `2` as invalid input, an environment failure, or an engine failure that prevented a trustworthy result.

## Command Exit Codes

| Command                          | `0`                                                              | `1`                                                                       | `2`                                                                                                |
| -------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `features emit`                  | Feature files emitted or previewed.                              | Not used.                                                                 | Invalid inputs or an emit engine failure.                                                          |
| `features lint`                  | No error-severity findings.                                      | At least one error-severity finding.                                      | Invalid inputs or an analysis failure.                                                             |
| `features drift`                 | Source tests and feature files are in sync.                      | Missing, stale, orphan, or unparseable feature findings.                  | Missing or invalid inputs, or an analysis failure.                                                 |
| `features check`                 | Enabled syntax and drift checks passed.                          | Syntax or drift findings.                                                 | Invalid inputs or an unexpected analysis failure.                                                  |
| `features reshape`               | Reshape completed without error findings.                        | Unsafe fallback, parse failure, or another per-file error finding.        | Invalid flags, missing inputs, or a preflight/engine failure.                                      |
| `features compare-observations`  | Baseline and candidate observations are semantically equivalent. | Meaningful difference or missing observation pair.                        | Missing arguments, missing directory, malformed file, or no traces found.                          |
| `features experimental wrap`     | Completed preview or write.                                      | Not used.                                                                 | Invalid inputs or an engine failure.                                                               |
| `features experimental scaffold` | Completed preview or write.                                      | Not used.                                                                 | Invalid inputs or an engine failure.                                                               |
| `requirements check`             | EARS and binding validation passed.                              | One or more error-severity findings.                                      | The command could not resolve or run `earsyntax`, or another environment prerequisite was missing. |
| `requirements drift`             | No requirement, binding, or effect-flow drift.                   | At least one error-severity drift finding.                                | The command could not read or validate the configured inputs.                                      |
| `requirements coverage`          | No verdict breached `--fail-on`; the artifact was written.       | At least one requirement breached the configured gate.                    | Runtime coverage or another required input could not be read.                                      |
| `coverage replay`                | Reports written, or no artifacts found.                          | Report generation completed with captured propagation or Istanbul errors. | Framework or unexpected failure.                                                                   |
| `otel instrument`                | Transform completed.                                             | Not used by the unified command.                                          | Parse, config, traversal, or write failure.                                                        |

## Practical Guidance

1. Treat exit `1` from `requirements coverage` or `features check` as a normal verification-gate failure, not a tool crash.
2. Treat `features drift` exit `1` as generated Gherkin being out of sync with its source tests.
3. Treat `features compare-observations` exit `1` as semantic drift between observation sets.
4. Treat `features reshape` exit `1` as unsafe or incomplete output that needs review before write or commit.
5. Treat exit `2` as setup or input failure where the command could not produce a trustworthy result.

## CI Example

```bash
blackbox requirements check --tests ./e2e --json
pnpm test:system
blackbox requirements coverage --tests ./e2e --fail-on unproven --json
```

The first command validates intent and bindings. The project-owned Playwright command produces runtime evidence. The last command joins both sides and applies the requirement gate.
