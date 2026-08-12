---
title: "CLI Reference"
description: "Reference for the Blackbox computational harness: init, doctor, status, verify, flow inspection, requirements validation, feature checks, coverage replay, structured output, and write behavior."
sidebar_position: 1
keywords: ["blackbox cli", "cli reference", "blackbox commands"]
toc_min_heading_level: 2
seo:
  primary_keyword: "blackbox cli"
  secondary_keywords:
    [
      "cli reference",
      "feature files cli",
      "observable decision coverage replay",
    ]
  search_intent: "reference intent from developers running or scripting the Blackbox verification lifecycle"
  snippet_angle: "catalog the Blackbox facade and engine commands, their inputs, writes, JSON contracts, and CI safety"
---

The `blackbox` binary is the **computational harness** for Blackbox. It validates files, discovers flows, runs Playwright, captures runtime evidence, computes verdicts, and returns structured findings.

Skills do inferential work. Humans approve accepted behavior. The CLI does not write requirements, Gherkin, suites, or effect contracts as a way to pass a failing run.

Every command supports `--json` using the shared CLI envelope. Exit code `0` means clean, `1` means the command completed with findings, and `2` means a usage or environment failure.

## Command Shape

The public binary is `blackbox`, provided by `@suites/blackbox-cli`. Commands use a space topic separator:

```bash
blackbox verify --flow subscribe-unknown-user
blackbox flows show subscribe-unknown-user
blackbox features check --features ./features --tests ./e2e
blackbox coverage replay --coverage-dir .blackbox-coverage
```

Use `blackbox features check`, not `blackbox features:check`.

## Framework Commands

| Command                    | Job                                                                                               | Writes                             |
| -------------------------- | ------------------------------------------------------------------------------------------------- | ---------------------------------- |
| `blackbox init`            | Begin project onboarding. The exact flow is deferred for this wave.                               | Not documented yet.                |
| `blackbox doctor`          | Check tools, topology, instrumentation, Playwright, paths, and artifact consistency.              | Nothing.                           |
| `blackbox status`          | Summarize repository connections and latest retained run without executing tests.                 | Nothing.                           |
| `blackbox verify`          | Run selected flows and return separate test, feature, effect, requirement, and decision verdicts. | Runtime evidence and reports only. |
| `blackbox explain <code>`  | Explain a diagnostic and the next safe action.                                                    | Nothing.                           |
| `blackbox flows list`      | List known flow IDs and connection state.                                                         | Nothing.                           |
| `blackbox flows show <id>` | Assemble one flow's requirements, feature, Playwright source, effects, artifacts, and verdicts.   | Nothing.                           |

### `init`

```bash
blackbox init
```

`init` is the first onboarding command. Its prompts, flags, outcomes, and written files are intentionally not part of this docs wave.

### `doctor`

```bash
blackbox doctor
blackbox doctor --flow subscribe-unknown-user --json
```

`doctor` is the first fully documented readiness contract. It checks whether Blackbox can produce trustworthy evidence from the current repository conventions and environment. It does not run the SUT or change files.

### `status`

```bash
blackbox status
blackbox status --flow subscribe-unknown-user --json
```

`status` reads repository artifacts and the latest retained run. It reports disconnected flows, artifact age, and the latest available layer verdict without presenting stale evidence as a current verification result.

### `verify`

```bash
blackbox verify
blackbox verify --flow subscribe-unknown-user
blackbox verify --flow subscribe-unknown-user --json
blackbox verify --layer runtime --layer decision --json
```

`verify` runs the configured lifecycle in dependency order:

1. Discover selected flows.
2. Validate EARS requirement sources.
3. Validate feature syntax, `@flow`, and `@requirement` tags.
4. Validate effect YAML shape and flow consistency.
5. Run the selected Playwright flows.
6. Confirm runtime artifacts belong to the current run.
7. Evaluate required and forbidden effects.
8. Produce requirement and observable decision verdicts when enabled.
9. Return one layered result without collapsing the verdicts.

`--flow` and `--layer` can be repeated. `--layer` accepts `requirements`, `features`, `runtime`, or `decision` and narrows one diagnostic run.

