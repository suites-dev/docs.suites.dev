---
title: "Agent Skills"
description: "Use Blackbox Skills for inferential proposals while the CLI performs deterministic checks, suite transformations, execution, and verdict computation."
sidebar_position: 4
keywords:
  [
    "Blackbox agent skills",
    "inferential harness",
    "computational harness",
    "human approval",
  ]
---

Blackbox Skills are the **inferential harness**. They translate meaning and propose changes to behavior artifacts.

The Blackbox CLI is the **computational harness**. It validates artifacts, extracts behavior, transforms native suite ASTs, executes flows, observes effects, and computes verdicts.

Humans retain authority over accepted behavior.

## Skill Set

| Skill                    | New-behavior job                               | Existing-project job                                 | Stop boundary                         |
| ------------------------ | ---------------------------------------------- | ---------------------------------------------------- | ------------------------------------- |
| `$blackbox`              | Coordinate the current flow                    | Resume the earliest incomplete adoption stage        | Any required human judgment           |
| `$blackbox-requirements` | Propose EARS from selected product intent      | Recover proposed EARS from reviewed Gherkin          | Human approval of requirement meaning |
| `$blackbox-gherkin`      | Propose Gherkin from approved requirements     | Sharpen CLI-extracted baseline behavior and flow IDs | Human approval of behavior language   |
| `$blackbox-effects`      | Classify observed effects into proposed policy | Classify observations after an adopted flow runs     | Human approval of effect meaning      |

There is no runner-specific suite-authoring Skill. `blackbox suites align --write` is the only documented Blackbox path that creates or reshapes native suite AST nodes.

## Shared Rules

Every Skill must:

- read accepted artifacts before proposing changes;
- use CLI JSON output for computational facts;
- author only its allowed artifact layer;
- stop before a human authority boundary;
- never rewrite accepted behavior to clear a failing verdict;
- never edit native suite source directly.

## `$blackbox`

Use `$blackbox` to inspect the current flow and select the next safe operation.

```bash
blackbox status --json
blackbox flows list --json
blackbox flows show <flow-id> --json
blackbox doctor --json
blackbox verify --flow <flow-id> --json
blackbox explain <code> --json
```

The coordinator may route to a specialist Skill or a deterministic CLI command. It stops when the next operation needs a person to approve meaning or behavior.

## `$blackbox-requirements`

Use `$blackbox-requirements` to translate selected intent into proposed `requirements/**/*.ears` files. For existing projects, it can translate reviewed Gherkin back into proposed requirements.

Validate proposals with:

```bash
blackbox requirements validate requirements/checkout.ears --json
blackbox requirements check --flow checkout-payment --json
```

The Skill can repair structural findings. A person approves requirement meaning.

## `$blackbox-gherkin`

Use `$blackbox-gherkin` to propose readable behavior from approved requirements or sharpen baseline Gherkin extracted from an existing suite.

```bash
blackbox features check \
  --feature features/checkout-payment.feature \
  --json
```

The Skill may clarify scenario language, flow boundaries, and stable IDs. It must not claim the existing test reveals complete product intent. A person approves behavior language before suite alignment.

## Deterministic Suite Translation

Suite source belongs to the CLI, not a Skill:

```bash
blackbox suites align \
  --feature features/checkout-payment.feature \
  --suite ./e2e/checkout.spec.ts \
  --write \
  --json
```

The command writes the native `.ts` file atomically and returns changed paths, source ranges, and digests. It does not create a patch artifact. A person reviews the actual source diff.

## `$blackbox-effects`

Use `$blackbox-effects` only after a run has produced observed effects:

```bash
blackbox effects show --flow checkout-payment --run latest --json
```

The Skill can propose `features/<flow-id>.effects.yaml` changes that:

- mark selected observed effects as required;
- add effects that must remain absent as forbidden;
- leave incidental observations outside the policy;
- flag observations that may indicate a defect.

Validate the proposal:

```bash
blackbox effects check --flow checkout-payment --json
```

The Skill does not create observations. `blackbox verify` already produced them. A person approves effect meaning.

## Read Review Boundaries Correctly

A source-changing operation can return:

```json
{
  "status": "awaiting-review",
  "data": {
    "review": {
      "required": true,
      "boundary": "suite-source"
    }
  }
}
```

`awaiting-review` is a successful transformation that must pause. It does not record approval. In alpha, use normal diff or pull-request review before running the suggested next command.

## Summary

- **Skills propose meaning.**
- **The CLI computes facts and transforms native suite structure.**
- **Humans approve accepted behavior.**
- **Agents repair implementation while the accepted harness stays fixed.**
