---
title: "Use Blackbox With Coding Agents"
description: "Install Blackbox Skills, route work through the right verification stage, and keep behavioral authority with people."
sidebar_position: 12
keywords: ["Blackbox agent skills", "coding agents", "behavioral verification"]
---

Blackbox Skills give coding agents a method for proposing artifacts and repairing implementation. Deterministic CLI and runtime components still compute every gate.

Use Skills across the four-step Quickstart when you want agent assistance. Install them before a static guide invokes `$blackbox-requirements` or `$blackbox-gherkin`; use `$blackbox-repair` after Step 4 produces a deterministic finding.

## Install the Skills

Review the project-local installation:

```bash
pnpm exec blackbox skills install --host codex --json
```

Write it after reviewing the file plan:

```bash
pnpm exec blackbox skills install --host codex --write --json
```

| Host   | Option          | Location                 |
| ------ | --------------- | ------------------------ |
| Codex  | `--host codex`  | `.agents/skills/`        |
| Claude | `--host claude` | `.claude/skills/`        |
| Both   | `--host all`    | Both supported locations |
| Auto   | `--host auto`   | Every detected location  |

The installer refuses to overwrite a locally modified Skill.

## Use the Skill for the Current Stage

| Skill                    | Proposes                                         | Human decision                           |
| ------------------------ | ------------------------------------------------ | ---------------------------------------- |
| Coordinator              | The correct workflow and next deterministic gate | Accept the selected path                 |
| `$blackbox-requirements` | Atomic EARS requirements                         | Approve requirement meaning              |
| `$blackbox-gherkin`      | Scenarios from requirements or executable tests  | Approve scenarios and flow IDs           |
| `$blackbox-runtime`      | SUT source, capture, and isolation configuration | Accept infrastructure and isolation risk |
| `$blackbox-effects`      | Required and forbidden effects                   | Accept behavior policy                   |
| `$blackbox-odc`          | Interpretation of decision propagation           | Set coverage policy                      |
| `$blackbox-repair`       | Implementation changes against findings          | Accept the final result                  |

## Give the Agent a Bounded Request

```text
$blackbox-effects

For flow subscribe-user, inspect the latest sealed evidence and the approved
feature. Propose the smallest required and forbidden effect contract. Do not
change the native assertions or flow ID. Stop for human review.
```

After approval, deterministic analysis evaluates the accepted contract:

```bash
pnpm exec blackbox analyze --run latest
```

## Keep Authority With People

Skills must not silently redefine:

- Requirement meaning.
- Accepted Gherkin or stable flow IDs.
- Native test assertions.
- Required and forbidden effects.
- SUT source, capture boundaries, reset assurance, or gate policy.
- Final interpretation of the result.

```text
Skills propose -> CLI and runtime compute -> agent repairs -> human approves
```

## Know What Computes Each Result

| Work                                | Owner                        |
| ----------------------------------- | ---------------------------- |
| Propose requirements and contracts  | Blackbox Skills              |
| Validate static artifacts and drift | Blackbox CLI                 |
| Execute native tests and attempts   | Runner adapter               |
| Observe and seal runtime evidence   | Language capture and sidecar |
| Check effects and calculate ODC     | Offline analyzers            |
| Accept behavior, policy, and result | People                       |

An agent can operate across the whole loop, but it does not replace the deterministic components that produce findings or the people who approve the target.

## Next Steps

- **[Add Readable Behavior Specifications](/docs/blackbox/guides/recover-behavior-from-existing-tests)**
- **[Start Without a Test](/docs/blackbox/guides/turn-requirements-into-system-test)**
- **[How Blackbox Works?](/docs/blackbox/overview/how-blackbox-works)**
- **[Enforce Effects and Read ODC](/docs/blackbox/quickstart/enforce-runtime-effects):** Enter the implementation-repair loop at Step 4.