`verify` writes evidence and reports under `.blackbox-coverage/`. It does not update accepted effect contracts, feature files, requirements, or suites.

### `explain`

```bash
blackbox explain requirement-violated
blackbox explain feature-stale --json
```

`explain` describes a diagnostic, why it matters, and the next safe action. Built-in diagnostic explanations do not require a configured project.

### `flows list` and `flows show`

```bash
blackbox flows list --json
blackbox flows show subscribe-unknown-user --json
```

The stable flow ID is the framework join key. `flows show` resolves the owning Playwright test, EARS requirement IDs, Gherkin feature, effect contract, latest run, and every available verdict through that ID. It never infers a connection from similar text.

## Layered JSON Output

`verify --json` preserves individual layer results even when one gate produces findings:

```json
{
  "schemaVersion": 1,
  "command": "verify",
  "status": "findings",
  "data": {
    "flowIds": ["subscribe-unknown-user"],
    "layers": {
      "decisionCoverage": {
        "state": "passed",
        "verdict": "propagating"
      },
      "effects": { "state": "findings", "verdict": "failed" },
      "features": { "state": "passed", "verdict": "in-sync" },
      "requirementCoverage": {
        "state": "findings",
        "verdict": "violated"
      },
      "requirements": { "state": "passed", "verdict": "valid" },
      "test": { "state": "passed", "verdict": "passed" }
    }
  },
  "findings": [
    {
      "file": "features/subscribe-unknown-user.effects.yaml",
      "flowId": "subscribe-unknown-user",
      "layer": "effects",
      "line": 7,
      "message": "Observed forbidden POST /v1/payment_intents",
      "rule": "forbidden-effect-observed",
      "severity": "error"
    }
  ],
  "summary": { "errors": 1, "info": 0, "warnings": 0 }
}
```

Layer state is `passed`, `findings`, `skipped`, or `not-configured`. Each layer keeps its own verdict vocabulary. Findings include optional `layer` and `flowId` fields in addition to severity, rule, message, file, and line fields.

## Layer Selection

`--layer` narrows a diagnostic run while preserving dependencies:

- `features` checks syntax and flow-tag consistency without running Playwright.
- `requirements` validates EARS sources without running Playwright.
- `runtime` runs selected Playwright flows and evaluates effect contracts.
- `decision` requires runtime capture and includes a fresh runtime run before decision analysis.

## Engine Command Matrix

| Command                                     | Job                                                                                   | Reads                                           | Writes                                                         | JSON | Stability                    |
| ------------------------------------------- | ------------------------------------------------------------------------------------- | ----------------------------------------------- | -------------------------------------------------------------- | ---- | ---------------------------- |
| `blackbox requirements validate [paths...]` | Validate EARS structure and stable IDs.                                               | EARS sources.                                   | Nothing.                                                       | Yes  | Alpha public                 |
| `blackbox requirements check`               | Validate EARS IDs and flow references discovered through feature tags and effects.    | EARS, features, effects, Playwright flow tags.  | Nothing.                                                       | Yes  | Alpha public                 |
| `blackbox requirements drift`               | Find requirements, feature tags, effect contracts, and flows that no longer agree.    | EARS, features, effects, Playwright flow tags.  | Nothing.                                                       | Yes  | Alpha public                 |
| `blackbox requirements coverage`            | Join requirement tags to effect coverage.                                             | EARS, features, effect coverage.                | `requirements/coverage.json` under the artifact directory.     | Yes  | Alpha public, report-writing |
| `blackbox features check`                   | Validate `.feature` syntax, tags, and source consistency.                             | Features and optional tests.                    | Nothing.                                                       | Yes  | Alpha public                 |
| `blackbox features drift`                   | Detect feature files that drifted from accepted flow structure.                       | `--tests`, `--features`.                        | Nothing.                                                       | Yes  | Alpha public                 |
| `blackbox features emit [paths...]`         | Secondary migration path that derives starter Gherkin from existing Playwright tests. | Test source files.                              | `.feature` files under `--out` only when explicitly requested. | Yes  | Alpha public, state-changing |
| `blackbox features compare-observations`    | Compare observation-reporter outputs from two runs.                                   | Baseline and candidate observation directories. | Nothing.                                                       | Yes  | Alpha public                 |
| `blackbox coverage replay`                  | Recompute observable decision reports from saved evidence.                            | `--coverage-dir`; optional service source map.  | Report files under `--out` or the coverage directory.          | Yes  | Alpha public, report-writing |
| `blackbox otel instrument`                  | Transform source files with static OpenTelemetry function-span instrumentation.       | `--input` source tree; optional config.         | Instrumented source tree under `--output`.                     | Yes  | Advanced                     |

