---
title: "CLI Reference"
description: "Reference for the Blackbox computational harness, including repository onboarding, artifact checks, suite AST transformations, runtime verification, and structured review boundaries."
sidebar_position: 1
keywords:
  ["blackbox cli", "blackbox suites align", "blackbox verify", "blackbox json"]
toc_min_heading_level: 2
---

The `blackbox` binary is the **computational harness**. It validates artifacts, extracts behavior from existing suites, transforms native suite ASTs, executes flows, observes effects, and computes bounded verdicts.

Skills own inferential proposals. Humans approve accepted behavior. The CLI never changes accepted behavior merely to clear a failing verdict.

## Public Command Surface

```text
blackbox init
blackbox doctor
blackbox status
blackbox verify
blackbox explain <code>

blackbox flows list
blackbox flows show <flow-id>

blackbox requirements validate [paths...]
blackbox requirements check
blackbox requirements drift
blackbox requirements coverage

blackbox features extract [suite-paths...]
blackbox features check
blackbox features drift

blackbox suites discover [paths...]
blackbox suites check
blackbox suites align

blackbox effects show
blackbox effects check

blackbox coverage replay
blackbox otel instrument
```

`features emit` may remain as a temporary compatibility alias. Use `features extract` in new scripts and documentation.

## Shared Options

| Option                           | Meaning                                                  |
| -------------------------------- | -------------------------------------------------------- |
| `--flow <id>`                    | Select one stable flow; repeat to select several         |
| `--json`                         | Write one machine-readable result to stdout              |
| `--write`                        | Apply an explicit source transformation atomically       |
| `--run <id\|latest>`             | Select retained runtime evidence                         |
| `--mode <auto\|new\|existing>`   | Select initialization behavior                           |
| `--feature <path>`               | Select an accepted Gherkin input                         |
| `--suite <path>`                 | Select a native suite when discovery is ambiguous        |
| `--expected-revision <revision>` | Require a repository revision before a future-safe write |

Every command supports `--json`. JSON mode never prompts. Ambiguous discovery returns choices and exits without writing.

## Framework Commands

| Command                   | Responsibility                                                      | Writes                           |
| ------------------------- | ------------------------------------------------------------------- | -------------------------------- |
| `blackbox init`           | Detect project state and select the onboarding path                 | Local state and scaffolding only |
| `blackbox doctor`         | Check tools, topology, instrumentation, paths, and bindings         | Nothing                          |
| `blackbox status`         | Report structural readiness and latest retained run                 | Nothing                          |
| `blackbox verify`         | Validate, execute, observe, normalize effects, and compute verdicts | Run-scoped evidence and reports  |
| `blackbox explain <code>` | Explain a deterministic finding and its safe next action            | Nothing                          |

### `init`

```bash
blackbox init --mode auto --json
blackbox init --mode new --json
blackbox init --mode existing --json
```

`init` detects new, existing, and mixed repositories. It does not modify requirements, features, effect contracts, or suite source.

### `doctor`

```bash
blackbox doctor --json
```

`doctor` checks configured layers. Runtime findings do not invalidate a structurally accepted harness; they mean runtime verification is not ready.

### `status`

```bash
blackbox status --json
blackbox status --flow checkout-payment --json
```

`status` reports the earliest structurally incomplete boundary without running tests. Alpha approval remains `external`.

### `verify`

```bash
blackbox verify --flow checkout-payment --json
```

`verify` validates selected artifacts, runs the native flow, captures evidence, creates observed effects, evaluates configured effect policy, computes eligible decision evidence, and returns separate layered verdicts.

The first run can return `effects: not-configured` while still writing observed effects.

## Flow Commands

```bash
blackbox flows list --json
blackbox flows show checkout-payment --json
```

The flow ID joins requirements, Gherkin, native suite nodes, effect policy, runtime evidence, and reports. `flows show` assembles those explicit relationships without inferring from similar text.

## Requirement Commands

