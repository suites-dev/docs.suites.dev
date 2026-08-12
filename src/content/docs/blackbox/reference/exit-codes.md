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

| Command                          | `0`                                                               | `1`                                                                       | `2`                                                                                 |
| -------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `init`                           | Manifest written or previewed.                                    | Detection completed with actionable findings and no unsafe write.         | Invalid flags, an existing manifest, or configuration could not be produced safely. |
| `doctor`                         | Configured layers are ready.                                      | One or more readiness checks failed.                                      | The manifest or environment could not be inspected.                                 |
| `status`                         | Repository and retained-run state was read without gate findings. | Disconnected, stale, or configured-gate findings were found.              | Project state could not be resolved.                                                |
| `verify`                         | Every configured gate passed.                                     | One or more test, effect, requirement, feature, or decision gates failed. | The run could not produce a trustworthy layered verdict.                            |
| `explain`                        | Diagnostic explanation returned.                                  | Not used.                                                                 | Unknown diagnostic code or invalid input.                                           |
| `flows list`                     | Known flows listed.                                               | Not used.                                                                 | Project configuration or flow discovery failed.                                     |
| `flows show`                     | Flow and connected artifacts resolved.                            | The flow exists but has connection findings.                              | Unknown flow ID or project discovery failure.                                       |
| `features emit`                  | Feature files emitted or previewed.                               | Not used.                                                                 | Invalid inputs or an emit engine failure.                                           |
| `features lint`                  | No error-severity findings.                                       | At least one error-severity finding.                                      | Invalid inputs or an analysis failure.                                              |
| `features drift`                 | Source tests and feature files are in sync.                       | Missing, stale, orphan, or unparseable feature findings.                  | Missing or invalid inputs, or an analysis failure.                                  |
| `features check`                 | Enabled syntax and drift checks passed.                           | Syntax or drift findings.                                                 | Invalid inputs or an unexpected analysis failure.                                   |
| `features compare-observations`  | Baseline and candidate observations are semantically equivalent.  | Meaningful difference or missing observation pair.                        | Missing arguments, missing directory, malformed file, or no traces found.           |
| `features experimental wrap`     | Completed preview or write.                                       | Not used.                                                                 | Invalid inputs or an engine failure.                                                |
| `features experimental scaffold` | Completed preview or write.                                       | Not used.                                                                 | Invalid inputs or an engine failure.                                                |
| `requirements validate`          | EARS structure and IDs are valid.                                 | One or more validation findings.                                          | The requirements engine or inputs could not be loaded.                              |
| `requirements profiles`          | Available profiles listed.                                        | Not used.                                                                 | Profile registry failure.                                                           |
| `requirements check`             | EARS and binding validation passed.                               | One or more error-severity findings.                                      | The requirements engine or configured inputs could not be loaded.                   |
| `requirements drift`             | No requirement, binding, or effect-flow drift.                    | At least one error-severity drift finding.                                | The command could not read or validate the configured inputs.                       |
| `requirements coverage`          | No verdict breached `--fail-on`; the artifact was written.        | At least one requirement breached the configured gate.                    | Runtime coverage or another required input could not be read.                       |
| `coverage replay`                | Reports written, or no artifacts found.                           | Report generation completed with captured propagation or Istanbul errors. | Framework or unexpected failure.                                                    |
| `otel instrument`                | Transform completed.                                              | Not used by the unified command.                                          | Parse, config, traversal, or write failure.                                         |

## Practical Guidance

1. Treat exit `1` from `verify` as a normal layered verification failure, not a tool crash.
2. Read the JSON layer state before deciding which engine output to inspect.
3. Treat `features drift` exit `1` as generated Gherkin being out of sync with its source tests.
4. Treat `features compare-observations` exit `1` as semantic drift between observation sets.
5. Treat `features emit` as a secondary migration command for existing tests, not the primary spec-driven flow.
6. Treat exit `2` as setup or input failure where the command could not produce a trustworthy result.

## CI Example

```bash
blackbox doctor --json
blackbox verify --json
```

`doctor` catches environment failures before the expensive run. `verify` executes the selected layers and applies their independent gates without changing accepted behavior artifacts.