The CLI does not expose public `requirements extract` or `requirements instructions` commands in this direction. Skills own inferential authoring.

## Feature Commands

### `features check`

```bash
blackbox features check
blackbox features check --features ./features --tests ./e2e
blackbox features check --skip-drift --json
```

Read-only. Defaults to `--features ./features`. Use this as the durable CI gate for feature syntax, tags, and drift.

### `features drift`

```bash
blackbox features drift --tests ./e2e --features ./features
blackbox features drift --json
```

Read-only. Use it when feature files are accepted review artifacts that must stay synchronized with source tests.

### `features emit`

```bash
blackbox features emit ./tests --out ./features
blackbox features emit ./tests --dry-run --json
```

This is a secondary migration path for existing Playwright tests. It is not the primary spec-driven authoring flow.

## Requirement Commands

### `requirements validate`

```bash
blackbox requirements validate requirements/billing.ears
blackbox requirements validate 'requirements/**/*.ears' --json
```

Read-only. It validates EARS structure, IDs, and profile rules without requiring a Playwright flow.

### `requirements check`

```bash
blackbox requirements check
blackbox requirements check --source 'requirements/**/*.ears' --json
```

Read-only. It validates EARS grammar, requirement ID uniqueness, and references discovered through feature tags and flow IDs.

### `requirements drift`

```bash
blackbox requirements drift
blackbox requirements drift --json
```

Read-only. It reports requirements without accepted flows, features that reference unknown requirements, effect contracts without matching features, and flows that cannot be connected.

### `requirements coverage`

```bash
blackbox requirements coverage
blackbox requirements coverage --fail-on unproven --json
```

The command writes `requirements/coverage.json` below the artifact directory. Its four verdicts are `proven`, `violated`, `unproven`, and `unbound`. `--fail-on` accepts `violated`, `unproven`, or `unbound` and defaults to `violated`.

## Coverage Commands

### `coverage replay`

```bash
blackbox coverage replay --coverage-dir .blackbox-coverage --out reports
blackbox coverage replay --no-html
blackbox coverage replay --service bff=/path/to/bff/src
```

Replays reports from saved runtime evidence. By default it writes observable decision JSON, Markdown, and HTML under the current `omcdc/` artifact path, plus Istanbul `code-coverage/coverage.json` and Istanbul HTML. With `--no-html`, it writes only `omcdc/verdict.json` and `omcdc/verdict.md`.

## Static Instrumentation Commands

### `otel instrument`

```bash
blackbox otel instrument --input ./src --output ./instrumented --config ./otel.json
blackbox otel instrument -i ./src -o ./instrumented --include 'services/**/*.ts' --verbose
```

This is a build-time instrumentation command. It walks `--input`, transforms matching files, and writes the output tree to `--output`. It is separate from the default testbed bootstrap path.

## Practical Defaults

1. Run `blackbox init` as the first onboarding command.
2. Run `blackbox doctor --json` after changing the testbed or artifact layout.
3. Run `blackbox status --json` before an agent proposes repairs.
4. Use `blackbox verify --json` as the normal local and CI verification command.
5. Use `requirements validate` before a new requirement has runtime evidence.
6. Use `features check` when Gherkin is part of the review contract.
7. Treat `coverage replay` as report regeneration over saved evidence, not as a live system-test run.

## Related Pages

1. [Exit Codes](/docs/blackbox/reference/exit-codes)
2. [Files and Artifacts](/docs/blackbox/reference/files-and-artifacts)
3. [Report Formats](/docs/blackbox/reference/report-formats)
