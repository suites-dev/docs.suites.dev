---
title: "Exit Codes"
description: "Define CLI exit codes for clean runs, findings, usage errors, fatal errors, and CI scripts."
sidebar_position: 9
keywords: ["exit codes", "ci scripting", "blackbox cli errors"]
toc_min_heading_level: 2
seo:
  primary_keyword: "exit codes"
  secondary_keywords: ["ci scripting", "blackbox cli errors", "feature drift exit code"]
  search_intent: "automation reference intent from users wiring Blackbox commands into CI scripts"
  snippet_angle: "document command-specific Blackbox exit codes for clean runs, drift, findings, write safety, and fatal errors"
---

This page documents command-specific exit codes that CI and scripts can use without parsing prose.

Developers writing shell scripts, CI jobs, and agent loops around the `blackbox` CLI.

## General Rule

`0` means the command completed cleanly. Nonzero codes are command-specific today. Do not assume every command uses the same meaning for `1` and `2` during the alpha.

## Command Exit Codes

| Command | `0` | `1` | `2` |
| --- | --- | --- | --- |
| `features emit` | Feature files emitted. | Not used by the command implementation. | Uncaught command/framework errors may exit nonzero. |
| `features lint` | No findings at or above `--fail-on`. | At least one finding met `--fail-on`. | Uncaught command/framework errors may exit nonzero. |
| `features drift` | Source tests and feature files are in sync. | Drift detected: missing, stale, orphan, or unparseable feature files. | Missing input directory or analysis failure. |
| `features check` | Syntax and drift checks passed, or skipped checks passed. | Syntax failure or drift detected. | Framework or unexpected failure. |
| `features reshape` | Reshape completed, or only skipped/already-BDD/no-test files were found. | Unsafe fallback, parse-error fallback, bad flags, missing paths, or no matched files. | Transform exception while processing a file. |
| `features compare-observations` | Baseline and candidate observations are semantically equivalent. | Meaningful difference or missing observation pair. | Missing arguments, missing directory, malformed file, or no traces found. |
| `features experimental wrap` | Completed preview or write. | Not used by the command implementation. | Uncaught command/framework errors may exit nonzero. |
| `features experimental scaffold` | Completed preview or write. | Not used by the command implementation. | Uncaught command/framework errors may exit nonzero. |
| `coverage replay` | Reports written, or no artifacts found. | Report generation completed with captured propagation or Istanbul errors. | Framework or unexpected failure. |
| `otel instrument` | Transform completed. | Parse/config/walk/write error. | Not used by the command implementation. |

## Practical Guidance

1. Treat `features check` exit `1` as a normal CI gate failure, not a tool crash.
2. Treat `features drift` exit `1` as generated feature files being out of sync.
3. Treat `features compare-observations` exit `1` as semantic drift between runs.
4. Treat `features reshape` exit `1` as unsafe or incomplete output that needs review before write/commit.
5. Treat exit `2` as setup, input, or transform failure where the command could not produce a trustworthy result.

## CI Example

```bash
blackbox features check --features ./features --tests ./tests --json
pnpm test:system
```

The first command gates feature syntax and drift. The second command is the project-owned system-test command that collects runtime evidence and produces reports.