| Command                 | Responsibility                                                   | Writes            |
| ----------------------- | ---------------------------------------------------------------- | ----------------- |
| `requirements validate` | Validate EARS syntax, profile rules, and IDs                     | Nothing           |
| `requirements check`    | Validate references across accepted artifacts                    | Nothing           |
| `requirements drift`    | Find missing, stale, duplicate, or disconnected bindings         | Nothing           |
| `requirements coverage` | Compute requirement verdicts from accepted bindings and evidence | Generated reports |

```bash
blackbox requirements validate requirements/checkout.ears --json
blackbox requirements check --flow checkout-payment --json
blackbox requirements drift --json
blackbox requirements coverage --json
```

Validation and structural checks do not require runtime evidence. Requirement coverage can only make runtime-backed claims when accepted bindings and current evidence exist.

## Feature Commands

### `features extract`

```bash
blackbox features extract ./e2e/checkout.spec.ts --json
blackbox features extract ./e2e/checkout.spec.ts --write --json
```

Parses existing suite ASTs and creates literal baseline Gherkin. A written baseline returns `awaiting-review`. It does not claim complete product intent.

### `features check` and `features drift`

```bash
blackbox features check --feature features/checkout-payment.feature --json
blackbox features drift --json
```

These commands validate syntax, IDs, tags, traceability, and accepted source relationships without running the system.

## Suite Commands

### `suites discover`

```bash
blackbox suites discover ./e2e --json
```

Parses candidate suites and reports flow candidates, source locations, and conflicts without changing source.

### `suites check`

```bash
blackbox suites check --flow checkout-payment --json
```

Validates native suite AST bindings against accepted Gherkin.

### `suites align`

```bash
blackbox suites align \
  --feature features/checkout-payment.feature \
  --suite ./e2e/checkout.spec.ts \
  --json

blackbox suites align \
  --feature features/checkout-payment.feature \
  --suite ./e2e/checkout.spec.ts \
  --write \
  --json
```

Without `--write`, the command returns a plan. With `--write`, it creates or reshapes only the selected native flow, writes atomically, and returns `awaiting-review` with changed paths and digests.

The CLI writes the `.ts` suite directly. It never emits an intermediate patch artifact or invents unsupported application-specific behavior.

## Effect Commands

### `effects show`

```bash
blackbox effects show --flow checkout-payment --run latest --json
```

Reads generated observed effects and current classifications for a retained run. It writes nothing.

### `effects check`

```bash
blackbox effects check --flow checkout-payment --json
```

Validates effect YAML, selectors, and flow ownership. It does not create or approve policy.

## Coverage and Instrumentation

```bash
blackbox coverage replay --coverage-dir .blackbox-coverage --json
blackbox otel instrument --input ./src --output ./instrumented --config ./otel.json
```

`coverage replay` recomputes reports from retained evidence without rerunning the suite. `otel instrument` writes an explicitly targeted instrumented source tree and is separate from the default testbed bootstrap path.

## Structured Review Results

Source-changing commands return an operation record:

```json
{
  "schemaVersion": 1,
  "command": "suites align",
  "operationId": "op_01J_CHECKOUT",
  "status": "awaiting-review",
  "data": {
    "flowIds": ["checkout-payment"],
    "writes": [
      {
        "path": "e2e/checkout.spec.ts",
        "kind": "suite-ast",
        "beforeDigest": "sha256:before",
        "afterDigest": "sha256:after"
      }
    ],
    "review": { "required": true, "boundary": "suite-source" }
  },
  "findings": []
}
```

`awaiting-review` means the transformation succeeded and must pause. It does not mean a person approved the diff.

## Exit Codes

| Code | Meaning                                                                                    |
| ---- | ------------------------------------------------------------------------------------------ |
| `0`  | Command completed, including a successful write that now awaits review                     |
| `1`  | Command completed with behavioral or validation findings                                   |
| `2`  | Invalid input, stale precondition, missing infrastructure, or engine failure blocked trust |

See [Exit Codes](/docs/blackbox/reference/exit-codes) and [Files and Artifacts](/docs/blackbox/reference/files-and-artifacts).
