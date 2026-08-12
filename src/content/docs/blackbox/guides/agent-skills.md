---
title: "Agent Skills"
description: "Use Blackbox agent Skills as inferential harnesses that propose requirements, Gherkin, Playwright patches, and effect contracts while the CLI computes facts and humans approve behavior."
sidebar_position: 4
keywords:
  [
    "Blackbox agent skills",
    "agentic verification",
    "inferential harness",
    "computational harness",
    "human in the loop",
  ]
---

Blackbox Skills are **inferential harnesses**. They translate between artifacts, propose exact patches, and stop when a human decision is required.

The Blackbox CLI is the **computational harness**. It validates structure, runs Playwright, captures runtime evidence, and returns deterministic verdicts.

## Skill Set

| Skill                    | Primary job                                                          | Human gate                                                |
| ------------------------ | -------------------------------------------------------------------- | --------------------------------------------------------- |
| `$blackbox`              | Coordinate the loop and route to specialist Skills.                  | Stop when accepted behavior would change.                 |
| `$blackbox-requirements` | Propose EARS requirements from product intent.                       | Human reviews and approves requirement meaning.           |
| `$blackbox-gherkin`      | Propose `.feature` files from approved requirements.                 | Human reviews and accepts scenario language.              |
| `$blackbox-playwright`   | Propose native Playwright suite patches.                             | Human approves the exact suite patch.                     |
| `$blackbox-effects`      | Propose effect assertions or effect contracts from runtime evidence. | Human reviews and accepts required and forbidden effects. |

The Skills may be installed or distributed by a later integration flow. This page defines the public behavior they should follow.

## Common Rules

Every Blackbox Skill follows the same constraints:

- Read accepted artifacts before proposing changes.
- Propose exact patches instead of editing accepted behavior silently.
- Use native Playwright APIs for suites.
- Use Gherkin only in `.feature` files.
- Use YAML only for `features/<flow>.effects.yaml`.
- Use CLI JSON output for deterministic facts.
- Stop when the next step needs human judgment.
- Never make a failing verdict disappear by changing requirements, features, suites, or effect contracts without review.

## `$blackbox`

Use `$blackbox` when you want one coordinator for the whole loop.

**Inputs**

- Product intent or an existing flow ID.
- Current repository artifacts.
- Latest CLI JSON output when available.

**Allowed CLI commands**

```bash
blackbox status --json
blackbox flows list --json
blackbox flows show <flow-id> --json
blackbox doctor --json
blackbox verify --flow <flow-id> --json
blackbox explain <code> --json
```

**Outputs**

- A step-by-step harness plan.
- Routing to specialist Skills.
- A stop request when human approval is needed.

## `$blackbox-requirements`

Use `$blackbox-requirements` to transform product intent into EARS proposals.

**Inputs**

- Product spec, ticket, Kiro, OpenSpec, Spec Kit, or design text.
- Target flow or feature scope.
- Existing `requirements/**/*.ears`.

**Allowed CLI commands**

```bash
blackbox requirements validate 'requirements/**/*.ears' --json
blackbox explain <code> --json
```

**Outputs**

- Proposed `requirements/**/*.ears` patch.
- Notes for ambiguous product decisions.
- Validation findings that a human or agent must resolve.

**Stop condition**

Stop after proposing or repairing EARS text. A human approves the requirement meaning.

## `$blackbox-gherkin`

Use `$blackbox-gherkin` to propose readable behavior from approved requirements.

**Inputs**

- Approved EARS requirements.
- Target flow ID.
- Existing `features/**/*.feature`.

**Allowed CLI commands**

```bash
blackbox features check --features ./features --json
blackbox features drift --features ./features --tests ./e2e --json
blackbox explain <code> --json
```

**Outputs**

- Proposed `.feature` patch.
- Feature-level `@flow:<id>` and `@requirement:<id>` tags.
- Scenario language that can be reviewed before implementation.

**Stop condition**

Stop after the feature proposal or when the scenario needs product interpretation.

## `$blackbox-playwright`

Use `$blackbox-playwright` to propose executable native Playwright flows.

**Inputs**

- Accepted `.feature` file.
- Existing Playwright testbed and fixtures.
- Flow ID and scenario title.

**Allowed CLI commands**

```bash
blackbox features check --features ./features --tests ./e2e --json
blackbox verify --flow <flow-id> --json
blackbox explain <code> --json
```

**Outputs**

- Proposed Playwright patch using `test.describe(..., { tag: "@flow:<id>" })`.
- `test.step` labels that map to the reviewed scenario.
- Ordinary Playwright assertions plus Blackbox effect matcher hooks.

**Stop condition**

Stop before applying the suite patch unless a human has approved that exact patch.

## `$blackbox-effects`

Use `$blackbox-effects` after a run produces runtime evidence.

**Inputs**

- `.blackbox-coverage/` evidence from a recent `verify` run.
- Accepted requirement and feature artifacts.
- Existing `features/<flow>.effects.yaml`, when present.

**Allowed CLI commands**

```bash
blackbox verify --flow <flow-id> --json
blackbox flows show <flow-id> --json
blackbox coverage replay --coverage-dir .blackbox-coverage --json
blackbox explain <code> --json
```

**Outputs**

- Proposed effect assertion changes.
- Proposed `features/<flow>.effects.yaml` patch.
- Explicit `requires` and `forbids` rationale.

**Stop condition**

Stop when deciding whether an observed effect is required, forbidden, incidental, or a defect.

## Integration Boundaries

Kiro, OpenSpec, Spec Kit, tickets, and design documents can feed the first step. They should not bypass the Blackbox review gates.

The stable integration boundary is artifact-based:

- external spec tool -> product intent;
- `$blackbox-requirements` -> EARS proposal;
- human approval -> accepted requirements;
- CLI validation -> deterministic findings;
- runtime evidence -> effect proposal;
- final human verification -> accepted result.

## Summary

- **Skills infer** and propose patches.
- **The CLI computes** facts and verdicts.
- **Humans approve** meaning and accepted behavior.
- **Agents repair implementation** only while the harness stays fixed.
